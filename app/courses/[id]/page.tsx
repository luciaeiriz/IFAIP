'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCourseById } from '@/src/data/courses'
import { Course } from '@/types/course'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const courseData = await getCourseById(courseId)
        if (courseData) {
          setCourse(courseData)
        } else {
          setError('Course not found')
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course')
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

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

  const parseKeySkills = (skills: string | null): string[] => {
    if (!skills) return []
    return skills.split(',').map((skill) => skill.trim()).filter(Boolean)
  }

  const parseModules = (modules: string | null): string[] => {
    if (!modules) return []
    // Try to parse as comma-separated or newline-separated
    return modules
      .split(/[,\n]/)
      .map((module) => module.trim())
      .filter(Boolean)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The course you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/courses"
            className="inline-block rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-700"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const keySkills = parseKeySkills(course.key_skills)
  const modules = parseModules(course.modules)

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {course.level && (
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getLevelBadgeColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>
            )}
            {course.provider && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {course.provider}
              </span>
            )}
            {course.course_type && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {course.course_type}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold text-editorial-900 sm:text-5xl">
            {course.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {course.duration && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{course.duration}</span>
              </div>
            )}
            {course.level && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{course.level}</span>
              </div>
            )}
            {course.price_label && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-900">
                  {course.price_label}
                </span>
              </div>
            )}
            {course.rating && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-medium text-gray-700">
                  {course.rating.toFixed(1)}
                </span>
                {course.reviews && (
                  <span className="text-gray-500">({course.reviews} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content (2/3 width) */}
          <div className="lg:col-span-2">
            {/* About This Course */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About This Course
              </h2>
              <div className="prose max-w-none text-gray-700">
                {course.description ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {course.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No description available for this course.
                  </p>
                )}
              </div>
            </section>

            {/* Key Skills */}
            {keySkills.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Key Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Course Modules */}
            {modules.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Course Modules
                </h2>
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{module}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Info */}
            {(course.instructors || course.effort || course.languages) && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Additional Information
                </h2>
                <div className="space-y-2 text-gray-700">
                  {course.instructors && (
                    <p>
                      <span className="font-semibold">Instructors:</span>{' '}
                      {course.instructors}
                    </p>
                  )}
                  {course.effort && (
                    <p>
                      <span className="font-semibold">Effort Required:</span>{' '}
                      {course.effort}
                    </p>
                  )}
                  {course.languages && (
                    <p>
                      <span className="font-semibold">Languages:</span>{' '}
                      {course.languages}
                    </p>
                  )}
                  {course.free_trial && (
                    <p>
                      <span className="font-semibold">Free Trial:</span>{' '}
                      {course.free_trial}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (1/3 width, sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-[50px] rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              {/* Price Display */}
              {course.price_label && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {course.price_label}
                  </div>
                </div>
              )}

              {/* Primary CTA Button - Forbes style */}
              <div className="mb-6">
                {course.external_url ? (
                  <a
                    href={course.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-md bg-editorial-900 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-editorial-800 focus:outline-none focus:ring-2 focus:ring-editorial-900 focus:ring-offset-2"
                  >
                    Go to Course
                  </a>
                ) : course.signup_enabled ? (
                  <Link
                    href={`/signup/${course.id}`}
                    className="block w-full rounded-md bg-editorial-900 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-editorial-800 focus:outline-none focus:ring-2 focus:ring-editorial-900 focus:ring-offset-2"
                  >
                    Sign Up
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full rounded-md bg-gray-300 px-6 py-3 text-center text-base font-semibold text-gray-500 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>

              {/* Course Details List */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Details
                </h3>
                <dl className="space-y-3 text-sm">
                  {course.provider && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Provider</dt>
                      <dd className="font-medium text-gray-900">
                        {course.provider}
                      </dd>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Duration</dt>
                      <dd className="font-medium text-gray-900">
                        {course.duration}
                      </dd>
                    </div>
                  )}
                  {course.level && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Level</dt>
                      <dd className="font-medium text-gray-900">
                        {course.level}
                      </dd>
                    </div>
                  )}
                  {course.effort && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Effort</dt>
                      <dd className="font-medium text-gray-900">
                        {course.effort}
                      </dd>
                    </div>
                  )}
                  {course.languages && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Languages</dt>
                      <dd className="font-medium text-gray-900">
                        {course.languages}
                      </dd>
                    </div>
                  )}
                  {course.instructors && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Instructors</dt>
                      <dd className="font-medium text-gray-900">
                        {course.instructors}
                      </dd>
                    </div>
                  )}
                  {course.rating && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Rating</dt>
                      <dd className="font-medium text-gray-900">
                        <span className="text-yellow-500">★</span>{' '}
                        {course.rating.toFixed(1)}
                        {course.reviews && ` (${course.reviews} reviews)`}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
