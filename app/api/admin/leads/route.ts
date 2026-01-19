import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  // Debug: Log environment variable status
  console.log('Environment check:', {
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  })

  // Verify service role key is being used
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    const errorMsg = 'SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations require the service role key. Please add it to your deployment environment variables.'
    console.error('❌', errorMsg)
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        hint: 'Add SUPABASE_SERVICE_ROLE_KEY to your deployment platform environment variables (Vercel/Netlify/etc). Find it in Supabase Dashboard → Settings → API → Service Role Key',
        debug: {
          nodeEnv: process.env.NODE_ENV,
          availableEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
        }
      },
      { status: 500 }
    )
  } else {
    console.log('✅ Using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)')
  }

  try {
    const { searchParams } = new URL(request.url)
    const landingTag = searchParams.get('landing_tag')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Fetching leads from database...')
    console.log('Using supabaseAdmin client with service role key')
    
    let query = supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (landingTag && landingTag !== 'all') {
      query = query.eq('landing_tag', landingTag)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch leads' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      success: true,
      leads: data || [],
      count: count || 0,
      timestamp: new Date().toISOString(), // Add timestamp to help debug caching
    })
    
    // Prevent all forms of caching - aggressive headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Vercel-Cache-Control', 'no-cache') // Vercel-specific
    response.headers.set('CDN-Cache-Control', 'no-cache') // CDN-specific
    response.headers.set('Vary', '*') // Prevent any caching based on headers
    
    return response
  } catch (error) {
    console.error('Error in GET /api/admin/leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


