import Link from 'next/link'

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
        IFAIP Membership
      </h1>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-gray-600 mb-6">
          Join IFAIP and unlock exclusive benefits, access to premium courses, and connect with a global community of AI professionals.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Membership Benefits</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Access to exclusive member-only courses</li>
          <li>Discounts on all training programs</li>
          <li>Networking opportunities with industry leaders</li>
          <li>Early access to new course releases</li>
          <li>Professional certification programs</li>
          <li>Monthly webinars and workshops</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Today</h2>
        <p className="text-gray-700 mb-6">
          Become a member and take your AI career to the next level. Membership details and pricing information coming soon.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/courses"
          className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  )
}

