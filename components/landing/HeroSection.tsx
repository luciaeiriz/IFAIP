'use client'

import Link from 'next/link'
import { trackCTAClick } from '@/lib/analytics'

interface HeroSectionProps {
  badge?: string
  title: string
  subtitle: string
  bulletPoints: Array<{
    icon: React.ReactNode
    text: string
  }>
  backgroundImage?: string
}

export default function HeroSection({
  badge = 'AI Training Platform',
  title,
  subtitle,
  bulletPoints,
  backgroundImage,
}: HeroSectionProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-20">
        <div className="text-center">
          {/* Badge */}
          {badge && (
            <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-sm">
              {badge}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-6 sm:mb-8 max-w-3xl text-lg sm:text-xl md:text-2xl lg:text-2xl text-white/90">
            {subtitle}
          </p>

          {/* Bullet Points */}
          <div className="mb-8 sm:mb-10 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {bulletPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white"
              >
                <div className="flex-shrink-0 text-primary-200">
                  {point.icon}
                </div>
                <span className="text-xs sm:text-sm md:text-base lg:text-base">{point.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
            <button
              onClick={() => {
                trackCTAClick('Explore Courses', 'hero_section', '#courses')
                scrollToSection('courses')
              }}
              className="w-full sm:w-auto rounded-md bg-white px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Explore Courses
            </button>
            <button
              onClick={() => {
                trackCTAClick('Get Course Recommendations', 'hero_section', '#lead-capture')
                scrollToSection('lead-capture')
              }}
              className="w-full sm:w-auto rounded-md border-2 border-white bg-transparent px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Get Course Recommendations
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

