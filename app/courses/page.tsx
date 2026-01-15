'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCoursesByTag } from '@/src/data/courses'

interface LandingPage {
  tag: string
  name: string
  href: string
  description: string
  subtitle: string
  bgColor: string
}

export default function CoursesPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch enabled landing pages (with cache-busting to ensure fresh data)
        const pagesResponse = await fetch(`/api/landing-pages?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        })
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json()
          const pages = pagesData.landingPages || []
          console.log('📋 Fetched landing pages:', pages)
          console.log('📋 Number of landing pages:', pages.length)
          setLandingPages(pages)

          // Fetch course counts for each landing page
          const counts: Record<string, number> = {}
          await Promise.all(
            pages.map(async (page: LandingPage) => {
              try {
                const courses = await getCoursesByTag(page.tag)
                counts[page.tag] = courses.length
              } catch (error) {
                console.error(`Error fetching courses for ${page.tag}:`, error)
                counts[page.tag] = 0
              }
            })
          )
          setCourseCounts(counts)
        } else {
          // Log error for debugging
          const errorData = await pagesResponse.json().catch(() => ({}))
          console.error('❌ Failed to fetch landing pages:', pagesResponse.status, errorData)
          // Fallback to legacy pages if API fails
          const legacyPages: LandingPage[] = [
            {
              name: 'Business',
              tag: 'Business',
              href: '/courses/business',
              description: 'AI certification programs designed for business owners and entrepreneurs looking to leverage artificial intelligence to grow their business.',
              subtitle: 'at IFAIP',
              bgColor: '#2563eb',
            },
            {
              name: 'Restaurant',
              tag: 'Restaurant',
              href: '/courses/restaurant',
              description: 'Specialized AI training for restaurant owners to optimize operations, improve customer experience, and increase profitability.',
              subtitle: 'at IFAIP',
              bgColor: '#16a34a',
            },
            {
              name: 'Fleet',
              tag: 'Fleet',
              href: '/courses/fleet',
              description: 'AI certification courses tailored for fleet managers to enhance logistics, reduce costs, and improve operational efficiency.',
              subtitle: 'at IFAIP',
              bgColor: '#9333ea',
            },
          ]
          setLandingPages(legacyPages)
          
          const [businessCourses, restaurantCourses, fleetCourses] = await Promise.all([
            getCoursesByTag('Business'),
            getCoursesByTag('Restaurant'),
            getCoursesByTag('Fleet'),
          ])

          setCourseCounts({
            Business: businessCourses.length,
            Restaurant: restaurantCourses.length,
            Fleet: fleetCourses.length,
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Poll for changes every 5 seconds when tab is active
    // This ensures admin changes are reflected quickly
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Courses page: Polling for landing page updates...')
        fetchData()
      }
    }, 5000) // Poll every 5 seconds
    
    // Also refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Courses page: Tab became visible, refreshing...')
        fetchData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Calculate dynamic section height based on number of enabled landing pages
  // Cards are now wider (600px max), so we get fewer per row (typically 2-3 max)
  const calculateSectionHeight = () => {
    if (landingPages.length === 0) return 'auto'
    
    // Card height is 280px, gap is 24px (gap-6), padding top is 100px, padding bottom is 200px
    // Title section takes ~110px (mb-12 = 48px + content height ~62px)
    const cardHeight = 280
    const gap = 24
    const paddingTop = 100
    const paddingBottom = 200
    const titleSectionHeight = 110
    
    // Estimate cards per row: with 600px cards, typically 2 per row on most screens
    // On very wide screens (>1400px) we might get 3, but calculate conservatively for 2
    const cardsPerRow = Math.min(landingPages.length, 2)
    const numberOfRows = Math.ceil(landingPages.length / cardsPerRow)
    
    // Calculate total content height in pixels
    const cardsHeight = numberOfRows * cardHeight + (numberOfRows > 0 ? (numberOfRows - 1) * gap : 0)
    const totalHeightPx = paddingTop + titleSectionHeight + cardsHeight + paddingBottom
    
    // Convert to viewport height with some buffer
    // Use a more responsive calculation: base height + per-row addition
    if (landingPages.length === 1) return '120vh'
    if (landingPages.length === 2) return '140vh'
    if (landingPages.length === 3) return '160vh'
    if (landingPages.length === 4) return '180vh'
    // For 5+ cards, add 20vh per additional card
    return `${180 + ((landingPages.length - 4) * 20)}vh`
  }

  // Calculate clip path based on number of cards - keep shape consistent
  const getClipPath = () => {
    // Maintain the same diagonal cut shape regardless of number of cards
    // This keeps the visual design consistent
    if (landingPages.length <= 3) return 'polygon(0 0, 100% 0, 100% 100%, 0 70%)'
    return 'polygon(0 0, 100% 0, 100% 100%, 0 85%)'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* White Hero Section */}
      <section className="bg-white h-[calc(100vh-4rem)] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">Courses</span>
              <div className="mt-2 h-px w-16 bg-black" />
            </div>
            
            {/* Title */}
            <h1 
              className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl mb-6"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Our courses and training
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Delivering real-world impact through data science and AI. Our comprehensive training programs are designed to advance your career in artificial intelligence.
            </p>
            
            {/* Learn More Button */}
            <Link
              href="#courses"
              className="inline-flex items-center justify-center bg-black text-white px-6 py-3 text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Cards Section - Adapts to number of enabled landing pages */}
      <section 
        id="courses" 
        className="relative flex items-start" 
        style={{ 
          backgroundColor: '#1C1C1C', 
          minHeight: calculateSectionHeight(),
          height: 'auto',
          paddingBottom: '200px',
          clipPath: getClipPath(), 
          paddingTop: '100px' 
        }}
      >
        <div className="mx-auto w-full flex flex-col" style={{ maxWidth: '1400px', paddingLeft: '16px', paddingRight: '16px' }}>
          {/* Title and Subtitle */}
          <div className="text-left mb-12 w-full">
            <h2 
              className="font-bold text-white mb-4"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: '30px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Our courses and training
            </h2>
            <p 
              className="text-lg text-white/90 max-w-2xl"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                lineHeight: '1.6'
              }}
            >
              Discover specialized AI training programs designed for professionals across industries.
            </p>
          </div>
          
          {/* Cards - Dynamic grid that wraps based on number of landing pages */}
          {landingPages.length === 0 && !isLoading && (
            <div className="text-white text-center py-12">
              <p className="text-xl mb-4">No landing pages found.</p>
              <p className="mb-4">Please check:</p>
              <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-sm">
                <li>1. Landing pages are enabled in the admin panel (/admin)</li>
                <li>2. Database migrations have been run</li>
                <li>3. Check browser console (F12) for errors</li>
                <li>4. Check server logs for API responses</li>
              </ul>
            </div>
          )}
          {isLoading && (
            <div className="text-white text-center py-12">
              <p>Loading landing pages...</p>
            </div>
          )}
          <div 
            className="grid gap-6"
            style={{
              gridTemplateColumns: landingPages.length > 0 
                ? `repeat(auto-fit, minmax(400px, ${landingPages.length <= 2 ? '600px' : 'min(600px, calc((100% - 48px) / ' + Math.min(landingPages.length, 3) + '))'}))`
                : '1fr',
              maxWidth: '100%',
              alignItems: 'stretch'
            }}
          >
            {landingPages.map((page) => {
              console.log('🎴 Rendering landing page card:', page.name, page.tag)
              const courseCount = courseCounts[page.tag] || 0
              return (
                <Link
                  key={page.tag}
                  href={page.href}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                  style={{ 
                    backgroundColor: page.bgColor,
                    width: '100%',
                    minWidth: '400px',
                    maxWidth: '600px',
                    minHeight: '280px',
                    height: '280px',
                    margin: '0 auto'
                  }}
                >
                  <div className="p-8 h-full flex flex-col text-white">
                    {/* Subtitle */}
                    <div className="mb-2">
                      <span 
                        className="text-sm uppercase tracking-wider"
                        style={{ 
                          fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                          opacity: 0.9
                        }}
                      >
                        {page.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 
                      className="text-3xl font-bold mb-3"
                      style={{ 
                        fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                        fontWeight: 700,
                        lineHeight: '1.2',
                      }}
                    >
                      {page.name}
                    </h2>

                    {/* Description */}
                    <p 
                      className="text-base mb-3 leading-relaxed"
                      style={{ 
                        fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                        opacity: 0.95,
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: '1 1 auto'
                      }}
                    >
                      {page.description}
                    </p>

                    {/* Course Count and Button Row */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {!isLoading && courseCount > 0 && (
                        <div className="text-sm opacity-90">
                          {courseCount} {courseCount === 1 ? 'course' : 'courses'} available
                        </div>
                      )}
                      <div className={!isLoading && courseCount > 0 ? '' : 'ml-auto'}>
                        <div 
                          className="inline-flex items-center justify-center bg-white text-black px-6 py-2.5 text-sm font-semibold rounded transition-all duration-300 group-hover:bg-gray-100"
                          style={{ 
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                          }}
                        >
                          Learn More
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* White Section Below Diagonal Cut */}
      <section className="relative bg-white" style={{ clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)', marginTop: '-1px', minHeight: '600px' }}>
        <div className="absolute left-0" style={{ top: '35%', width: '100%', paddingLeft: '40px', paddingBottom: '60px', paddingRight: '40px' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
            <h2 
              className="text-4xl font-bold text-black mb-6"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Fundamental Research
            </h2>
            <p 
              className="text-lg text-black mb-6 leading-relaxed"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                lineHeight: '1.6'
              }}
            >
              Realising the possibilities of data science and AI will require advancing the tools, methods and theory that underpin these technologies. Cutting across our science and innovation activity, our Fundamental Research capability is democratising access to fundamental tools and enabling the application of AI methodology across new domains.
            </p>
            <p 
              className="text-lg text-black mb-8 leading-relaxed"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                lineHeight: '1.6'
              }}
            >
              Our Fundamental Research team is also leading a mission developing the next generation of fundamental AI tools and theory for modelling, prediction and control of physical systems.
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}
