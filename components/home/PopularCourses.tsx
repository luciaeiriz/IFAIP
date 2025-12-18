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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">Loading courses...</div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-editorial-900 sm:text-4xl">
            Popular Courses
          </h2>
          <Link
            href="/courses/business"
            className="text-editorial-900 font-medium hover:text-editorial-800"
          >
            View All Courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => {
            const ratingInfo = getRatingLabel(course.rating)
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 text-sm font-medium text-gray-500">
                  {course.provider}
                </div>
                <h3 className="mb-2 text-lg font-bold text-editorial-900 group-hover:text-editorial-800">
                  {course.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {course.description}
                </p>
                {course.rating && (
                  <div className="mb-4 flex items-center gap-2">
                    <div className="text-lg font-bold text-editorial-900">
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
                    <span className="text-xs text-gray-600">{course.duration}</span>
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

