export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
        Terms of Service
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-6">
          By accessing and using the IFAIP platform, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
        <p className="text-gray-700 mb-6">
          Permission is granted to temporarily access the materials on IFAIP's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Course Enrollment</h2>
        <p className="text-gray-700 mb-6">
          When you enroll in a course, you agree to provide accurate and complete information. Course access is granted based on successful enrollment and payment (if applicable).
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-700 mb-6">
          All course materials, content, and resources are the property of IFAIP or its content providers and are protected by copyright and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="text-gray-700 mb-6">
          IFAIP shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Information</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms of Service, please contact us through our website.
        </p>
      </div>
    </div>
  )
}

