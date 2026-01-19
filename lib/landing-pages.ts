import { supabase } from './supabase'

export interface LandingPage {
  id: string
  tag: string
  name: string
  description: string | null
  hero_title: string | null
  subtitle: string | null
  bg_color: string
  header_image_url: string | null
  relevancy_column: string
  is_enabled: boolean
  display_order: number
  created_at: string | null
  updated_at: string | null
  courseCount?: number
}

export interface LandingPagePublic {
  tag: string
  name: string
  href: string
  description: string
  subtitle: string
  bgColor: string
  heroTitle: string | null
}

/**
 * Fetch all landing pages (admin only)
 */
export async function getAllLandingPages(): Promise<LandingPage[]> {
  try {
    // Dynamically import supabaseAdmin to avoid bundling in client code
    const { supabaseAdmin } = await import('./supabase-admin')
    
    const { data, error } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all landing pages:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllLandingPages:', error)
    return []
  }
}

/**
 * Fetch enabled landing pages only (public)
 */
export async function getEnabledLandingPages(): Promise<LandingPagePublic[]> {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('is_enabled', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching enabled landing pages:', error)
      throw error
    }

    return (data || []).map((page) => ({
      tag: page.tag,
      name: page.name,
      href: `/courses/${page.tag}`,
      description: page.description || '',
      subtitle: page.subtitle || 'at IFAIP',
      bgColor: page.bg_color || '#2563eb',
      heroTitle: page.hero_title,
    }))
  } catch (error) {
    console.error('Error in getEnabledLandingPages:', error)
    return []
  }
}

/**
 * Get single landing page by tag
 */
export async function getLandingPageByTag(tag: string): Promise<LandingPage | null> {
  try {
    const normalizedTag = tag.toLowerCase()
    
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('tag', normalizedTag)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Error fetching landing page by tag:', error.message)
      return null
    }

    if (!data) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getLandingPageByTag:', error)
    return null
  }
}

/**
 * Create new landing page (admin only)
 */
export async function createLandingPage(data: {
  tag: string
  name: string
  description?: string
  heroTitle?: string
  subtitle?: string
  bgColor?: string
  headerImageUrl?: string
  isEnabled?: boolean
  displayOrder?: number
}): Promise<LandingPage> {
  try {
    const response = await fetch('/api/admin/landing-pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create landing page')
    }

    const result = await response.json()
    return result.landingPage
  } catch (error) {
    console.error('Error in createLandingPage:', error)
    throw error
  }
}

/**
 * Update landing page (admin only)
 */
export async function updateLandingPage(
  id: string,
  data: Partial<{
    name: string
    description: string
    heroTitle: string
    subtitle: string
    bgColor: string
    headerImageUrl: string
    isEnabled: boolean
    displayOrder: number
  }>
): Promise<LandingPage> {
  try {
    const response = await fetch('/api/admin/landing-pages', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update landing page')
    }

    const result = await response.json()
    return result.landingPage
  } catch (error) {
    console.error('Error in updateLandingPage:', error)
    throw error
  }
}

/**
 * Delete landing page (admin only)
 */
export async function deleteLandingPage(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/admin/landing-pages/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete landing page')
    }
  } catch (error) {
    console.error('Error in deleteLandingPage:', error)
    throw error
  }
}
