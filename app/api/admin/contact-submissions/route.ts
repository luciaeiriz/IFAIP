import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '500')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error, count } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching contact submissions:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch contact submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      submissions: data || [],
      count: count || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/contact-submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
