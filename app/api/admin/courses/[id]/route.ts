import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.tag) {
      return NextResponse.json(
        { error: 'Title and tag are required' },
        { status: 400 }
      )
    }

    // Prepare the course data for database
    const courseData: any = {
      title: body.title,
      description: body.description || null,
      headline: body.headline || null,
      bullet_points: body.bullet_points || null,
      provider: body.provider || null,
      level: body.level || null,
      duration: body.duration || null,
      tag: body.tag,
      external_url: body.external_url || null,
      priority: body.priority || null,
      rating: body.rating || null,
      reviews: body.reviews || null,
      course_type: body.course_type || null,
      key_skills: body.key_skills || null,
      modules: body.modules || null,
      instructors: body.instructors || null,
      effort: body.effort || null,
      languages: body.languages || null,
      free_trial: body.free_trial || null,
      price_label: body.price_label || null,
      source: body.source || 'admin',
      signup_enabled: body.signup_enabled ?? true,
      is_featured: body.is_featured ?? false,
    }

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update course' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error) {
    console.error('Error in PUT /api/admin/courses/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting course:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/courses/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

