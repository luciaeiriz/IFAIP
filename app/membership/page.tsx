'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MembershipPage() {
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
      <section className="relative" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/membership_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
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
            Membership
          </h1>
          
          {/* Description */}
          <p 
            className="mb-8 leading-relaxed text-gray-700"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Join IFAIP and unlock exclusive benefits, access to premium courses, and connect with a global community of AI professionals.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('benefits')}
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
              {/* Benefits Section */}
              <section id="benefits" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px', marginTop: '-10px' }}>Membership Benefits</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                      <ul className="list-disc list-inside space-y-3 ml-4">
                        <li className="leading-relaxed">Access to exclusive member-only courses</li>
                        <li className="leading-relaxed">Discounts on all training programs</li>
                        <li className="leading-relaxed">Networking opportunities with industry leaders</li>
                        <li className="leading-relaxed">Early access to new course releases</li>
                        <li className="leading-relaxed">Professional certification programs</li>
                        <li className="leading-relaxed">Monthly webinars and workshops</li>
                      </ul>
                    </div>
                </div>
              </section>

              {/* Join Today Section */}
              <section id="join-today" className="scroll-mt-24">
                <div>
                    <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                    <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>Join Today</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed mb-6" style={{ fontSize: '16px' }}>
                      <p>
                        Become a member and take your AI career to the next level. Membership details and pricing information coming soon.
                      </p>
                      <p>
                        As an IFAIP member, you'll gain access to a comprehensive suite of resources designed to accelerate your professional growth in artificial intelligence. Our membership program is tailored for individuals and organizations committed to staying at the forefront of AI innovation.
                      </p>
                    </div>
                    <Link
                      href="/membership/join"
                      className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900"
                      style={{ width: '156px', height: '48px' }}
                    >
                      Join Today
                    </Link>
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
                    onClick={() => scrollToSection('benefits')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Membership Benefits
                  </button>
                  <button
                    onClick={() => scrollToSection('join-today')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Join Today
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
