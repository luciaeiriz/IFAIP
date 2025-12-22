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
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on a courses page (but not the old /courses page)
  const isCoursesPage = pathname?.startsWith('/courses') && pathname !== '/courses'

  // Simplified header for courses pages
  if (isCoursesPage) {
    return (
      <header className="sticky top-0 z-50 bg-black relative">
        <nav className="mx-auto relative" style={{ maxWidth: '912px', height: '50px' }}>
          <div className="flex h-full items-center justify-center">
            <Link 
              href="/"
              className="transition-opacity hover:opacity-80 flex items-center justify-center"
            >
              <Image 
                src="/logo_white.png" 
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
    )
  }

  const isHomePage = pathname === '/'
  const isAboutPage = pathname === '/about'
  const isTermsPage = pathname === '/terms'
  const isPrivacyPage = pathname === '/privacy'
  const isAdminPage = pathname === '/admin'

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

