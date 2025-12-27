'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CoursesPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to business courses page by default
    router.replace('/courses/business')
  }, [router])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">Redirecting...</div>
    </div>
  )
}
