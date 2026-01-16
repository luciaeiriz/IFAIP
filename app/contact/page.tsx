'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Here you would typically send the form data to your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light Background */}
      <section className="relative contact-hero-section" style={{ backgroundColor: '#bfbfbf', backgroundImage: 'url(/contact_header.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="mx-auto max-w-7xl flex flex-col justify-end contact-hero-container" style={{ height: '562px', paddingBottom: '40px', paddingLeft: '0px', paddingRight: '72px' }}>
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-5 lg:mb-6 contact-breadcrumb" style={{ marginTop: '200px' }}>
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 transition-colors text-xs sm:text-sm lg:text-sm"
            >
              Home
            </Link>
          </div>
          
          {/* Separator Line */}
          <div className="bg-gray-900 mb-6 sm:mb-7 lg:mb-8 contact-separator" style={{ width: '100%', height: '5px' }}></div>
          
          {/* Main Heading */}
          <h1 
            className="mb-4 sm:mb-5 lg:mb-6 leading-tight text-gray-900 contact-hero-title"
            style={{ 
              fontSize: '55px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
              fontWeight: 400
            }}
          >
            Contact us
          </h1>
          
          {/* Description */}
          <p 
            className="mb-6 sm:mb-7 lg:mb-8 leading-relaxed text-gray-700 contact-hero-description"
            style={{ 
              fontSize: '25px',
              fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif'
            }}
          >
            Get in touch with us. We're here to help answer your questions and assist with your AI professional development journey.
          </p>
          
          {/* Learn More Button */}
          <button
            onClick={() => scrollToSection('contact-form')}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900 contact-hero-button"
            style={{ width: '156px', height: '48px' }}
          >
            Contact form
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
      <section className="bg-white contact-content-section">
        <div className="mx-auto max-w-7xl contact-content-container" style={{ paddingLeft: '0px', paddingRight: '72px', paddingTop: '40px', paddingBottom: '96px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 lg:space-y-16 contact-main-content">
              {/* Contact Form Section */}
              <section id="contact-form" className="scroll-mt-24 contact-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-title" style={{ fontSize: '32px', marginTop: '-10px' }}>Contact Form</h2>
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-gray-700 leading-relaxed contact-section-text" style={{ fontSize: '16px' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="courses">Course Information</option>
                          <option value="membership">Membership</option>
                          <option value="partnership">Partnership Opportunities</option>
                          <option value="support">Technical Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                          placeholder="Your message..."
                        />
                      </div>

                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                          <p className="text-sm text-green-800">Thank you for your message! We'll get back to you soon.</p>
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                          <p className="text-sm text-red-800">There was an error submitting your message. Please try again.</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors border border-gray-900 px-6 sm:px-7 lg:px-8 py-2.5 sm:py-2.5 lg:py-3 disabled:opacity-50 disabled:cursor-not-allowed contact-submit-button"
                        style={{ width: '156px', height: '48px' }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </div>
                </div>
              </section>

              {/* Contact Information Section */}
              <section id="contact-info" className="scroll-mt-24 contact-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-title" style={{ fontSize: '32px' }}>Contact Information</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed contact-section-text" style={{ fontSize: '16px' }}>
                    <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-lg">
                      <p className="mb-2">
                        <strong>Email:</strong> contact@ifaip.org
                      </p>
                      <p className="mb-2">
                        <strong>General Inquiries:</strong> info@ifaip.org
                      </p>
                      <p className="mb-2">
                        <strong>Membership:</strong> membership@ifaip.org
                      </p>
                      <p className="mb-2">
                        <strong>Partnerships:</strong> partnerships@ifaip.org
                      </p>
                      <p className="mt-4">
                        <strong>Address:</strong> International Federation for Artificial Intelligence Professionals
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Office Hours Section */}
              <section id="office-hours" className="scroll-mt-24 contact-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-title" style={{ fontSize: '32px' }}>Office Hours</h2>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed contact-section-text" style={{ fontSize: '16px' }}>
                    <p>
                      Our team is available to assist you during the following hours:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (GMT)</li>
                      <li><strong>Saturday:</strong> 10:00 AM - 2:00 PM (GMT)</li>
                      <li><strong>Sunday:</strong> Closed</li>
                    </ul>
                    <p className="mt-4">
                      Please note that response times may vary depending on the volume of inquiries. 
                      We aim to respond to all messages within 2-3 business days.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq" className="scroll-mt-24 contact-section">
                <div>
                  <div className="bg-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-divider" style={{ width: '64px', height: '4px' }}></div>
                  <h2 className="font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 contact-section-title" style={{ fontSize: '32px' }}>Frequently Asked Questions</h2>
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-gray-700 leading-relaxed contact-section-text" style={{ fontSize: '16px' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I enroll in a course?</h3>
                      <p>
                        You can browse our course catalog and enroll directly through our platform. 
                        Simply select the course you're interested in and follow the enrollment instructions.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the membership process?</h3>
                      <p>
                        Membership applications can be submitted through our membership page. 
                        Our team will review your application and contact you with next steps.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer corporate training?</h3>
                      <p>
                        Yes, we offer corporate training programs and partnership opportunities. 
                        Please contact our partnerships team for more information.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I become an instructor?</h3>
                      <p>
                        We welcome qualified instructors to join our platform. Please reach out 
                        to our partnerships team with your credentials and course proposals.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Jump to Navigation */}
            <div className="lg:col-span-1 flex justify-start lg:justify-end contact-sidebar">
              {/* Dropdown for Mobile/Tablet */}
              <div className="w-full lg:hidden contact-dropdown-container mb-6">
                <label htmlFor="contact-jump-to-select" className="block text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>
                  Jump to
                </label>
                <select
                  id="contact-jump-to-select"
                  value={activeSection || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToSection(e.target.value)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent contact-dropdown-select"
                  style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                >
                  <option value="">Select a section...</option>
                  <option value="contact-form">Contact Form</option>
                  <option value="contact-info">Contact Information</option>
                  <option value="office-hours">Office Hours</option>
                  <option value="faq">Frequently Asked Questions</option>
                </select>
              </div>

              {/* Sidebar for Desktop */}
              <div className="hidden lg:block sticky top-24 contact-sidebar-content" style={{ width: '317px', height: '450px', marginRight: '-72px' }}>
                {/* Thick black line above title */}
                <div className="bg-gray-900 mb-4" style={{ width: '100%', height: '4px' }}></div>
                <h3 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'sans-serif' }}>Jump to</h3>
                {/* Light divider below title */}
                <div className="bg-gray-200 mb-6" style={{ width: '100%', height: '1px' }}></div>
                <nav className="space-y-0">
                  <button
                    onClick={() => scrollToSection('contact-form')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Contact Form
                  </button>
                  <button
                    onClick={() => scrollToSection('contact-info')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Contact Information
                  </button>
                  <button
                    onClick={() => scrollToSection('office-hours')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Office Hours
                  </button>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="block text-left text-gray-900 hover:text-gray-700 transition-colors w-full text-sm py-2 border-b border-gray-200"
                    style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                  >
                    Frequently Asked Questions
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

