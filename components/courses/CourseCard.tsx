import Link from 'next/link'
import { Course, CourseLevel, CourseTag } from '@/types/course'

// Re-export Course type for convenience
export type { Course, CourseLevel, CourseTag } from '@/types/course'

interface CourseCardProps {
  course: Course
  showProvider?: boolean
  className?: string
  imageUrl?: string | null
}

export default function CourseCard({ course, showProvider = true, className = '', imageUrl }: CourseCardProps) {
  const getLevelBadgeColor = (level: CourseLevel | null) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTagBadgeColor = (tag: CourseTag) => {
    switch (tag) {
      case 'Restaurant':
        return 'bg-blue-100 text-blue-800'
      case 'Fleet':
        return 'bg-purple-100 text-purple-800'
      case 'Business':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingLabel = (rating: number | null): { label: string; color: string } => {
    if (!rating) return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
    if (rating >= 9.5) return { label: 'EXCELLENT', color: 'bg-green-50 text-green-800 border-green-200' }
    if (rating >= 9.0) return { label: 'VERY GOOD', color: 'bg-amber-50 text-amber-800 border-amber-200' }
    return { label: 'GOOD', color: 'bg-gray-50 text-gray-800 border-gray-200' }
  }

  const getCTAButton = () => {
    const ratingInfo = getRatingLabel(course.rating)
    const buttonClass = "block w-full rounded-md bg-editorial-900 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-editorial-800"
    
    if (course.external_url) {
      return (
        <a
          href={course.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Go to Course
        </a>
      )
    } else if (course.signup_enabled) {
      return (
        <Link
          href={`/signup/${course.id}`}
          className={buttonClass}
        >
          Sign Up
        </Link>
      )
    } else {
      return (
        <Link
          href={`/courses/${course.id}`}
          className={buttonClass}
        >
          Learn More
        </Link>
      )
    }
  }

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}>
      {/* Image/Gradient Area */}
      <div
        className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 bg-cover bg-center"
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`,
              }
            : undefined
        }
      >
        {/* Course Image or Gradient Placeholder */}
        {!imageUrl && (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}

        {/* Price Badge */}
        {course.price_label && (
          <div className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-editorial-900 shadow-md">
            {course.price_label}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-3">
          {/* Level and Tag Badges */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {course.level && (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getLevelBadgeColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>
            )}
            {course.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTagBadgeColor(
                  tag
                )}`}
              >
                {tag}
              </span>
            ))}
            {course.course_type && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {course.course_type}
              </span>
            )}
          </div>

          {/* Provider */}
          {showProvider && course.provider && (
            <div className="mb-2 text-sm font-medium text-gray-500">
              {course.provider}
            </div>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-editorial-900">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
              {course.description}
            </p>
          )}
        </div>

        {/* Rating Badge */}
        {course.rating && (
          <div className="mb-4 flex items-center gap-2">
            <div className="text-xl font-bold text-editorial-900">
              {course.rating.toFixed(1)}
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase ${getRatingLabel(course.rating).color}`}
            >
              {getRatingLabel(course.rating).label}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          {course.duration && (
            <>
              <svg
                className="h-4 w-4 flex-shrink-0"
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
              <span>{course.duration}</span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto">
          {getCTAButton()}
        </div>
      </div>
    </div>
  )
}
