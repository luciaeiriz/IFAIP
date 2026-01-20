'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdvertiserDisclosureModal from '../ui/AdvertiserDisclosureModal'

interface ForbesHeroSectionProps {
  tag: string
  heroTitle?: string | null
}

export default function ForbesHeroSection({ tag, heroTitle }: ForbesHeroSectionProps) {
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false)
  const getTitle = () => {
    // Use custom hero title if provided
    if (heroTitle) {
      // Split by <br> or newlines and render as JSX
      const parts = heroTitle.split(/<br\s*\/?>|\n/).filter(Boolean)
      if (parts.length > 1) {
        return (
          <>
            {parts.map((part, index) => (
              <span key={index}>
                {part}
                {index < parts.length - 1 && <br />}
              </span>
            ))}
          </>
        )
      }
      return heroTitle
    }
    
    // Fallback to legacy logic
    if (tag === 'Business') {
      return (
        <>
          The Best AI Certification<br />
          for Business Owners
        </>
      )
    } else if (tag === 'Restaurant') {
      return (
        <>
          The Best AI Certification<br />
          for Restaurant Owners
        </>
      )
    } else if (tag === 'Fleet') {
      return (
        <>
          The Best AI Certification<br />
          for Fleet Manager
        </>
      )
    } else {
      // Generic fallback for new tags
      return (
        <>
          The Best AI Certification<br />
          for {tag}
        </>
      )
    }
  }

  return (
    <section 
      className="bg-white flex items-start w-full relative lg:overflow-hidden lg:h-[231px] h-auto min-h-[200px] pt-6 sm:pt-7 md:pt-8 lg:pt-[29px] pb-6 sm:pb-6 md:pb-6 lg:pb-0 forbes-hero-section"
      style={{ 
        backgroundColor: '#FFFFFF',
        overflow: 'visible'
      }}
    >
      {/* Left side - Text content */}
      <div 
        className="relative z-10 w-full lg:w-1/2 px-4 sm:px-6 md:px-8 lg:pl-20 lg:pr-0 forbes-hero-content"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          overflow: 'visible'
        }}
      >
        {/* Main Title */}
        <div className="w-full lg:w-[900px] max-w-[900px] mb-2 sm:mb-3 lg:mb-2">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-left leading-tight sm:leading-tight lg:leading-normal"
            style={{ 
              color: '#181716', 
              fontFamily: 'Pieta Black, EuclidCircularB, sans-serif',
              fontWeight: '900',
              lineHeight: '1.2',
              margin: '0px',
              letterSpacing: '-0.02em',
              WebkitTextStroke: '0.5px #181716',
              textShadow: '0.5px 0.5px 0px rgba(24, 23, 22, 0.1)'
            }}
          >
            {getTitle()}
          </h1>
        </div>

        {/* Description Text */}
        <p className="text-xs sm:text-sm lg:text-sm mt-2 sm:mt-3 lg:mt-0 lg:whitespace-nowrap leading-relaxed sm:leading-normal" style={{ fontSize: '14px', fontFamily: 'Cerebri Sans, EuclidCircularB, sans-serif', color: '#000000' }}>
          AI certification training classes offer a fast-tracked way to gain the skills required to excel in the lucrative AI field
        </p>

        {/* Disclaimer Box */}
        <div
          className="mt-4 sm:mt-5 md:mt-6 lg:absolute lg:top-[159px] lg:left-20 lg:mt-0 px-3 sm:px-4 md:px-4 lg:px-4 forbes-disclaimer"
          style={{
            backgroundColor: '#F7F7F7',
            borderRadius: '4px',
            maxWidth: '900px',
            minHeight: '34px',
            display: 'flex',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <p
            className="text-[10px] sm:text-xs lg:text-xs leading-tight lg:leading-none lg:whitespace-nowrap"
            style={{
              color: '#929A9B',
              fontFamily: 'EuclidCircularB, sans-serif',
              margin: 0
            }}
          >
            We earn a commission from the offers on this page, which influences which offers are displayed and how and where the offers appear.{' '}
            <button
              onClick={() => setDisclosureModalOpen(true)}
              style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit', whiteSpace: 'nowrap' }}
            >
              Advertiser Disclosure.
            </button>
          </p>
        </div>
        <AdvertiserDisclosureModal
          isOpen={disclosureModalOpen}
          onClose={() => setDisclosureModalOpen(false)}
        />
      </div>

      {/* Right side - Image with gradient fade - Hidden on mobile */}
      <div 
        className="hidden lg:block absolute right-0 top-0"
        style={{ 
          width: '45%',
          height: '179px',
          zIndex: 1
        }}
      >
        {/* Hero image */}
        <Image
          src="/hero.png?v=2"
          alt="Hero"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'right center'
          }}
          priority
        />
        
        {/* Gradient overlay that fades from white on left to transparent on right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0.5) 35%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.15) 65%, rgba(255, 255, 255, 0) 80%, transparent 100%)',
            zIndex: 2
          }}
        />
      </div>
    </section>
  )
}

