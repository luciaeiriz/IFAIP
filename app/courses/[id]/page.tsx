'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCourseById } from '@/src/data/courses'
import { Course } from '@/types/course'

type TabType = 'about' | 'learn' | 'curriculum' | 'information' | 'details'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('about')

  const scrollToSection = (sectionId: string, tabType: TabType) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setActiveTab(tabType)
      const offset = 100 // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Track which section is in view on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'section-about', tab: 'about' as TabType },
        { id: 'section-learn', tab: 'learn' as TabType },
        { id: 'section-curriculum', tab: 'curriculum' as TabType },
        { id: 'section-information', tab: 'information' as TabType },
        { id: 'section-details', tab: 'details' as TabType },
      ]

      const scrollPosition = window.scrollY + 150 // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveTab(sections[i].tab)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const courseData = await getCourseById(courseId)
        if (courseData) {
          setCourse(courseData)
        } else {
          setError('Course not found')
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course')
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const getLevelBadgeColor = (level: string | null) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const parseKeySkills = (skills: string | null): string[] => {
    if (!skills) return []
    return skills.split(',').map((skill) => skill.trim()).filter(Boolean)
  }

  const parseModules = (modules: string | null): string[] => {
    if (!modules) return []
    // Try to parse as comma-separated or newline-separated
    return modules
      .split(/[,\n]/)
      .map((module) => module.trim())
      .filter(Boolean)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The course you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/courses"
            className="inline-block rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-700"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const keySkills = parseKeySkills(course.key_skills)
  const modules = parseModules(course.modules)
  const isOurCourse = !course.external_url

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#F3F6FC', height: '463px' }}>
        <div className="mx-auto max-w-7xl py-16" style={{ paddingLeft: '0', paddingRight: '24px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Hero content (2/3 width) */}
            <div className="lg:col-span-2" style={{ marginLeft: '-24px', paddingLeft: '24px' }}>
              {/* Logo */}
              <div className="mb-6">
                <Image 
                  src="/cognite_logo.png" 
                  alt="IFAIP Logo" 
                  width={200} 
                  height={60}
                  style={{ objectFit: 'contain', height: '60px', width: 'auto' }}
                />
              </div>

              {/* Title */}
              <h1 
                className="mb-3 leading-tight text-gray-900"
                style={{
                  fontSize: '44px',
                  fontFamily: '"Source Sans Pro", Arial, sans-serif',
                  fontWeight: 700
                }}
              >
                {course.title}
              </h1>
              
              {/* Description */}
              {course.description && (
                <p 
                  className="mb-8 text-gray-700"
                  style={{
                    fontSize: '16px',
                    fontFamily: '"Source Sans Pro", Arial, sans-serif',
                    fontWeight: 400
                  }}
                >
                  {course.description}
                </p>
              )}

              {/* Sign Up Button */}
              <div className="mb-8">
                {course.external_url ? (
                  <a
                    href={course.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg text-center text-base font-bold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0156D2] focus:ring-offset-2"
                    style={{ backgroundColor: '#0156D2', width: '285px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Enroll Now
                  </a>
                ) : course.signup_enabled ? (
                  <Link
                    href={`/signup/${course.id}`}
                    className="block rounded-lg text-center text-base font-bold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0156D2] focus:ring-offset-2"
                    style={{ backgroundColor: '#0156D2', width: '285px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Sign Up Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block rounded-lg bg-gray-300 text-center text-base font-bold text-gray-500 cursor-not-allowed"
                    style={{ width: '285px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
            {/* Right side - Empty space (1/3 width) */}
            <div className="lg:col-span-1"></div>
          </div>
          
          {/* Meta Info Card - Single white card with dividers - Full width */}
          <div className="rounded-lg bg-white p-6 shadow-sm mb-8" style={{ marginLeft: '-24px', paddingLeft: '24px', marginRight: '-24px', paddingRight: '24px' }}>
            <div className="flex flex-wrap items-center divide-x divide-gray-200">
              {course.duration && (
                <div className="flex-1 min-w-[150px] px-4 first:pl-0">
                  <div className="text-base font-bold text-gray-900 mb-1">{course.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              )}
              {course.level && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="text-base font-bold text-gray-900 mb-1">{course.level}</div>
                  <div className="text-sm text-gray-500">Level</div>
                </div>
              )}
              {course.rating && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="flex items-center gap-1 text-base font-bold text-gray-900 mb-1">
                    <span className="text-blue-500">★</span>
                    {course.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.reviews ? `(${course.reviews} reviews)` : 'Rating'}
                  </div>
                </div>
              )}
              {course.effort && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="text-base font-bold text-gray-900 mb-1">{course.effort}</div>
                  <div className="text-sm text-gray-500">Effort</div>
                </div>
              )}
              {course.price_label && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="text-base font-bold text-gray-900 mb-1">{course.price_label}</div>
                  <div className="text-sm text-gray-500">Price</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white w-full">
        <div className="mx-auto max-w-7xl py-12" style={{ paddingLeft: '0', paddingRight: '24px' }}>
          <div className="grid grid-cols-1 gap-8">
            {/* Main Content (full width) */}
            <div style={{ marginLeft: '-24px', paddingLeft: '24px' }}>
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200 sticky top-[95px] bg-white z-30 pb-0">
              <nav className="flex space-x-1" aria-label="Tabs">
                <button
                  onClick={() => scrollToSection('section-about', 'about')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'about'
                      ? 'text-[#0156D2] border-b-2 border-[#0156D2]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  About
                </button>
                {keySkills.length > 0 && (
                  <button
                    onClick={() => scrollToSection('section-learn', 'learn')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'learn'
                        ? 'text-[#0156D2] border-b-2 border-[#0156D2]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    What You'll Learn
                  </button>
                )}
                {modules.length > 0 && (
                  <button
                    onClick={() => scrollToSection('section-curriculum', 'curriculum')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'curriculum'
                        ? 'text-[#0156D2] border-b-2 border-[#0156D2]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Curriculum
                  </button>
                )}
                {(course.instructors || course.effort || course.languages || course.free_trial) && (
                  <button
                    onClick={() => scrollToSection('section-information', 'information')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'information'
                        ? 'text-[#0156D2] border-b-2 border-[#0156D2]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Information
                  </button>
                )}
                <button
                  onClick={() => scrollToSection('section-details', 'details')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'text-[#0156D2] border-b-2 border-[#0156D2]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Details
                </button>
              </nav>
            </div>

            {/* All Content Sections - All displayed at once */}
            <div className="space-y-8">
              {/* About Section */}
              <section id="section-about" className="scroll-mt-24">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  About This Course
                </h2>
                <div className="prose prose-lg max-w-none">
                  {course.description ? (
                    <p className="whitespace-pre-line leading-relaxed text-gray-700 text-base">
                      {course.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description available for this course.
                    </p>
                  )}
                </div>
              </section>

              {/* What You'll Learn Section */}
              {keySkills.length > 0 && (
                <section id="section-learn" className="scroll-mt-24">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    What You'll Learn
                  </h2>
                  <div className="space-y-3">
                    {keySkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Curriculum Section */}
              {modules.length > 0 && (
                <section id="section-curriculum" className="scroll-mt-24">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    Course Curriculum
                  </h2>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-lg border-2 border-gray-100 bg-gray-50 p-5 transition-all hover:border-[#36498C] hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#36498C] text-base font-bold text-white">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-900 font-medium">{module}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Information Section */}
              {(course.instructors || course.effort || course.languages || course.free_trial) && (
                <section id="section-information" className="scroll-mt-24">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    Course Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {course.instructors && (
                      <div>
                        <div className="mb-1 text-sm font-semibold text-gray-600">Instructors</div>
                        <div className="text-gray-900">{course.instructors}</div>
                      </div>
                    )}
                    {course.effort && (
                      <div>
                        <div className="mb-1 text-sm font-semibold text-gray-600">Effort Required</div>
                        <div className="text-gray-900">{course.effort}</div>
                      </div>
                    )}
                    {course.languages && (
                      <div>
                        <div className="mb-1 text-sm font-semibold text-gray-600">Languages</div>
                        <div className="text-gray-900">{course.languages}</div>
                      </div>
                    )}
                    {course.free_trial && (
                      <div>
                        <div className="mb-1 text-sm font-semibold text-gray-600">Free Trial</div>
                        <div className="text-gray-900">{course.free_trial}</div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Details Section */}
              <section id="section-details" className="scroll-mt-24">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  Course Details
                </h2>
                {/* Price Display */}
                {course.price_label && (
                  <div className="mb-8 text-center">
                    <div className="mb-2 text-sm font-medium text-gray-600">Price</div>
                    <div className="text-4xl font-bold text-[#36498C]">
                      {course.price_label}
                    </div>
                  </div>
                )}
                {/* Course Details List */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <dl className="space-y-4 text-sm">
                    {course.provider && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Provider</dt>
                        <dd className="font-semibold text-gray-900">
                          {course.provider}
                        </dd>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Duration</dt>
                        <dd className="font-semibold text-gray-900">
                          {course.duration}
                        </dd>
                      </div>
                    )}
                    {course.level && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Level</dt>
                        <dd className="font-semibold text-gray-900">
                          {course.level}
                        </dd>
                      </div>
                    )}
                    {course.effort && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Effort</dt>
                        <dd className="font-semibold text-gray-900">
                          {course.effort}
                        </dd>
                      </div>
                    )}
                    {course.languages && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Languages</dt>
                        <dd className="font-semibold text-gray-900">
                          {course.languages}
                        </dd>
                      </div>
                    )}
                    {course.instructors && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Instructors</dt>
                        <dd className="font-semibold text-gray-900 text-right max-w-[60%]">
                          {course.instructors}
                        </dd>
                      </div>
                    )}
                    {course.rating && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-600 font-medium">Rating</dt>
                        <dd className="font-semibold text-gray-900">
                          <span className="text-yellow-500">★</span>{' '}
                          {course.rating.toFixed(1)}
                          {course.reviews && ` (${course.reviews})`}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
