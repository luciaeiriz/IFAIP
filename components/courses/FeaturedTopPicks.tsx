import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Course } from '@/types/course'

interface FeaturedTopPicksProps {
  courses: Course[]
}

export default function FeaturedTopPicks({ courses }: FeaturedTopPicksProps) {
  if (courses.length === 0) return null

  // Get top 3 courses (already sorted by priority, so index 0 = #1, index 1 = #2, index 2 = #3)
  const top3Raw = courses.slice(0, 3)
  
  // Rearrange: #2 on left, #1 in middle, #3 on right
  // So order should be: [index 1, index 0, index 2]
  const top3 = top3Raw.length >= 3 
    ? [top3Raw[1], top3Raw[0], top3Raw[2]]  // #2, #1, #3
    : top3Raw  // If less than 3, just show them in order

  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  // Generate logo URL from provider name or external_url
  // Priority: Provider name first (more accurate), then external_url domain
  const getLogoUrl = (provider: string | null, externalUrl: string | null): string | null => {
    // First, try provider name mapping (most accurate)
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
    <section className="hidden lg:block" style={{ backgroundColor: '#F6F7FF', width: '100%', padding: '16px 0 32px 0', marginLeft: '0', marginRight: '0', height: '249px' }}>
      <div style={{ width: '100%', paddingLeft: '80px', paddingRight: '80px', boxSizing: 'border-box' }}>
        <h2 className="mb-6" style={{ fontSize: '18px', color: '#181716', fontFamily: 'EuclidCircularB, sans-serif', marginTop: '-8px' }}>
          Our Top 3 Providers
        </h2>

        <div className="flex justify-start" style={{ gap: '24px', flexWrap: 'nowrap', width: '100%', maxWidth: '100%', alignItems: 'flex-start', boxSizing: 'border-box', marginTop: '-10px' }}>
          {top3.map((course, index) => {
            // The middle card (index 1) is always the #1 ranked course (highest priority)
            // Only show "MOST POPULAR" badge if we have all 3 courses and this is the middle one
            const isMostPopular = index === 1 && courses.length >= 3
            // Card dimensions: left (0) = 413×157, middle (1) = 450×185, right (2) = 415×150
            const cardWidth = index === 1 ? '450px' : (index === 2 ? '415px' : '413px')
            const cardHeight = index === 0 ? '157px' : (index === 1 ? '185px' : '150px')
            // Center left and right cards vertically with middle card (185px height)
            // Left: (185 - 157) / 2 = 14px, Right: (185 - 150) / 2 = 17.5px
            const cardMarginTop = index === 0 ? '14px' : (index === 2 ? '18px' : '0px')
            return (
              <div
                key={course.id}
                className="relative bg-white shadow-sm transition-shadow hover:shadow-md"
                style={{ 
                  width: cardWidth,
                  height: cardHeight,
                  marginTop: cardMarginTop,
                  padding: isMostPopular ? '20px 20px 0px 33px' : '20px 20px 0px 20px',
                  border: isMostPopular ? '5px solid #36498C' : '1px solid #E0E0E0',
                  boxShadow: isMostPopular ? 'none' : '0 1px 3px rgba(184, 197, 224, 0.3), 0 1px 2px rgba(184, 197, 224, 0.2)',
                  borderRadius: '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  flexShrink: 0
                }}
              >
                {/* Most Popular Badge */}
                {isMostPopular && (
                  <div 
                    className="absolute"
                    style={{
                      top: '4px',
                      left: '4px',
                      backgroundColor: '#36498C',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'EuclidCircularB, sans-serif',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  >
                    ✓ MOST POPULAR
                  </div>
                )}

                {/* Title */}
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: '16px', 
                    fontFamily: 'EuclidCircularB, sans-serif',
                    color: '#181716',
                    lineHeight: '1.4',
                    marginTop: isMostPopular ? '26px' : '0px',
                    marginLeft: '0px',
                    marginBottom: '2px'
                  }}
                >
                  {course.title}
                </h3>

                {/* Brief description tagline - Prioritize headline field */}
                {(course.headline || course.description) && (
                  <div 
                    className=""
                    style={{ 
                      fontSize: '14px', 
                      fontFamily: 'EuclidCircularB, sans-serif',
                      color: '#333333',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: index === 2 ? '0px' : '2px',
                      marginBottom: '0px'
                    }}
                  >
                    {/* Use headline if available, otherwise fallback to description extraction */}
                    {course.headline ? course.headline : (() => {
                      // Fallback to description extraction if headline not available
                      const desc = course.description.trim();
                      const firstSentence = desc.split('.')[0].trim();
                      if (firstSentence.length <= 60 && firstSentence.length > 0) {
                        return firstSentence;
                      }
                      // If first sentence is too long, take first 60 chars
                      return desc.substring(0, 57).trim() + '...';
                    })()}
                  </div>
                )}

                {/* Bottom section: Logo on left, Learn More button and Rating on right */}
                <div style={{ position: 'absolute', bottom: '20px', left: isMostPopular ? '33px' : '20px', right: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '12px' }}>
                    {/* Provider Logo - Left aligned */}
                    <div style={{ marginLeft: isMostPopular ? '-13px' : '-13px' }}>
                      <ProviderLogo 
                        provider={course.provider}
                        logoUrl={getLogoUrl(course.provider, course.external_url)}
                      />
                    </div>

                    {/* Right side: Learn More button and Rating */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      {/* Learn More Link - Right aligned */}
                      <Link
                        href={course.external_url || `/courses/${course.id}`}
                        target={course.external_url ? '_blank' : undefined}
                        rel={course.external_url ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1 font-semibold transition-colors hover:opacity-80"
                        style={{ 
                          fontSize: '16px', 
                          fontFamily: 'EuclidCircularB, sans-serif',
                          color: '#34B682',
                          textDecoration: 'none',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: '0',
                          cursor: 'pointer'
                        }}
                      >
                        Learn More
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#34B682' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>

                      {/* Rating - Right aligned, smaller size */}
                      {course.rating && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="font-bold"
                            style={{ 
                              fontSize: '14px', 
                              fontFamily: 'EuclidCircularB, sans-serif',
                              color: '#181716'
                            }}
                          >
                            {course.rating.toFixed(1)}
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="h-3.5 w-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
              </div>
            )
          })}
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
          width: '80px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Image
          src="/cognite_logo.png"
          alt="Cognite logo"
          width={80}
          height={48}
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
          width: '80px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Image
          src="/cognite_logo.png"
          alt="Cognite logo"
          width={80}
          height={48}
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
        width: '80px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        src={logoUrl}
        alt="Provider logo"
        width={80}
        height={48}
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
