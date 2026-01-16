'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFeaturedCourses } from '@/src/data/courses'
import { Course } from '@/types/course'

export default function PopularCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const featured = await getFeaturedCourses()
        setCourses(featured.slice(0, 4))
      } catch (error) {
        console.error('Error fetching featured courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const getLevelBadgeColor = (level: string | null) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  if (isLoading) {
    return (
      <section className="bg-homepage-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-homepage-dark/60 font-medium">Loading courses...</div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <section className="bg-homepage-white py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-homepage-dark tracking-tight">
            Popular Courses
          </h2>
          <Link
            href="/courses/business"
            className="text-sm font-semibold text-homepage-dark hover:text-homepage-accentDark transition-colors flex items-center gap-1"
          >
            View All Courses
            <svg className="h-4 w-4 transition-transform hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {courses.map((course) => {
            const ratingInfo = getRatingLabel(course.rating)
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-2xl border border-homepage-accentLight/50 bg-homepage-white p-5 sm:p-6 md:p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-2 text-xs sm:text-sm font-medium text-homepage-dark/60">
                  {course.provider}
                </div>
                <h3 className="mb-2 text-base sm:text-lg md:text-lg font-bold text-homepage-dark group-hover:text-homepage-accentDark">
                  {course.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-xs sm:text-sm md:text-sm text-homepage-dark/70">
                  {course.description}
                </p>
                {course.rating && (
                  <div className="mb-4 flex items-center gap-2">
                    <div className="text-lg font-bold text-homepage-dark">
                      {course.rating.toFixed(1)}
                    </div>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase ${ratingInfo.color}`}
                    >
                      {ratingInfo.label}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {course.level && (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getLevelBadgeColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </span>
                  )}
                  {course.duration && (
                    <span className="text-xs text-homepage-dark/60">{course.duration}</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

