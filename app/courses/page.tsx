'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [sectionHeight, setSectionHeight] = useState<string>('auto')
  const gridRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroDescriptionRef = useRef<HTMLParagraphElement>(null)
  const heroButtonRef = useRef<HTMLAnchorElement>(null)
  const heroTextContainerRef = useRef<HTMLDivElement>(null)
  const heroBreadcrumbRef = useRef<HTMLDivElement>(null)

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
        fetchData()
      }
    }, 5000) // Poll every 5 seconds
    
    // Also refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Update clip path CSS variable for desktop when landing pages change
  useEffect(() => {
    const updateClipPath = () => {
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const section = document.getElementById('courses')
        if (section && window.innerWidth >= 1024) {
          section.style.setProperty('--courses-clip-path', getClipPath())
        }
      }
    }
    
    updateClipPath()
    window.addEventListener('resize', updateClipPath)
    return () => window.removeEventListener('resize', updateClipPath)
  }, [landingPages.length])
  
  // Update grid columns for mobile/tablet only
  useEffect(() => {
    const updateGridColumns = () => {
      if (gridRef.current && typeof window !== 'undefined' && window.innerWidth < 1024) {
        gridRef.current.style.gridTemplateColumns = '1fr'
      }
    }
    
    updateGridColumns()
    window.addEventListener('resize', updateGridColumns)
    return () => window.removeEventListener('resize', updateGridColumns)
  }, [])
  
  // Set hero title font size: 48px (3rem) on tablet, 60px on desktop
  useEffect(() => {
    const updateHeroTitle = () => {
      if (heroTitleRef.current && typeof window !== 'undefined') {
        // Always use window.innerWidth directly for accurate current width
        const currentWidth = window.innerWidth
        if (currentWidth >= 1024) {
          // Desktop: 60px
          heroTitleRef.current.style.fontSize = '60px'
          heroTitleRef.current.style.lineHeight = '1.2'
        } else if (currentWidth >= 768 && currentWidth < 1024) {
          // Tablet: 48px (3rem) - significantly larger than default md:text-4xl (36px)
          heroTitleRef.current.style.fontSize = '3rem'
          heroTitleRef.current.style.lineHeight = '1.2'
        } else {
          // Phone: use Tailwind classes - remove inline styles
          heroTitleRef.current.style.fontSize = ''
          heroTitleRef.current.style.lineHeight = ''
        }
      }
    }
    
    // Run immediately and on resize
    if (typeof window !== 'undefined') {
      updateHeroTitle()
      window.addEventListener('resize', updateHeroTitle)
      return () => window.removeEventListener('resize', updateHeroTitle)
    }
  }, [windowWidth])

  // Track window width for responsive height calculation
  useEffect(() => {
    const updateWindowWidth = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth)
      }
    }
    
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
    return () => window.removeEventListener('resize', updateWindowWidth)
  }, [])

  // Calculate section height based on landing pages and window width
  useEffect(() => {
    const calculateHeight = () => {
      if (landingPages.length === 0) {
        setSectionHeight('auto')
        return
      }
      
      // Check screen size - use windowWidth state if available, otherwise check window directly
      const currentWidth = windowWidth > 0 
        ? windowWidth 
        : (typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 1024)
      const isTablet = currentWidth >= 768 && currentWidth < 1024
      const isPhone = currentWidth < 768
      
      // For tablet and phone views, return 'auto' so the section adjusts dynamically to card content
      if (isTablet || isPhone) {
        setSectionHeight('auto')
        return
      }
      
      // Desktop view (>= 1024px) - calculate height based on number of cards
      if (landingPages.length === 1) {
        setSectionHeight('120vh')
      } else if (landingPages.length === 2) {
        setSectionHeight('140vh')
      } else if (landingPages.length === 3) {
        setSectionHeight('160vh')
      } else if (landingPages.length === 4) {
        setSectionHeight('180vh')
      } else {
        // For 5+ cards, add 20vh per additional card
        setSectionHeight(`${180 + ((landingPages.length - 4) * 20)}vh`)
      }
    }
    
    calculateHeight()
  }, [landingPages.length, windowWidth])

  // Adjust hero text elements for tablet view (768px - 1023px)
  useEffect(() => {
    const updateHeroTextSizes = () => {
      if (typeof window === 'undefined') return
      
      const currentWidth = windowWidth > 0 ? windowWidth : window.innerWidth
      const isTablet = currentWidth >= 768 && currentWidth < 1024
      
      // Update breadcrumb spacing for tablet
      if (heroBreadcrumbRef.current) {
        if (isTablet) {
          heroBreadcrumbRef.current.style.marginBottom = '1.5rem' // mb-6 - increased spacing
        } else {
          heroBreadcrumbRef.current.style.marginBottom = ''
        }
      }
      
      // Update title spacing for tablet
      if (heroTitleRef.current) {
        if (isTablet) {
          heroTitleRef.current.style.marginBottom = '1.5rem' // mb-6 - increased spacing
        } else {
          // Don't override Tailwind classes for non-tablet
          if (currentWidth < 768 || currentWidth >= 1024) {
            heroTitleRef.current.style.marginBottom = ''
          }
        }
      }
      
      // Update description size and spacing for tablet
      if (heroDescriptionRef.current) {
        if (isTablet) {
          heroDescriptionRef.current.style.fontSize = '1.25rem' // 20px - larger than md:text-lg (18px)
          heroDescriptionRef.current.style.lineHeight = '1.75'
          heroDescriptionRef.current.style.marginBottom = '2rem' // mb-8 - increased spacing
        } else {
          heroDescriptionRef.current.style.fontSize = ''
          heroDescriptionRef.current.style.lineHeight = ''
          heroDescriptionRef.current.style.marginBottom = ''
        }
      }
      
      // Update button size for tablet
      if (heroButtonRef.current) {
        if (isTablet) {
          heroButtonRef.current.style.fontSize = '1rem' // 16px
          heroButtonRef.current.style.padding = '0.75rem 1.5rem' // py-3 px-6
        } else {
          heroButtonRef.current.style.fontSize = ''
          heroButtonRef.current.style.padding = ''
        }
      }
    }
    
    updateHeroTextSizes()
    window.addEventListener('resize', updateHeroTextSizes)
    return () => window.removeEventListener('resize', updateHeroTextSizes)
  }, [windowWidth])


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
      <section className="bg-white min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:h-[calc(100vh-4rem)] flex items-center py-12 sm:py-16 md:py-20 lg:py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div ref={heroTextContainerRef} className="max-w-3xl">
            {/* Breadcrumb */}
            <div ref={heroBreadcrumbRef} className="mb-3 sm:mb-4 lg:mb-4">
              <span className="text-xs sm:text-sm lg:text-sm text-gray-600">Courses</span>
              <div className="mt-2 h-px w-12 sm:w-16 lg:w-16 bg-black" />
            </div>
            
            {/* Title */}
            <h1 
              ref={heroTitleRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-black mb-4 sm:mb-5 md:mb-6 lg:mb-6 courses-hero-title"
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
            <p 
              ref={heroDescriptionRef}
              className="text-base sm:text-lg md:text-lg lg:text-lg text-gray-700 mb-6 sm:mb-7 md:mb-8 lg:mb-8 leading-relaxed"
            >
              Delivering real-world impact through data science and AI. Our comprehensive training programs are designed to advance your career in artificial intelligence.
            </p>
            
            {/* Learn More Button */}
            <Link
              ref={heroButtonRef}
              href="#courses"
              className="inline-flex items-center justify-center bg-black text-white px-5 py-2.5 sm:px-6 sm:py-3 lg:px-6 lg:py-3 text-sm sm:text-base lg:text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Cards Section - Adapts to number of enabled landing pages */}
      <section 
        id="courses" 
        className="relative flex items-start courses-cards-section"
        style={{ 
          backgroundColor: '#1C1C1C', 
          minHeight: sectionHeight,
          height: 'auto',
        }}
      >
        <div className="mx-auto w-full flex flex-col px-4 sm:px-6 md:px-8 courses-cards-container" style={{ maxWidth: '1400px' }}>
          {/* Title and Subtitle */}
          <div className="text-left mb-8 sm:mb-10 md:mb-12 courses-title-container" style={{ width: '100%' }}>
            <h2 
              className="font-bold text-white mb-3 sm:mb-4 courses-section-title"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Our courses and training
            </h2>
            <p 
              className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl courses-section-subtitle"
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
            ref={gridRef}
            className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-6 courses-grid"
            style={{
              gridTemplateColumns: landingPages.length > 0 
                ? `repeat(auto-fit, minmax(400px, ${landingPages.length <= 2 ? '600px' : 'min(600px, calc((100% - 48px) / ' + Math.min(landingPages.length, 3) + '))'}))`
                : '1fr',
              maxWidth: '100%',
              alignItems: 'stretch'
            }}
          >
            {landingPages.map((page) => {
              const courseCount = courseCounts[page.tag] || 0
              return (
                <Link
                  key={page.tag}
                  href={page.href}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col courses-card"
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
                  <div className="p-5 sm:p-6 md:p-7 lg:p-8 h-full flex flex-col text-white courses-card-content">
                    {/* Subtitle */}
                    <div className="mb-1 sm:mb-2 courses-card-subtitle-container">
                      <span 
                        className="text-xs sm:text-sm courses-card-subtitle uppercase tracking-wider"
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
                      className="text-xl sm:text-2xl md:text-2xl courses-card-title font-bold mb-2 sm:mb-3"
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
                      className="text-sm sm:text-base courses-card-description mb-3 leading-relaxed"
                      style={{ 
                        fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                        opacity: 0.95,
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: '1 1 auto'
                      }}
                    >
                      {page.description}
                    </p>

                    {/* Course Count and Button Row */}
                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-2 sm:gap-0 courses-card-footer">
                      {!isLoading && courseCount > 0 && (
                        <div className="text-xs sm:text-sm courses-card-count opacity-90">
                          {courseCount} {courseCount === 1 ? 'course' : 'courses'} available
                        </div>
                      )}
                      <div className={!isLoading && courseCount > 0 ? '' : 'ml-auto'}>
                        <div 
                          className="inline-flex items-center justify-center bg-white text-black px-4 py-2 sm:px-5 sm:py-2 courses-card-button font-semibold rounded transition-all duration-300 group-hover:bg-gray-100"
                          style={{ 
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                          }}
                        >
                          Learn More
                          <svg
                            className="ml-2 h-3 w-3 sm:h-4 sm:w-4 courses-card-button-icon"
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
      <section className="relative bg-white courses-bottom-section" style={{ marginTop: '-1px' }}>
        <div className="absolute left-0 px-4 sm:px-6 md:px-8 courses-bottom-content" style={{ width: '100%' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-5 md:mb-6 courses-bottom-title"
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
              className="text-sm sm:text-base md:text-lg text-black mb-4 sm:mb-5 md:mb-6 leading-relaxed courses-bottom-text"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                lineHeight: '1.6'
              }}
            >
              Realising the possibilities of data science and AI will require advancing the tools, methods and theory that underpin these technologies. Cutting across our science and innovation activity, our Fundamental Research capability is democratising access to fundamental tools and enabling the application of AI methodology across new domains.
            </p>
            <p 
              className="text-sm sm:text-base md:text-lg text-black mb-6 sm:mb-7 md:mb-8 leading-relaxed courses-bottom-text"
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
