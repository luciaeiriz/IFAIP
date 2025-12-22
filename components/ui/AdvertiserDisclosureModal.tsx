'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface AdvertiserDisclosureModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdvertiserDisclosureModal({ isOpen, onClose }: AdvertiserDisclosureModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={onClose}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: 'EuclidCircularB, sans-serif',
          zIndex: 100000,
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#181716', fontFamily: 'EuclidCircularB, sans-serif' }}
          >
            Advertiser Disclosure
          </h2>
          
          <div
            className="space-y-4 text-gray-700 leading-relaxed"
            style={{ fontSize: '16px', fontFamily: 'EuclidCircularB, sans-serif', lineHeight: '1.6' }}
          >
            <p>
              The content on this page has been created independently by our editorial team. We may earn a commission from some of the offers featured, which can influence how and where offers are displayed, including their order and any associated ratings or scores.
            </p>
            
            <p>
              In addition to commission, we may also take into account factors such as brand recognition and overall reputation when evaluating products, services, or programmes. While we aim to provide accurate, current, and relevant information, not all available options in the market may be included, and we cannot guarantee that all details are complete or fully up to date at the time of publication.
            </p>
          </div>

          {/* Close button at bottom */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'EuclidCircularB, sans-serif' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at document body level, outside any stacking contexts
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

