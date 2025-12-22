'use client'

import Link from 'next/link'
import { useState } from 'react'

interface LogoProps {
  className?: string
  href?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className = '', href = '/', variant = 'light' }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const logoContent = (
    <div className={`flex items-center ${className}`}>
      {!imageError ? (
        // Try to load logo image
        <img
          src={variant === 'light' ? '/logo_white.png' : '/logo.png'}
          alt="IFAIP Logo"
          className="h-12 w-auto object-contain"
          onError={() => {
            // Fallback to text if image doesn't exist
            setImageError(true)
          }}
        />
      ) : (
        // Fallback text logo
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            International Federation for
          </span>
          <span className="text-xl font-bold uppercase text-primary-600">
            Artificial Intelligence
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            Professionals
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
