import { createClient } from '@supabase/supabase-js'

// In Next.js, NEXT_PUBLIC_ variables are available at build time
// They get embedded into the client bundle
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only log in development to avoid console spam
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase URL and Anon Key must be provided via environment variables')
    console.error('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.error('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  } else {
    console.log('✅ Supabase client initialized')
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

