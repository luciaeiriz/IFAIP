'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PrivacyPage() {
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
      <section className="relative privacy-hero-section" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/privacy_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="mx-auto max-w-7xl flex flex-col justify-end privacy-hero-container" style={{ height: '562px', paddingBottom: '40px', paddingLeft: '0px', paddingRight: '72px' }}>
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-5 lg:mb-6 privacy-breadcrumb" style={{ marginTop: '200px' }}>
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 transition-colors text-xs sm:text-sm lg:text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Separator Line */}
          <div className="bg-gray-900 mb-6 sm:mb-7 lg:mb-8 privacy-separator" style={{ width: '100%', height: '5px' }}></div>
          
          {/* Main Heading */}
          <h1 
            className="mb-4 sm:mb-5 lg:mb-6 leading-tight text-gray-900 privacy-hero-title"
            style={{ 
              fontSize: '55px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
              fontWeight: 400
            }}
          >
            Privacy Policy
          </h1>
          
          {/* Description */}
          <p 
            className="mb-6 sm:mb-7 lg:mb-8 leading-relaxed text-gray-700 privacy-hero-description"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('introduction')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900 privacy-hero-button"
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
      <section className="bg-white privacy-content-section">
        <div className="mx-auto max-w-7xl privacy-content-container" style={{ paddingLeft: '0px', paddingRight: '72px', paddingTop: '40px', paddingBottom: '96px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 lg:space-y-16 privacy-main-content">
              {/* Introduction Section */}
              <section id="introduction" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px', marginTop: '-10px' }}>Introduction</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p>
                      The International Federation for Artificial Intelligence Professionals ("IFAIP", "we", 
                      "us", or "our") is committed to protecting your privacy. This Privacy Policy explains 
                      how we collect, use, disclose, and safeguard your information when you visit our website 
                      and use our services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Information We Collect Section */}
              <section id="information-collect" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>1. Information We Collect</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Personal Information</h3>
                    <p>
                      We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Name and contact information (email address, phone number)</li>
                      <li>Account credentials and profile information</li>
                      <li>Course enrollment and progress data</li>
                      <li>Payment information (processed securely through third-party providers)</li>
                      <li>Communication preferences and feedback</li>
                      <li>Role and professional information (when provided)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Automatically Collected Information</h3>
                    <p>
                      When you visit our website, we automatically collect certain information, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>IP address and location data</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Pages visited and time spent on pages</li>
                      <li>Referring website addresses</li>
                      <li>UTM parameters and tracking data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information Section */}
              <section id="how-we-use" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>2. How We Use Your Information</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process your course enrollments and payments</li>
                      <li>Send you course updates, educational content, and recommendations</li>
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Analyze usage patterns to improve our platform and user experience</li>
                      <li>Send administrative information, such as updates to our terms and policies</li>
                      <li>Detect, prevent, and address technical issues and security threats</li>
                      <li>Comply with legal obligations and enforce our terms</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing Section */}
              <section id="information-sharing" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>3. Information Sharing and Disclosure</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      We do not sell, trade, or rent your personal information to third parties. We may share 
                      your information only in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>With Your Consent:</strong> We may share your information with your explicit 
                        consent or at your direction.
                      </li>
                      <li>
                        <strong>Service Providers:</strong> We may share information with third-party service 
                        providers who assist in operating our platform, such as payment processors, email 
                        service providers, and analytics services.
                      </li>
                      <li>
                        <strong>Course Providers:</strong> When you enroll in a course, we may share relevant 
                        information with the course provider to facilitate your enrollment and access.
                      </li>
                      <li>
                        <strong>Legal Requirements:</strong> We may disclose information if required by law, 
                        court order, or government regulation, or to protect our rights and safety.
                      </li>
                      <li>
                        <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of 
                        assets, your information may be transferred as part of that transaction.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Cookie Policy Section */}
              <section id="cookie-policy" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>4. Cookie Policy</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      We use cookies and similar tracking technologies to track activity on our platform and 
                      hold certain information. Cookies are files with a small amount of data that may include 
                      an anonymous unique identifier.
                    </p>
                    <p>
                      <strong>Types of Cookies We Use:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Essential Cookies:</strong> Required for the platform to function properly
                      </li>
                      <li>
                        <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our 
                        website
                      </li>
                      <li>
                        <strong>Preference Cookies:</strong> Remember your settings and preferences
                      </li>
                      <li>
                        <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track 
                        campaign effectiveness
                      </li>
                    </ul>
                    <p>
                      You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
                      sent. However, if you do not accept cookies, you may not be able to use some portions of 
                      our platform.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security Section */}
              <section id="data-security" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>5. Data Security</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal 
                      information against unauthorized access, alteration, disclosure, or destruction. However, 
                      no method of transmission over the Internet or electronic storage is 100% secure. While 
                      we strive to use commercially acceptable means to protect your information, we cannot 
                      guarantee absolute security.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Rights Section */}
              <section id="user-rights" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>6. Your Rights and Choices</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      Depending on your location, you may have certain rights regarding your personal information, 
                      including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Access:</strong> Request access to your personal information and receive a copy 
                        of the data we hold about you
                      </li>
                      <li>
                        <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                      </li>
                      <li>
                        <strong>Deletion:</strong> Request deletion of your personal information, subject to 
                        certain legal and operational limitations
                      </li>
                      <li>
                        <strong>Objection:</strong> Object to processing of your personal information for certain 
                        purposes
                      </li>
                      <li>
                        <strong>Restriction:</strong> Request restriction of processing in certain circumstances
                      </li>
                      <li>
                        <strong>Portability:</strong> Request transfer of your data to another service provider
                      </li>
                      <li>
                        <strong>Opt-Out:</strong> Opt-out of marketing communications at any time
                      </li>
                    </ul>
                    <p>
                      To exercise these rights, please contact us using the information provided in the Contact 
                      Information section below.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Retention Section */}
              <section id="data-retention" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>7. Data Retention</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      We retain your personal information for as long as necessary to fulfill the purposes 
                      outlined in this Privacy Policy, unless a longer retention period is required or permitted 
                      by law. When we no longer need your information, we will securely delete or anonymize it.
                    </p>
                  </div>
                </div>
              </section>

              {/* Children's Privacy Section */}
              <section id="children-privacy" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>8. Children's Privacy</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      Our services are not intended for individuals under the age of 18. We do not knowingly 
                      collect personal information from children. If you believe we have collected information 
                      from a child, please contact us immediately, and we will take steps to delete such 
                      information.
                    </p>
                  </div>
                </div>
              </section>

              {/* International Data Transfers Section */}
              <section id="international-transfers" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>9. International Data Transfers</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      Your information may be transferred to and processed in countries other than your country 
                      of residence. These countries may have data protection laws that differ from those in your 
                      country. We take appropriate safeguards to ensure your information receives adequate 
                      protection.
                    </p>
                  </div>
                </div>
              </section>

              {/* Changes to Privacy Policy Section */}
              <section id="changes-policy" className="scroll-mt-24 privacy-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 privacy-section-title" style={{ fontSize: '32px' }}>10. Changes to This Privacy Policy</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed privacy-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      We may update this Privacy Policy from time to time. We will notify you of any changes by 
                      posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
                      advised to review this Privacy Policy periodically for any changes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section id="contact" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>11. Contact Information</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
                      practices, please contact us:
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg mt-4">
                      <p className="mb-2">
                        <strong>Email:</strong> privacy@ifaip.org
                      </p>
                      <p className="mb-2">
                        <strong>Website:</strong> Contact form available on our website
                      </p>
                      <p>
                        <strong>Address:</strong> International Federation for Artificial Intelligence Professionals
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Jump to Navigation */}
            <div className="lg:col-span-1 flex justify-start lg:justify-end privacy-sidebar">
              {/* Dropdown for Mobile/Tablet */}
              <div className="w-full lg:hidden privacy-dropdown-container mb-6">
                <label htmlFor="privacy-jump-to-select" className="block text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Jump to
                </label>
                <select
                  id="privacy-jump-to-select"
                  value={activeSection || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToSection(e.target.value)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent privacy-dropdown-select"
                  style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                >
                  <option value="">Select a section...</option>
                  <option value="introduction">Introduction</option>
                  <option value="information-collect">Information We Collect</option>
                  <option value="how-we-use">How We Use Your Information</option>
                  <option value="information-sharing">Information Sharing</option>
                  <option value="cookie-policy">Cookie Policy</option>
                  <option value="data-security">Data Security</option>
                  <option value="user-rights">Your Rights and Choices</option>
                  <option value="data-retention">Data Retention</option>
                  <option value="children-privacy">Children's Privacy</option>
                  <option value="international-transfers">International Data Transfers</option>
                  <option value="changes-policy">Changes to Privacy Policy</option>
                  <option value="contact">Contact Information</option>
                </select>
              </div>

              {/* Sidebar for Desktop */}
              <div className="hidden lg:block sticky top-24 privacy-sidebar-content" style={{ width: '317px', height: '450px', marginRight: '-72px' }}>
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
                    onClick={() => scrollToSection('information-collect')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Information We Collect
                  </button>
                  <button
                    onClick={() => scrollToSection('how-we-use')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    How We Use Your Information
                  </button>
                  <button
                    onClick={() => scrollToSection('information-sharing')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Information Sharing
                  </button>
                  <button
                    onClick={() => scrollToSection('cookie-policy')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Cookie Policy
                  </button>
                  <button
                    onClick={() => scrollToSection('data-security')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Data Security
                  </button>
                  <button
                    onClick={() => scrollToSection('user-rights')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Your Rights and Choices
                  </button>
                  <button
                    onClick={() => scrollToSection('data-retention')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Data Retention
                  </button>
                  <button
                    onClick={() => scrollToSection('children-privacy')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Children's Privacy
                  </button>
                  <button
                    onClick={() => scrollToSection('international-transfers')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    International Data Transfers
                  </button>
                  <button
                    onClick={() => scrollToSection('changes-policy')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Changes to Privacy Policy
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
