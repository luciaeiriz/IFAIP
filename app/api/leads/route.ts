import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.landing_tag) {
      return NextResponse.json(
        { error: 'Email and landing_tag are required' },
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
    const validLandingTags = ['Business', 'Restaurant', 'Fleet', 'Membership']
    if (!validLandingTags.includes(body.landing_tag)) {
      return NextResponse.json(
        { error: 'Invalid landing_tag. Must be one of: Business, Restaurant, Fleet, Membership' },
        { status: 400 }
      )
    }

    // Prepare the lead data for database
    const leadData = {
      email: body.email.trim().toLowerCase(),
      role: body.role?.trim() || null,
      landing_tag: body.landing_tag,
      utm_source: body.utm_source?.trim() || null,
      utm_medium: body.utm_medium?.trim() || null,
      utm_campaign: body.utm_campaign?.trim() || null,
    }

    // Use admin client (service role key) to bypass RLS
    // This is acceptable for public lead capture endpoints since we validate all input
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create lead' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, lead: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


