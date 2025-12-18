import { supabase } from './supabase'

export interface LeadData {
  email: string
  role?: string | null
  landing_tag: string
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
}

/**
 * Inserts a new lead into the leads table
 */
export async function createLead(leadData: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([leadData])

    if (error) {
      console.error('Error creating lead:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in createLead:', error)
    return { success: false, error: 'Failed to submit lead' }
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

