import Image from 'next/image'

interface ForbesHeroSectionProps {
  tag: string
}

export default function ForbesHeroSection({ tag }: ForbesHeroSectionProps) {
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
      className="bg-white flex items-start w-full relative overflow-hidden"
      style={{ 
        height: '222px',
        backgroundColor: '#FFFFFF',
        paddingTop: '30px'
      }}
    >
      {/* Left side - Text content */}
      <div 
        className="relative z-10"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          paddingLeft: '80px',
          width: '50%',
          minWidth: '600px'
        }}
      >
        {/* Main Title */}
        <div style={{ width: '600px' }}>
          <h1 
            className="text-[48px] mb-2 text-left"
            style={{ 
              color: '#181716', 
              fontFamily: 'EuclidCircularB, sans-serif',
              fontWeight: '900',
              lineHeight: '1.2',
              margin: '0px 0px 2px',
              letterSpacing: '-0.02em'
            }}
          >
            {getTitle()}
          </h1>
        </div>

        {/* Description Text - Full width, not constrained */}
        <p className="text-xs text-gray-500" style={{ maxWidth: 'none', width: 'auto' }}>
          AI certification training classes offer a fast-tracked way to gain the skills required to excel in the lucrative AI field
        </p>
      </div>

      {/* Right side - Image with gradient fade */}
      <div 
        className="absolute right-0 top-0 h-full"
        style={{ 
          width: '50%',
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
            background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 15%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0) 50%, transparent 100%)',
            zIndex: 2
          }}
        />
      </div>
    </section>
  )
}

