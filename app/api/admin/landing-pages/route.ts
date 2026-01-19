import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET all landing pages (admin only)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching landing pages:', error)
      // If table doesn't exist (PGRST205 = table not found in schema cache)
      if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
        console.warn('⚠️ landing_pages table does not exist. Please run database migrations.')
        return NextResponse.json(
          { 
            error: 'Landing pages table not found. Please run database migrations first.',
            code: 'PGRST205'
          },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: error.message || 'Failed to fetch landing pages' },
        { status: 500 }
      )
    }

    // Get course counts for each landing page
    // Note: We can't use dynamic column names in Supabase filters directly
    // So we'll fetch all courses and count in memory, or use a simpler approach
    const landingPagesWithCounts = await Promise.all(
      (data || []).map(async (page) => {
        try {
          const relevancyColumn = page.relevancy_column
          
          // Fetch courses and filter in memory since we can't use dynamic column names in filters
          const { data: allCourses, error: coursesError } = await supabaseAdmin
            .from('courses')
            .select(`id, ${relevancyColumn}`)
          
          if (coursesError) {
            console.warn(`Error fetching courses for ${page.tag}:`, coursesError)
            return {
              ...page,
              courseCount: 0,
            }
          }

          // Count ALL courses (matching what "Manage Courses" shows)
          // The "Manage Courses" view shows all courses ordered by relevancy,
          // so the count should match that behavior
          const courseCount = (allCourses || []).length

          return {
            ...page,
            courseCount,
          }
        } catch (error) {
          console.error(`Error counting courses for ${page.tag}:`, error)
          return {
            ...page,
            courseCount: 0,
          }
        }
      })
    )

    return NextResponse.json({ success: true, landingPages: landingPagesWithCounts })
  } catch (error) {
    console.error('Error in GET /api/admin/landing-pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new landing page
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.tag || !body.name) {
      return NextResponse.json(
        { error: 'Tag and name are required' },
        { status: 400 }
      )
    }

    // Validate tag format (URL-friendly: alphanumeric + hyphens only)
    const tagRegex = /^[a-z0-9-]+$/
    if (!tagRegex.test(body.tag.toLowerCase())) {
      return NextResponse.json(
        { error: 'Tag must be URL-friendly (lowercase letters, numbers, and hyphens only)' },
        { status: 400 }
      )
    }

    const normalizedTag = body.tag.toLowerCase()

    // Check if tag already exists
    const { data: existing } = await supabaseAdmin
      .from('landing_pages')
      .select('id')
      .eq('tag', normalizedTag)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A landing page with this tag already exists' },
        { status: 400 }
      )
    }

    // Auto-assign display_order: get max display_order and add 1
    const { data: maxOrderData } = await supabaseAdmin
      .from('landing_pages')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    const nextDisplayOrder = maxOrderData?.display_order !== undefined 
      ? maxOrderData.display_order + 1 
      : 0

    // Generate relevancy column name
    const relevancyColumn = `${normalizedTag}_relevancy`

    // Call RPC function to add the relevancy column to courses table
    try {
      const { error: rpcError } = await supabaseAdmin.rpc('add_relevancy_column', {
        column_name: relevancyColumn,
      })

      if (rpcError) {
        console.error('Error adding relevancy column:', rpcError)
        // Don't fail the request - column might already exist
      }
    } catch (rpcError) {
      console.error('Error calling add_relevancy_column RPC:', rpcError)
      // Don't fail the request - column might already exist
    }

    // Generate description using OpenAI if not provided (standardized with PUT handler)
    let description: string
    if (body.description !== undefined) {
      console.log(`📝 POST: Received description field:`, {
        value: body.description,
        type: typeof body.description,
        length: body.description?.length,
        isEmpty: !body.description || (typeof body.description === 'string' && body.description.trim() === '')
      })
      
      // If description is empty or just whitespace, auto-generate it
      if (!body.description || (typeof body.description === 'string' && body.description.trim() === '')) {
        try {
          const { generateLandingPageDescription } = await import('@/lib/generate-landing-page-description')
          console.log(`🤖 Auto-generating description for "${body.name}" during creation (description was empty)...`)
          const generatedDescription = await generateLandingPageDescription(body.name, normalizedTag)
          if (generatedDescription) {
            description = generatedDescription.replace(/^["']+|["']+$/g, '').trim()
            console.log(`✅ Generated description: ${description} (${description.length} chars)`)
          } else {
            description = `AI certification programs designed for ${body.name.toLowerCase()} professionals looking to leverage artificial intelligence.`
            console.log(`✅ Using fallback description: ${description}`)
          }
        } catch (error) {
          console.error('Error generating description:', error)
          description = `AI certification programs designed for ${body.name.toLowerCase()} professionals looking to leverage artificial intelligence.`
        }
      } else {
        // Clean up any quotation marks from user-provided descriptions
        description = body.description.replace(/^["']+|["']+$/g, '').trim()
        console.log(`✅ Using provided description: ${description} (${description.length} chars)`)
      }
    } else {
      // Description not provided - auto-generate
      try {
        const { generateLandingPageDescription } = await import('@/lib/generate-landing-page-description')
        console.log(`🤖 Auto-generating description for "${body.name}" during creation (description not provided)...`)
        const generatedDescription = await generateLandingPageDescription(body.name, normalizedTag)
        if (generatedDescription) {
          description = generatedDescription.replace(/^["']+|["']+$/g, '').trim()
          console.log(`✅ Generated description: ${description} (${description.length} chars)`)
        } else {
          description = `AI certification programs designed for ${body.name.toLowerCase()} professionals looking to leverage artificial intelligence.`
          console.log(`✅ Using fallback description: ${description}`)
        }
      } catch (error) {
        console.error('Error generating description:', error)
        description = `AI certification programs designed for ${body.name.toLowerCase()} professionals looking to leverage artificial intelligence.`
      }
    }

    // Prepare landing page data
    const landingPageData = {
      tag: normalizedTag,
      name: body.name,
      description: description,
      hero_title: body.heroTitle || `The Best AI Certification for ${body.name}`,
      subtitle: body.subtitle || 'at IFAIP',
      bg_color: body.bgColor || '#2563eb',
      header_image_url: body.headerImageUrl || '/hero.png', // Placeholder
      relevancy_column: relevancyColumn,
      is_enabled: Boolean(body.isEnabled ?? true), // Explicitly convert to boolean, default to enabled
      display_order: nextDisplayOrder, // Auto-assigned: max + 1
    }

    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .insert([landingPageData])
      .select()
      .single()

    if (error) {
      console.error('Error creating landing page:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create landing page' },
        { status: 500 }
      )
    }

    // Trigger course ranking for this new landing page
    // Import the ranking function directly instead of making an HTTP call
    try {
      const { rankCoursesForLandingPage } = await import('@/lib/rank-course')
      // Use the processed description (which may have been auto-generated)
      const categoryContext = description || `AI courses relevant to ${body.name}`
      
      console.log(`🚀 Starting course ranking for new landing page "${normalizedTag}"...`)
      
      // Run ranking in the background (don't block the response)
      rankCoursesForLandingPage(normalizedTag, relevancyColumn, categoryContext)
        .then((result) => {
          if (result.success) {
            console.log(`✅ Successfully ranked ${result.ranked} courses for "${normalizedTag}"`)
          } else {
            console.warn(`⚠️ Course ranking completed but may have failed for "${normalizedTag}"`)
          }
        })
        .catch((error) => {
          console.error(`❌ Error ranking courses for "${normalizedTag}":`, error)
        })
    } catch (error) {
      console.error('Error importing ranking function:', error)
      console.log('⚠️ Course ranking will need to be triggered manually')
    }

    console.log(`✅ POST: Successfully created landing page. Returned data:`, {
      id: data.id,
      name: data.name,
      description: data.description,
      descriptionLength: data.description?.length || 0
    })

    return NextResponse.json({ success: true, landingPage: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/landing-pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update landing page
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 PUT: Received update request for landing page ${body.id}:`, {
      isEnabled: body.isEnabled,
      name: body.name,
      description: body.description !== undefined ? 'provided' : 'not provided',
      heroTitle: body.heroTitle,
    })

    // Fetch current landing page to get name and tag for description generation if needed
    const { data: currentPage } = await supabaseAdmin
      .from('landing_pages')
      .select('name, tag, is_enabled')
      .eq('id', body.id)
      .single()

    if (!currentPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      )
    }

    console.log(`📋 PUT: Current landing page state:`, {
      id: body.id,
      name: currentPage.name,
      current_is_enabled: currentPage.is_enabled,
      requested_is_enabled: body.isEnabled,
    })

    // Prepare update data (only include provided fields)
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    
    // Handle description field - use same pattern as heroTitle for consistency
    if (body.description !== undefined) {
      console.log(`📝 PUT: Received description field:`, {
        value: body.description,
        type: typeof body.description,
        length: body.description?.length,
        isEmpty: !body.description || (typeof body.description === 'string' && body.description.trim() === '')
      })
      
      // If description is empty or just whitespace, auto-generate it
      if (!body.description || (typeof body.description === 'string' && body.description.trim() === '')) {
        try {
          const { generateLandingPageDescription } = await import('@/lib/generate-landing-page-description')
          const pageName = body.name || currentPage?.name || 'Landing Page'
          const pageTag = currentPage?.tag || ''
          console.log(`🤖 Auto-generating description for "${pageName}" during update (description was empty)...`)
          const generatedDescription = await generateLandingPageDescription(pageName, pageTag)
          if (generatedDescription) {
            updateData.description = generatedDescription.replace(/^["']+|["']+$/g, '').trim()
            console.log(`✅ Generated description: ${updateData.description} (${updateData.description.length} chars)`)
          } else {
            updateData.description = `AI certification programs designed for ${pageName.toLowerCase()} professionals looking to leverage artificial intelligence.`
            console.log(`✅ Using fallback description: ${updateData.description}`)
          }
        } catch (error) {
          console.error('Error generating description:', error)
          updateData.description = `AI certification programs designed for ${(body.name || currentPage?.name || 'professionals').toLowerCase()} professionals looking to leverage artificial intelligence.`
        }
      } else {
        // Clean up any quotation marks from user-provided descriptions
        updateData.description = body.description.replace(/^["']+|["']+$/g, '').trim()
        console.log(`✅ Using provided description: ${updateData.description} (${updateData.description.length} chars)`)
      }
    }
    if (body.heroTitle !== undefined) updateData.hero_title = body.heroTitle
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle
    if (body.bgColor !== undefined) updateData.bg_color = body.bgColor
    if (body.headerImageUrl !== undefined) updateData.header_image_url = body.headerImageUrl
    if (body.isEnabled !== undefined) {
      // Explicitly convert to boolean to ensure consistent data type
      updateData.is_enabled = Boolean(body.isEnabled)
      console.log(`🔄 PUT: Setting is_enabled to ${updateData.is_enabled} (from ${body.isEnabled}, type: ${typeof body.isEnabled}) for landing page ${body.id}`)
    }
    // display_order is now auto-assigned on creation, so we ignore it on updates

    console.log(`💾 PUT: Updating landing page ${body.id} with data:`, updateData)
    
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating landing page:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update landing page' },
        { status: 500 }
      )
    }

    console.log(`✅ PUT: Successfully updated landing page. Returned data:`, {
      id: data.id,
      name: data.name,
      description: data.description,
      descriptionLength: data.description?.length || 0,
      is_enabled: data.is_enabled
    })

    // Verify the update by querying again - wait a moment to ensure transaction commits
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Query by ID first
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, name, is_enabled, tag')
      .eq('id', body.id)
      .single()

    if (verifyError) {
      console.error(`❌ PUT: Verification query error:`, verifyError)
    }

    console.log(`🔍 PUT: Verification query by ID result:`, {
      id: verifyData?.id,
      name: verifyData?.name,
      tag: verifyData?.tag,
      is_enabled: verifyData?.is_enabled,
      is_enabled_type: typeof verifyData?.is_enabled
    })

    // Also query ALL pages to see the full state - wait a bit longer to ensure commit
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { data: allPagesCheck, error: allPagesError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, name, tag, is_enabled')
      .order('name')
    
    if (allPagesError) {
      console.error(`❌ PUT: Error querying all pages:`, allPagesError)
    }
    
    console.log(`🔍 PUT: ALL landing pages after update (with delay):`, allPagesCheck?.map(p => ({
      name: p.name,
      tag: p.tag,
      is_enabled: p.is_enabled,
      type: typeof p.is_enabled
    })))
    
    // Specifically check Healthcare one more time
    const { data: healthcareCheck } = await supabaseAdmin
      .from('landing_pages')
      .select('id, name, tag, is_enabled')
      .eq('tag', 'healthcare')
      .single()
    
    console.log(`🔍 PUT: Healthcare-specific check:`, {
      name: healthcareCheck?.name,
      tag: healthcareCheck?.tag,
      is_enabled: healthcareCheck?.is_enabled,
      type: typeof healthcareCheck?.is_enabled
    })

    return NextResponse.json({ success: true, landingPage: data })
  } catch (error) {
    console.error('Error in PUT /api/admin/landing-pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
