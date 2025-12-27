'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCourseById } from '@/lib/courses'
import { Course } from '@/types/course'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(!!courseId)

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const courseData = await getCourseById(courseId)
          setCourse(courseData)
        } catch (error) {
          console.error('Error fetching course:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Icon and Heading */}
        <div className="text-center mb-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">
            You're All Set!
          </h1>
          {isLoading ? (
            <p className="text-lg text-gray-600">Loading course information...</p>
          ) : course ? (
            <p className="text-lg text-gray-600">
              Thank you for signing up for <span className="font-semibold text-gray-900">{course.title}</span>
            </p>
          ) : (
            <p className="text-lg text-gray-600">
              Thank you for your signup!
            </p>
          )}
        </div>

        {/* What Happens Next Section */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 text-center">
            What Happens Next?
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Check Your Email
                </h3>
                <p className="text-gray-600">
                  We've sent you a confirmation email with all the details you need to get started. 
                  Please check your inbox (and spam folder, just in case).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Access Your Course
                </h3>
                <p className="text-gray-600">
                  Follow the instructions in your email to access your course materials and begin your learning journey.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Join the Community
                </h3>
                <p className="text-gray-600">
                  Connect with other learners, share your progress, and get support from our community of AI professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/courses"
            className="rounded-md bg-primary-600 px-8 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Explore More Courses
          </Link>
          <Link
            href="/"
            className="rounded-md border-2 border-gray-300 bg-white px-8 py-3 text-center text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  )
}
