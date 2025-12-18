import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  // In a real app, fetch course data based on params.id
  // For now, this is a placeholder

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/courses"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Course Title
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Course description will appear here...
          </p>

          <div className="prose max-w-none">
            <h2>About This Course</h2>
            <p>Detailed course information will be displayed here.</p>

            <h2>What You'll Learn</h2>
            <ul>
              <li>Key skill 1</li>
              <li>Key skill 2</li>
              <li>Key skill 3</li>
            </ul>

            <h2>Course Modules</h2>
            <p>Module information will be displayed here.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">Price</div>
              <div className="text-gray-600">Course pricing information</div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm text-gray-600">Level:</span>
                <span className="ml-2 font-medium">Beginner</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">TBD</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Provider:</span>
                <span className="ml-2 font-medium">TBD</span>
              </div>
            </div>

            <Link
              href={`/signup/${params.id}`}
              className="block w-full rounded-md bg-primary-600 px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

