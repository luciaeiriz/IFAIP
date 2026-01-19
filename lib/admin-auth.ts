import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest } from 'next/server'

/**
 * Check if the current client-side user is an admin
 * Use this in client components
 * Calls a server-side API route to check admin status securely
 */
export async function isAdminClient(): Promise<boolean> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return false
    }

    if (!session?.user || !session?.access_token) {
      console.log('No session or access token')
      return false
    }

    console.log('Calling /api/admin/check-status with token:', session.access_token.substring(0, 20) + '...')

    // Call server-side API route to check admin status
    // Pass the access token in Authorization header
    // This avoids exposing the service role key to the client
    const response = await fetch('/api/admin/check-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      credentials: 'include', // Include cookies for session
    })

    if (!response.ok) {
      console.error('API route returned error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return false
    }

    const data = await response.json()
    console.log('Admin check result:', data)
    return data.isAdmin === true
  } catch (error) {
    console.error('Error checking admin status (client):', error)
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
          },
        })
        
        const { data: { user }, error } = await tempClient.auth.getUser(token)
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
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      console.log('⚠️ No user ID found in request')
      return false
    }

    console.log('🔍 Checking admin status for user:', userId)

    // Check if user exists in admin_users table
    // Use .maybeSingle() instead of .single() to handle 0 rows gracefully
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('❌ Error querying admin_users:', error)
      return false
    }

    const isAdmin = !!data
    console.log(isAdmin ? '✅ User is admin' : '❌ User is not admin')
    if (!isAdmin) {
      console.log('💡 User ID not found in admin_users table. Make sure your user_id matches auth.users.id exactly.')
    }
    return isAdmin
  } catch (error) {
    console.error('Error checking admin status (server):', error)
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
