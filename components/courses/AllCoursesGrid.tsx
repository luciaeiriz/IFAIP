import Link from 'next/link'
import { Course } from '@/types/course'

interface AllCoursesGridProps {
  courses: Course[]
}

export default function AllCoursesGrid({ courses }: AllCoursesGridProps) {
  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-white text-gray-900 border-gray-300' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-white text-gray-900 border-gray-300' }
    return { label: 'GOOD', color: 'bg-white text-gray-900 border-gray-300' }
  }

  const getCategoryBanner = (index: number, course: Course): string => {
    // You can customize these based on course data or index
    const categories = [
      'Best For Foundational Understanding of AI',
      'Best For Building AI Tools',
      'Best For Strategic AI Implementation'
    ]
    return categories[index] || 'Featured Program'
  }

  return (
    <section className="bg-white">
      <div style={{ width: '100%', paddingLeft: '80px', paddingRight: '80px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontFamily: 'EuclidCircularB, sans-serif', 
          fontWeight: 'bold', 
          color: 'black', 
          margin: '0px 0px 16px' 
        }}>
          Featured Programs
        </h2>

        {courses.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No courses found matching your criteria.
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course, index) => {
              const ratingInfo = getRatingLabel(course.rating)
              const rank = index + 1
              
              return (
                <div
                  key={course.id}
                  className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  style={{ display: 'flex', gap: '24px' }}
                >
                {/* Category Banner - Top Left */}
                <div
                  className="absolute"
                  style={{
                    top: '-1px',
                    left: '-1px',
                    backgroundColor: '#FF8C00',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'EuclidCircularB, sans-serif',
                    zIndex: 10,
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)'
                  }}
                >
                  ✓ {getCategoryBanner(index, course)}
                </div>

                {/* Left Side: Ranking and Logos */}
                <div style={{ flexShrink: 0, width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
                  {/* Ranking Number */}
                  <div
                    style={{
                      fontSize: '64px',
                      fontWeight: '900',
                      fontFamily: 'EuclidCircularB, sans-serif',
                      color: '#181716',
                      lineHeight: '1',
                      marginBottom: '20px'
                    }}
                  >
                    {rank}
                  </div>

                  {/* Provider Logo Placeholder - You can add actual logos here */}
                  {course.provider && (
                    <div
                      style={{
                        width: '100px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#666666',
                        textAlign: 'center',
                        fontFamily: 'EuclidCircularB, sans-serif'
                      }}
                    >
                      {course.provider}
                    </div>
                  )}
                </div>

                {/* Right Side: Content */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
                  {/* Title */}
                  <h3 className="mb-4 text-2xl font-bold" style={{ fontFamily: 'EuclidCircularB, sans-serif', color: '#181716' }}>
                    {course.title}
                  </h3>

                  {/* Description with Checkmarks */}
                  {course.description && (
                    <div className="mb-6 space-y-2">
                      {course.description.split('.').filter(s => s.trim()).slice(0, 3).map((point, i) => (
                        <div key={i} className="flex items-start gap-2" style={{ fontFamily: 'EuclidCircularB, sans-serif', fontSize: '14px', color: '#181716' }}>
                          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="#28A745"/>
                            <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{point.trim()}.</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rating and Action Section - Right aligned, vertical stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginTop: 'auto', paddingTop: '16px' }}>
                    {/* Combined Rating Box - Two halves: Blue (score) and White (label + stars) */}
                    {course.rating && (
                      <div
                        className="inline-flex rounded-md overflow-hidden"
                        style={{
                          fontFamily: 'EuclidCircularB, sans-serif',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'stretch',
                          height: '45px' // Match Learn More button height (py-3 = 12px top + 12px bottom + line height)
                        }}
                      >
                        {/* Left half - Blue with score */}
                        <div
                          style={{
                            backgroundColor: '#36498C',
                            color: '#FFFFFF',
                            fontWeight: '900',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 20px',
                            width: '50%'
                          }}
                        >
                          {course.rating.toFixed(1)}
                        </div>
                        {/* Right half - White with label and stars */}
                        <div
                          className="border border-gray-300"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 12px',
                            width: '50%',
                            gap: '4px'
                          }}
                        >
                          {/* Rating Label */}
                          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'EuclidCircularB, sans-serif' }}>
                            {ratingInfo.label}
                          </div>
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="h-3 w-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Learn More Button - Green, below rating box */}
                    <Link
                      href={course.external_url || `/courses/${course.id}`}
                      target={course.external_url ? '_blank' : undefined}
                      rel={course.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: '#28A745',
                        fontFamily: 'EuclidCircularB, sans-serif',
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}
                    >
                      Learn More
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Discount Information (Optional) */}
                  {course.price_label && (
                    <div className="mt-2" style={{ fontSize: '12px', color: '#666666', fontFamily: 'EuclidCircularB, sans-serif' }}>
                      {course.price_label}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        )}
      </div>
    </section>
  )
}
