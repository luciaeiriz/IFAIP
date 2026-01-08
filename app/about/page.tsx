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
      <section className="relative" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/about_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="mx-auto max-w-7xl flex flex-col justify-end" style={{ height: '562px', paddingBottom: '40px', paddingLeft: '0px', paddingRight: '72px' }}>
          {/* Breadcrumb */}
          <div className="mb-6" style={{ marginTop: '200px' }}>
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 transition-colors text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Separator Line */}
          <div className="bg-gray-900 mb-8" style={{ width: '100%', height: '5px' }}></div>
          
          {/* Main Heading */}
          <h1 
            className="mb-6 leading-tight text-gray-900"
            style={{ 
              fontSize: '55px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
              fontWeight: 400
            }}
          >
            About us
          </h1>
          
          {/* Description */}
          <p 
            className="mb-8 leading-relaxed text-gray-700"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Building the skills, standards, and certifications needed to help professionals and organisations thrive in the future of artificial intelligence.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('introduction')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900"
            style={{ width: '156px', height: '48px' }}
          >
            Learn more
            <svg
              className="w-5 h-5"
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl" style={{ paddingLeft: '0px', paddingRight: '72px', paddingTop: '40px', paddingBottom: '96px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Introduction Section */}
              <section id="introduction" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px', marginTop: '-10px' }}>Introduction</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
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
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>What We Do</h2>
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Course Selection</h3>
                        <p className="leading-relaxed">
                          We carefully curate and review AI training courses from leading providers worldwide, 
                          ensuring that our platform features only the highest-quality educational content. Our 
                          team of experts evaluates each course for relevance, quality, and practical value.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Certification</h3>
                        <p className="leading-relaxed">
                          IFAIP offers industry-recognized certifications that validate your AI expertise and 
                          enhance your professional credentials. Our certification programs are designed in 
                          collaboration with industry leaders and academic institutions.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Building</h3>
                        <p className="leading-relaxed">
                          We foster a global community of AI professionals, providing networking opportunities, 
                          knowledge sharing platforms, and collaborative learning environments. Connect with 
                          peers, mentors, and industry experts from around the world.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Partnerships</h3>
                        <p className="leading-relaxed">
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
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>Our Approach</h2>
                    <div className="space-y-4 text-gray-700">
                      <p className="leading-relaxed">
                        At IFAIP, we take a comprehensive and practical approach to AI education:
                      </p>
                      <ul className="list-disc list-inside space-y-3 ml-4">
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
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>Who we are</h2>
                    <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
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
                <div className="p-8 bg-gray-50 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Whether you're looking to advance your career, train your team, or become an instructor, 
                    IFAIP has opportunities for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/courses"
                      className="inline-block rounded-md bg-[#36498C] px-6 py-3 text-base font-semibold text-white hover:bg-[#36498C]/90 text-center transition-colors"
                    >
                      Browse Courses
                    </Link>
                    <Link
                      href="/membership"
                      className="inline-block rounded-md border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      Learn About Membership
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Jump to Navigation */}
            <div className="lg:col-span-1 flex justify-end">
              <div className="sticky top-24" style={{ width: '317px', height: '450px', marginRight: '-72px' }}>
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
