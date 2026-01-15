import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'

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
    console.log(`🔍 getLandingPageByTag: Searching for tag "${normalizedTag}"`)
    
    // Try to fetch the landing page - RLS will filter to only enabled pages
    // But we need to check if it exists even if disabled for admin purposes
    // So we'll fetch all pages and filter client-side, or use a different approach
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('tag', normalizedTag)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found - could be because RLS is blocking or it doesn't exist
        console.log(`❌ Landing page not found for tag "${normalizedTag}" (code: PGRST116)`)
        console.log(`   This could mean:`)
        console.log(`   1. The landing page doesn't exist`)
        console.log(`   2. The landing page exists but is disabled (RLS blocking)`)
        console.log(`   3. The tag doesn't match exactly`)
        return null
      }
      console.error('Error fetching landing page by tag:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      // Don't throw - return null so the page can still render with legacy fallback
      return null
    }

    if (!data) {
      console.log(`❌ No data returned for tag "${normalizedTag}"`)
      return null
    }

    console.log(`✅ Found landing page:`, data.name, `(enabled: ${data.is_enabled})`)
    
    // If RLS allowed it through, it should be enabled, but double-check
    if (!data.is_enabled) {
      console.warn(`⚠️ Landing page "${data.name}" is disabled but was returned (RLS might not be working correctly)`)
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
