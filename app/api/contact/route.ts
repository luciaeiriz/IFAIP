import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
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

    // Prepare the contact submission data for database
    const contactData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      utm_source: body.utm_source?.trim() || null,
      utm_medium: body.utm_medium?.trim() || null,
      utm_campaign: body.utm_campaign?.trim() || null,
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact submission:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create contact submission' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, submission: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/contact:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
