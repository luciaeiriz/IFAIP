import Link from 'next/link'

export default function AIForFleetPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          AI for Fleet Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Optimize your fleet operations with intelligent AI systems for routing, maintenance, and logistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {/* Course cards will be filtered by tag=Fleet */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fleet AI Course</h3>
          <p className="text-gray-600 mb-4">Learn how to implement AI in fleet management...</p>
          <Link
            href="/courses/1"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Learn more →
          </Link>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/courses/fleet"
          className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          View All Fleet Courses
        </Link>
      </div>
    </div>
  )
}

