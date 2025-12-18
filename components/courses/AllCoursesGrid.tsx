'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Course } from '@/types/course'

interface AllCoursesGridProps {
  courses: Course[]
}

export default function AllCoursesGrid({ courses }: AllCoursesGridProps) {
  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-white text-gray-900 border-gray-300' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-white text-gray-900 border-gray-300' }
    return { label: 'GOOD', color: 'bg-white text-gray-900 border-gray-300' }
  }

  const getCategoryBanner = (index: number, course: Course): string => {
    // You can customize these based on course data or index
    const categories = [
      'Best For Foundational Understanding of AI',
      'Best For Building AI Tools',
      'Best For Strategic AI Implementation'
    ]
    return categories[index] || 'Featured Program'
  }

  // Generate logo URL from provider name
  const getLogoUrl = (provider: string | null): string | null => {
    if (!provider || provider.trim() === '') return null

    // Normalize provider name: lowercase, trim, remove extra spaces
    const normalizedProvider = provider.toLowerCase().trim().replace(/\s+/g, ' ')
    
    // Map common provider names to their domains
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

    // Try exact match first
    if (providerDomainMap[normalizedProvider]) {
      return `/api/logo/${encodeURIComponent(providerDomainMap[normalizedProvider])}`
    }

    // Try partial matching for common patterns
    for (const [key, domain] of Object.entries(providerDomainMap)) {
      if (normalizedProvider.includes(key) || key.includes(normalizedProvider)) {
        return `/api/logo/${encodeURIComponent(domain)}`
      }
    }

    // Check if provider name looks like a domain (contains a dot)
    if (normalizedProvider.includes('.')) {
      // Might be a domain already, try it
      return `/api/logo/${encodeURIComponent(normalizedProvider)}`
    }

    // If no mapping found and not a domain, return null (will use logomark.png)
    return null
  }

  return (
    <section className="bg-white">
      <div style={{ width: '100%', paddingLeft: '80px', paddingRight: '80px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontFamily: 'EuclidCircularB, sans-serif', 
          fontWeight: 'bold', 
          color: 'black', 
          margin: '0px 0px 16px' 
        }}>
          Featured Programs
        </h2>

        {courses.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No courses found matching your criteria.
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course, index) => {
              const ratingInfo = getRatingLabel(course.rating)
              const rank = index + 1
              const logoUrl = getLogoUrl(course.provider)
              
              return (
                <div
                  key={course.id}
                  className="relative rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  style={{ display: 'flex', gap: '24px', marginRight: '320px', padding: '24px 24px 12px 24px', minHeight: '200px' }}
                >
                {/* Category Banner - Top Left (only for top 3 courses) */}
                {index < 3 && (
                  <div
                    className="absolute"
                    style={{
                      top: '-1px',
                      left: '-1px',
                      backgroundColor: '#FF8C00',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      fontFamily: 'EuclidCircularB, sans-serif',
                      zIndex: 10,
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)'
                    }}
                  >
                    ✓ {getCategoryBanner(index, course)}
                  </div>
                )}

                {/* Left Side: Ranking and Logos */}
                <div style={{ flexShrink: 0, width: '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '20px' }}>
                  {/* Ranking Number */}
                  <div
                    style={{
                      fontSize: '64px',
                      fontWeight: '900',
                      fontFamily: 'EuclidCircularB, sans-serif',
                      color: '#181716',
                      lineHeight: '1',
                      marginBottom: '20px',
                      marginLeft: '0'
                    }}
                  >
                    {rank}
                  </div>

                  {/* Provider Logo - Using Logo.dev API via our proxy */}
                  <div style={{ transform: 'translate(-5px, -5px)' }}>
                    <ProviderLogo 
                      provider={course.provider}
                      logoUrl={logoUrl}
                    />
                  </div>
                </div>

                {/* Middle Section: Title and Description */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', paddingTop: '20px', paddingRight: '20px', paddingBottom: '12px' }}>
                  {/* Title */}
                  <h3 className="mb-4 text-2xl font-bold text-left" style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1.3' }}>
                    {course.title}
                  </h3>

                  {/* Description with Checkmarks */}
                  {course.description && (
                    <div className="space-y-2" style={{ width: '100%' }}>
                      {course.description.split('.').filter(s => s.trim()).slice(0, 3).map((point, i) => (
                        <div key={i} className="flex items-start gap-2" style={{ fontFamily: 'EuclidCircularB, sans-serif', fontSize: '14px', color: '#181716', lineHeight: '1.5' }}>
                          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="#34B682"/>
                            <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{point.trim()}.</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Rating and Action Section */}
                <div style={{ flexShrink: 0, width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: '20px', gap: '12px' }}>
                    {/* Combined Rating Box - Two halves: Blue (score) and White (label + stars) */}
                    {course.rating && (
                      <div
                        className="inline-flex rounded-md overflow-hidden"
                        style={{
                          fontFamily: 'EuclidCircularB, sans-serif',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'stretch',
                          height: '45px',
                          width: '188px' // Fixed width to match Learn More button
                        }}
                      >
                        {/* Left side - Blue with score (2 parts = 40%) */}
                        <div
                          style={{
                            backgroundColor: '#36498C',
                            color: '#FFFFFF',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 20px',
                            width: '40%'
                          }}
                        >
                          {course.rating.toFixed(1)}
                        </div>
                        {/* Right side - White with label and stars (3 parts = 60%) */}
                        <div
                          className="border border-gray-300"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 12px',
                            width: '60%',
                            gap: '4px'
                          }}
                        >
                          {/* Rating Label */}
                          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'EuclidCircularB, sans-serif', color: '#36498C' }}>
                            {ratingInfo.label}
                          </div>
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="h-3 w-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Learn More Button - Green, below rating box, same width as rating box */}
                    <Link
                      href={course.external_url || `/courses/${course.id}`}
                      target={course.external_url ? '_blank' : undefined}
                      rel={course.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: '#34B682',
                        fontFamily: 'EuclidCircularB, sans-serif',
                        fontSize: '14px',
                        textDecoration: 'none',
                        width: '188px',
                        height: '45px'
                      }}
                    >
                      Learn More
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Discount Information (Optional) */}
                    {course.price_label && (
                      <div className="mt-2 text-center" style={{ fontSize: '12px', color: '#666666', fontFamily: 'EuclidCircularB, sans-serif', width: '100%' }}>
                        {course.price_label}
                      </div>
                    )}
                  </div>
                </div>
            )
          })}
          </div>
        )}
      </div>
    </section>
  )
}

// Separate component for logo with error handling
function ProviderLogo({ provider, logoUrl }: { provider: string | null; logoUrl: string | null }) {
  const [imageError, setImageError] = useState(false)
  
  // If no provider or logoUrl, always use logomark.png
  if (!provider || !provider.trim() || !logoUrl) {
    return (
      <div
        style={{
          width: '120px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Image
          src="/logomark.png"
          alt="IFAIP logo"
          width={120}
          height={72}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    )
  }

  // If image failed to load, show logomark.png
  if (imageError) {
    return (
      <div
        style={{
          width: '120px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Image
          src="/logomark.png"
          alt="IFAIP logo"
          width={120}
          height={72}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    )
  }

  // If we have external_url, try to load logo from Logo.dev
  return (
    <div
      style={{
        width: '120px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        src={logoUrl}
        alt="Provider logo"
        width={120}
        height={72}
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onError={() => {
          // Fallback to logomark.png if logo fails to load
          setImageError(true)
        }}
      />
    </div>
  )
}
