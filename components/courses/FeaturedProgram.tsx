import Link from 'next/link'
import { Course } from '@/types/course'

interface FeaturedProgramProps {
  course: Course
  rank: number
}

export default function FeaturedProgram({ course, rank }: FeaturedProgramProps) {
  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  const parseKeySkills = (skills: string | null): string[] => {
    if (!skills) return []
    return skills.split(';').map((s) => s.trim()).filter(Boolean).slice(0, 4)
  }

  const ratingInfo = getRatingLabel(course.rating)
  const keyPoints = parseKeySkills(course.key_skills)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
      {/* Badge */}
      {rank === 1 && (
        <div className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-orange-800">
          ✓ Best For Foundational Understanding of AI
        </div>
      )}

      <div className="flex items-start gap-6">
        {/* Rank Number */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-[#181716] text-2xl font-bold text-white">
          {rank}
        </div>

        {/* Course Content */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="mb-3 text-2xl font-bold text-[#181716]">
            {course.title}
          </h3>

          {/* Bullet Points */}
          {keyPoints.length > 0 && (
            <ul className="mb-6 space-y-2">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Provider */}
          {course.provider && (
            <div className="mb-4 text-sm font-medium text-gray-600">
              {course.provider}
            </div>
          )}

          {/* Rating Box */}
          {course.rating && (
            <div className="mb-6 inline-block rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="text-3xl font-bold text-[#181716] mb-1">
                {course.rating.toFixed(1)}
              </div>
              <div className={`inline-block rounded-md border px-3 py-1 text-xs font-semibold uppercase ${ratingInfo.color}`}>
                {ratingInfo.label}
              </div>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Link
            href={course.external_url || `/courses/${course.id}`}
            target={course.external_url ? '_blank' : undefined}
            rel={course.external_url ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700"
          >
            Learn More
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Discount */}
          {course.free_trial && (
            <p className="mt-3 text-xs text-gray-600">
              {course.free_trial}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

