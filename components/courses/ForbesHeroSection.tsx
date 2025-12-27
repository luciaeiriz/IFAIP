'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdvertiserDisclosureModal from '../ui/AdvertiserDisclosureModal'

interface ForbesHeroSectionProps {
  tag: string
}

export default function ForbesHeroSection({ tag }: ForbesHeroSectionProps) {
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false)
  const getTitle = () => {
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
    } else {
      return (
        <>
          The Best AI Certification<br />
          for Fleet Manager
        </>
      )
    }
  }

  return (
    <section 
      className="bg-white flex items-start w-full relative overflow-hidden lg:h-[231px] h-auto min-h-[200px] pt-[29px] pb-4 lg:pb-0"
      style={{ 
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Left side - Text content */}
      <div 
        className="relative z-10 w-full lg:w-1/2 px-4 sm:px-6 md:px-8 lg:pl-20 lg:pr-0"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
        }}
      >
        {/* Main Title */}
        <div className="w-full lg:w-[600px]">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] mb-2 text-left"
            style={{ 
              color: '#181716', 
              fontFamily: 'Pieta Black, EuclidCircularB, sans-serif',
              fontWeight: '900',
              lineHeight: '1.2',
              margin: '0px 0px 2px',
              letterSpacing: '-0.02em',
              WebkitTextStroke: '0.5px #181716',
              textShadow: '0.5px 0.5px 0px rgba(24, 23, 22, 0.1)'
            }}
          >
            {getTitle()}
          </h1>
        </div>

        {/* Description Text */}
        <p className="text-xs sm:text-sm lg:text-sm mt-2 lg:mt-0" style={{ fontSize: '14px', fontFamily: 'Cerebri Sans, EuclidCircularB, sans-serif', color: '#000000', whiteSpace: 'nowrap' }}>
          AI certification training classes offer a fast-tracked way to gain the skills required to excel in the lucrative AI field
        </p>

        {/* Disclaimer Box */}
        <div
          className="mt-4 lg:absolute lg:top-[159px] lg:left-20 lg:mt-0"
          style={{
            backgroundColor: '#F7F7F7',
            padding: '8px 16px',
            borderRadius: '4px',
            maxWidth: '900px',
            minHeight: '34px',
            display: 'flex',
            alignItems: 'center',
            zIndex: 10,
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <p
            className="text-[10px] sm:text-xs lg:text-xs"
            style={{
              color: '#929A9B',
              fontFamily: 'EuclidCircularB, sans-serif',
              lineHeight: '1',
              margin: 0,
              whiteSpace: 'nowrap'
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
          src="/hero.png"
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

