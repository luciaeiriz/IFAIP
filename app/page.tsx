'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type FilterType = 'all' | 'news' | 'blog' | 'researcher-spotlights' | 'latest-research' | 'events'

interface LatestCard {
  id: string
  category: 'news' | 'blog' | 'researcher-spotlights' | 'latest-research' | 'events'
  label: string
  title: string
  description?: string
  date?: string
  time?: string
  href: string
  imageColor: string
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)

  // Feature cards data (similar to news cards in Turing Institute)
  const featureCards = [
    {
      label: 'Training',
      title: 'Industry-Recognized AI Certification Programs',
      description: 'Earn certificates that are recognized by leading companies and institutions worldwide. Our comprehensive training programs are designed to advance your career in artificial intelligence.',
      date: 'Monday 20 Jan 2025',
      href: '/courses',
    },
    {
      label: 'Membership',
      title: 'Join the Global AI Professional Network',
      description: 'Connect with AI professionals from around the world. Access exclusive resources, course discounts, and expand your career opportunities through our professional network.',
      date: 'Friday 17 Jan 2025',
      href: '/membership',
    },
  ]

  // Latest section cards data
  const latestCards: LatestCard[] = [
    {
      id: '1',
      category: 'news',
      label: 'News',
      title: 'New AI-powered tool to identify threats in space and improve national security',
      description: 'The University of Birmingham and the Alan Turing Institute have won a significant grant to develop AI tools for space security.',
      date: 'Thursday 18 Dec 2025',
      href: '/news/ai-threats-space',
      imageColor: 'from-blue-900 to-blue-700'
    },
    {
      id: '2',
      category: 'events',
      label: 'Event',
      title: '2-day Workshop on Responsibility and Accountability in Safety-Critical AI Applications',
      date: 'Monday 12 Jan 2026 - Tuesday 13 Jan 2026',
      time: 'Time: 11:30 - 15:00',
      href: '/events/workshop-responsibility',
      imageColor: 'from-green-600 to-green-800'
    },
    {
      id: '3',
      category: 'latest-research',
      label: 'Research projects',
      title: 'Advancing Management Skills in Biomedical AI Research',
      description: 'Tackling the challenges of collaboration and data sharing in the AI ecosystem.',
      href: '/research/biomedical-ai',
      imageColor: 'from-purple-600 to-purple-800'
    },
    {
      id: '4',
      category: 'researcher-spotlights',
      label: 'Research spotlight',
      title: 'Isabel Fenton',
      description: 'Isabel Fenton is applying data science and AI to environmental challenges and sustainability research.',
      href: '/research/isabel-fenton',
      imageColor: 'from-pink-500 to-magenta-600'
    },
    {
      id: '5',
      category: 'news',
      label: 'News',
      title: 'Breakthrough in Machine Learning Algorithms for Healthcare',
      description: 'Researchers develop new ML models that can predict patient outcomes with unprecedented accuracy.',
      date: 'Tuesday 15 Dec 2025',
      href: '/news/ml-healthcare',
      imageColor: 'from-indigo-600 to-indigo-800'
    },
    {
      id: '6',
      category: 'blog',
      label: 'Blog',
      title: 'The Future of AI in Education: Opportunities and Challenges',
      description: 'Exploring how artificial intelligence is transforming the educational landscape and what it means for students and educators.',
      date: 'Monday 14 Dec 2025',
      href: '/blog/ai-education-future',
      imageColor: 'from-teal-600 to-teal-800'
    },
    {
      id: '7',
      category: 'events',
      label: 'Event',
      title: 'AI Ethics Conference 2026',
      date: 'Friday 20 Feb 2026',
      time: 'Time: 09:00 - 17:00',
      href: '/events/ai-ethics-conference',
      imageColor: 'from-orange-600 to-orange-800'
    },
    {
      id: '8',
      category: 'researcher-spotlights',
      label: 'Research spotlight',
      title: 'Dr. Michael Chen',
      description: 'Dr. Chen is pioneering work in neural network optimization and computational efficiency.',
      href: '/research/michael-chen',
      imageColor: 'from-cyan-600 to-cyan-800'
    },
    {
      id: '9',
      category: 'blog',
      label: 'Blog',
      title: 'Understanding Large Language Models: A Comprehensive Guide',
      description: 'Deep dive into how LLMs work, their capabilities, limitations, and real-world applications.',
      date: 'Wednesday 13 Dec 2025',
      href: '/blog/llm-guide',
      imageColor: 'from-amber-600 to-amber-800'
    },
    {
      id: '10',
      category: 'latest-research',
      label: 'Research projects',
      title: 'Quantum Computing Meets AI: New Frontiers',
      description: 'Exploring the intersection of quantum computing and artificial intelligence for next-generation problem solving.',
      href: '/research/quantum-ai',
      imageColor: 'from-violet-600 to-violet-800'
    },
    {
      id: '11',
      category: 'news',
      label: 'News',
      title: 'AI Regulation Framework Announced by International Consortium',
      description: 'Leading AI organizations collaborate to establish global standards for ethical AI development and deployment.',
      date: 'Wednesday 16 Dec 2025',
      href: '/news/ai-regulation',
      imageColor: 'from-red-600 to-red-800'
    },
    {
      id: '12',
      category: 'news',
      label: 'News',
      title: 'Major Breakthrough in Natural Language Processing',
      description: 'New transformer architecture achieves state-of-the-art performance across multiple language understanding benchmarks.',
      date: 'Friday 19 Dec 2025',
      href: '/news/nlp-breakthrough',
      imageColor: 'from-blue-600 to-blue-800'
    },
    {
      id: '13',
      category: 'blog',
      label: 'Blog',
      title: 'AI and Climate Change: Technology Solutions for Sustainability',
      description: 'How artificial intelligence is being leveraged to address climate challenges and create sustainable solutions.',
      date: 'Tuesday 16 Dec 2025',
      href: '/blog/ai-climate',
      imageColor: 'from-emerald-600 to-emerald-800'
    },
    {
      id: '14',
      category: 'blog',
      label: 'Blog',
      title: 'The Evolution of Computer Vision: From Pixels to Understanding',
      description: 'Tracing the development of computer vision technologies and their impact on industries from healthcare to autonomous vehicles.',
      date: 'Thursday 17 Dec 2025',
      href: '/blog/computer-vision',
      imageColor: 'from-rose-600 to-rose-800'
    },
    {
      id: '15',
      category: 'events',
      label: 'Event',
      title: 'AI Innovation Summit 2026',
      date: 'Saturday 15 Mar 2026',
      time: 'Time: 10:00 - 18:00',
      href: '/events/innovation-summit',
      imageColor: 'from-yellow-600 to-yellow-800'
    },
    {
      id: '16',
      category: 'events',
      label: 'Event',
      title: 'Machine Learning Bootcamp for Professionals',
      date: 'Monday 10 Feb 2026 - Friday 14 Feb 2026',
      time: 'Time: 09:00 - 17:00',
      href: '/events/ml-bootcamp',
      imageColor: 'from-lime-600 to-lime-800'
    },
    {
      id: '17',
      category: 'researcher-spotlights',
      label: 'Research spotlight',
      title: 'Dr. Sarah Martinez',
      description: 'Dr. Martinez specializes in explainable AI and is developing methods to make machine learning models more transparent and interpretable.',
      href: '/research/sarah-martinez',
      imageColor: 'from-fuchsia-600 to-fuchsia-800'
    },
    {
      id: '18',
      category: 'researcher-spotlights',
      label: 'Research spotlight',
      title: 'Prof. James Wilson',
      description: 'Prof. Wilson leads research in reinforcement learning and its applications to robotics and autonomous systems.',
      href: '/research/james-wilson',
      imageColor: 'from-sky-600 to-sky-800'
    },
    {
      id: '19',
      category: 'latest-research',
      label: 'Research projects',
      title: 'Federated Learning for Privacy-Preserving AI',
      description: 'Developing distributed machine learning approaches that protect user privacy while enabling collaborative model training.',
      href: '/research/federated-learning',
      imageColor: 'from-indigo-600 to-indigo-800'
    },
    {
      id: '20',
      category: 'latest-research',
      label: 'Research projects',
      title: 'AI-Driven Drug Discovery and Development',
      description: 'Using machine learning to accelerate pharmaceutical research and reduce time-to-market for new treatments.',
      href: '/research/ai-drug-discovery',
      imageColor: 'from-cyan-600 to-cyan-800'
    },
  ]

  // Filter cards based on active filter
  const filteredCards = (activeFilter === 'all' 
    ? latestCards 
    : latestCards.filter(card => {
        if (activeFilter === 'researcher-spotlights') {
          return card.category === 'researcher-spotlights'
        }
        if (activeFilter === 'latest-research') {
          return card.category === 'latest-research'
        }
        return card.category === activeFilter
      })
  ).slice(0, 4)

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Split Layout Section */}
      <section className="relative h-[calc(100vh-4rem)] w-full">
        {/* Full-width Video Background */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Background Video - Zoomed in to fill space */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute"
              style={{ 
                width: '150%', 
                height: '150%', 
                objectFit: 'cover',
                objectPosition: 'center',
                top: '-25%',
                left: '-25%',
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <source src="/hero_video.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          {/* Content Overlay - Positioned on left side */}
          <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-24 text-left" style={{ maxWidth: '750px', transform: 'translateY(-30px)' }}>
            {/* Main Mission Statement */}
            <h1 
              className="text-white leading-[1.1] mb-8 w-full"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontSize: '36px',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                textAlign: 'left'
              }}
            >
              We are the international federation for artificial intelligence professionals.
            </h1>
            
            {/* CTA Button with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                className="inline-flex items-center justify-start bg-white text-black px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors"
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              >
                Our courses and training
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {coursesDropdownOpen && (
                <>
                  {/* Invisible bridge area to prevent mouse leave */}
                  <div className="absolute left-0 top-full w-full h-1" />
                  <div className="absolute left-0 top-full w-48 z-50" style={{ marginTop: '4px' }}>
                    <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
                      <div className="py-1">
                        <Link
                          href="/courses/business"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Business
                        </Link>
                        <Link
                          href="/courses/restaurant"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Restaurant
                        </Link>
                        <Link
                          href="/courses/fleet"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Fleet
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Blue Background with Feature Cards - Overlaid on top */}
        <div 
          className="absolute top-0 right-0 w-full lg:w-[50%] h-full py-16 lg:py-24 flex flex-col justify-center z-20"
          style={{ 
            backgroundColor: '#030EF9',
            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0 100%, 15% 30%)',
          }}
        >
          <div className="space-y-6" style={{ position: 'absolute', right: '20px', width: '483px' }}>
            {featureCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="block p-6 sm:p-8 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                style={{ 
                  fontFamily: '"Helvetica Roman", Helvetica, sans-serif',
                  transform: 'translateZ(0)',
                  width: '483px',
                  height: '200px',
                  backgroundColor: '#353DFC',
                }}
              >
                <div style={{ transform: 'translateY(-20px)', paddingTop: '10px' }}>
                  <div className="mb-2">
                    <span 
                      className="text-sm text-white uppercase tracking-wider"
                      style={{ 
                        fontFamily: '"Helvetica Roman", Helvetica, sans-serif',
                        letterSpacing: '0.1em',
                        fontWeight: 400
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                  <h2 
                    className="text-sm text-white mb-3 leading-tight"
                    style={{ 
                      fontFamily: '"Helvetica Roman", Helvetica, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {card.title}
                  </h2>
                  <p 
                    className="text-sm text-white mb-3 leading-relaxed"
                    style={{ 
                      fontFamily: '"Helvetica Roman", Helvetica, sans-serif',
                      lineHeight: '1.6',
                      fontWeight: 400
                    }}
                  >
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/30">
                    <span 
                      className="text-sm text-white/90"
                      style={{ 
                        fontFamily: '"Helvetica Roman", Helvetica, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      {card.date}
                    </span>
                    {/* Arrow aligned with date */}
                    <svg
                      className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto" style={{ maxWidth: '100%', paddingLeft: '0', paddingRight: '0' }}>
          {/* Header */}
          <div 
            className="mb-8" 
            style={{ 
              maxWidth: '1320px',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: '0',
              paddingRight: '0'
            }}
          >
            <div 
              className="mb-2"
              style={{
                width: '95px',
                height: '9px',
                backgroundColor: '#000000'
              }}
            />
            <h2 
              className="font-bold text-black mb-6"
              style={{ 
                fontFamily: '"Neue Haas Unica Pro", Helvetica, sans-serif',
                fontSize: '32px'
              }}
            >
              Latest
            </h2>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-baseline gap-4 border-b border-gray-200 pb-4" style={{ alignItems: 'baseline' }}>
              <button 
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer border-b-2 border-transparent pb-1"
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('all')}
              >
                Filter
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('all')}
              >
                All
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'news' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('news')}
              >
                News
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'blog' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('blog')}
              >
                Blog
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'researcher-spotlights' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('researcher-spotlights')}
              >
                Researcher spotlights
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'latest-research' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('latest-research')}
              >
                Latest research
              </button>
              <button 
                className={`text-sm border-b-2 pb-1 transition-colors cursor-pointer ${
                  activeFilter === 'events' 
                    ? 'font-bold text-black border-black' 
                    : 'font-normal text-gray-600 hover:text-black border-transparent'
                }`}
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  verticalAlign: 'baseline'
                }}
                onClick={() => handleFilterClick('events')}
              >
                Events
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2" 
            style={{ 
              gap: '20px', 
              paddingLeft: '0', 
              paddingRight: '0', 
              margin: '0',
              width: '100%',
              maxWidth: '1320px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {filteredCards.map((card) => (
              <Link 
                key={card.id}
                href={card.href}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex relative group"
                style={{ 
                  backgroundColor: '#F2F2F2',
                  width: '650px',
                  height: '209px'
                }}
              >
                <div 
                  className="bg-gray-200 relative overflow-hidden"
                  style={{
                    width: '325px',
                    height: '209px'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.imageColor} flex items-center justify-center`}>
                    <span className="text-white text-sm font-medium">{card.label} Image</span>
                  </div>
                </div>
                <div 
                  className="flex flex-col justify-end relative"
                  style={{
                    width: '325px',
                    height: '209px',
                    padding: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <span 
                      className="text-gray-500 uppercase tracking-wide mb-2 block"
                      style={{ 
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '12px',
                        lineHeight: '1.3'
                      }}
                    >
                      {card.label}
                    </span>
                    <h3 
                      className="font-bold text-black mb-3 leading-tight"
                      style={{ 
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '18px',
                        lineHeight: '1.4'
                      }}
                    >
                      {card.title}
                    </h3>
                    {card.description && (
                      <p 
                        className="text-black mb-3 line-clamp-3"
                        style={{ 
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}
                      >
                        {card.description}
                      </p>
                    )}
                    {card.time ? (
                      <>
                        {card.date && (
                          <div 
                            className="text-black mb-2"
                            style={{ 
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '13px',
                              lineHeight: '1.4'
                            }}
                          >
                            {card.date}
                          </div>
                        )}
                        <div 
                          className="text-black"
                          style={{ 
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '13px',
                            lineHeight: '1.4'
                          }}
                        >
                          {card.time}
                        </div>
                      </>
                    ) : card.date && (
                      <span 
                        className="text-gray-500"
                        style={{ 
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '12px',
                          lineHeight: '1.3'
                        }}
                      >
                        {card.date}
                      </span>
                    )}
                  </div>
                  <svg
                    className="absolute bottom-4 right-4 h-5 w-5 text-black"
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
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
