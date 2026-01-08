'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PartnerPage() {
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
      <section className="relative" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/partner_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
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
            Partner with us
          </h1>
          
          {/* Description */}
          <p 
            className="mb-8 leading-relaxed text-gray-700"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Join forces with IFAIP to advance AI education and professional development worldwide. Together, we can shape the future of artificial intelligence.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('partnership-opportunities')}
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
              {/* Partnership Opportunities Section */}
              <section id="partnership-opportunities" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px', marginTop: '-10px' }}>Partnership Opportunities</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      IFAIP collaborates with leading organizations, educational institutions, technology companies, 
                      and industry leaders to advance AI education and professional development. We offer various 
                      partnership opportunities designed to create mutual value and drive innovation in artificial intelligence.
                    </p>
                    <p>
                      Whether you're a course provider, technology company, educational institution, or industry 
                      organization, we invite you to explore how we can work together to shape the future of AI education.
                    </p>
                  </div>
                </div>
              </section>

              {/* Types of Partnerships Section */}
              <section id="types-of-partnerships" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>Types of Partnerships</h2>
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Provider Partnerships</h3>
                      <p className="leading-relaxed">
                        Partner with IFAIP to showcase your AI training courses to our global network of professionals. 
                        We help you reach qualified learners, provide certification opportunities, and enhance your course 
                        visibility through our curated platform. Our partnership includes marketing support, learner 
                        analytics, and access to our professional community.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Corporate Training Partnerships</h3>
                      <p className="leading-relaxed">
                        Develop custom AI training programs for your organization. We work with companies to design 
                        tailored learning solutions that address specific business needs, upskill teams, and drive 
                        innovation. Our corporate partnerships include program development, delivery support, and 
                        certification pathways.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology Partnerships</h3>
                      <p className="leading-relaxed">
                        Collaborate with technology companies to integrate cutting-edge AI tools and platforms into our 
                        educational programs. Technology partners gain access to our learner community, contribute to 
                        curriculum development, and showcase their innovations to AI professionals worldwide.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Partnerships</h3>
                      <p className="leading-relaxed">
                        Partner with universities and research institutions to bridge academic research and professional 
                        practice. Academic partnerships include joint research initiatives, curriculum development, 
                        instructor exchange programs, and pathways for students to gain professional certifications.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Association Partnerships</h3>
                      <p className="leading-relaxed">
                        Work with industry associations and professional bodies to establish standards, develop 
                        certification programs, and create pathways for professional recognition. These partnerships 
                        help shape industry standards and ensure our programs align with real-world professional needs.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Benefits of Partnership Section */}
              <section id="benefits" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>Benefits of Partnership</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Partnering with IFAIP offers numerous advantages:
                    </p>
                    <ul className="list-disc list-inside space-y-3 ml-4">
                      <li className="leading-relaxed">
                        <strong>Global Reach:</strong> Access our international network of AI professionals, learners, 
                        and organizations across multiple industries and regions.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Brand Visibility:</strong> Enhance your organization's visibility and credibility 
                        within the global AI professional community.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Market Insights:</strong> Gain valuable insights into AI education trends, learner 
                        needs, and industry demands through our analytics and community feedback.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Quality Assurance:</strong> Benefit from our rigorous course evaluation and quality 
                        standards that ensure your content meets professional expectations.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Certification Support:</strong> Leverage our certification framework to provide 
                        recognized credentials that enhance learner value and professional development.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Community Access:</strong> Connect with a diverse network of AI professionals, 
                        educators, and industry leaders for collaboration and knowledge sharing.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Innovation Opportunities:</strong> Participate in joint initiatives, research 
                        projects, and innovation programs that advance the field of AI education.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to Partner Section */}
              <section id="how-to-partner" className="scroll-mt-24">
                <div>
                  <div className="bg-gray-900 mb-6" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-6" style={{ fontSize: '32px' }}>How to Partner with Us</h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontSize: '16px' }}>
                    <p>
                      We're always looking for innovative partners who share our commitment to advancing AI education. 
                      To explore partnership opportunities:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 ml-4">
                      <li className="leading-relaxed">
                        <strong>Review Our Partnership Types:</strong> Identify which partnership model aligns best 
                        with your organization's goals and capabilities.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Contact Our Partnerships Team:</strong> Reach out to discuss your partnership interests 
                        and explore potential collaboration opportunities.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Partnership Proposal:</strong> Submit a partnership proposal outlining your organization, 
                        proposed collaboration, and mutual benefits.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Evaluation Process:</strong> Our team will review your proposal and schedule a meeting 
                        to discuss partnership details and alignment with our mission.
                      </li>
                      <li className="leading-relaxed">
                        <strong>Partnership Agreement:</strong> Once approved, we'll work together to formalize the 
                        partnership and establish collaboration frameworks.
                      </li>
                    </ol>
                    <p className="mt-6">
                      For course providers specifically, you can submit your courses for review through our course 
                      submission process. Our team evaluates courses based on quality, relevance, and alignment with 
                      professional development needs.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="scroll-mt-24">
                <div className="p-8 bg-gray-50 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Ready to partner with IFAIP? Contact our partnerships team to discuss how we can work together 
                    to advance AI education and professional development.
                  </p>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong>Email:</strong> partnerships@ifaip.org
                    </p>
                    <p>
                      <strong>General Inquiries:</strong> contact@ifaip.org
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Link
                      href="/contact"
                      className="inline-block rounded-md bg-[#36498C] px-6 py-3 text-base font-semibold text-white hover:bg-[#36498C]/90 text-center transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/courses"
                      className="inline-block rounded-md border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors"
                    >
                      View Our Courses
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
                    onClick={() => scrollToSection('partnership-opportunities')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Partnership Opportunities
                  </button>
                  <button
                    onClick={() => scrollToSection('types-of-partnerships')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Types of Partnerships
                  </button>
                  <button
                    onClick={() => scrollToSection('benefits')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Benefits of Partnership
                  </button>
                  <button
                    onClick={() => scrollToSection('how-to-partner')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    How to Partner with Us
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Get Started
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

