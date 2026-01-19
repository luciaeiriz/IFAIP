import { supabase } from './supabase'

/**
 * Helper function to make authenticated admin API calls
 * Automatically includes the Authorization header with the current session's access token
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Add timeout wrapper to getSession call
  const sessionPromise = supabase.auth.getSession()
  const sessionTimeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('getSession timeout')), 30000)
  )
  
  let session
  try {
    const result = await Promise.race([
      sessionPromise,
      sessionTimeoutPromise,
    ]) as any
    session = result.data?.session
  } catch (timeoutError: any) {
    if (timeoutError.message === 'getSession timeout') {
      throw new Error('Session check timed out. Please try again.')
    }
    throw timeoutError
  }
  
  if (!session?.access_token) {
    throw new Error('No active session. Please log in again.')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${session.access_token}`)
  
  // Only set Content-Type if not already set, if there's a body, and if it's not FormData
  // FormData sets its own Content-Type with boundary, so we shouldn't override it
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })
}
