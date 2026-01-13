'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Course } from '@/types/course'

interface AllCoursesGridProps {
  courses: Course[]
}

export default function AllCoursesGrid({ courses }: AllCoursesGridProps) {
  const router = useRouter()

  const handleCardClick = (course: Course, e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on interactive elements (buttons, links, etc.)
    const target = e.target as HTMLElement
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button')
    ) {
      return
    }

    // Navigate to course URL
    if (course.external_url) {
      window.open(course.external_url, '_blank', 'noopener,noreferrer')
    } else {
      router.push(`/courses/${course.id}`)
    }
  }

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
  // Priority: 1. logo_url from database (cached), 2. provider name mapping, 3. external_url domain
  const getLogoUrl = (course: Course): string | null => {
    // Priority 1: Use cached logo_url from database if available
    if (course.logo_url && course.logo_url.trim() !== '') {
      return course.logo_url
    }
    
    const provider = course.provider
    const externalUrl = course.external_url
    
    // Priority 2: Try provider name mapping (most accurate)
    if (provider && provider.trim() !== '') {
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
    }

    // Fall back to extracting domain from external_url (for cases where provider is not mapped)
    if (externalUrl) {
      try {
        const url = new URL(externalUrl)
        const hostname = url.hostname
        // Remove 'www.' prefix if present
        const domain = hostname.replace(/^www\./, '')
        if (domain) {
          return `/api/logo/${encodeURIComponent(domain)}`
        }
      } catch (e) {
        // If URL parsing fails, return null
      }
    }

    // If no mapping found and not a domain, return null (will use cognite_logo.png)
    return null
  }

  return (
    <section className="bg-white">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-20 flex flex-col lg:flex-row gap-6 lg:gap-6 items-start">
        {/* Left side - Courses section */}
        <div className="w-full lg:flex-1 lg:min-w-0">
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
              const logoUrl = getLogoUrl(course)
              
              return (
                <div
                  key={course.id}
                  className="relative rounded-lg bg-white transition-shadow cursor-pointer w-full"
                  style={{ 
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 1px 3px rgba(184, 197, 224, 0.3), 0 1px 2px rgba(184, 197, 224, 0.2)',
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '20px 16px 12px 16px', 
                    minHeight: '200px',
                    overflow: 'hidden'
                  }}
                  onClick={(e) => handleCardClick(course, e)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(184, 197, 224, 0.4), 0 2px 4px rgba(184, 197, 224, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(184, 197, 224, 0.3), 0 1px 2px rgba(184, 197, 224, 0.2)';
                  }}
                >
                {/* Category Banner - Top Left (only for top 3 courses) */}
                {index < 3 && (
                  <>
                    {/* Orange tick to the left of the badge */}
                    <div
                      className="absolute"
                      style={{
                        top: '6px',
                        left: '12px',
                        height: '19px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        width: '18px'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9L7 13L15 5" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div
                      className="absolute text-[9px] sm:text-[10px] lg:text-[11px]"
                      style={{
                        top: '6px',
                        left: '32px',
                        height: '19px',
                        backgroundColor: '#FF8C00',
                        color: '#FFFFFF',
                        padding: '0px 8px',
                        fontWeight: 'bold',
                        fontFamily: 'EuclidCircularB, sans-serif',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                        maxWidth: 'calc(100% - 50px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {getCategoryBanner(index, course)}
                    </div>
                  </>
                )}

                {/* Mobile Layout: Stack vertically */}
                <div className="flex flex-col lg:hidden gap-4">
                  {/* Ranking and Logo Row */}
                  <div className="flex items-center gap-4">
                    <div className="text-4xl sm:text-5xl font-black" style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1' }}>
                      {rank}
                    </div>
                    <div>
                      <ProviderLogo 
                        provider={course.provider}
                        logoUrl={logoUrl}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-lg sm:text-xl font-bold text-left hover:underline" 
                    style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1.3' }}
                  >
                    {course.title}
                  </h3>

                  {/* Description with Checkmarks */}
                  {((course.bullet_points && course.bullet_points.length > 0) || course.description) && (
                    <div className="space-y-2">
                      {course.bullet_points && course.bullet_points.length > 0 ? (
                        course.bullet_points.map((point, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1.5' }}>
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="8" fill="#CCEBE4"/>
                              <path d="M5 8L7 10L11 6" stroke="#1D6B59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                            <span className="hover:underline">{point}</span>
                          </div>
                        ))
                      ) : (
                        course.description?.split('.').filter(s => s.trim()).slice(0, 3).map((point, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1.5' }}>
                            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="8" fill="#CCEBE4"/>
                              <path d="M5 8L7 10L11 6" stroke="#1D6B59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                            <span className="hover:underline">{point.trim()}.</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Rating and Button */}
                  <div className="flex flex-col items-stretch gap-3">
                    {course.rating && (
                      <div className="inline-flex overflow-hidden w-full" style={{ fontFamily: 'EuclidCircularB, sans-serif', fontSize: '14px', height: '45px', borderRadius: '4px' }}>
                        <div style={{ backgroundColor: '#36498C', color: '#FFFFFF', fontWeight: '900', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', width: '40%' }}>
                          {course.rating.toFixed(1)}
                        </div>
                        <div className="border border-gray-300" style={{ backgroundColor: '#FFFFFF', color: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', width: '60%', gap: '4px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'EuclidCircularB, sans-serif', color: '#36498C' }}>
                            {ratingInfo.label}
                          </div>
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

                    <Link
                      href={course.external_url || `/courses/${course.id}`}
                      target={course.external_url ? '_blank' : undefined}
                      rel={course.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-colors hover:opacity-90 w-full text-sm sm:text-base"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: '#34B682',
                        fontFamily: 'EuclidCircularB, sans-serif',
                        textDecoration: 'none',
                        height: '45px',
                        borderRadius: '4px',
                      }}
                    >
                      Learn More
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Desktop Layout: Horizontal */}
                <div className="hidden lg:flex gap-6 w-full">
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
                    <h3 
                      className="mb-4 text-2xl font-bold text-left hover:underline" 
                      style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716', lineHeight: '1.3' }}
                    >
                      {course.title}
                    </h3>

                    {/* Description with Checkmarks - Prioritize bullet_points field */}
                    {((course.bullet_points && course.bullet_points.length > 0) || course.description) && (
                      <div className="space-y-2" style={{ width: '100%' }}>
                        {/* Use generated bullet_points if available, otherwise fallback to description parsing */}
                        {course.bullet_points && course.bullet_points.length > 0 ? (
                          // Use generated bullet points from database
                          course.bullet_points.map((point, i) => (
                            <div key={i} className="flex items-start gap-2" style={{ fontFamily: 'EuclidCircularB, sans-serif', fontSize: '14px', color: '#181716', lineHeight: '1.5' }}>
                              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="8" fill="#CCEBE4"/>
                                <path d="M5 8L7 10L11 6" stroke="#1D6B59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                              <span className="hover:underline">{point}</span>
                            </div>
                          ))
                        ) : (
                          // Fallback to description parsing if bullet_points not available
                          course.description?.split('.').filter(s => s.trim()).slice(0, 3).map((point, i) => (
                            <div key={i} className="flex items-start gap-2" style={{ fontFamily: 'EuclidCircularB, sans-serif', fontSize: '14px', color: '#181716', lineHeight: '1.5' }}>
                              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="8" fill="#CCEBE4"/>
                                <path d="M5 8L7 10L11 6" stroke="#1D6B59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                              <span className="hover:underline">{point.trim()}.</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Rating and Action Section */}
                  <div style={{ flexShrink: 0, width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: '20px', paddingRight: '4px', gap: '12px' }}>
                    {/* Combined Rating Box - Two halves: Blue (score) and White (label + stars) */}
                    {course.rating && (
                      <div
                        className="inline-flex overflow-hidden"
                        style={{
                          fontFamily: 'EuclidCircularB, sans-serif',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'stretch',
                          height: '45px',
                          width: '188px', // Fixed width to match Learn More button
                          borderRadius: '4px',
                          marginRight: '0'
                        }}
                      >
                        {/* Left side - Blue with score (2 parts = 40%) */}
                        <div
                          style={{
                            backgroundColor: '#36498C',
                            color: '#FFFFFF',
                            fontWeight: '900',
                            fontSize: '30px',
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
                          <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'EuclidCircularB, sans-serif', color: '#36498C' }}>
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
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: '#34B682',
                        fontFamily: 'EuclidCircularB, sans-serif',
                        fontSize: '16px',
                        textDecoration: 'none',
                        width: '188px',
                        height: '45px',
                        paddingLeft: '8px',
                        paddingRight: '40px',
                        borderRadius: '4px',
                        marginRight: '0'
                      }}
                    >
                      Learn More
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                </div>
            )
          })}
          </div>
        )}
        </div>

        {/* Right side - Our Guides component - Hidden on mobile */}
        <div className="hidden lg:block" style={{ width: '305px', height: '241px', flexShrink: 0 }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0E0E0',
            boxShadow: '0 1px 3px rgba(184, 197, 224, 0.3), 0 1px 2px rgba(184, 197, 224, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 12px 20px', height: '41px', display: 'flex', alignItems: 'center', backgroundColor: '#F6F7FF', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'EuclidCircularB, sans-serif',
                fontWeight: 'normal',
                color: '#181716',
                margin: '0'
              }}>
                Our Guides
              </h3>
            </div>
            
            {/* Full-width separator line */}
            <div style={{
              borderBottom: '1px solid #E0E0E0',
              width: '100%'
            }}></div>

            {/* Entry 1 - First subsection */}
            <div style={{ padding: '16px 20px', height: '87px' }}>
              <h4 style={{
                fontSize: '14px',
                fontFamily: 'EuclidCircularB, sans-serif',
                fontWeight: 'normal',
                color: '#181716',
                marginBottom: '8px',
                marginTop: '0',
                lineHeight: '1.4'
              }}>
                Best Online Leadership Programmes
              </h4>
              <a href="#" style={{
                fontSize: '14px',
                fontFamily: 'EuclidCircularB, sans-serif',
                color: '#395BB6',
                textDecoration: 'none',
                fontWeight: 'normal'
              }}>
                Read More
              </a>
            </div>

            {/* Full-width separator line */}
            <div style={{
              borderBottom: '1px solid #E0E0E0',
              width: '100%'
            }}></div>

            {/* Entry 2 - Second subsection */}
            <div style={{ padding: '16px 20px', height: '109px' }}>
              <h4 style={{
                fontSize: '14px',
                fontFamily: 'EuclidCircularB, sans-serif',
                fontWeight: 'normal',
                color: '#181716',
                marginBottom: '8px',
                marginTop: '0',
                lineHeight: '1.4'
              }}>
                The Best Business Management Courses
              </h4>
              <a href="#" style={{
                fontSize: '14px',
                fontFamily: 'EuclidCircularB, sans-serif',
                color: '#395BB6',
                textDecoration: 'none',
                fontWeight: 'normal'
              }}>
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Separate component for logo with error handling
function ProviderLogo({ provider, logoUrl }: { provider: string | null; logoUrl: string | null }) {
  const [imageError, setImageError] = useState(false)
  
  // If no provider or logoUrl, always use cognite_logo.png
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
          src="/cognite_logo.png"
          alt="Cognite logo"
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

  // If image failed to load, show cognite_logo.png
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
          src="/cognite_logo.png"
          alt="Cognite logo"
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
          // Fallback to cognite_logo.png if logo fails to load
          setImageError(true)
        }}
      />
    </div>
  )
}
