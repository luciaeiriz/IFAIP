'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TermsPage() {
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
      <section className="relative terms-hero-section" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/terms_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="mx-auto max-w-7xl flex flex-col justify-end terms-hero-container" style={{ height: '562px', paddingBottom: '40px', paddingLeft: '0px', paddingRight: '72px' }}>
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-5 lg:mb-6 terms-breadcrumb" style={{ marginTop: '200px' }}>
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 transition-colors text-xs sm:text-sm lg:text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Separator Line */}
          <div className="bg-gray-900 mb-6 sm:mb-7 lg:mb-8 terms-separator" style={{ width: '100%', height: '5px' }}></div>
          
          {/* Main Heading */}
          <h1 
            className="mb-4 sm:mb-5 lg:mb-6 leading-tight text-gray-900 terms-hero-title"
            style={{ 
              fontSize: '55px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
              fontWeight: 400
            }}
          >
            Terms of Service
          </h1>
          
          {/* Description */}
          <p 
            className="mb-6 sm:mb-7 lg:mb-8 leading-relaxed text-gray-700 terms-hero-description"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Please read these terms carefully before using our platform. By accessing or using IFAIP, you agree to be bound by these Terms of Service.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('introduction')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900 terms-hero-button"
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
      <section className="bg-white terms-content-section">
        <div className="mx-auto max-w-7xl terms-content-container" style={{ paddingLeft: '0px', paddingRight: '72px', paddingTop: '40px', paddingBottom: '96px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 lg:space-y-16 terms-main-content">
              {/* Introduction Section */}
              <section id="introduction" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px', marginTop: '-10px' }}>Introduction</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p>
                      Welcome to the International Federation for Artificial Intelligence Professionals (IFAIP). 
                      These Terms of Service ("Terms") govern your access to and use of our website, services, 
                      and platform. By accessing or using IFAIP, you agree to be bound by these Terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* Acceptance of Terms Section */}
              <section id="acceptance" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>1. Acceptance of Terms</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      By accessing and using the IFAIP platform, you accept and agree to be bound by the terms 
                      and provision of this agreement. If you do not agree to abide by the above, please do not 
                      use this service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Use License Section */}
              <section id="use-license" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>2. Use License</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      Permission is granted to temporarily access the materials on IFAIP's website for personal, 
                      non-commercial transitory viewing only. This is the grant of a license, not a transfer of 
                      title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or for any public display</li>
                      <li>Attempt to reverse engineer any software contained on the website</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Course Enrollment Section */}
              <section id="course-enrollment" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>3. Course Enrollment</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      When you enroll in a course through IFAIP, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and complete information during registration</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Comply with all course requirements and guidelines</li>
                      <li>Respect intellectual property rights of course providers and instructors</li>
                      <li>Use course materials solely for personal educational purposes</li>
                    </ul>
                    <p>
                      Course access is granted based on successful enrollment and payment (if applicable). 
                      IFAIP reserves the right to revoke access for violations of these Terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Responsibilities Section */}
              <section id="user-responsibilities" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>4. User Responsibilities</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      As a user of IFAIP, you are responsible for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Maintaining the confidentiality of your account information</li>
                      <li>All activities that occur under your account</li>
                      <li>Ensuring that your use of the platform complies with all applicable laws</li>
                      <li>Not using the platform for any unlawful or prohibited purpose</li>
                      <li>Not interfering with or disrupting the platform or servers</li>
                      <li>Not attempting to gain unauthorized access to any part of the platform</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Intellectual Property Section */}
              <section id="intellectual-property" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>5. Intellectual Property</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      All course materials, content, and resources available through IFAIP are the property of 
                      IFAIP, its content providers, or course instructors and are protected by copyright and 
                      other intellectual property laws. You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Reproduce, distribute, or create derivative works from course materials</li>
                      <li>Share your course access credentials with others</li>
                      <li>Record, stream, or redistribute course content</li>
                      <li>Use course materials for commercial purposes without authorization</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Disclaimers Section */}
              <section id="disclaimers" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>6. Disclaimers</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      <strong>No Warranty:</strong> The materials on IFAIP's website are provided on an 'as is' 
                      basis. IFAIP makes no warranties, expressed or implied, and hereby disclaims and negates 
                      all other warranties including, without limitation, implied warranties or conditions of 
                      merchantability, fitness for a particular purpose, or non-infringement of intellectual 
                      property or other violation of rights.
                    </p>
                    <p>
                      <strong>Course Quality:</strong> While we strive to curate high-quality courses, IFAIP 
                      does not guarantee the accuracy, completeness, or usefulness of any course content. Course 
                      quality and outcomes may vary.
                    </p>
                    <p>
                      <strong>Third-Party Content:</strong> IFAIP may link to external websites or include 
                      content from third parties. We are not responsible for the content, privacy practices, 
                      or terms of service of external sites.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability Section */}
              <section id="limitation-liability" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>7. Limitation of Liability</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      In no event shall IFAIP or its suppliers be liable for any damages (including, without 
                      limitation, damages for loss of data or profit, or due to business interruption) arising 
                      out of the use or inability to use the materials on IFAIP's website, even if IFAIP or an 
                      authorized representative has been notified orally or in writing of the possibility of 
                      such damage.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund Policy Section */}
              <section id="refund-policy" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>8. Refund Policy</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      Refund policies vary by course provider. Please review the specific refund policy for 
                      each course before enrollment. IFAIP facilitates course enrollment but does not control 
                      individual course refund policies. For refund requests, please contact the course provider 
                      directly or reach out to our support team.
                    </p>
                  </div>
                </div>
              </section>

              {/* Changes to Terms Section */}
              <section id="changes-terms" className="scroll-mt-24 terms-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 terms-section-title" style={{ fontSize: '32px' }}>9. Changes to Terms</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed terms-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      IFAIP may revise these Terms of Service at any time without notice. By using this website, 
                      you are agreeing to be bound by the then current version of these Terms of Service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section id="contact" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>10. Contact Information</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      If you have any questions about these Terms of Service, please contact us through our 
                      website or email us at support@ifaip.org.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Jump to Navigation */}
            <div className="lg:col-span-1 flex justify-start lg:justify-end terms-sidebar">
              {/* Dropdown for Mobile/Tablet */}
              <div className="w-full lg:hidden terms-dropdown-container mb-6">
                <label htmlFor="jump-to-select" className="block text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Jump to
                </label>
                <select
                  id="jump-to-select"
                  value={activeSection || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToSection(e.target.value)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent terms-dropdown-select"
                  style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                >
                  <option value="">Select a section...</option>
                  <option value="introduction">Introduction</option>
                  <option value="acceptance">Acceptance of Terms</option>
                  <option value="use-license">Use License</option>
                  <option value="course-enrollment">Course Enrollment</option>
                  <option value="user-responsibilities">User Responsibilities</option>
                  <option value="intellectual-property">Intellectual Property</option>
                  <option value="disclaimers">Disclaimers</option>
                  <option value="limitation-liability">Limitation of Liability</option>
                  <option value="refund-policy">Refund Policy</option>
                  <option value="changes-terms">Changes to Terms</option>
                  <option value="contact">Contact Information</option>
                </select>
              </div>

              {/* Sidebar for Desktop */}
              <div className="hidden lg:block sticky top-24 terms-sidebar-content" style={{ width: '317px', height: '450px', marginRight: '-72px' }}>
                {/* Thick black line above title */}
                <div className="bg-gray-900 mb-4" style={{ width: '100%', height: '4px' }}></div>
                <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'sans-serif' }}>Jump to</h3>
                {/* Light divider below title */}
                <div className="bg-gray-200 mb-6" style={{ width: '100%', height: '1px' }}></div>
                <nav className="space-y-0 terms-sidebar-nav">
                  <button
                    onClick={() => scrollToSection('introduction')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Introduction
                  </button>
                  <button
                    onClick={() => scrollToSection('acceptance')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Acceptance of Terms
                  </button>
                  <button
                    onClick={() => scrollToSection('use-license')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Use License
                  </button>
                  <button
                    onClick={() => scrollToSection('course-enrollment')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Course Enrollment
                  </button>
                  <button
                    onClick={() => scrollToSection('user-responsibilities')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    User Responsibilities
                  </button>
                  <button
                    onClick={() => scrollToSection('intellectual-property')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Intellectual Property
                  </button>
                  <button
                    onClick={() => scrollToSection('disclaimers')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Disclaimers
                  </button>
                  <button
                    onClick={() => scrollToSection('limitation-liability')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Limitation of Liability
                  </button>
                  <button
                    onClick={() => scrollToSection('refund-policy')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Refund Policy
                  </button>
                  <button
                    onClick={() => scrollToSection('changes-terms')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Changes to Terms
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Contact Information
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
