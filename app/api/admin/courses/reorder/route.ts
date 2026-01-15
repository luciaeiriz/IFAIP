import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag, courses } = body

    if (!tag || !courses || !Array.isArray(courses)) {
      return NextResponse.json(
        { error: 'Tag and courses array are required' },
        { status: 400 }
      )
    }

    // Get relevancy column from landing_pages table (supports both legacy and dynamic tags)
    let relevancyColumn: string
    
    // Check if it's a legacy tag
    if (tag === 'Business') {
      relevancyColumn = 'business_relevancy'
    } else if (tag === 'Restaurant') {
      relevancyColumn = 'restaurant_relevancy'
    } else if (tag === 'Fleet') {
      relevancyColumn = 'fleet_relevancy'
    } else {
      // For dynamic tags, fetch from landing_pages table
      const { data: landingPage, error: landingPageError } = await supabaseAdmin
        .from('landing_pages')
        .select('relevancy_column')
        .eq('tag', tag.toLowerCase())
        .single()

      if (landingPageError || !landingPage) {
        return NextResponse.json(
          { error: `Landing page not found for tag: ${tag}` },
          { status: 404 }
        )
      }

      relevancyColumn = landingPage.relevancy_column
    }

    console.log(`💾 API: Saving order for ${tag} page`)
    console.log(`💾 API: Relevancy column: ${relevancyColumn}`)
    console.log(`💾 API: Updating ${courses.length} courses`)

    // Step 1: Get all course IDs and set other courses (not in top 10) to high relevancy (999)
    const top10CourseIds = courses.map((c: { id: string }) => c.id)
    
    const { data: allCourses } = await supabaseAdmin
      .from('courses')
      .select('id')
    
    const allCourseIds = (allCourses || []).map((c: { id: string }) => c.id)
    const otherCourseIds = allCourseIds.filter((id: string) => !top10CourseIds.includes(id))
    
    // Set other courses to 999
    if (otherCourseIds.length > 0) {
      const { error: clearError } = await supabaseAdmin
        .from('courses')
        .update({ [relevancyColumn]: 999 })
        .in('id', otherCourseIds)
      
      if (clearError) {
        console.error('Error clearing other courses:', clearError)
        // Continue anyway - this is not critical
      } else {
        console.log(`✅ Set ${otherCourseIds.length} other courses to relevancy 999`)
      }
    }
    
    // Step 2: Update relevancy scores for the top 10 courses
    const updatePromises = courses.map(async (course: { id: string }, index: number) => {
      const newRelevancy = index + 1
      
      const { error } = await supabaseAdmin
        .from('courses')
        .update({ [relevancyColumn]: newRelevancy })
        .eq('id', course.id)
      
      if (error) {
        console.error(`❌ Error updating course ${course.id}:`, error)
        throw error
      }
      
      return { courseId: course.id, relevancy: newRelevancy }
    })
    
    const results = await Promise.all(updatePromises)
    console.log(`✅ Successfully updated ${results.length} courses`)

    return NextResponse.json({ 
      success: true, 
      updated: results.length,
      message: 'Order updated successfully'
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/courses/reorder:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

