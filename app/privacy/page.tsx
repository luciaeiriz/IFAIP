export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Name and contact information (email address, phone number)</li>
          <li>Account credentials and profile information</li>
          <li>Course enrollment and progress data</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Communication preferences and feedback</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Provide, maintain, and improve our services</li>
          <li>Process your course enrollments and payments</li>
          <li>Send you course updates and educational content</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Analyze usage patterns to improve our platform</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
        <p className="text-gray-700 mb-6">
          We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>With service providers who assist in operating our platform</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
        <p className="text-gray-700 mb-6">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Access and update your personal information</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Request a copy of your data</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking</h2>
        <p className="text-gray-700 mb-6">
          We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us through our website.
        </p>
      </div>
    </div>
  )
}

