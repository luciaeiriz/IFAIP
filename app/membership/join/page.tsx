'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUTMParams } from '@/lib/leads'

export default function JoinMembershipPage() {
  const router = useRouter()
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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          landing_tag: 'Membership',
          ...utmParams,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSuccess(true)
        setEmail('')
        setTimeout(() => {
          router.push('/membership?success=true')
        }, 2000)
      } else {
        setError(data.error || 'Failed to submit. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-600"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-700 mb-6">
            We've received your membership interest. We'll be in touch soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join IFAIP Membership</h1>
        <p className="text-gray-600 mb-8">
          Enter your email to express interest in IFAIP membership.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
              placeholder="your.email@example.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors px-6 py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/membership')}
              className="px-6 py-3 border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

