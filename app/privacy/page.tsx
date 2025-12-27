export default function PrivacyPage() {
  return (
    <div className="bg-white mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 sm:text-5xl">
        Privacy Policy
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            The International Federation for Artificial Intelligence Professionals ("IFAIP", "we", 
            "us", or "our") is committed to protecting your privacy. This Privacy Policy explains 
            how we collect, use, disclose, and safeguard your information when you visit our website 
            and use our services.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Personal Information</h3>
          <p className="text-gray-700 leading-relaxed mb-2">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Name and contact information (email address, phone number)</li>
            <li>Account credentials and profile information</li>
            <li>Course enrollment and progress data</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communication preferences and feedback</li>
            <li>Role and professional information (when provided)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Automatically Collected Information</h3>
          <p className="text-gray-700 leading-relaxed mb-2">
            When you visit our website, we automatically collect certain information, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>UTM parameters and tracking data</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your course enrollments and payments</li>
            <li>Send you course updates, educational content, and recommendations</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to improve our platform and user experience</li>
            <li>Send administrative information, such as updates to our terms and policies</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>
        </section>

        {/* Information Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We do not sell, trade, or rent your personal information to third parties. We may share 
            your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>
              <strong>With Your Consent:</strong> We may share your information with your explicit 
              consent or at your direction.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share information with third-party service 
              providers who assist in operating our platform, such as payment processors, email 
              service providers, and analytics services.
            </li>
            <li>
              <strong>Course Providers:</strong> When you enroll in a course, we may share relevant 
              information with the course provider to facilitate your enrollment and access.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required by law, 
              court order, or government regulation, or to protect our rights and safety.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of 
              assets, your information may be transferred as part of that transaction.
            </li>
          </ul>
        </section>

        {/* Cookie Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We use cookies and similar tracking technologies to track activity on our platform and 
            hold certain information. Cookies are files with a small amount of data that may include 
            an anonymous unique identifier.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Types of Cookies We Use:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>
              <strong>Essential Cookies:</strong> Required for the platform to function properly
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our 
              website
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and preferences
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track 
              campaign effectiveness
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
            sent. However, if you do not accept cookies, you may not be able to use some portions of 
            our platform.
          </p>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet or electronic storage is 100% secure. While 
            we strive to use commercially acceptable means to protect your information, we cannot 
            guarantee absolute security.
          </p>
        </section>

        {/* User Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            Depending on your location, you may have certain rights regarding your personal information, 
            including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>
              <strong>Access:</strong> Request access to your personal information and receive a copy 
              of the data we hold about you
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or incomplete information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal information, subject to 
              certain legal and operational limitations
            </li>
            <li>
              <strong>Objection:</strong> Object to processing of your personal information for certain 
              purposes
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of processing in certain circumstances
            </li>
            <li>
              <strong>Portability:</strong> Request transfer of your data to another service provider
            </li>
            <li>
              <strong>Opt-Out:</strong> Opt-out of marketing communications at any time
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise these rights, please contact us using the information provided in the Contact 
            Information section below.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes 
            outlined in this Privacy Policy, unless a longer retention period is required or permitted 
            by law. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our services are not intended for individuals under the age of 18. We do not knowingly 
            collect personal information from children. If you believe we have collected information 
            from a child, please contact us immediately, and we will take steps to delete such 
            information.
          </p>
        </section>

        {/* International Data Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country 
            of residence. These countries may have data protection laws that differ from those in your 
            country. We take appropriate safeguards to ensure your information receives adequate 
            protection.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
            practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> privacy@ifaip.org
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Website:</strong> Contact form available on our website
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> International Federation for Artificial Intelligence Professionals
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
