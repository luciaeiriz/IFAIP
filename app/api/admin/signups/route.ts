import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const landingTag = searchParams.get('landing_tag')
    const courseId = searchParams.get('course_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('signups')
      .select('*, courses(title)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (landingTag && landingTag !== 'all') {
      query = query.eq('landing_tag', landingTag)
    }

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching signups:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch signups' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      signups: data || [],
      count: count || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/signups:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


