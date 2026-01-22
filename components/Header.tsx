'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import AdvertiserDisclosureModal from './ui/AdvertiserDisclosureModal'

interface LandingPage {
  tag: string
  name: string
  href: string
  description: string
  bgColor: string
  heroTitle?: string | null
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [breadcrumbCoursesDropdownOpen, setBreadcrumbCoursesDropdownOpen] = useState(false)
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false)
  const [coursesDropdownTimeout, setCoursesDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const pathname = usePathname()

  // Fetch enabled landing pages
  useEffect(() => {
    const fetchLandingPages = async () => {
      try {
        // Add cache-busting query parameter to ensure fresh data
        const response = await fetch(`/api/landing-pages?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setLandingPages(data.landingPages || [])
        }
      } catch (error) {
        console.error('Error fetching landing pages:', error)
      }
    }
    
    // Initial fetch
    fetchLandingPages()
    
    // Refetch when window gains focus (user switches back to tab)
    // This helps catch changes made in another tab or after admin updates
    const handleFocus = () => {
      fetchLandingPages()
    }
    
    // Poll for changes every 5 seconds when tab is active
    // This ensures admin changes are reflected quickly
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchLandingPages()
      }
    }, 5000) // Poll every 5 seconds
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        fetchLandingPages()
      }
    })
    
    return () => {
      clearInterval(pollInterval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (coursesDropdownTimeout) {
        clearTimeout(coursesDropdownTimeout)
      }
    }
  }, [coursesDropdownTimeout])
  
  // Check if we're on a courses page (but not the old /courses page)
  const isCoursesPage = pathname?.startsWith('/courses') && pathname !== '/courses'

  // Build breadcrumb items based on pathname
  const getBreadcrumbs = () => {
    if (!pathname) return []
    
    const items = [
      { label: 'Home', href: '/' }
    ]
    
    if (pathname.startsWith('/courses')) {
      const firstLandingPage = landingPages.length > 0 ? landingPages[0] : null
      items.push({ label: 'Courses', href: firstLandingPage?.href || '/courses' })
      
      // Check if it's a landing page (category page)
      const pathParts = pathname.split('/')
      if (pathParts.length === 3 && pathParts[1] === 'courses') {
        const tag = pathParts[2]
        const landingPage = landingPages.find(lp => lp.tag === tag)
        if (landingPage) {
          items.push({ label: landingPage.name, href: landingPage.href })
        } else {
          // Legacy support for Business/Restaurant/Fleet
          const legacyNames: Record<string, string> = {
            business: 'Business',
            restaurant: 'Restaurant',
            fleet: 'Fleet',
          }
          const legacyName = legacyNames[tag.toLowerCase()]
          if (legacyName) {
            items.push({ label: legacyName, href: pathname })
          }
        }
      } else if (pathname.startsWith('/courses/') && pathname !== '/courses') {
        // It's a course detail page - extract category from path or use generic
        if (pathParts.length > 2) {
          items.push({ label: 'Course', href: pathname })
        }
      }
    }
    
    return items
  }

  // Simplified header for courses pages
  if (isCoursesPage) {
    return (
      <header className="sticky top-0 z-50 bg-black shadow-sm header-courses-page">
        <nav className="mx-auto max-w-7xl pl-4 pr-0 sm:pl-6 sm:pr-0 lg:pl-8 lg:pr-0 relative">
          <AdvertiserDisclosureModal
            isOpen={disclosureModalOpen}
            onClose={() => setDisclosureModalOpen(false)}
          />
          <div className="relative flex items-center justify-center" style={{ height: '50px' }}>
            {/* Center - Logo */}
            <Link href="/" className="transition-opacity hover:opacity-80 flex items-center justify-center">
              <Image 
                src="/logo_white.png" 
                alt="IFAIP Logo" 
                width={240} 
                height={90}
                quality={95}
                priority
                style={{ objectFit: 'contain', height: '45px', width: 'auto' }}
              />
            </Link>
          </div>
        </nav>
      </header>
    )
  }

  const isHomePage = pathname === '/'
  const isCoursesLandingPage = pathname === '/courses'
  const isAboutPage = pathname === '/about'
  const isMembershipPage = pathname === '/membership' || pathname?.startsWith('/membership')
  const isTermsPage = pathname === '/terms'
  const isPrivacyPage = pathname === '/privacy'
  const isContactPage = pathname === '/contact'
  const isPartnerPage = pathname === '/partner'
  const isAdminPage = pathname === '/admin'

  // Turing Institute style header for homepage, courses landing page, about page, membership page, terms page, privacy page, contact page, and partner page
  if (isHomePage || isCoursesLandingPage || isAboutPage || isMembershipPage || isTermsPage || isPrivacyPage || isContactPage || isPartnerPage) {
    return (
      <header className="sticky top-0 z-50 bg-white">
        <nav className="mx-auto max-w-7xl relative">
          <div className="flex items-center justify-between" style={{ height: '107px' }}>
            {/* Left - Logo */}
            <div className="flex items-center pl-4 sm:pl-6 md:pl-6 lg:pl-2">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image 
                  src="/logo.png" 
                  alt="IFAIP Logo" 
                  width={200} 
                  height={60}
                  className="h-auto"
                  style={{ objectFit: 'contain', maxHeight: '60px' }}
                  priority
                />
              </Link>
            </div>

            {/* Right - Navigation Links */}
            <div 
              className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8 pr-4 sm:pr-6 lg:pr-8"
              style={{ 
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              <Link
                href="/about"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                About us
              </Link>
              <div
                className="relative"
                onMouseEnter={() => {
                  if (coursesDropdownTimeout) {
                    clearTimeout(coursesDropdownTimeout)
                    setCoursesDropdownTimeout(null)
                  }
                  setCoursesDropdownOpen(true)
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setCoursesDropdownOpen(false)
                  }, 200) // 200ms delay before closing
                  setCoursesDropdownTimeout(timeout)
                }}
              >
                <Link
                  href="/courses"
                  className="text-sm font-medium text-black hover:text-gray-600 transition-colors flex items-center"
                  style={{ fontSize: '15px' }}
                >
                  Courses
                </Link>
                {coursesDropdownOpen && (
                  <div 
                    className="fixed top-[107px] left-1/2 pt-4" 
                    style={{ transform: 'translateX(-50%)', width: '1200px', maxWidth: 'calc(100vw - 40px)', zIndex: 50 }}
                    onMouseEnter={() => {
                      if (coursesDropdownTimeout) {
                        clearTimeout(coursesDropdownTimeout)
                        setCoursesDropdownTimeout(null)
                      }
                      setCoursesDropdownOpen(true)
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => {
                        setCoursesDropdownOpen(false)
                      }, 200) // 200ms delay before closing
                      setCoursesDropdownTimeout(timeout)
                    }}
                  >
                    <div className="shadow-2xl" style={{ backgroundColor: '#1C1C1C', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}>
                      <div className="p-12">
                        {/* Course Cards - Horizontal Layout */}
                        <div 
                          className={`grid gap-6 ${landingPages.length === 1 ? 'grid-cols-1' : landingPages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} 
                          style={{ maxWidth: '900px', margin: '0 auto' }}
                        >
                          {landingPages.length > 0 ? (
                            landingPages.map((page) => {
                              // Use description field (NOT heroTitle) - truncate to consistent length (max 145 characters)
                              // Get description - handle null, undefined, empty string, or whitespace-only
                              let description: string | null = page.description
                              if (description && typeof description === 'string') {
                                description = description.trim()
                              } else {
                                description = null
                              }
                              
                              // Only use fallback if description is truly empty/null
                              const truncatedDescription = description && description.length > 0
                                ? (description.length > 145 ? description.substring(0, 145).trim() + '...' : description)
                                : 'AI certification programs'
                              
                              
                              return (
                                <Link
                                  key={page.tag}
                                  href={page.href}
                                  className="group block"
                                >
                                  <div className="rounded overflow-hidden relative" style={{ backgroundColor: page.bgColor || '#2663EB', height: '100px', width: '100%' }}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                      <h4 className="text-base font-semibold mb-1">{page.name}</h4>
                                      <p className="text-sm text-white/90 line-clamp-2">
                                        {truncatedDescription}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              )
                            })
                          ) : (
                            <>
                              {/* Fallback to legacy pages if API fails */}
                              <Link
                                href="/courses/business"
                                className="group block"
                              >
                                <div className="rounded overflow-hidden relative" style={{ backgroundColor: '#2663EB', height: '100px', width: '100%' }}>
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <h4 className="text-base font-semibold mb-1">Business</h4>
                                    <p className="text-sm text-white/90 line-clamp-2">
                                      AI certification programs designed for business owners and entrepreneurs looking to leverage artificial intelligence to grow their business.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                              <Link
                                href="/courses/restaurant"
                                className="group block"
                              >
                                <div className="rounded overflow-hidden relative" style={{ backgroundColor: '#16A349', height: '100px', width: '100%' }}>
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <h4 className="text-base font-semibold mb-1">Restaurant</h4>
                                    <p className="text-sm text-white/90 line-clamp-2">
                                      Specialized AI training for restaurant owners to optimize operations, improve customer experience, and increase profitability.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                              <Link
                                href="/courses/fleet"
                                className="group block"
                              >
                                <div className="rounded overflow-hidden relative" style={{ backgroundColor: '#9333EA', height: '100px', width: '100%' }}>
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <h4 className="text-base font-semibold mb-1">Fleet</h4>
                                    <p className="text-sm text-white/90 line-clamp-2">
                                      AI certification courses tailored for fleet managers to enhance logistics, reduce costs, and improve operational efficiency.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/membership"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Membership
              </Link>
              <Link
                href="/partner"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Partner with us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Contact us
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-black hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
        <AdvertiserDisclosureModal
          isOpen={disclosureModalOpen}
          onClose={() => setDisclosureModalOpen(false)}
        />
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/courses"
                className="block px-3 py-2 text-base font-medium text-black hover:bg-gray-50"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/membership"
                className="block px-3 py-2 text-base font-medium text-black hover:bg-gray-50"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-black hover:bg-gray-50"
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About us
              </Link>
            </div>
          </div>
        )}
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-black shadow-sm">
      <nav className="mx-auto max-w-7xl pl-4 pr-0 sm:pl-6 sm:pr-0 lg:pl-8 lg:pr-0 relative">
        <AdvertiserDisclosureModal
          isOpen={disclosureModalOpen}
          onClose={() => setDisclosureModalOpen(false)}
        />
        <div className="relative flex items-center justify-center" style={{ height: '50px' }}>
          {/* Center - Logo */}
          <Link href="/" className="transition-opacity hover:opacity-80 flex items-center justify-center">
            <Image 
              src="/logo_white.png" 
              alt="IFAIP Logo" 
              width={240} 
              height={90}
              quality={95}
              priority
              style={{ objectFit: 'contain', height: '45px', width: 'auto' }}
            />
          </Link>
        </div>
      </nav>
    </header>
  )
}

