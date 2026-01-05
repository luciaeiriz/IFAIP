'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import AdvertiserDisclosureModal from './ui/AdvertiserDisclosureModal'

const courseCategories = [
  { name: 'Business', href: '/courses/business' },
  { name: 'Restaurant', href: '/courses/restaurant' },
  { name: 'Fleet', href: '/courses/fleet' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [breadcrumbCoursesDropdownOpen, setBreadcrumbCoursesDropdownOpen] = useState(false)
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on a courses page (but not the old /courses page)
  const isCoursesPage = pathname?.startsWith('/courses') && pathname !== '/courses'

  // Build breadcrumb items based on pathname
  const getBreadcrumbs = () => {
    if (!pathname) return []
    
    const items = [
      { label: 'Home', href: '/' }
    ]
    
    if (pathname.startsWith('/courses')) {
      items.push({ label: 'Courses', href: '/courses/business' })
      
      // Check if it's a category page
      if (pathname === '/courses/business') {
        items.push({ label: 'Business', href: '/courses/business' })
      } else if (pathname === '/courses/restaurant') {
        items.push({ label: 'Restaurant', href: '/courses/restaurant' })
      } else if (pathname === '/courses/fleet') {
        items.push({ label: 'Fleet', href: '/courses/fleet' })
      } else if (pathname.startsWith('/courses/') && pathname !== '/courses') {
        // It's a course detail page - extract category from path or use generic
        const pathParts = pathname.split('/')
        if (pathParts.length > 2) {
          // Try to determine category from URL or use "Course"
          items.push({ label: 'Course', href: pathname })
        }
      }
    }
    
    return items
  }

  // Simplified header for courses pages
  if (isCoursesPage) {
    const breadcrumbs = getBreadcrumbs()
    
    return (
      <>
        <header className="sticky top-0 z-50 bg-white relative border-b border-gray-200">
          <nav className="mx-auto relative" style={{ maxWidth: '912px', height: '50px', paddingLeft: '0' }}>
            <div className="flex h-full items-center justify-start" style={{ marginLeft: '-220px' }}>
              <Link 
                href="/"
                className="transition-opacity hover:opacity-80 flex items-center"
              >
                <Image 
                  src="/logo.png" 
                  alt="IFAIP Logo" 
                  width={120} 
                  height={45}
                  style={{ objectFit: 'contain', height: '45px', width: 'auto' }}
                />
              </Link>
            </div>
          </nav>
          <AdvertiserDisclosureModal
            isOpen={disclosureModalOpen}
            onClose={() => setDisclosureModalOpen(false)}
          />
        </header>
        {/* Breadcrumb Subheader */}
        <div className="sticky top-[50px] z-40 bg-white border-b border-gray-200">
          <nav className="mx-auto" style={{ maxWidth: '912px', height: '45px', paddingLeft: '0' }}>
            <div className="flex h-full items-center" style={{ marginLeft: '-200px' }}>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index === 0 ? (
                      <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </Link>
                    ) : crumb.label === 'Courses' ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setBreadcrumbCoursesDropdownOpen(true)}
                        onMouseLeave={() => setBreadcrumbCoursesDropdownOpen(false)}
                      >
                        <button
                          className="hover:text-gray-900 transition-colors flex items-center"
                          style={{ 
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                          }}
                        >
                          {crumb.label}
                          <svg
                            className="ml-1 h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {breadcrumbCoursesDropdownOpen && (
                          <div className="absolute left-0 top-full pt-2 w-40 z-50">
                            <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
                              <div className="py-1">
                                <Link
                                  href="/courses/business"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Business
                                </Link>
                                <Link
                                  href="/courses/restaurant"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Restaurant
                                </Link>
                                <Link
                                  href="/courses/fleet"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Fleet
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        href={crumb.href} 
                        className="hover:text-gray-900 transition-colors"
                        style={{ 
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                        }}
                      >
                        {crumb.label}
                      </Link>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </>
    )
  }

  const isHomePage = pathname === '/'
  const isCoursesLandingPage = pathname === '/courses'
  const isAboutPage = pathname === '/about'
  const isTermsPage = pathname === '/terms'
  const isPrivacyPage = pathname === '/privacy'
  const isAdminPage = pathname === '/admin'

  // Turing Institute style header for homepage and courses landing page
  if (isHomePage || isCoursesLandingPage) {
    return (
      <header className="sticky top-0 z-50 bg-white">
        <nav className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between" style={{ height: '107px' }}>
            {/* Left - Logo */}
            <div className="flex items-center pl-0 sm:pl-1 lg:pl-2" style={{ marginLeft: '-8px' }}>
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
                href="/membership"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Membership
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                About us
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                <Link
                  href="/courses"
                  className="text-sm font-medium text-black hover:text-gray-600 transition-colors flex items-center"
                  style={{ fontSize: '15px' }}
                >
                  Courses
                </Link>
                {coursesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-48">
                    <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          href="/courses/business"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Business
                        </Link>
                        <Link
                          href="/courses/restaurant"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Restaurant
                        </Link>
                        <Link
                          href="/courses/fleet"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Fleet
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/about"
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                style={{ fontSize: '15px' }}
              >
                Partner with us
              </Link>
              <Link
                href="/about"
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
                href="/courses/business"
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
        <div className="relative flex items-center justify-between" style={{ height: '50px' }}>
          {/* Left side - Mobile menu button */}
          {!isTermsPage && !isPrivacyPage && !isAdminPage && (
            <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-800"
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
          )}

          {/* Center - Logo (absolutely positioned) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="transition-opacity hover:opacity-80 flex items-center justify-center">
              <Image 
                src="/logo_white.png" 
                alt="IFAIP Logo" 
                width={120} 
                height={45}
                style={{ objectFit: 'contain', height: '45px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Right side - Desktop Navigation */}
          {!isTermsPage && !isPrivacyPage && !isAdminPage && (
            <div className="hidden md:flex md:items-center md:justify-end md:space-x-8 md:ml-auto md:mr-0 lg:mr-0 xl:mr-0">
              {/* Courses Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                <Link
                  href="/courses/business"
                  className="flex items-center text-sm text-white hover:text-gray-300 transition-colors"
                >
                  Courses
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                {coursesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-48">
                    <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {courseCategories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {category.name}
                          </Link>
                        ))}
                        <Link
                          href="/courses/business"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                        >
                          All Courses
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isAboutPage && (
                <Link
                  href="/membership"
                  className="text-sm text-white hover:text-gray-300 transition-colors"
                >
                  Membership
                </Link>
              )}

              {!isAboutPage && (
                <Link
                  href="/about"
                  className="text-sm text-white hover:text-gray-300 transition-colors"
                >
                  About
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {!isTermsPage && !isPrivacyPage && !isAdminPage && mobileMenuOpen && (
          <div className="md:hidden bg-black">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <div className="border-b border-gray-700 pb-3">
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-white"
                >
                  Courses
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      coursesDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {coursesDropdownOpen && (
                  <div className="mt-2 space-y-1 pl-6">
                    {courseCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-3 py-2 text-sm text-gray-300 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                <Link
                  href="/courses/business"
                  className="block px-3 py-2 text-sm text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Courses
                </Link>
                  </div>
                )}
              </div>
              {!isAboutPage && (
                <Link
                  href="/membership"
                  className="block px-3 py-2 text-sm font-medium text-white hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Membership
                </Link>
              )}
              {!isAboutPage && (
                <Link
                  href="/about"
                  className="block px-3 py-2 text-sm font-medium text-white hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

