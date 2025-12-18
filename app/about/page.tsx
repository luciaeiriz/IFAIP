export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
        About IFAIP
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          The International Federation for Artificial Intelligence Professionals (IFAIP) is dedicated to advancing AI education and professional development worldwide.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          Our mission is to provide accessible, high-quality AI training courses that empower professionals and organizations to harness the power of artificial intelligence. We believe that AI literacy is essential for success in the modern world, and we're committed to making world-class education available to everyone.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Comprehensive AI training courses for all skill levels</li>
          <li>Specialized programs for businesses, restaurants, and fleet management</li>
          <li>Expert instructors and industry-leading curriculum</li>
          <li>Flexible learning options to fit your schedule</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get Started</h2>
        <p className="text-gray-700">
          Ready to begin your AI journey? Browse our courses and find the perfect program for your needs.
        </p>
      </div>
    </div>
  )
}

