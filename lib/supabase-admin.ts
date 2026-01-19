import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role key (bypasses RLS)
// Only use this in API routes, never in client components
// This module is dynamically imported to avoid bundling in client code

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// In production, require service role key. In development, allow fallback for easier local setup
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseServiceRoleKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required in production. Admin operations require service role key.')
  } else {
    // Development fallback - use anon key but warn
    const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!fallbackKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    }
    console.warn('⚠️ Using ANON_KEY as fallback for admin client. Set SUPABASE_SERVICE_ROLE_KEY for proper admin access.')
  }
}

// Use service role key if available, otherwise fallback to anon key (dev only)
const adminKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, adminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: (url, options = {}) => {
      // Add timeout to prevent hanging in production
      // Use AbortSignal.timeout if available, otherwise create a timeout promise
      const timeoutMs = 30000 // 30 seconds for admin operations
      
      // If options already has a signal, respect it
      if (options.signal) {
        return fetch(url, options)
      }
      
      // Create timeout signal
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })
    },
  },
})

