'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { getCoursesByTag, getFeaturedCourses } from '@/src/data/courses'
import { Course, CourseTag } from '@/types/course'
import ForbesHeroSection from '@/components/courses/ForbesHeroSection'
import FeaturedTopPicks from '@/components/courses/FeaturedTopPicks'
import AllCoursesGrid from '@/components/courses/AllCoursesGrid'

const TAG = 'Business'

function BusinessCoursesContent() {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      
      try {
        console.log('🚀 === STARTING COURSE FETCH ===')
        console.log(`Target tag: ${TAG}`)
        
        // Step 1: Test connection
        const { testSupabaseConnection } = await import('@/src/data/courses')
        await testSupabaseConnection()
        
        // Step 2: Fetch courses
        const [courses, featured] = await Promise.all([
          getCoursesByTag(TAG),
          getFeaturedCourses(),
        ])
        
        console.log(`✅ Fetch complete:`)
        console.log(`  - ${courses.length} courses for tag "${TAG}"`)
        console.log(`  - ${featured.length} total featured courses`)
        
        const featuredForTag = featured.filter(c => c.tags.includes(TAG as CourseTag))
        console.log(`  - ${featuredForTag.length} featured courses for tag "${TAG}"`)
        
        setAllCourses(courses)
        setFeaturedCourses(featuredForTag)
      } catch (err: any) {
        console.error('❌ Error fetching courses:', err)
        const errorMessage = err.message || 'Failed to load courses.'
        console.error('Error message:', errorMessage)
        setAllCourses([])
        setFeaturedCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])


  // Get top 3 courses for top picks (already sorted by business_relevancy from getCoursesByTag)
  const featuredTopPicks = useMemo(() => {
    // Use top 3 from allCourses (already sorted by business_relevancy, lower = higher priority)
    return allCourses.slice(0, 3)
  }, [allCourses])


  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl py-16">
        <div className="text-center">Loading courses...</div>
      </div>
    )
  }

  // Show message if no courses found
  if (allCourses.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ForbesHeroSection tag={TAG} />
        {/* Top 3 Providers Section */}
        <FeaturedTopPicks courses={featuredTopPicks} />
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses found</h2>
            <p className="text-gray-600 mb-4">
              There are no {TAG.toLowerCase()} courses available at the moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ForbesHeroSection tag={TAG} />

      {/* Top 3 Providers Section */}
      <FeaturedTopPicks courses={featuredTopPicks} />

      {/* All Courses Section */}
      {allCourses.length > 0 && (
        <div className="bg-white pt-4 pb-12">
          <AllCoursesGrid courses={allCourses.slice(0, 10)} />
        </div>
      )}
    </div>
  )
}

export default function BusinessCoursesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl py-16">
        <div className="text-center">Loading courses...</div>
      </div>
    }>
      <BusinessCoursesContent />
    </Suspense>
  )
}

