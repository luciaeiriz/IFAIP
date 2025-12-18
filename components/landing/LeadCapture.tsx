'use client'

import { useState, useEffect } from 'react'
import { createLead, getUTMParams } from '@/lib/leads'

interface LeadCaptureProps {
  title: string
  subtitle: string
  landingTag: string
  rolePlaceholder?: string
}

export default function LeadCapture({
  title,
  subtitle,
  landingTag,
  rolePlaceholder = 'e.g., Restaurant Manager, Fleet Operator',
}: LeadCaptureProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
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
        role: role || null,
        landing_tag: landingTag,
        ...utmParams,
      })

      if (result.success) {
        setIsSuccess(true)
        setEmail('')
        setRole('')
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
      <section id="lead-capture" className="bg-primary-600 py-16">
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
    <section id="lead-capture" className="bg-primary-600 py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mb-8 text-lg text-white/90">{subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-8 shadow-lg"
        >
          <div className="space-y-4">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Role (Optional)
              </label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder={rolePlaceholder}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Get Recommendations'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

