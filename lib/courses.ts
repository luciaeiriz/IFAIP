import { supabase } from './supabase'
import { Course, CourseTag, DatabaseCourse } from '@/types/course'

/**
 * Transform database course row to Course object
 */
function transformCourse(row: DatabaseCourse): Course {
  // Handle both 'course_type' and 'type' column names if needed
  const courseType = row.course_type || null
  
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
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  }
}

/**
 * Fetches courses filtered by tag, ordered by priority ascending
 */
export async function getCoursesByTag(tag: CourseTag): Promise<Course[]> {
  try {
    console.log(`Fetching courses with tag: ${tag}`)
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('tag', tag)
      .order('priority', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('Error fetching courses by tag:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }

    console.log(`Found ${courses?.length || 0} courses with tag ${tag}`)
    if (courses && courses.length > 0) {
      console.log('Sample course:', JSON.stringify(courses[0], null, 2))
    }

    return (courses || []).map(transformCourse)
  } catch (error) {
    console.error('Error in getCoursesByTag:', error)
    throw error
  }
}

/**
 * Fetches a single course by ID
 * Uses maybeSingle() to handle not found gracefully
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching course by ID:', error)
      throw error
    }

    if (!data) {
      return null
    }

    return transformCourse(data as DatabaseCourse)
  } catch (error) {
    console.error('Error in getCourseById:', error)
    throw error
  }
}

/**
 * Fetches all courses ordered by priority ascending
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching all courses:', error)
      throw error
    }

    return (data || []).map(transformCourse)
  } catch (error) {
    console.error('Error in getAllCourses:', error)
    throw error
  }
}

/**
 * Fetches top courses (by priority) - if is_featured doesn't exist, 
 * we'll use priority <= 3 as featured
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    // Get top courses ordered by priority
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('priority', { ascending: true, nullsFirst: true })
      .limit(20) // Get top 20, then filter

    if (error) {
      console.error('Error fetching featured courses:', error)
      throw error
    }

    // Transform and filter to top 3 by priority
    const transformed = (courses || []).map(transformCourse)
    const filtered = transformed.filter(c => c.priority !== null && c.priority <= 3).slice(0, 3)
    console.log(`Found ${filtered.length} featured courses (from ${transformed.length} total)`)
    return filtered
  } catch (error) {
    console.error('Error in getFeaturedCourses:', error)
    throw error
  }
}

/**
 * Test function to check database connection and see what data exists
 */
export async function testDatabaseConnection(): Promise<void> {
  try {
    console.log('Testing database connection...')
    const { data, error } = await supabase
      .from('courses')
      .select('tag, priority, title')
      .limit(5)

    if (error) {
      console.error('Database connection error:', error)
      return
    }

    console.log(`Found ${data?.length || 0} courses in database`)
    if (data && data.length > 0) {
      console.log('Sample courses:', data)
      const uniqueTags = [...new Set(data.map(c => c.tag).filter(Boolean))]
      console.log('Unique tags found:', uniqueTags)
    }
  } catch (error) {
    console.error('Error testing database:', error)
  }
}

