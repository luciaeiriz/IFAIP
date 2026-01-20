'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/types/course'
import { getCoursesByTag } from '@/src/data/courses'

interface ScrollBannerProps {
  currentCourse: Course
}

export default function ScrollBanner({ currentCourse }: ScrollBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [topCourse, setTopCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the top-ranked course for the same tag
  useEffect(() => {
    const fetchTopCourse = async () => {
      if (!currentCourse.tags || currentCourse.tags.length === 0) {
        console.log('ScrollBanner: No tags found for current course')
        setIsLoading(false)
        return
      }

      try {
        // Get courses by the first tag of the current course
        const tag = currentCourse.tags[0]
        console.log('ScrollBanner: Fetching courses for tag:', tag)
        const courses = await getCoursesByTag(tag)
        console.log('ScrollBanner: Found courses:', courses.length, 'Current course ID:', currentCourse.id)
        
        // The first course is the top-ranked (index 0)
        // Always show the top program, even if it's the current course
        if (courses.length > 0) {
          console.log('ScrollBanner: Top course ID:', courses[0].id)
          console.log('ScrollBanner: Setting top course')
          setTopCourse(courses[0])
        } else {
          console.log('ScrollBanner: No courses found')
        }
      } catch (error) {
        console.error('ScrollBanner: Error fetching top course:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopCourse()
  }, [currentCourse])

  // Show banner when top course is loaded
  useEffect(() => {
    if (topCourse) {
      setIsVisible(true)
    }
  }, [topCourse])

  // Handle scroll to show/hide banner (commented out for testing - uncomment to enable scroll behavior)
  // useEffect(() => {
  //   if (!topCourse) return
  //   
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY || window.pageYOffset
  //     const shouldShow = scrollY > 200
  //     setIsVisible(shouldShow)
  //   }
  //   
  //   handleScroll() // Check initial position
  //   window.addEventListener('scroll', handleScroll, { passive: true })
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [topCourse])

  // Debug logging
  useEffect(() => {
    console.log('ScrollBanner render:', {
      isLoading,
      hasTopCourse: !!topCourse,
      topCourseId: topCourse?.id,
      currentCourseId: currentCourse.id,
      isVisible,
      willRender: !isLoading && !!topCourse
    })
  }, [isLoading, topCourse, currentCourse.id, isVisible])

  // Don't show if loading or no top course
  if (isLoading || !topCourse) {
    return null
  }

  // Generate logo URL (similar logic to FeaturedTopPicks)
  const getLogoUrl = (course: Course): string | null => {
    if (course.logo_url && course.logo_url.trim() !== '') {
      return course.logo_url
    }
    
    const provider = course.provider
    const externalUrl = course.external_url
    
    if (provider && provider.trim() !== '') {
      const normalizedProvider = provider.toLowerCase().trim().replace(/\s+/g, ' ')
      const providerDomainMap: Record<string, string> = {
        'oxford university': 'ox.ac.uk',
        'university of oxford': 'ox.ac.uk',
        'oxford': 'ox.ac.uk',
        'mit': 'mit.edu',
        'massachusetts institute of technology': 'mit.edu',
        'harvard university': 'harvard.edu',
        'harvard': 'harvard.edu',
        'harvard business school': 'hbs.edu',
        'stanford university': 'stanford.edu',
        'stanford': 'stanford.edu',
        'university of pennsylvania': 'upenn.edu',
        'wharton': 'wharton.upenn.edu',
        'lund university': 'lu.se',
        'coursera': 'coursera.org',
        'edx': 'edx.org',
        'udemy': 'udemy.com',
        'linkedin learning': 'linkedin.com',
        'linkedin': 'linkedin.com',
        'pluralsight': 'pluralsight.com',
        'udacity': 'udacity.com',
        'google': 'google.com',
        'ibm': 'ibm.com',
        'openai': 'openai.com',
      }

      if (providerDomainMap[normalizedProvider]) {
        return `/api/logo/${encodeURIComponent(providerDomainMap[normalizedProvider])}`
      }

      for (const [key, domain] of Object.entries(providerDomainMap)) {
        if (normalizedProvider.includes(key) || key.includes(normalizedProvider)) {
          return `/api/logo/${encodeURIComponent(domain)}`
        }
      }

      if (normalizedProvider.includes('.')) {
        return `/api/logo/${encodeURIComponent(normalizedProvider)}`
      }
    }

    if (externalUrl) {
      try {
        const url = new URL(externalUrl)
        const hostname = url.hostname
        const domain = hostname.replace(/^www\./, '')
        if (domain) {
          return `/api/logo/${encodeURIComponent(domain)}`
        }
      } catch (e) {
        // URL parsing failed
      }
    }

    return null
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        borderTop: '1px solid #E0E0E0',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side: Course info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Badge */}
            <div className="flex-shrink-0">
              <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 whitespace-nowrap">
                ✓ Top Program
              </div>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <ProviderLogo 
                provider={topCourse.provider}
                logoUrl={getLogoUrl(topCourse)}
              />
            </div>

            {/* Course title and headline */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate" style={{ fontFamily: 'EuclidCircularB, sans-serif' }}>
                {topCourse.title}
              </h3>
              {topCourse.headline && (
                <p className="text-sm text-gray-600 truncate mt-1" style={{ fontFamily: 'EuclidCircularB, sans-serif' }}>
                  {topCourse.headline}
                </p>
              )}
            </div>
          </div>

          {/* Right side: CTA button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {topCourse.rating && (
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="font-bold text-gray-900 text-sm">{topCourse.rating.toFixed(1)}</span>
              </div>
            )}
            {topCourse.external_url ? (
              <a
                href={topCourse.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#0156D2] px-6 py-2.5 text-white font-semibold hover:bg-[#0144A8] transition-colors whitespace-nowrap"
                style={{ fontSize: '14px', fontFamily: 'EuclidCircularB, sans-serif' }}
              >
                Learn More
              </a>
            ) : topCourse.signup_enabled ? (
              <Link
                href={`/courses/${topCourse.id}`}
                className="rounded-lg bg-[#0156D2] px-6 py-2.5 text-white font-semibold hover:bg-[#0144A8] transition-colors whitespace-nowrap"
                style={{ fontSize: '14px', fontFamily: 'EuclidCircularB, sans-serif' }}
              >
                Learn More
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// Provider logo component with error handling
function ProviderLogo({ provider, logoUrl }: { provider: string | null; logoUrl: string | null }) {
  const [imageError, setImageError] = useState(false)
  
  if (!provider || !provider.trim() || !logoUrl) {
    return (
      <div className="w-16 h-10 flex items-center justify-center">
        <Image
          src="/cognite_logo.png"
          alt="Cognite logo"
          width={64}
          height={40}
          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    )
  }

  if (imageError) {
    return (
      <div className="w-16 h-10 flex items-center justify-center">
        <Image
          src="/cognite_logo.png"
          alt="Cognite logo"
          width={64}
          height={40}
          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    )
  }

  return (
    <div className="w-16 h-10 flex items-center justify-center">
      <Image
        src={logoUrl}
        alt="Provider logo"
        width={64}
        height={40}
        style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
        onError={() => setImageError(true)}
      />
    </div>
  )
}
