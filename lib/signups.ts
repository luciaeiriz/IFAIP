import { supabase } from './supabase'

export interface SignupData {
  first_name: string
  last_name: string
  email: string
  course_id: string
  landing_tag: string
  source?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
}

/**
 * Inserts a new signup into the signups table
 */
export async function createSignup(
  signupData: SignupData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('signups').insert([signupData])

    if (error) {
      console.error('Error creating signup:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in createSignup:', error)
    return { success: false, error: 'Failed to submit signup' }
  }
}

/**
 * Extracts all UTM parameters from the current URL
 */
export function getAllUTMParams(): {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
} {
  if (typeof window === 'undefined') {
    return {}
  }

  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  }
}

