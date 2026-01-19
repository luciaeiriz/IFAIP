'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getCoursesByTag, getFeaturedCoursesByTag } from '@/src/data/courses'
import { Course, CourseLevel, CourseTag } from '@/types/course'

interface CourseBrowserProps {
  tag: CourseTag
}

export default function CourseBrowser({ tag }: CourseBrowserProps) {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All')
  const [selectedProvider, setSelectedProvider] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Recommended' | 'Newest' | 'Shortest'>('Recommended')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        // Fetch courses in parallel - optimized API calls
        const [taggedCourses, featured] = await Promise.all([
          getCoursesByTag(tag),
          getFeaturedCoursesByTag(tag),
        ])
        setAllCourses(taggedCourses)
        // Take top 3 featured courses (already filtered by tag in database)
        setFeaturedCourses(featured.slice(0, 3))
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [tag])

  // Get unique providers
  const providers = useMemo(() => {
    const uniqueProviders = new Set<string>()
    allCourses.forEach((course) => {
      if (course.provider) {
        uniqueProviders.add(course.provider)
      }
    })
    return Array.from(uniqueProviders).sort()
  }, [allCourses])

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...allCourses]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.provider?.toLowerCase().includes(query)
      )
    }

    // Level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Provider filter
    if (selectedProvider !== 'All') {
      filtered = filtered.filter((course) => course.provider === selectedProvider)
    }

    // Sort
    switch (sortBy) {
      case 'Newest':
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
        break
      case 'Shortest':
        filtered.sort((a, b) => {
          // Extract numbers from duration strings (e.g., "2 weeks" -> 2)
          const getDuration = (duration: string | null) => {
            if (!duration) return Infinity
            const match = duration.match(/\d+/)
            return match ? parseInt(match[0]) : Infinity
          }
          return getDuration(a.duration) - getDuration(b.duration)
        })
        break
      case 'Recommended':
      default:
        // Already sorted by priority from getCoursesByTag
        break
    }

    return filtered
  }, [allCourses, searchQuery, selectedLevel, selectedProvider, sortBy])

  // Reorder featured courses: 2nd, 1st (center), 3rd
  const orderedFeatured = useMemo(() => {
    if (featuredCourses.length === 0) return []
    if (featuredCourses.length === 1) return featuredCourses
    if (featuredCourses.length === 2) return [featuredCourses[1], featuredCourses[0]]
    return [featuredCourses[1], featuredCourses[0], featuredCourses[2]]
  }, [featuredCourses])

  const getLevelBadgeColor = (level: CourseLevel | null) => {
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

  if (isLoading) {
    return (
      <section id="courses" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading courses...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="courses" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Featured Programs */}
        {orderedFeatured.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Programs
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {orderedFeatured.map((course, index) => {
                const isCenter = index === 1 && orderedFeatured.length >= 2
                return (
                  <div
                    key={course.id}
                    className={`relative rounded-lg border-2 ${
                      isCenter
                        ? 'border-primary-500 bg-primary-50 md:-mt-4 md:scale-105'
                        : 'border-gray-200 bg-white'
                    } p-6 shadow-lg transition-transform hover:scale-105`}
                  >
                    {isCenter && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                          Top Pick
                        </span>
                      </div>
                    )}
                    <div className="mb-2 text-sm font-medium text-gray-500">
                      {course.provider}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                      {course.description}
                    </p>
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-700">
                            {course.rating.toFixed(1)}
                          </span>
                          {course.reviews && (
                            <span className="text-gray-500">
                              ({course.reviews})
                            </span>
                          )}
                        </div>
                      )}
                      {course.duration && (
                        <span className="text-gray-600">{course.duration}</span>
                      )}
                      {course.level && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getLevelBadgeColor(
                            course.level
                          )}`}
                        >
                          {course.level}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="block w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Learn More
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            All Courses
          </h2>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Level Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedLevel === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'All' ? 'All Levels' : level}
                  </button>
                )
              )}
            </div>

            {/* Provider and Sort */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="All">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'Recommended' | 'Newest' | 'Shortest'
                  )
                }
                className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Recommended">Recommended</option>
                <option value="Newest">Newest</option>
                <option value="Shortest">Shortest</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No courses found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    {course.provider}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  {course.level && (
                    <div className="mb-2">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getLevelBadgeColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                    </div>
                  )}
                  <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
                    {course.duration && <span>{course.duration}</span>}
                    {course.price_label && (
                      <span className="font-semibold text-gray-900">
                        {course.price_label}
                      </span>
                    )}
                  </div>
                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
                    {course.description}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      View Details
                    </Link>
                    {course.external_url && (
                      <a
                        href={course.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        External
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

