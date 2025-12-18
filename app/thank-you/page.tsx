import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Thank You!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your signup has been received successfully. We'll be in touch soon with more information about your course.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Browse More Courses
          </Link>
          <Link
            href="/"
            className="rounded-md bg-gray-200 px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

