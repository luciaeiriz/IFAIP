import Link from 'next/link'

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Course Discovery
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore our comprehensive collection of AI training courses
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/courses?tag=General"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          General
        </Link>
        <Link
          href="/courses?tag=Restaurant"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Restaurant
        </Link>
        <Link
          href="/courses?tag=Fleet"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Fleet
        </Link>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder course cards - will be replaced with actual data */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Title</h3>
          <p className="text-gray-600 mb-4">Course description will appear here...</p>
          <Link
            href="/courses/1"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  )
}

