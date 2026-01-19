import { supabase } from './supabase'

export interface ContactSubmissionData {
  name: string
  email: string
  subject: string
  message: string
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
}

/**
 * Inserts a new contact submission into the contact_submissions table
 */
export async function createContactSubmission(
  contactData: ContactSubmissionData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([contactData])

    if (error) {
      console.error('Error creating contact submission:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in createContactSubmission:', error)
    return { success: false, error: 'Failed to submit contact form' }
  }
}

/**
 * Extracts UTM parameters from the current URL
 */
export function getUTMParams(): {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
} {
  if (typeof window === 'undefined') {
    return {}
  }

  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  }
}
