'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCourseById, getCoursesByTag, getFeaturedCourses } from '@/src/data/courses'
import { Course, CourseTag } from '@/types/course'
import ForbesHeroSection from '@/components/courses/ForbesHeroSection'
import FeaturedTopPicks from '@/components/courses/FeaturedTopPicks'
import AllCoursesGrid from '@/components/courses/AllCoursesGrid'
import EmailCaptureCTA from '@/components/courses/EmailCaptureCTA'
import LandingPageScrollBanner from '@/components/courses/LandingPageScrollBanner'
import { getLandingPageByTag } from '@/lib/landing-pages'
import { trackCourseView } from '@/lib/analytics'

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Legacy tags that don't require database lookup
const LEGACY_TAGS = ['business', 'restaurant', 'fleet']

type TabType = 'about' | 'learn' | 'curriculum' | 'information' | 'details'

function CourseDetailContent() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [isCourseDetail, setIsCourseDetail] = useState<boolean | null>(null)

  // Determine if slug is a UUID (course ID) or a tag
  useEffect(() => {
    if (!slug) return

    const isUUID = UUID_REGEX.test(slug)
    setIsCourseDetail(isUUID)

    if (isUUID) {
      // It's a course ID - fetch course detail
      fetchCourseDetail(slug)
    } else {
      // It's a tag - fetch landing page
      fetchLandingPage(slug)
    }
  }, [slug])

  const fetchCourseDetail = async (courseId: string) => {
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

  const fetchLandingPage = async (tag: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const normalizedTag = tag.toLowerCase()
      console.log(`🔍 === FETCHING LANDING PAGE FOR TAG: "${normalizedTag}" ===`)
      
      // Fetch landing page metadata
      const pageData = await getLandingPageByTag(normalizedTag)
      console.log(`📄 Landing page data:`, pageData)
      
      if (!pageData) {
        // Check if it's a legacy tag
        if (!LEGACY_TAGS.includes(normalizedTag)) {
          console.error(`❌ Landing page not found for tag: "${normalizedTag}"`)
          setError('Landing page not found')
          setIsLoading(false)
          return
        }
      } else if (!pageData.is_enabled) {
        console.warn(`⚠️ Landing page "${normalizedTag}" exists but is disabled`)
        if (!LEGACY_TAGS.includes(normalizedTag)) {
          setError('Landing page is disabled')
          setIsLoading(false)
          return
        }
      }

      // Fetch courses
      const tagForCourses = pageData?.tag || normalizedTag
      console.log(`📚 Fetching courses for tag: "${tagForCourses}"`)
      
      const [courses, featured] = await Promise.all([
        getCoursesByTag(tagForCourses),
        getFeaturedCourses(),
      ])
      
      console.log(`✅ Found ${courses.length} courses for tag "${tagForCourses}"`)
      
      const featuredForTag = featured.filter(c => 
        c.tags.includes(tagForCourses as CourseTag) || 
        c.tags.some(t => t.toLowerCase() === tagForCourses.toLowerCase())
      )
      
      // Store courses in a way that the landing page component can use
      // We'll render the landing page view
      setCourse(null) // Not a course detail page
      setIsLoading(false)
    } catch (err: any) {
      console.error('❌ Error fetching landing page:', err)
      setError('Failed to load landing page')
      setIsLoading(false)
    }
  }

  const scrollToSection = (sectionId: string, tabType: TabType) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setActiveTab(tabType)
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Render course detail page (UUID)
  if (isCourseDetail === true) {
    return <CourseDetailView 
      course={course} 
      isLoading={isLoading} 
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      scrollToSection={scrollToSection}
    />
  }

  // Render landing page (tag)
  if (isCourseDetail === false) {
    return <LandingPageView slug={slug} />
  }

  // Loading state
  return (
    <div className="mx-auto max-w-7xl py-16">
      <div className="text-center">Loading...</div>
    </div>
  )
}

// Landing page view component
function LandingPageView({ slug }: { slug: string }) {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [landingPage, setLandingPage] = useState<any>(null)
  const [currentTag, setCurrentTag] = useState<CourseTag | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setNotFoundError(false)
      
      try {
        const normalizedTag = slug.toLowerCase()
        console.log(`🔍 === FETCHING DATA FOR TAG: "${normalizedTag}" ===`)
        
        // Fetch landing page metadata
        const pageData = await getLandingPageByTag(normalizedTag)
        console.log(`📄 Landing page data:`, pageData)
        
        if (!pageData) {
          if (!LEGACY_TAGS.includes(normalizedTag)) {
            console.error(`❌ Landing page not found for tag: "${normalizedTag}"`)
            setNotFoundError(true)
            setIsLoading(false)
            return
          }
        } else if (!pageData.is_enabled) {
          if (!LEGACY_TAGS.includes(normalizedTag)) {
            setNotFoundError(true)
            setIsLoading(false)
            return
          }
        } else {
          console.log(`✅ Landing page found and enabled:`, pageData.name)
          setLandingPage(pageData)
        }

        // Fetch courses - use pageData.tag if available, otherwise use normalizedTag
        const tagForCourses = pageData?.tag || normalizedTag
        console.log(`📚 Fetching courses for tag: "${tagForCourses}"`)
        
        // Convert to proper CourseTag format (capitalized)
        const normalizedTagForCourses = tagForCourses.charAt(0).toUpperCase() + tagForCourses.slice(1).toLowerCase()
        const courseTag = (normalizedTagForCourses === 'Business' || normalizedTagForCourses === 'Restaurant' || normalizedTagForCourses === 'Fleet') 
          ? normalizedTagForCourses as CourseTag 
          : undefined
        
        const [courses, featured] = await Promise.all([
          getCoursesByTag(tagForCourses),
          getFeaturedCourses(),
        ])
        
        console.log(`✅ Found ${courses.length} courses for tag "${tagForCourses}"`)
        
        const featuredForTag = featured.filter(c => 
          c.tags.includes(tagForCourses as CourseTag) || 
          c.tags.some(t => t.toLowerCase() === tagForCourses.toLowerCase())
        )
        
        setAllCourses(courses)
        setFeaturedCourses(featuredForTag)
        setCurrentTag(courseTag)
      } catch (err: any) {
        console.error('❌ Error fetching courses:', err)
        setAllCourses([])
        setFeaturedCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const featuredTopPicks = useMemo(() => {
    return allCourses.slice(0, 3)
  }, [allCourses])

  // Get top course for banner (first course is top-ranked)
  const topCourse = useMemo(() => {
    const top = allCourses.length > 0 ? allCourses[0] : null
    console.log('🟢 LandingPageView topCourse:', {
      allCoursesCount: allCourses.length,
      topCourseTitle: top?.title,
      topCourseId: top?.id
    })
    return top
  }, [allCourses])

  if (notFoundError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-4">Landing page not found</p>
          <Link href="/courses" className="text-[#36498C] hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl py-16">
        <div className="text-center">Loading courses...</div>
      </div>
    )
  }

  if (allCourses.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ForbesHeroSection 
          tag={landingPage?.name || slug} 
          heroTitle={landingPage?.hero_title}
        />
        <FeaturedTopPicks courses={featuredTopPicks} />
        <div className="mx-auto max-w-7xl py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No courses found</h2>
            <p className="text-gray-600 mb-4">
              There are no {slug.toLowerCase()} courses available at the moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ paddingBottom: '100px' }}>
      {/* Scroll Banner - shows top program info */}
      <LandingPageScrollBanner topCourse={topCourse} />
      
      <ForbesHeroSection 
        tag={landingPage?.name || slug} 
        heroTitle={landingPage?.hero_title}
      />
      <FeaturedTopPicks courses={featuredTopPicks} />
      {allCourses.length > 0 && (
        <div className="bg-white pt-4 pb-12">
          <AllCoursesGrid courses={allCourses} tag={currentTag} />
        </div>
      )}
      <EmailCaptureCTA tag={slug} />
    </div>
  )
}

// Course detail view component (from original [id]/page.tsx)
function CourseDetailView({ 
  course, 
  isLoading, 
  error,
  activeTab,
  setActiveTab,
  scrollToSection
}: {
  course: Course | null
  isLoading: boolean
  error: string | null
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  scrollToSection: (sectionId: string, tabType: TabType) => void
}) {
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

  // Track course view when course is loaded
  useEffect(() => {
    if (course) {
      trackCourseView(
        course.id,
        course.title,
        course.tags[0], // Use first tag
        course.provider || undefined
      )
    }
  }, [course])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#F3F6FC', minHeight: '463px', paddingBottom: '0px', overflow: 'visible', position: 'relative' }}>
        <div className="mx-auto max-w-7xl py-16" style={{ paddingLeft: '0', paddingRight: '24px', overflow: 'visible', height: '537px' }}>
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

              {/* Instructor */}
              {course.instructors && (
                <p 
                  className="mb-8 text-gray-700"
                  style={{
                    fontSize: '16px',
                    fontFamily: '"Source Sans Pro", Arial, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Instructor: <span style={{ textDecoration: 'underline' }}>{course.instructors}</span>
                </p>
              )}

              {/* Sign Up Button */}
              <div className="mb-8">
                {course.external_url ? (
                  <a
                    href={course.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg text-center font-bold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0156D2] focus:ring-offset-2"
                    style={{ backgroundColor: '#0156D2', width: '285px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                  >
                    Enroll Now
                  </a>
                ) : course.signup_enabled ? (
                  <Link
                    href={`/signup/${course.id}`}
                    className="block rounded-lg text-center font-bold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0156D2] focus:ring-offset-2"
                    style={{ backgroundColor: '#0156D2', width: '285px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
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
          
          {/* Meta Info Card */}
          <div className="rounded-lg bg-white p-6 mb-0 relative z-10" style={{ marginLeft: '-24px', paddingLeft: '24px', marginRight: '-24px', paddingRight: '24px', marginBottom: '0', position: 'absolute', top: '478px', width: '1342px', height: '116px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.12)' }}>
            <div className="flex flex-wrap items-center divide-x divide-gray-200">
              {course.duration && (
                <div className="flex-1 min-w-[150px] px-4 first:pl-0">
                  <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>{course.duration}</div>
                  <div className="text-gray-500" style={{ fontSize: '14px' }}>Duration</div>
                </div>
              )}
              {course.level && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>{course.level}</div>
                  <div className="text-gray-500" style={{ fontSize: '14px' }}>Level</div>
                </div>
              )}
              {course.rating && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="flex items-center gap-1 font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>
                    <span className="text-blue-500">★</span>
                    {course.rating.toFixed(1)}
                  </div>
                  <div className="text-gray-500" style={{ fontSize: '14px' }}>
                    {course.reviews ? `(${course.reviews} reviews)` : 'Rating'}
                  </div>
                </div>
              )}
              {course.effort && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>{course.effort}</div>
                  <div className="text-gray-500" style={{ fontSize: '14px' }}>Effort</div>
                </div>
              )}
              {course.price_label && (
                <div className="flex-1 min-w-[150px] px-4">
                  <div className="font-bold text-gray-900 mb-1" style={{ fontSize: '20px' }}>{course.price_label}</div>
                  <div className="text-gray-500" style={{ fontSize: '14px' }}>Price</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white w-full relative" style={{ marginTop: '0', paddingTop: '24px', paddingBottom: '100px' }}>
        <div className="mx-auto max-w-7xl py-12" style={{ paddingLeft: '0', paddingRight: '24px' }}>
          <div className="grid grid-cols-1 gap-8">
            <div style={{ marginLeft: '-24px', paddingLeft: '24px' }}>
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200 bg-white pb-0" style={{ marginTop: '20px' }}>
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
                    What You&apos;ll Learn
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

            {/* All Content Sections */}
            <div className="space-y-8">
              {/* About Section */}
              <section id="section-about" className="scroll-mt-24">
                <h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontSize: '20px' }}>
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
                  <h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontSize: '20px' }}>
                    What You&apos;ll Learn
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
                  <h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontSize: '20px' }}>
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
                  <h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontSize: '20px' }}>
                    Course Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {course.instructors && (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="flex-1">
                          <div className="mb-1 text-sm font-semibold text-gray-600">Instructors</div>
                          <div className="text-gray-900">{course.instructors}</div>
                        </div>
                      </div>
                    )}
                    {course.effort && (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <div className="mb-1 text-sm font-semibold text-gray-600">Effort Required</div>
                          <div className="text-gray-900">{course.effort}</div>
                        </div>
                      </div>
                    )}
                    {course.languages && (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <div className="flex-1">
                          <div className="mb-1 text-sm font-semibold text-gray-600">Languages</div>
                          <div className="text-gray-900">{course.languages}</div>
                        </div>
                      </div>
                    )}
                    {course.free_trial && (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <div className="mb-1 text-sm font-semibold text-gray-600">Free Trial</div>
                          <div className="text-gray-900">{course.free_trial}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Details Section */}
              <section id="section-details" className="scroll-mt-24">
                <h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontSize: '20px' }}>
                  Course Details
                </h2>
                {course.price_label && (
                  <div className="mb-8 text-center">
                    <div className="mb-2 text-sm font-medium text-gray-600">Price</div>
                    <div className="text-4xl font-bold text-[#36498C]">
                      {course.price_label}
                    </div>
                  </div>
                )}
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

export default function CoursesSlugPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl py-16">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <CourseDetailContent />
    </Suspense>
  )
}
