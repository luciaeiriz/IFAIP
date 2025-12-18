'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const courseCategories = [
  { name: 'General', href: '/courses?tag=General' },
  { name: 'Restaurant', href: '/courses?tag=Restaurant' },
  { name: 'Fleet', href: '/courses?tag=Fleet' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo href="/" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Courses Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
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
              </button>
              {coursesDropdownOpen && (
                <div
                  onMouseEnter={() => setCoursesDropdownOpen(true)}
                  onMouseLeave={() => setCoursesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                >
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
                      href="/courses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                    >
                      All Courses
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/membership"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Membership
            </Link>

            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>

            <Link
              href="/courses"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                  className="flex w-full items-center justify-between px-3 py-2 text-base font-medium text-gray-700"
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
                        className="block px-3 py-2 text-sm text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/courses"
                      className="block px-3 py-2 text-sm text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Courses
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/membership"
                className="block px-3 py-2 text-base font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/courses"
                className="block px-3 py-2 text-base font-medium text-white bg-primary-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

