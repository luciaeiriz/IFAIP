import Link from 'next/link'
import { Course } from '@/types/course'

interface FeaturedTopPicksProps {
  courses: Course[]
}

export default function FeaturedTopPicks({ courses }: FeaturedTopPicksProps) {
  if (courses.length === 0) return null

  const top3 = courses.slice(0, 3)

  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  return (
    <section style={{ backgroundColor: '#F6F7FF', width: '100%', padding: '32px 0' }}>
      <div style={{ width: '100%', paddingLeft: '80px', paddingRight: '80px' }}>
        <h2 className="mb-6 text-2xl" style={{ color: '#181716', fontFamily: 'EuclidCircularB, sans-serif' }}>
          Our Top 3 Providers
        </h2>

        <div className="flex justify-start" style={{ gap: '24px', flexWrap: 'nowrap', width: '100%' }}>
          {top3.map((course, index) => {
            const isMostPopular = index === 1
            return (
              <div
                key={course.id}
                className="relative bg-white shadow-sm transition-shadow hover:shadow-md"
                style={{ 
                  width: 'calc((100% - 48px) / 3)',
                  aspectRatio: '825 / 320',
                  padding: '20px',
                  border: isMostPopular ? '3px solid #36498C' : '1px solid #E0E0E0',
                  borderRadius: '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  flex: '1 1 0'
                }}
              >
                {/* Most Popular Badge */}
                {isMostPopular && (
                  <div 
                    className="absolute"
                    style={{
                      top: '-12px',
                      left: '16px',
                      backgroundColor: '#36498C',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '0px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      fontFamily: 'EuclidCircularB, sans-serif',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  >
                    ✓ MOST POPULAR
                  </div>
                )}

                {/* Title */}
                <h3 
                  className="mb-2 font-bold"
                  style={{ 
                    fontSize: '16px', 
                    fontFamily: 'EuclidCircularB, sans-serif',
                    color: '#181716',
                    lineHeight: '1.4'
                  }}
                >
                  {course.title}
                </h3>

                {/* Brief description tagline */}
                {course.description && (
                  <div 
                    className="mb-3"
                    style={{ 
                      fontSize: '14px', 
                      fontFamily: 'EuclidCircularB, sans-serif',
                      color: '#333333',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {(() => {
                      // Extract a brief tagline - take first sentence or first 60 characters
                      const desc = course.description.trim();
                      const firstSentence = desc.split('.')[0].trim();
                      if (firstSentence.length <= 60 && firstSentence.length > 0) {
                        return firstSentence;
                      }
                      // If first sentence is too long, take first 60 chars
                      return desc.substring(0, 57).trim() + '...';
                    })()}
                  </div>
                )}

                {/* Bottom section: Learn More button and Rating */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '12px', gap: '8px' }}>
                    {/* Learn More Link - Right aligned */}
                    <Link
                      href={course.external_url || `/courses/${course.id}`}
                      target={course.external_url ? '_blank' : undefined}
                      rel={course.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 font-semibold transition-colors hover:opacity-80"
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: 'EuclidCircularB, sans-serif',
                        color: '#28A745',
                        textDecoration: 'none',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer'
                      }}
                    >
                      Learn More
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#28A745' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Rating - Right aligned, smaller size */}
                    {course.rating && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="font-bold"
                          style={{ 
                            fontSize: '14px', 
                            fontFamily: 'EuclidCircularB, sans-serif',
                            color: '#181716'
                          }}
                        >
                          {course.rating.toFixed(1)}
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-3.5 w-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
