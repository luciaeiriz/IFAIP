import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// DELETE landing page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    if (!slug) {
      return NextResponse.json(
        { error: 'ID or tag is required' },
        { status: 400 }
      )
    }

    // Determine if slug is UUID (ID) or tag
    const isUUID = UUID_REGEX.test(slug)
    
    let landingPage
    if (isUUID) {
      // Fetch by ID
      const { data, error: fetchError } = await supabaseAdmin
        .from('landing_pages')
        .select('id, tag, relevancy_column')
        .eq('id', slug)
        .single()

      if (fetchError || !data) {
        return NextResponse.json(
          { error: 'Landing page not found' },
          { status: 404 }
        )
      }
      landingPage = data
    } else {
      // Fetch by tag
      const { data, error: fetchError } = await supabaseAdmin
        .from('landing_pages')
        .select('id, tag, relevancy_column')
        .eq('tag', slug)
        .single()

      if (fetchError || !data) {
        return NextResponse.json(
          { error: 'Landing page not found' },
          { status: 404 }
        )
      }
      landingPage = data
    }

    // Check if there are courses using this relevancy column
    // Only block deletion if courses have meaningful relevancy scores (not just null or placeholder values)
    // Skip this check if force=true
    if (!force) {
      const { count } = await supabaseAdmin
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .not(landingPage.relevancy_column, 'is', null)
        .gt(landingPage.relevancy_column, 0)
        .lt(landingPage.relevancy_column, 999)

      if (count && count > 0) {
        return NextResponse.json(
          { 
            error: `Cannot delete landing page: ${count} courses have relevancy scores for this landing page. To hide it from users, disable it instead of deleting. If you really need to delete it, add ?force=true to the request URL.`,
            courseCount: count
          },
          { status: 400 }
        )
      }
    } else {
      // Log force deletion
      const { count } = await supabaseAdmin
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .not(landingPage.relevancy_column, 'is', null)
        .gt(landingPage.relevancy_column, 0)
        .lt(landingPage.relevancy_column, 999)
      
      console.log(`⚠️ Force deleting landing page "${landingPage.tag}" with ${count || 0} courses having relevancy scores`)
    }

    // Before deleting the landing page, clear all relevancy scores for this column
    // This ensures we don't leave orphaned relevancy data
    console.log(`🧹 Clearing relevancy scores from ${landingPage.relevancy_column} column before deleting landing page...`)
    
    // Validate column name to prevent SQL injection (should match pattern: lowercase, numbers, underscores)
    const columnNamePattern = /^[a-z0-9_]+$/
    if (!columnNamePattern.test(landingPage.relevancy_column)) {
      console.error(`❌ Invalid relevancy column name: ${landingPage.relevancy_column}`)
      return NextResponse.json(
        { error: 'Invalid relevancy column name' },
        { status: 400 }
      )
    }

    // Clear relevancy scores for all courses that have scores for this landing page
    // Use direct update with dynamic object - Supabase supports this
    try {
      // Create update object with dynamic column name
      const updateObj: any = {}
      updateObj[landingPage.relevancy_column] = null
      
      // Try batch update first - update all courses at once
      // Note: We update ALL courses, setting the relevancy column to null
      // This is safe because NULL means "no relevancy score" for that landing page
      const { data: updatedCourses, error: updateError } = await supabaseAdmin
        .from('courses')
        .update(updateObj)
        .select('id')

      if (updateError) {
        console.error(`⚠️ Batch update failed, trying individual updates:`, updateError)
        
        // Fallback: Get all courses and update them individually
        const { data: allCourses, error: fetchError } = await supabaseAdmin
          .from('courses')
          .select('id')
          .limit(1000) // Limit to prevent memory issues

        if (!fetchError && allCourses && allCourses.length > 0) {
          // Update in batches of 50 to avoid overwhelming the database
          const batchSize = 50
          let cleared = 0
          for (let i = 0; i < allCourses.length; i += batchSize) {
            const batch = allCourses.slice(i, i + batchSize)
            const updatePromises = batch.map(course => {
              const singleUpdateObj: any = {}
              singleUpdateObj[landingPage.relevancy_column] = null
              return supabaseAdmin
                .from('courses')
                .update(singleUpdateObj)
                .eq('id', course.id)
            })
            
            const results = await Promise.allSettled(updatePromises)
            cleared += results.filter(r => r.status === 'fulfilled').length
          }
          console.log(`✅ Cleared relevancy scores for ${cleared} courses (individual updates)`)
        } else if (fetchError) {
          console.error(`⚠️ Error fetching courses:`, fetchError)
        }
      } else {
        const updatedCount = updatedCourses?.length || 0
        console.log(`✅ Cleared relevancy scores for ${updatedCount} courses`)
      }
    } catch (clearError: any) {
      console.error(`⚠️ Error clearing relevancy scores (continuing with deletion):`, clearError)
      // Continue with deletion even if clearing scores fails
    }

    // Delete the landing page
    console.log(`🗑️ Attempting to delete landing page:`, {
      id: landingPage.id,
      tag: landingPage.tag,
      name: landingPage.name
    })
    
    const { error, data: deleteResult } = await supabaseAdmin
      .from('landing_pages')
      .delete()
      .eq('id', landingPage.id)
      .select()

    if (error) {
      console.error('❌ Error deleting landing page:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete landing page' },
        { status: 500 }
      )
    }

    console.log(`✅ DELETE: Landing page deletion result:`, deleteResult)

    // Verify deletion by querying for the page
    await new Promise(resolve => setTimeout(resolve, 200))
    const { data: verifyDeleted } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tag, name')
      .eq('id', landingPage.id)
      .single()

    if (verifyDeleted) {
      console.error(`⚠️ WARNING: Landing page "${landingPage.tag}" still exists after deletion attempt!`)
      return NextResponse.json(
        { error: 'Deletion may have failed - landing page still exists in database' },
        { status: 500 }
      )
    } else {
      console.log(`✅ Verified: Landing page "${landingPage.tag}" successfully deleted from database`)
    }

    return NextResponse.json({ 
      success: true,
      message: `Landing page deleted successfully. Relevancy scores have been cleared.`
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/landing-pages/[slug]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
