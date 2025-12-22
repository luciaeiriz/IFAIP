export default function TermsPage() {
  return (
    <div className="bg-white mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 sm:text-5xl">
        Terms of Service
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to the International Federation for Artificial Intelligence Professionals (IFAIP). 
            These Terms of Service ("Terms") govern your access to and use of our website, services, 
            and platform. By accessing or using IFAIP, you agree to be bound by these Terms.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            By accessing and using the IFAIP platform, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please do not 
            use this service.
          </p>
        </section>

        {/* Use License */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            Permission is granted to temporarily access the materials on IFAIP's website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of 
            title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        {/* Course Enrollment */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Course Enrollment</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            When you enroll in a course through IFAIP, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Provide accurate and complete information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all course requirements and guidelines</li>
            <li>Respect intellectual property rights of course providers and instructors</li>
            <li>Use course materials solely for personal educational purposes</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Course access is granted based on successful enrollment and payment (if applicable). 
            IFAIP reserves the right to revoke access for violations of these Terms.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            As a user of IFAIP, you are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Maintaining the confidentiality of your account information</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring that your use of the platform complies with all applicable laws</li>
            <li>Not using the platform for any unlawful or prohibited purpose</li>
            <li>Not interfering with or disrupting the platform or servers</li>
            <li>Not attempting to gain unauthorized access to any part of the platform</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            All course materials, content, and resources available through IFAIP are the property of 
            IFAIP, its content providers, or course instructors and are protected by copyright and 
            other intellectual property laws. You may not:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Reproduce, distribute, or create derivative works from course materials</li>
            <li>Share your course access credentials with others</li>
            <li>Record, stream, or redistribute course content</li>
            <li>Use course materials for commercial purposes without authorization</li>
          </ul>
        </section>

        {/* Disclaimers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimers</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>No Warranty:</strong> The materials on IFAIP's website are provided on an 'as is' 
            basis. IFAIP makes no warranties, expressed or implied, and hereby disclaims and negates 
            all other warranties including, without limitation, implied warranties or conditions of 
            merchantability, fitness for a particular purpose, or non-infringement of intellectual 
            property or other violation of rights.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Course Quality:</strong> While we strive to curate high-quality courses, IFAIP 
            does not guarantee the accuracy, completeness, or usefulness of any course content. Course 
            quality and outcomes may vary.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Third-Party Content:</strong> IFAIP may link to external websites or include 
            content from third parties. We are not responsible for the content, privacy practices, 
            or terms of service of external sites.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            In no event shall IFAIP or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on IFAIP's website, even if IFAIP or an 
            authorized representative has been notified orally or in writing of the possibility of 
            such damage.
          </p>
        </section>

        {/* Refund Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Refund Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            Refund policies vary by course provider. Please review the specific refund policy for 
            each course before enrollment. IFAIP facilitates course enrollment but does not control 
            individual course refund policies. For refund requests, please contact the course provider 
            directly or reach out to our support team.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            IFAIP may revise these Terms of Service at any time without notice. By using this website, 
            you are agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms of Service, please contact us through our 
            website or email us at support@ifaip.org.
          </p>
        </section>
      </div>
    </div>
  )
}
