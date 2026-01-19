import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

/**
 * Check if the current client-side user is an admin
 * Use this in client components
 * Calls a server-side API route to check admin status securely
 */
export async function isAdminClient(): Promise<boolean> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:10',message:'isAdminClient entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:13',message:'before getSession in isAdminClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:15',message:'after getSession in isAdminClient',data:{hasSession:!!session,hasError:!!sessionError,hasUser:!!session?.user,hasToken:!!session?.access_token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return false
    }

    if (!session?.user || !session?.access_token) {
      console.log('No session or access token')
      return false
    }

    // Don't log tokens even in development for security
    if (process.env.NODE_ENV === 'development') {
      console.log('Calling /api/admin/check-status')
    }

    // Call server-side API route to check admin status
    // Pass the access token in Authorization header
    // This avoids exposing the service role key to the client
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:33',message:'before fetch to check-status',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion
    
    // Add timeout to prevent hanging in production
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    let response: Response
    try {
      response = await fetch('/api/admin/check-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include', // Include cookies for session
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Admin status check timed out after 10 seconds')
        return false
      }
      throw fetchError
    }
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:71',message:'after fetch to check-status',data:{ok:response.ok,status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion

    if (!response.ok) {
      const errorText = await response.text()
      let errorData: any = {}
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      console.error('Admin status check failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: window.location.href,
      })
      return false
    }

    const data = await response.json()
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin check result:', data)
    }
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:85',message:'isAdminClient exit',data:{isAdmin:data.isAdmin===true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion
    return data.isAdmin === true
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:90',message:'isAdminClient error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
    // #endregion
    console.error('Error checking admin status (client):', {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    })
    return false
  }
}

/**
 * Extract user ID from request (checks Authorization header first, then cookies)
 * Returns the authenticated user ID or null
 */
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:82',message:'getUserIdFromRequest entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  try {
    // Get environment variables once at the top
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    // First, try Authorization header (Bearer token)
    const authHeader = request.headers.get('authorization')
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:90',message:'checking auth header',data:{hasAuthHeader:!!authHeader,startsWithBearer:authHeader?.startsWith('Bearer ')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // Use a regular Supabase client with anon key to verify the token
      // The service role client doesn't work for getUser() with tokens
      if (supabaseUrl && supabaseAnonKey) {
        // Create a temporary client with the token as the session
        const { createClient } = await import('@supabase/supabase-js')
        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:106',message:'before getUser from auth header',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const { data: { user }, error } = await tempClient.auth.getUser(token)
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:108',message:'after getUser from auth header',data:{hasUser:!!user,hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (!error && user) {
          console.log('✅ Extracted user ID from Authorization header:', user.id)
          return user.id
        } else {
          console.error('❌ Error getting user from token:', error)
        }
      }
    } else {
      console.log('⚠️ No Authorization header found')
    }

    // If no Authorization header, try cookies
    // Supabase stores session in cookies with pattern: sb-<project-ref>-auth-token
    const cookies = request.cookies
    
    // Extract project ref from URL (format: https://xxxxx.supabase.co)
    const projectRefMatch = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)
    const projectRef = projectRefMatch?.[1] || ''
    
    // Try the standard cookie name
    const authTokenCookie = cookies.get(`sb-${projectRef}-auth-token`)
    
    if (authTokenCookie && supabaseUrl && supabaseAnonKey) {
      try {
        const cookieData = JSON.parse(authTokenCookie.value)
        const accessToken = cookieData?.access_token || cookieData?.accessToken
        
        if (accessToken) {
          // Use regular client with anon key to verify token
          const { createClient } = await import('@supabase/supabase-js')
          const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          })
          const { data: { user }, error } = await tempClient.auth.getUser(accessToken)
          if (!error && user) {
            return user.id
          }
        }
      } catch (parseError) {
        // Skip cookie parsing errors
      }
    }

    // Try finding any cookie with 'auth' or 'sb' in the name
    const allCookies = cookies.getAll()
    
    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js')
      for (const cookie of allCookies) {
        if (cookie.name.includes('auth') || cookie.name.includes('sb-')) {
          try {
            const cookieData = JSON.parse(cookie.value)
            const accessToken = cookieData?.access_token || cookieData?.accessToken
            if (accessToken) {
              const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                },
              })
              const { data: { user }, error } = await tempClient.auth.getUser(accessToken)
              if (!error && user) {
                return user.id
              }
            }
          } catch {
            // Skip if not JSON or other errors
          }
        }
      }
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:163',message:'getUserIdFromRequest returning null',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return null
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/admin-auth.ts:166',message:'getUserIdFromRequest error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.error('Error extracting user ID from request:', error)
    return null
  }
}

/**
 * Check if the user making the request is an admin
 * Use this in API routes and server components
 */
export async function isAdminServer(request: NextRequest): Promise<boolean> {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ No user ID found in request - check Authorization header or cookies')
      }
      return false
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Checking admin status for user:', userId)
    }

    // Check if user exists in admin_users table
    // Use .maybeSingle() instead of .single() to handle 0 rows gracefully
    // Dynamically import supabaseAdmin to avoid bundling it in client code
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('❌ Error querying admin_users:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return false
    }

    const isAdmin = !!data
    if (process.env.NODE_ENV === 'development') {
      console.log(isAdmin ? '✅ User is admin' : '❌ User is not admin')
      if (!isAdmin) {
        console.log('💡 User ID not found in admin_users table. Make sure your user_id matches auth.users.id exactly.')
      }
    }
    return isAdmin
  } catch (error) {
    console.error('Error checking admin status (server):', {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return false
  }
}

/**
 * Get the admin user ID from the request
 * Returns the user_id if user is an admin, null otherwise
 */
export async function getAdminUserId(request: NextRequest): Promise<string | null> {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return null
    }

    // Check if user exists in admin_users table
    // Use .maybeSingle() instead of .single() to handle 0 rows gracefully
    // Dynamically import supabaseAdmin to avoid bundling it in client code
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data.user_id
  } catch (error) {
    console.error('Error getting admin user ID:', error)
    return null
  }
}
