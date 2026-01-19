import { supabase } from '@/lib/supabase'
import { Course, CourseTag, DatabaseCourse } from '@/types/course'

/**
 * Raw database row type - accepts any column name variations
 */
type RawCourseRow = Record<string, any>

/**
 * Transform function - handles both 'course_type' and 'type' column names
 */
function transformCourse(row: RawCourseRow): Course {
  // Handle both 'course_type' and 'type' column names
  const courseType = row.type || row.course_type || null
  
  return {
    id: String(row.id || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    headline: row.headline || null,
    bullet_points: Array.isArray(row.bullet_points) ? row.bullet_points : null,
    provider: row.provider || null,
    level: (row.level as any) || 'Beginner',
    duration: String(row.duration || ''),
    tags: row.tag ? [row.tag] : [],
    external_url: row.external_url || null,
    priority: Number(row.priority) || 999,
    rating: row.rating ? Number(row.rating) : null,
    reviews: row.reviews ? Number(row.reviews) : null,
    course_type: courseType,
    key_skills: row.key_skills || null,
    modules: row.modules || null,
    instructors: row.instructors || null,
    effort: row.effort || null,
    languages: row.languages || null,
    price: row.free_trial || undefined,
    source: String(row.source || ''),
    signup_enabled: Boolean(row.signup_enabled ?? true),
    is_featured: Boolean(row.is_featured ?? false),
    price_label: row.price_label || null,
    free_trial: row.free_trial || null,
    logo_url: row.logo_url || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  }
}

/**
 * Raw query - just get everything, no filters
 */
async function rawQueryAllCourses(): Promise<RawCourseRow[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(100)

    if (error) {
      console.error('❌ RAW QUERY ERROR:', error.message)
      // If it's an RLS error, provide helpful message
      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.error('🔒 RLS ERROR: Row Level Security is blocking the query!')
      }
      return []
    }

    return data || []
  } catch (error: any) {
    console.error('❌ RAW QUERY EXCEPTION:', error?.message)
    return []
  }
}

/**
 * Test Supabase connection with raw query
 */
export async function testSupabaseConnection(): Promise<void> {
  await rawQueryAllCourses()
}

/**
 * Fetches ALL courses - simplest possible query
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const rawCourses = await rawQueryAllCourses()
    
    if (rawCourses.length === 0) {
      return []
    }

    return rawCourses.map(transformCourse)
  } catch (error) {
    console.error('❌ getAllCourses ERROR:', error)
    return []
  }
}

/**
 * Cache for relevancy column lookups to avoid repeated database queries
 */
const relevancyColumnCache = new Map<string, string>()

/**
 * Helper function to get the relevancy column name for a given tag
 * Supports both legacy tags (Business, Restaurant, Fleet) and dynamic tags from landing_pages table
 * Uses caching to avoid repeated database queries
 */
export async function getRelevancyColumn(tag: string): Promise<string> {
  // Check cache first
  if (relevancyColumnCache.has(tag)) {
    return relevancyColumnCache.get(tag)!
  }
  
  // Check if it's a legacy tag
  if (tag === 'Business') {
    relevancyColumnCache.set(tag, 'business_relevancy')
    return 'business_relevancy'
  }
  if (tag === 'Restaurant') {
    relevancyColumnCache.set(tag, 'restaurant_relevancy')
    return 'restaurant_relevancy'
  }
  if (tag === 'Fleet') {
    relevancyColumnCache.set(tag, 'fleet_relevancy')
    return 'fleet_relevancy'
  }
  
  // For new tags, fetch from landing_pages table
  try {
    const { data } = await supabase
      .from('landing_pages')
      .select('relevancy_column')
      .eq('tag', tag.toLowerCase())
      .single()
    
    if (data?.relevancy_column) {
      relevancyColumnCache.set(tag, data.relevancy_column) // Cache result
      return data.relevancy_column
    }
  } catch (error) {
    console.warn(`Could not fetch relevancy column for tag "${tag}":`, error)
  }
  
  // Fallback: generate column name from tag
  const fallback = `${tag.toLowerCase()}_relevancy`
  relevancyColumnCache.set(tag, fallback) // Cache fallback
  return fallback
}

/**
 * Base internal function - fetches courses with flexible options
 * This is the single source of truth for course fetching logic
 * Returns courses with relevancy data preserved (even though Course type doesn't include it)
 */
async function getCoursesByTagInternal(
  tag: CourseTag | string, 
  options: {
    includeHidden?: boolean
    limit?: number
  } = {}
): Promise<Course[]> {
  try {
    const { includeHidden = false, limit } = options
    const relevancyColumn = await getRelevancyColumn(tag)
    
    // Build query step by step - Supabase queries are chainable
    // CRITICAL: NO FILTERING BY TAG OR signup_enabled - get ALL courses, sort by relevancy score
    // The relevancy score determines which page the course appears on, not the tag field
    let query = supabase
      .from('courses')
      .select('*')
      // NO .eq('tag', tag) - we want ALL courses, not filtered by tag
      // NO .eq('signup_enabled', true) - we want ALL courses regardless of signup_enabled
    
    // Order by relevancy column (lower number = higher priority)
    // This determines which courses appear on each page
    query = query.order(relevancyColumn || 'priority', { ascending: true, nullsFirst: false })
    
    // Apply limit AFTER ordering to ensure we get the top N courses
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (data && limit && data.length > limit) {
      console.error(`❌ ERROR: Query returned ${data.length} courses but limit was ${limit}! This should not happen.`)
    }
    
    if (error) {
      console.error('❌ getCoursesByTagInternal DATABASE ERROR:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Fallback: try using priority if relevancy column doesn't exist
      console.warn('⚠️ Falling back to priority-based ordering...')
      let fallbackQuery = supabase
        .from('courses')
        .select('*')
        // NO .eq('tag', tag) - get ALL courses
      
      fallbackQuery = fallbackQuery.order('priority', { ascending: true, nullsFirst: false })
      
      if (limit) {
        fallbackQuery = fallbackQuery.limit(limit)
      }
      
      const { data: fallbackData, error: fallbackError } = await fallbackQuery
      
      if (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError)
        return []
      }
      
      return (fallbackData || []).map(transformCourse)
    }
    
    if (!data || data.length === 0) {
      console.warn(`⚠️ getCoursesByTagInternal: No courses found for tag "${tag}"`)
      return []
    }
    
    // Transform courses - relevancy data exists in raw rows but Course type doesn't include it
    // The calling code can access it via type assertion if needed (CourseWithRelevancy)
    let transformed = data.map(transformCourse)
    
    // CRITICAL: Enforce limit in case database returns more than requested
    // This ensures we NEVER return more courses than the limit
    if (limit && transformed.length > limit) {
      console.warn(`⚠️ WARNING: Database returned ${transformed.length} courses but limit is ${limit}. Truncating to ${limit}.`)
      transformed = transformed.slice(0, limit)
    }
    
    return transformed
  } catch (error: any) {
    console.error('❌ getCoursesByTagInternal EXCEPTION:', error)
    console.error('Exception message:', error?.message)
    return []
  }
}

/**
 * Interface for courses with relevancy data (used by admin management)
 */
export interface CourseWithRelevancy extends Course {
  business_relevancy?: number | null
  restaurant_relevancy?: number | null
  fleet_relevancy?: number | null
}

/**
 * For course pages - returns exactly 10 courses sorted by relevancy (no signup_enabled filter)
 */
export async function getCoursesByTag(tag: CourseTag | string): Promise<Course[]> {
  return getCoursesByTagInternal(tag, { includeHidden: true, limit: 10 })
}

/**
 * For admin management - returns courses with relevancy data preserved
 * This ensures the management tool shows exactly what course pages display
 */
export async function getCoursesByTagWithRelevancy(
  tag: CourseTag,
  options: { includeHidden?: boolean; limit?: number } = {}
): Promise<CourseWithRelevancy[]> {
  const { includeHidden = false, limit = 10 } = options
  const relevancyColumn = await getRelevancyColumn(tag)
  
  try {
    // Build query - same logic as getCoursesByTagInternal but preserve relevancy data
    let query = supabase
      .from('courses')
      .select('*')
      .eq('tag', tag)
    
    if (!includeHidden) {
      query = query.eq('signup_enabled', true)
    }
    
    query = query.order(relevancyColumn || 'priority', { ascending: true, nullsFirst: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('❌ getCoursesByTagWithRelevancy DATABASE ERROR:', error)
      // Fallback to priority-based ordering
      let fallbackQuery = supabase
        .from('courses')
        .select('*')
        .eq('tag', tag)
      
      if (!includeHidden) {
        fallbackQuery = fallbackQuery.eq('signup_enabled', true)
      }
      
      fallbackQuery = fallbackQuery.order('priority', { ascending: true, nullsFirst: false })
      
      if (limit) {
        fallbackQuery = fallbackQuery.limit(limit)
      }
      
      const { data: fallbackData, error: fallbackError } = await fallbackQuery
      
      if (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError)
        return []
      }
      
      // Transform with relevancy data preserved
      const coursesWithRelevancy = (fallbackData || []).map(row => ({
        ...transformCourse(row),
        business_relevancy: row.business_relevancy ?? null,
        restaurant_relevancy: row.restaurant_relevancy ?? null,
        fleet_relevancy: row.fleet_relevancy ?? null,
      })) as CourseWithRelevancy[]
      
      // Enforce limit
      return limit && coursesWithRelevancy.length > limit 
        ? coursesWithRelevancy.slice(0, limit)
        : coursesWithRelevancy
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    // Transform courses and PRESERVE relevancy data from raw database rows
    // This maintains the exact order from the database query
    let coursesWithRelevancy = data.map(row => ({
      ...transformCourse(row),
      business_relevancy: row.business_relevancy ?? null,
      restaurant_relevancy: row.restaurant_relevancy ?? null,
      fleet_relevancy: row.fleet_relevancy ?? null,
    })) as CourseWithRelevancy[]
    
    // Enforce limit
    if (limit && coursesWithRelevancy.length > limit) {
      console.warn(`⚠️ WARNING: Database returned ${coursesWithRelevancy.length} courses but limit is ${limit}. Truncating to ${limit}.`)
      coursesWithRelevancy = coursesWithRelevancy.slice(0, limit)
    }
    
    return coursesWithRelevancy
  } catch (error: any) {
    console.error('❌ getCoursesByTagWithRelevancy EXCEPTION:', error)
    return []
  }
}

/**
 * For admin management - returns all courses (visible + hidden) for management
 */
export async function getCoursesByTagForManagement(tag: CourseTag | string): Promise<Course[]> {
  return getCoursesByTagInternal(tag, { includeHidden: true, limit: 100 })
}

/**
 * Fetches a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('❌ getCourseById ERROR:', error)
      return null
    }

    if (!data) {
      return null
    }

    return transformCourse(data)
  } catch (error) {
    console.error('❌ getCourseById EXCEPTION:', error)
    return null
  }
}

/**
 * Fetches featured courses - directly queries database with is_featured filter
 * This is more efficient than fetching all courses and filtering in memory
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    // Query database directly for featured courses
    // Only show courses where signup_enabled is true (visible courses)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
      .eq('signup_enabled', true)
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('❌ getFeaturedCourses DATABASE ERROR:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Transform database rows to Course objects
    return data.map(transformCourse)
  } catch (error) {
    console.error('❌ getFeaturedCourses ERROR:', error)
    return []
  }
}

/**
 * Optimized: Fetches featured courses filtered by tag - more efficient than fetching all and filtering client-side
 * This reduces data transfer and improves performance
 */
export async function getFeaturedCoursesByTag(tag: CourseTag): Promise<Course[]> {
  try {
    // Query database directly for featured courses with tag filter
    // This is more efficient than fetching all featured courses and filtering in memory
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
      .eq('signup_enabled', true)
      .eq('tag', tag)
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('❌ getFeaturedCoursesByTag DATABASE ERROR:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Transform database rows to Course objects
    return data.map(transformCourse)
  } catch (error) {
    console.error('❌ getFeaturedCoursesByTag ERROR:', error)
    return []
  }
}
