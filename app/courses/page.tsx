'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCoursesByTag } from '@/src/data/courses'
import { CourseTag } from '@/types/course'

interface CategoryInfo {
  name: string
  tag: CourseTag
  href: string
  description: string
  subtitle: string
  bgColor: string
}

const categories: CategoryInfo[] = [
  {
    name: 'Business',
    tag: 'Business',
    href: '/courses/business',
    description: 'AI certification programs designed for business owners and entrepreneurs looking to leverage artificial intelligence to grow their business.',
    subtitle: 'at IFAIP',
    bgColor: '#2563eb', // Blue
  },
  {
    name: 'Restaurant',
    tag: 'Restaurant',
    href: '/courses/restaurant',
    description: 'Specialized AI training for restaurant owners to optimize operations, improve customer experience, and increase profitability.',
    subtitle: 'at IFAIP',
    bgColor: '#16a34a', // Green
  },
  {
    name: 'Fleet',
    tag: 'Fleet',
    href: '/courses/fleet',
    description: 'AI certification courses tailored for fleet managers to enhance logistics, reduce costs, and improve operational efficiency.',
    subtitle: 'at IFAIP',
    bgColor: '#9333ea', // Purple
  },
]

export default function CoursesPage() {
  const [courseCounts, setCourseCounts] = useState<Record<CourseTag, number>>({
    Business: 0,
    Restaurant: 0,
    Fleet: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourseCounts = async () => {
      setIsLoading(true)
      try {
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
      } catch (error) {
        console.error('Error fetching course counts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseCounts()
  }, [])

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

      {/* Three Color-Coded Cards Section */}
      <section id="courses" className="relative flex items-start" style={{ backgroundColor: '#1C1C1C', height: '150vh', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)', paddingTop: '100px' }}>
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
              Discover specialized AI training programs designed for business owners, restaurant operators, and fleet managers.
            </p>
          </div>
          
          {/* Cards */}
          <div className="flex flex-nowrap justify-center" style={{ gap: '16px' }}>
            {categories.map((category) => {
              const courseCount = courseCounts[category.tag]
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{ 
                    backgroundColor: category.bgColor,
                    width: '428px',
                    height: '322px'
                  }}
                >
                  <div className="p-8 h-full flex flex-col text-white">
                    {/* Subtitle */}
                    <div className="mb-4">
                      <span 
                        className="text-sm uppercase tracking-wider"
                        style={{ 
                          fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                          opacity: 0.9
                        }}
                      >
                        {category.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 
                      className="text-3xl font-bold mb-4"
                      style={{ 
                        fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                        fontWeight: 700,
                        lineHeight: '1.2',
                      }}
                    >
                      {category.name}
                    </h2>

                    {/* Description */}
                    <p 
                      className="text-base mb-6 leading-relaxed flex-grow"
                      style={{ 
                        fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                        opacity: 0.95,
                        lineHeight: '1.6'
                      }}
                    >
                      {category.description}
                    </p>

                    {/* Course Count */}
                    {!isLoading && courseCount > 0 && (
                      <div className="mb-6 text-sm opacity-90">
                        {courseCount} {courseCount === 1 ? 'course' : 'courses'} available
                      </div>
                    )}

                    {/* Learn More Button */}
                    <div className="mt-auto">
                      <div 
                        className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-sm font-semibold rounded transition-all duration-300 group-hover:bg-gray-100"
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
