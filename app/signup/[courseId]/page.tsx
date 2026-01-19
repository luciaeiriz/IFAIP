'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { getCourseById } from '@/lib/courses'
import { createSignup, getAllUTMParams } from '@/lib/signups'
import { Course } from '@/types/course'
import Toast from '@/components/ui/Toast'
import { trackCourseSignup } from '@/lib/analytics'

// Zod validation schema
const signupSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
})

type SignupFormData = z.infer<typeof signupSchema>

function SignupContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SignupFormData>({
    first_name: '',
    last_name: '',
    email: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Get URL parameters
  const landingTag = searchParams.get('tag') || 'Business'
  const source = searchParams.get('source') || null

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)
      try {
        const courseData = await getCourseById(courseId)
        setCourse(courseData)
      } catch (error) {
        console.error('Error fetching course:', error)
        setToast({ message: 'Failed to load course information', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const handleChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev: SignupFormData) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof SignupFormData, string>>) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate with Zod
    const result = signupSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {}
      result.error.errors.forEach((error: z.ZodIssue) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof SignupFormData] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Get UTM parameters
      const utmParams = getAllUTMParams()

      // Create signup data
      const signupData = {
        ...result.data,
        course_id: courseId,
        landing_tag: landingTag,
        source,
        ...utmParams,
      }

      const response = await createSignup(signupData)

      if (response.success) {
        // Track signup event
        if (course) {
          trackCourseSignup(
            courseId,
            course.title,
            landingTag,
            utmParams
          )
        }
        // Redirect to thank you page
        router.push(`/thank-you?course_id=${courseId}`)
      } else {
        setToast({
          message: response.error || 'Failed to submit signup. Please try again.',
          type: 'error',
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting signup:', error)
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error',
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course information...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">
            The course you're trying to sign up for doesn't exist.
          </p>
          <Link
            href="/courses"
            className="inline-block rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-700"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Course Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign Up for Course
          </h1>
          <h2 className="text-xl text-gray-700">{course.title}</h2>
          {course.provider && (
            <p className="mt-2 text-sm text-gray-500">by {course.provider}</p>
          )}
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                className={`w-full rounded-md border ${
                  errors.first_name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } px-4 py-2 focus:outline-none focus:ring-2`}
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                className={`w-full rounded-md border ${
                  errors.last_name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } px-4 py-2 focus:outline-none focus:ring-2`}
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange('email')}
                className={`w-full rounded-md border ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                } px-4 py-2 focus:outline-none focus:ring-2`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Sign Up'}
            </button>

            {/* Terms and Privacy */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                By signing up, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  )
}
