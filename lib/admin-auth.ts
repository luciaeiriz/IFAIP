import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

/**
 * Validate that Supabase URL uses HTTPS in production
 * Returns true if valid, false otherwise
 */
function validateSupabaseUrl(supabaseUrl: string): boolean {
  if (process.env.NODE_ENV === 'production' && supabaseUrl && !supabaseUrl.startsWith('https://')) {
    console.error('❌ Supabase URL must use HTTPS in production. Current URL:', supabaseUrl.substring(0, 30) + '...')
    return false
  }
  return true
}

/**
 * Check if the current client-side user is an admin
 * Use this in client components
 * Calls a server-side API route to check admin status securely
 */
export async function isAdminClient(): Promise<boolean> {
  try {
    // Add timeout wrapper to getSession call
    const sessionPromise = supabase.auth.getSession()
    const sessionTimeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('getSession timeout')), 30000)
    )
    
    let session, sessionError
    try {
      const result = await Promise.race([
        sessionPromise,
        sessionTimeoutPromise,
      ]) as any
      session = result.data?.session
      sessionError = result.error
    } catch (timeoutError: any) {
      if (timeoutError.message === 'getSession timeout') {
        console.error('❌ getSession() timed out after 30 seconds in isAdminClient()')
        return false
      }
      throw timeoutError
    }

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
    
    // Add timeout to prevent hanging in production (increased to 30s)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
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
        console.error('Admin status check timed out after 30 seconds')
        return false
      }
      throw fetchError
    }

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
    return data.isAdmin === true
  } catch (error) {
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
  try {
    // Get environment variables once at the top
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    // Validate HTTPS in production
    if (!validateSupabaseUrl(supabaseUrl)) {
      return null
    }
    
    // First, try Authorization header (Bearer token)
    const authHeader = request.headers.get('authorization')
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
            fetch: (url, options = {}) => {
              // Add timeout to prevent hanging
              const timeoutMs = 10000 // 10 seconds for getUser operations
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
              
              return fetch(url, {
                ...options,
                signal: options.signal || controller.signal,
              }).finally(() => {
                clearTimeout(timeoutId)
              })
            },
          },
        })
        
        // Add timeout wrapper to getUser call
        try {
          const getUserPromise = tempClient.auth.getUser(token)
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('getUser timeout')), 10000)
          )
          
          const { data: { user }, error } = await Promise.race([
            getUserPromise,
            timeoutPromise,
          ]) as any
          
          if (!error && user) {
            console.log('✅ Extracted user ID from Authorization header:', user.id)
            return user.id
          } else {
            console.error('❌ Error getting user from token:', error)
          }
        } catch (getUserError: any) {
          if (getUserError.message === 'getUser timeout') {
            console.error('❌ getUser() timed out after 10 seconds')
          } else {
            console.error('❌ Error getting user from token:', getUserError)
          }
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
              fetch: (url, options = {}) => {
                // Add timeout to prevent hanging
                const timeoutMs = 10000 // 10 seconds for getUser operations
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
                
                return fetch(url, {
                  ...options,
                  signal: options.signal || controller.signal,
                }).finally(() => {
                  clearTimeout(timeoutId)
                })
              },
            },
          })
          
          // Add timeout wrapper to getUser call
          try {
            const getUserPromise = tempClient.auth.getUser(accessToken)
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('getUser timeout')), 10000)
            )
            
            const { data: { user }, error } = await Promise.race([
              getUserPromise,
              timeoutPromise,
            ]) as any
            
            if (!error && user) {
              return user.id
            }
          } catch (getUserError: any) {
            if (getUserError.message === 'getUser timeout') {
              console.error('❌ getUser() timed out after 10 seconds (cookie)')
            }
            // Skip other errors, continue to next cookie
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
                  fetch: (url, options = {}) => {
                    // Add timeout to prevent hanging
                    const timeoutMs = 10000 // 10 seconds for getUser operations
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
                    
                    return fetch(url, {
                      ...options,
                      signal: options.signal || controller.signal,
                    }).finally(() => {
                      clearTimeout(timeoutId)
                    })
                  },
                },
              })
              
              // Add timeout wrapper to getUser call
              try {
                const getUserPromise = tempClient.auth.getUser(accessToken)
                const timeoutPromise = new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error('getUser timeout')), 10000)
                )
                
                const { data: { user }, error } = await Promise.race([
                  getUserPromise,
                  timeoutPromise,
                ]) as any
                
                if (!error && user) {
                  return user.id
                }
              } catch (getUserError: any) {
                if (getUserError.message === 'getUser timeout') {
                  console.error('❌ getUser() timed out after 10 seconds (cookie loop)')
                }
                // Skip other errors, continue to next cookie
              }
            }
          } catch {
            // Skip if not JSON or other errors
          }
        }
      }
    }

    return null
  } catch (error) {
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
    // Validate Supabase URL before making queries
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    if (!validateSupabaseUrl(supabaseUrl)) {
      return false
    }
    
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
    
    // Add timeout wrapper to admin query
    const queryPromise = supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Admin query timeout')), 10000)
    )
    
    let data, error
    try {
      const result = await Promise.race([
        queryPromise,
        timeoutPromise,
      ]) as any
      data = result.data
      error = result.error
    } catch (timeoutError: any) {
      if (timeoutError.message === 'Admin query timeout') {
        console.error('❌ Admin query timed out after 10 seconds')
        return false
      }
      throw timeoutError
    }

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
