import { supabase } from './supabase'
import { Course, CourseTag } from '@/types/course'

/**
 * Fetches courses filtered by tag, ordered by order (priority) ascending
 */
export async function getCoursesByTag(tag: CourseTag): Promise<Course[]> {
  try {
    console.log(`Fetching courses with tag: ${tag}`)
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('tag', tag)
      .order('order', { ascending: true, nullsFirst: true })

    if (error) {
      console.error('Error fetching courses by tag:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }

    console.log(`Found ${courses?.length || 0} courses with tag ${tag}`)
    if (courses && courses.length > 0) {
      console.log('Sample course:', JSON.stringify(courses[0], null, 2))
    }

    return (courses as Course[]) || []
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

    return data as Course | null
  } catch (error) {
    console.error('Error in getCourseById:', error)
    throw error
  }
}

/**
 * Fetches all courses ordered by order (priority) ascending
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching all courses:', error)
      throw error
    }

    return (data as Course[]) || []
  } catch (error) {
    console.error('Error in getAllCourses:', error)
    throw error
  }
}

/**
 * Fetches top courses (by order) - if is_featured doesn't exist, 
 * we'll use order <= 3 as featured
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    // Get top courses ordered by order (priority)
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('order', { ascending: true, nullsFirst: true })
      .limit(20) // Get top 20, then filter

    if (error) {
      console.error('Error fetching featured courses:', error)
      throw error
    }

    // Filter to top 3 by order (priority)
    const featured = (courses as Course[]) || []
    const filtered = featured.filter(c => c.order !== null && c.order <= 3).slice(0, 3)
    console.log(`Found ${filtered.length} featured courses (from ${featured.length} total)`)
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
      .select('tag, order, title')
      .limit(5)

    if (error) {
      console.error('Database connection error:', error)
      return
    }

    console.log(`Found ${data?.length || 0} courses in database`)
    if (data && data.length > 0) {
      console.log('Sample courses:', data)
      const uniqueTags = [...new Set(data.map(c => c.tag))]
      console.log('Unique tags found:', uniqueTags)
    }
  } catch (error) {
    console.error('Error testing database:', error)
  }
}

