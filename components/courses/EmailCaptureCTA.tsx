'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createLead, getUTMParams } from '@/lib/leads'
import { CourseTag } from '@/types/course'

interface EmailCaptureCTAProps {
  tag?: CourseTag
}

export default function EmailCaptureCTA({ tag: tagProp }: EmailCaptureCTAProps = {}) {
  const searchParams = useSearchParams()
  const [tag, setTag] = useState<CourseTag>(tagProp || 'Business')

  useEffect(() => {
    // If tag prop is provided, use it; otherwise check search params
    if (tagProp) {
      setTag(tagProp)
    } else {
      const tagParam = searchParams?.get('tag')
      if (tagParam && ['Business', 'Restaurant', 'Fleet'].includes(tagParam)) {
        setTag(tagParam as CourseTag)
      }
    }
  }, [tagProp, searchParams])
  
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const utmParams = getUTMParams()
      const result = await createLead({
        email,
        landing_tag: tag as 'Business' | 'Restaurant' | 'Fleet',
        ...utmParams,
      })

      if (result.success) {
        setIsSuccess(true)
        setEmail('')
      } else {
        setError(result.error || 'Failed to submit. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section className="bg-primary-600 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
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
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Thank You!
            </h3>
            <p className="text-gray-600">
              We'll send you personalized course recommendations soon.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-primary-600 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Get Personalised Course Recommendations
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Tell us your email and we'll send you courses tailored to your needs
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-8 shadow-lg"
        >
          <div className="flex gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Get Recommendations'}
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

