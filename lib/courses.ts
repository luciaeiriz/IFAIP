import { supabase } from './supabase'
import { Course, CourseTag } from '@/types/course'

/**
 * Fetches all courses, with matching tag courses first (sorted by priority),
 * followed by remaining courses (sorted by priority)
 */
export async function getCoursesByTag(tag: CourseTag): Promise<Course[]> {
  try {
    // Fetch all courses
    const { data: allCourses, error } = await supabase
      .from('courses')
      .select('*')
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching courses:', error)
      throw error
    }

    if (!allCourses) {
      return []
    }

    // Separate courses by tag match
    const matchingCourses: Course[] = []
    const otherCourses: Course[] = []

    allCourses.forEach((course: Course) => {
      if (course.tag === tag) {
        matchingCourses.push(course)
      } else {
        otherCourses.push(course)
      }
    })

    // Sort matching courses by priority (ascending, nulls last)
    matchingCourses.sort((a, b) => {
      if (a.priority === null && b.priority === null) return 0
      if (a.priority === null) return 1
      if (b.priority === null) return -1
      return a.priority - b.priority
    })

    // Sort other courses by priority (ascending, nulls last)
    otherCourses.sort((a, b) => {
      if (a.priority === null && b.priority === null) return 0
      if (a.priority === null) return 1
      if (b.priority === null) return -1
      return a.priority - b.priority
    })

    // Return matching courses first, then others
    return [...matchingCourses, ...otherCourses]
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

    return (data as Course[]) || []
  } catch (error) {
    console.error('Error in getAllCourses:', error)
    throw error
  }
}

/**
 * Fetches courses where is_featured = true
 * Ordered by priority ascending
 */
export async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
      .order('priority', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching featured courses:', error)
      throw error
    }

    return (data as Course[]) || []
  } catch (error) {
    console.error('Error in getFeaturedCourses:', error)
    throw error
  }
}

