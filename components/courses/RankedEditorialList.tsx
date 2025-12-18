import Link from 'next/link'
import { Course } from '@/types/course'

interface RankedEditorialListProps {
  courses: Course[]
}

export default function RankedEditorialList({ courses }: RankedEditorialListProps) {
  if (courses.length === 0) return null

  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  const parseKeySkills = (skills: string | null): string[] => {
    if (!skills) return []
    return skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3)
  }

  return (
    <section className="bg-white">
      <h2 className="text-[48px] font-bold leading-none mb-0.5" style={{ color: '#181716', fontFamily: 'EuclidCircularB, sans-serif', margin: '0px 0px 2px' }}>
        Best AI Certification Programmes
      </h2>

        <div className="space-y-8">
          {courses.map((course, index) => {
            const ratingInfo = getRatingLabel(course.rating)
            const keyPoints = parseKeySkills(course.key_skills)

            return (
              <div
                key={course.id}
                className="rounded-lg border border-gray-200 bg-white p-10 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-6">
                  {/* Rank Number - Forbes style: large, dark background */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-editorial-900 text-2xl font-bold text-white">
                    {index + 1}
                  </div>

                  {/* Course Content */}
                  <div className="flex-1">
                    {/* Title and Rating Row */}
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold text-editorial-900">
                          {course.title}
                        </h3>
                        {course.provider && (
                          <p className="text-base font-medium text-gray-600">
                            {course.provider}
                          </p>
                        )}
                      </div>

                      {/* Rating Badge - Forbes style */}
                      {course.rating && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-3xl font-bold text-editorial-900">
                            {course.rating.toFixed(1)}
                          </div>
                          <span
                            className={`rounded-md border px-3 py-1 text-xs font-semibold uppercase ${ratingInfo.color}`}
                          >
                            {ratingInfo.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bullet Points - Forbes style */}
                    {keyPoints.length > 0 && (
                      <ul className="mb-6 space-y-2">
                        {keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Meta Info */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {course.duration}
                        </span>
                      )}
                      {course.level && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {course.level}
                        </span>
                      )}
                      {course.price_label && (
                        <span className="font-semibold text-editorial-900">
                          {course.price_label}
                        </span>
                      )}
                    </div>

                    {/* CTA Button - Forbes style: dark button */}
                    <Link
                      href={course.external_url || `/courses/${course.id}`}
                      target={course.external_url ? '_blank' : undefined}
                      rel={course.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-block rounded-md bg-editorial-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-editorial-800"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    </section>
  )
}
