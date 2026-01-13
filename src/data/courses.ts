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
    console.log('🔍 RAW QUERY: Fetching ALL courses with no filters...')
    
    // Log the Supabase URL being used (first 30 chars for security)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    console.log('🔗 Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : '❌ MISSING')
    console.log('🔑 Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ MISSING')
    
    // Try the simplest possible query first
    const { data, error, count } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .limit(100) // Add explicit limit

    if (error) {
      console.error('❌ RAW QUERY ERROR:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error hint:', error.hint)
      console.error('Full error:', JSON.stringify(error, null, 2))
      
      // If it's an RLS error, provide helpful message
      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.error('🔒 RLS ERROR: Row Level Security is blocking the query!')
        console.error('Check your Supabase RLS policies for the courses table.')
        console.error('Go to Supabase Dashboard → Authentication → Policies → courses table')
        console.error('Make sure "courses_select_public" policy exists and allows SELECT')
      }
      
      return []
    }

    console.log(`✅ RAW QUERY SUCCESS: Found ${data?.length || 0} courses (count: ${count})`)
    
    if (data && data.length > 0) {
      console.log('📋 Sample raw course data:', JSON.stringify(data[0], null, 2))
      console.log('📋 All column names:', Object.keys(data[0]))
      console.log('📋 Sample tag value:', data[0].tag)
      console.log('📋 Sample priority value:', data[0].priority)
    } else {
      console.warn('⚠️ No courses found in database')
      console.warn('This could mean:')
      console.warn('1. No courses exist in THIS Supabase project')
      console.warn('2. RLS policies are blocking the query (but no error shown)')
      console.warn('3. Wrong Supabase project/credentials')
      console.warn('')
      console.warn('🔍 VERIFICATION STEPS:')
      console.warn('1. Go to Supabase Dashboard → Table Editor → courses')
      console.warn('2. Check if courses exist there')
      console.warn('3. Verify the Supabase URL matches:', supabaseUrl.substring(0, 30) + '...')
      console.warn('4. Check RLS policies: Dashboard → Authentication → Policies')
    }

    return data || []
  } catch (error: any) {
    console.error('❌ RAW QUERY EXCEPTION:', error)
    console.error('Exception message:', error?.message)
    console.error('Exception stack:', error?.stack)
    return []
  }
}

/**
 * Test Supabase connection with raw query
 */
export async function testSupabaseConnection(): Promise<void> {
  console.log('🧪 === TESTING SUPABASE CONNECTION ===')
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  
  const courses = await rawQueryAllCourses()
  console.log(`📊 Connection test result: ${courses.length} courses found`)
  
  if (courses.length > 0) {
    const sample = courses[0]
    console.log('📋 Sample course columns:', Object.keys(sample))
    console.log('📋 Sample course tag value:', sample.tag)
    console.log('📋 Sample course type column:', sample.type || sample.course_type || 'NOT FOUND')
  }
}

/**
 * Fetches ALL courses - simplest possible query
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    console.log('📦 getAllCourses: Starting...')
    
    const rawCourses = await rawQueryAllCourses()
    
    if (rawCourses.length === 0) {
      console.warn('⚠️ getAllCourses: No courses found in database')
      return []
    }

    console.log(`📦 getAllCourses: Transforming ${rawCourses.length} courses...`)
    const transformed = rawCourses.map(transformCourse)
    
    if (transformed.length > 0) {
      console.log('✅ getAllCourses: Sample transformed course:', {
        id: transformed[0].id,
        title: transformed[0].title,
        tag: transformed[0].tags,
        priority: transformed[0].priority,
      })
    }

    return transformed
  } catch (error) {
    console.error('❌ getAllCourses ERROR:', error)
    return []
  }
}

/**
 * Helper function to get the relevancy column name for a given tag
 */
export function getRelevancyColumn(tag: CourseTag): string {
  return tag === 'Business' 
    ? 'business_relevancy' 
    : tag === 'Restaurant' 
    ? 'restaurant_relevancy' 
    : 'fleet_relevancy'
}

/**
 * Base internal function - fetches courses with flexible options
 * This is the single source of truth for course fetching logic
 * Returns courses with relevancy data preserved (even though Course type doesn't include it)
 */
async function getCoursesByTagInternal(
  tag: CourseTag, 
  options: {
    includeHidden?: boolean
    limit?: number
  } = {}
): Promise<Course[]> {
  try {
    const { includeHidden = false, limit } = options
    const relevancyColumn = getRelevancyColumn(tag)
    
    console.log(`🏷️ getCoursesByTagInternal: Fetching courses for tag "${tag}" (includeHidden: ${includeHidden}, limit: ${limit || 'none'})...`)
    console.log(`🏷️ IMPORTANT: NO tag filter, NO signup_enabled filter - getting ALL courses sorted by ${relevancyColumn}`)
    console.log(`🏷️ Ordering by: ${relevancyColumn} (ascending, nullsFirst: false)`)
    
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
      console.log(`🏷️ Limiting to ${limit} courses`)
    }
    
    const { data, error } = await query
    
    // Log the actual results to debug
    console.log(`🏷️ Query executed: returned ${data?.length || 0} courses (limit was ${limit || 'none'})`)
    if (data && data.length > 0) {
      console.log(`🏷️ Relevancy scores for returned courses:`, data.map((r: any) => ({
        id: r.id,
        title: r.title,
        [relevancyColumn]: r[relevancyColumn],
        signup_enabled: r.signup_enabled
      })))
    }
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
      
      const transformed = (fallbackData || []).map(transformCourse)
      console.log(`🏷️ getCoursesByTagInternal (fallback): Returned ${transformed.length} courses`)
      return transformed
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
    
    console.log(`🏷️ getCoursesByTagInternal: Successfully returned ${transformed.length} courses for tag "${tag}" (limit was ${limit || 'none'})`)
    
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
export async function getCoursesByTag(tag: CourseTag): Promise<Course[]> {
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
  const relevancyColumn = getRelevancyColumn(tag)
  
  try {
    console.log(`🏷️ getCoursesByTagWithRelevancy: Fetching courses for tag "${tag}" with relevancy data...`)
    
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
      const result = limit && coursesWithRelevancy.length > limit 
        ? coursesWithRelevancy.slice(0, limit)
        : coursesWithRelevancy
      
      console.log(`🏷️ getCoursesByTagWithRelevancy (fallback): Returned ${result.length} courses`)
      return result
    }
    
    if (!data || data.length === 0) {
      console.warn(`⚠️ getCoursesByTagWithRelevancy: No courses found for tag "${tag}"`)
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
    
    console.log(`🏷️ getCoursesByTagWithRelevancy: Successfully returned ${coursesWithRelevancy.length} courses for tag "${tag}"`)
    return coursesWithRelevancy
  } catch (error: any) {
    console.error('❌ getCoursesByTagWithRelevancy EXCEPTION:', error)
    return []
  }
}

/**
 * For admin management - returns all courses (visible + hidden) for management
 */
export async function getCoursesByTagForManagement(tag: CourseTag): Promise<Course[]> {
  return getCoursesByTagInternal(tag, { includeHidden: true, limit: 100 })
}

/**
 * Fetches a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    console.log(`🔍 getCourseById: Fetching course ${id}...`)
    
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
      console.warn(`⚠️ getCourseById: Course ${id} not found`)
      return null
    }

    console.log(`✅ getCourseById: Found course ${id}`)
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
    console.log('⭐ getFeaturedCourses: Fetching featured courses from database...')
    
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
      console.log('⭐ getFeaturedCourses: No featured courses found')
      return []
    }

    console.log(`⭐ getFeaturedCourses: Database returned ${data.length} featured courses`)
    
    // Transform database rows to Course objects
    const featured = data.map(transformCourse)

    console.log(`⭐ getFeaturedCourses: Successfully returned ${featured.length} featured courses`)
    return featured
  } catch (error) {
    console.error('❌ getFeaturedCourses ERROR:', error)
    return []
  }
}
