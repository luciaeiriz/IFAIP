import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rankCoursesForLandingPage } from '@/lib/rank-course'

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST rank all courses for a specific landing page
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Tag or ID is required' },
        { status: 400 }
      )
    }

    // Determine if slug is UUID (ID) or tag
    const isUUID = UUID_REGEX.test(slug)
    
    let landingPage
    if (isUUID) {
      // Fetch by ID, then use the tag
      const { data, error: fetchError } = await supabaseAdmin
        .from('landing_pages')
        .select('tag, relevancy_column, name, description')
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
        .select('tag, relevancy_column, name, description')
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

    const categoryContext = landingPage.description || `AI courses relevant to ${landingPage.name}`

    console.log(`🚀 Starting course ranking for landing page "${landingPage.tag}"...`)
    console.log(`   Relevancy column: ${landingPage.relevancy_column}`)

    // Rank all courses for this landing page (use the tag from the landing page)
    const result = await rankCoursesForLandingPage(
      landingPage.tag,
      landingPage.relevancy_column,
      categoryContext
    )

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to rank courses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ranked ${result.ranked} courses for "${landingPage.tag}"`,
      ranked: result.ranked
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/landing-pages/[slug]/rank-courses:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
