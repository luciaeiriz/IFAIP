import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
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
      .insert([courseData])
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, course: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


