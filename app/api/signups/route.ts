import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.course_id || !body.landing_tag) {
      return NextResponse.json(
        { error: 'first_name, last_name, email, course_id, and landing_tag are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate landing_tag
    const validLandingTags = ['Business', 'Restaurant', 'Fleet']
    if (!validLandingTags.includes(body.landing_tag)) {
      return NextResponse.json(
        { error: 'Invalid landing_tag. Must be one of: Business, Restaurant, Fleet' },
        { status: 400 }
      )
    }

    // Verify course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, signup_enabled')
      .eq('id', body.course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (!course.signup_enabled) {
      return NextResponse.json(
        { error: 'Signups are not enabled for this course' },
        { status: 403 }
      )
    }

    // Prepare the signup data for database
    const signupData = {
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      email: body.email.trim().toLowerCase(),
      course_id: body.course_id,
      landing_tag: body.landing_tag,
      source: body.source?.trim() || null,
      utm_source: body.utm_source?.trim() || null,
      utm_medium: body.utm_medium?.trim() || null,
      utm_campaign: body.utm_campaign?.trim() || null,
      utm_term: body.utm_term?.trim() || null,
      utm_content: body.utm_content?.trim() || null,
    }

    const { data, error } = await supabase
      .from('signups')
      .insert([signupData])
      .select()
      .single()

    if (error) {
      console.error('Error creating signup:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create signup' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, signup: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/signups:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

