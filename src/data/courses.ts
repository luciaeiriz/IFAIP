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
 * Fetches courses filtered by tag - uses relevancy columns for ranking
 */
export async function getCoursesByTag(tag: CourseTag): Promise<Course[]> {
  try {
    console.log(`🏷️ getCoursesByTag: Fetching courses for tag "${tag}"...`)
    
    // Determine which relevancy column to use based on tag
    const relevancyColumn = tag === 'Business' 
      ? 'business_relevancy' 
      : tag === 'Restaurant' 
      ? 'restaurant_relevancy' 
      : 'fleet_relevancy'
    
    console.log(`🏷️ Using relevancy column: ${relevancyColumn}`)
    
    // Query all courses, ordered by relevancy (lower number = higher relevancy)
    // Filter out courses where relevancy is null for this category
    const { data, error, count } = await supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .not(relevancyColumn, 'is', null)
      .order(relevancyColumn, { ascending: true, nullsFirst: false })

    if (error) {
      console.error('❌ getCoursesByTag DATABASE ERROR:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Fallback: try using tag column for backward compatibility
      console.warn('⚠️ Falling back to tag-based filtering...')
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('tag', tag)
        .order('priority', { ascending: true, nullsFirst: false })
      
      if (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError)
        return []
      }
      
      const transformed = (fallbackData || []).map(transformCourse)
      console.log(`🏷️ getCoursesByTag (fallback): Returned ${transformed.length} courses`)
      return transformed
    }

    console.log(`🏷️ getCoursesByTag: Database returned ${data?.length || 0} courses (count: ${count})`)
    
    if (!data || data.length === 0) {
      console.warn(`⚠️ getCoursesByTag: No courses found for tag "${tag}"`)
      return []
    }

    console.log(`🏷️ Transforming ${data.length} courses...`)
    const transformed = data.map(transformCourse)
    
    console.log(`🏷️ getCoursesByTag: Successfully returned ${transformed.length} courses for tag "${tag}"`)
    if (transformed.length > 0) {
      console.log('Sample transformed course:', {
        id: transformed[0].id,
        title: transformed[0].title,
        tags: transformed[0].tags,
        business_relevancy: data[0].business_relevancy,
        restaurant_relevancy: data[0].restaurant_relevancy,
        fleet_relevancy: data[0].fleet_relevancy,
      })
    }

    return transformed
  } catch (error: any) {
    console.error('❌ getCoursesByTag EXCEPTION:', error)
    console.error('Exception message:', error?.message)
    return []
  }
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
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
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
