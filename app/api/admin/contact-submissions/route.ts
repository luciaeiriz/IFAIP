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
    serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'not set',
    nodeEnv: process.env.NODE_ENV,
    allSupabaseEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
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
    const limit = parseInt(searchParams.get('limit') || '500')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Fetching contact submissions from database...')
    console.log('Using supabaseAdmin client with service role key')
    
    // First, test if we can access the table at all
    const testQuery = await supabaseAdmin
      .from('contact_submissions')
      .select('id')
      .limit(1)
    
    if (testQuery.error) {
      console.error('Test query error:', testQuery.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${testQuery.error.message}`,
          code: testQuery.error.code,
          hint: testQuery.error.hint || 'Check if the contact_submissions table exists and RLS policies allow access',
        },
        { status: 500 }
      )
    }

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

    const response = NextResponse.json({
      success: true,
      submissions: data || [],
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
