'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light Background */}
      <section className="relative about-hero-section" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/about_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="mx-auto max-w-7xl flex flex-col justify-end about-hero-container px-4 sm:px-6 md:px-8 lg:px-0 lg:pr-[72px] pb-8 sm:pb-10 md:pb-10 lg:pb-10" style={{ minHeight: '400px', paddingTop: '120px' }}>
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-6 lg:mb-6">
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 transition-colors text-xs sm:text-sm lg:text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Separator Line */}
          <div className="bg-gray-900 mb-6 sm:mb-8 lg:mb-8" style={{ width: '100%', height: '5px' }}></div>
          
          {/* Main Heading */}
          <h1 
            className="mb-4 sm:mb-6 lg:mb-6 leading-tight text-gray-900"
            style={{ 
              fontSize: 'clamp(28px, 6vw, 55px)',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
              fontWeight: 400
            }}
          >
            About us
          </h1>
          
          {/* Description */}
          <p 
            className="mb-6 sm:mb-8 lg:mb-8 leading-relaxed text-gray-700"
            style={{ 
              fontSize: 'clamp(16px, 3.5vw, 25px)',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Building the skills, standards, and certifications needed to help professionals and organisations thrive in the future of artificial intelligence.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('introduction')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm sm:text-base font-semibold hover:bg-gray-800 transition-colors border border-gray-900 w-full sm:w-auto lg:w-[156px] h-10 sm:h-12 lg:h-12"
          >
            Learn more
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m0 0l-6-6m6 6l6-6"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Content Section - Two Column Layout */}
      <section className="bg-white about-content-section">
        <div className="mx-auto max-w-7xl about-content-container px-4 sm:px-6 md:px-8 lg:px-0 lg:pr-[72px] pt-8 sm:pt-10 md:pt-10 lg:pt-10 pb-16 sm:pb-20 md:pb-24 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
              {/* Introduction Section */}
              <section id="introduction" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 32px)', marginTop: '-10px' }}>Introduction</h2>
                    <div className="space-y-3 sm:space-y-4 lg:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base lg:text-base">
                      <p>
                        The International Federation for Artificial Intelligence Professionals (IFAIP) is dedicated 
                        to advancing AI education and professional development worldwide. Our mission is to empower 
                        individuals and organizations with the knowledge, skills, and certifications needed to thrive 
                        in the rapidly evolving field of artificial intelligence.
                      </p>
                      <p>
                        We believe that AI literacy is essential for success in the modern world, and we're committed 
                        to making world-class education accessible to everyone, regardless of their background or 
                        prior experience.
                      </p>
                    </div>
                </div>
              </section>

              {/* What We Do Section */}
              <section id="what-we-do" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>What We Do</h2>
                    <div className="space-y-5 sm:space-y-6 lg:space-y-6 text-gray-700 text-sm sm:text-base lg:text-base">
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900 mb-2">Curated Course Selection</h3>
                        <p className="leading-relaxed text-sm sm:text-base lg:text-base">
                          We carefully curate and review AI training courses from leading providers worldwide, 
                          ensuring that our platform features only the highest-quality educational content. Our 
                          team of experts evaluates each course for relevance, quality, and practical value.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900 mb-2">Professional Certification</h3>
                        <p className="leading-relaxed text-sm sm:text-base lg:text-base">
                          IFAIP offers industry-recognized certifications that validate your AI expertise and 
                          enhance your professional credentials. Our certification programs are designed in 
                          collaboration with industry leaders and academic institutions.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900 mb-2">Community Building</h3>
                        <p className="leading-relaxed text-sm sm:text-base lg:text-base">
                          We foster a global community of AI professionals, providing networking opportunities, 
                          knowledge sharing platforms, and collaborative learning environments. Connect with 
                          peers, mentors, and industry experts from around the world.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-900 mb-2">Industry Partnerships</h3>
                        <p className="leading-relaxed text-sm sm:text-base lg:text-base">
                          IFAIP collaborates with leading technology companies, educational institutions, and 
                          industry organizations to ensure our programs align with current market needs and 
                          emerging trends in artificial intelligence.
                        </p>
                      </div>
                    </div>
                </div>
              </section>

              {/* Our Approach Section */}
              <section id="our-approach" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>Our Approach</h2>
                    <div className="space-y-3 sm:space-y-4 lg:space-y-4 text-gray-700 text-sm sm:text-base lg:text-base">
                      <p className="leading-relaxed">
                        At IFAIP, we take a comprehensive and practical approach to AI education:
                      </p>
                      <ul className="list-disc list-inside space-y-2 sm:space-y-3 lg:space-y-3 ml-2 sm:ml-4 lg:ml-4">
                        <li className="leading-relaxed">
                          <strong>Practical Focus:</strong> We emphasize hands-on learning and real-world 
                          applications over theoretical concepts alone.
                        </li>
                        <li className="leading-relaxed">
                          <strong>Industry Relevance:</strong> Our curriculum is continuously updated to reflect 
                          the latest developments and best practices in AI.
                        </li>
                        <li className="leading-relaxed">
                          <strong>Accessibility:</strong> We believe quality AI education should be accessible 
                          to everyone, regardless of their technical background or geographic location.
                        </li>
                        <li className="leading-relaxed">
                          <strong>Flexibility:</strong> Our programs accommodate different learning styles and 
                          schedules, offering both self-paced and instructor-led options.
                        </li>
                        <li className="leading-relaxed">
                          <strong>Continuous Support:</strong> We provide ongoing support and resources to help 
                          learners succeed throughout their AI journey.
                        </li>
                      </ul>
                    </div>
                </div>
              </section>

              {/* Our Organization Section */}
              <section id="our-organization" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>Who we are</h2>
                    <div className="space-y-3 sm:space-y-4 lg:space-y-4 text-gray-700 text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed">
                      <p>
                        IFAIP was founded with the vision of creating a global standard for AI professional 
                        development. We are an independent, non-profit organization dedicated to advancing the 
                        field of artificial intelligence through education and professional development.
                      </p>
                      <p>
                        Our team consists of experienced AI professionals, educators, and industry experts who 
                        are passionate about making AI education accessible and effective. We work with a 
                        diverse network of instructors, course providers, and industry partners to deliver 
                        comprehensive learning experiences.
                      </p>
                      <p>
                        As a trusted platform for AI education, we are committed to maintaining the highest 
                        standards of quality, integrity, and transparency in everything we do.
                      </p>
                    </div>
                </div>
              </section>

              {/* Get Involved Section */}
              <section id="get-involved" className="scroll-mt-24">
                <div className="p-6 sm:p-8 md:p-8 lg:p-8 bg-gray-50 border border-gray-200">
                  <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-4">Get Involved</h2>
                  <p className="text-gray-700 mb-5 sm:mb-6 lg:mb-6 leading-relaxed text-sm sm:text-base lg:text-base">
                    Whether you're looking to advance your career, train your team, or become an instructor, 
                    IFAIP has opportunities for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-4">
                    <Link
                      href="/courses"
                      className="inline-block rounded-md bg-[#36498C] px-5 py-2.5 sm:px-6 sm:py-3 lg:px-6 lg:py-3 text-sm sm:text-base lg:text-base font-semibold text-white hover:bg-[#36498C]/90 text-center transition-colors"
                    >
                      Browse Courses
                    </Link>
                    <Link
                      href="/membership"
                      className="inline-block rounded-md border-2 border-gray-300 bg-white px-5 py-2.5 sm:px-6 sm:py-3 lg:px-6 lg:py-3 text-sm sm:text-base lg:text-base font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      Learn About Membership
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Jump to Navigation */}
            <div className="lg:col-span-1 flex justify-start lg:justify-end about-sidebar">
              {/* Dropdown for Mobile/Tablet */}
              <div className="w-full lg:hidden about-dropdown-container mb-6">
                <label htmlFor="about-jump-to-select" className="block text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Jump to
                </label>
                <select
                  id="about-jump-to-select"
                  value={activeSection || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToSection(e.target.value)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent about-dropdown-select"
                  style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                >
                  <option value="">Select a section...</option>
                  <option value="introduction">Introduction</option>
                  <option value="what-we-do">What We Do</option>
                  <option value="our-approach">Our Approach</option>
                  <option value="our-organization">Who we are</option>
                  <option value="get-involved">Get Involved</option>
                </select>
              </div>

              {/* Sidebar for Desktop */}
              <div className="hidden lg:block sticky top-24 about-sidebar-content" style={{ width: '317px', height: '450px', marginRight: '-72px' }}>
                {/* Thick black line above title */}
                <div className="bg-gray-900 mb-4" style={{ width: '100%', height: '4px' }}></div>
                <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'sans-serif' }}>Jump to</h3>
                {/* Light divider below title */}
                <div className="bg-gray-200 mb-6" style={{ width: '100%', height: '1px' }}></div>
                <nav className="space-y-0">
                  <button
                    onClick={() => scrollToSection('introduction')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Introduction
                  </button>
                  <button
                    onClick={() => scrollToSection('what-we-do')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    What We Do
                  </button>
                  <button
                    onClick={() => scrollToSection('our-approach')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Our Approach
                  </button>
                  <button
                    onClick={() => scrollToSection('our-organization')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Who we are
                  </button>
                  <button
                    onClick={() => scrollToSection('get-involved')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Get Involved
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
