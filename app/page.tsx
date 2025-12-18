import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to IFAIP
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover world-class AI training courses and advance your career in artificial intelligence
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/courses"
            className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Browse Courses
          </Link>
          <Link
            href="/about"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Business</h3>
            <p className="text-gray-600 mb-4">
              AI solutions tailored for your business needs
            </p>
            <Link
              href="/ai-for-business"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Explore →
            </Link>
          </div>
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Restaurants</h3>
            <p className="text-gray-600 mb-4">
              Transform your restaurant operations with AI
            </p>
            <Link
              href="/ai-for-restaurants"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Explore →
            </Link>
          </div>
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Fleet Management</h3>
            <p className="text-gray-600 mb-4">
              Optimize your fleet with intelligent AI systems
            </p>
            <Link
              href="/ai-for-fleet"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Explore →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

