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

    console.log('Fetching contact submissions from database...')
    const { data, error, count } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching contact submissions:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      return NextResponse.json(
        { 
          success: false,
          error: error.message || 'Failed to fetch contact submissions',
          code: error.code,
          details: error.details
        },
        { status: 500 }
      )
    }

    console.log(`Successfully fetched ${data?.length || 0} contact submissions (total: ${count || 0})`)

    return NextResponse.json({
      success: true,
      submissions: data || [],
      count: count || 0,
    })
  } catch (error: any) {
    console.error('Error in GET /api/admin/contact-submissions:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error?.message
      },
      { status: 500 }
    )
  }
}
