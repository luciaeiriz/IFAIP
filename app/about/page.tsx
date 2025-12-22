export default function AboutPage() {
  return (
    <div className="bg-white mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 sm:text-5xl">
        About IFAIP
      </h1>

      <div className="prose prose-lg max-w-none">
        {/* Mission Statement */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            The International Federation for Artificial Intelligence Professionals (IFAIP) is dedicated 
            to advancing AI education and professional development worldwide. Our mission is to empower 
            individuals and organizations with the knowledge, skills, and certifications needed to thrive 
            in the rapidly evolving field of artificial intelligence.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that AI literacy is essential for success in the modern world, and we're committed 
            to making world-class education accessible to everyone, regardless of their background or 
            prior experience.
          </p>
        </section>

        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Course Selection</h3>
              <p className="leading-relaxed">
                We carefully curate and review AI training courses from leading providers worldwide, 
                ensuring that our platform features only the highest-quality educational content. Our 
                team of experts evaluates each course for relevance, quality, and practical value.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Certification</h3>
              <p className="leading-relaxed">
                IFAIP offers industry-recognized certifications that validate your AI expertise and 
                enhance your professional credentials. Our certification programs are designed in 
                collaboration with industry leaders and academic institutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Building</h3>
              <p className="leading-relaxed">
                We foster a global community of AI professionals, providing networking opportunities, 
                knowledge sharing platforms, and collaborative learning environments. Connect with 
                peers, mentors, and industry experts from around the world.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Partnerships</h3>
              <p className="leading-relaxed">
                IFAIP collaborates with leading technology companies, educational institutions, and 
                industry organizations to ensure our programs align with current market needs and 
                emerging trends in artificial intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Approach</h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              At IFAIP, we take a comprehensive and practical approach to AI education:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li className="leading-relaxed">
                <strong>Practical Focus:</strong> We emphasize hands-on learning and real-world 
                applications over theoretical concepts alone.
              </li>
              <li className="leading-relaxed">
                <strong>Industry Relevance:</strong> Our curriculum is continuously updated to reflect 
                the latest developments and best practices in AI.
              </li>
              <li className="leading-relaxed">
                <strong>Accessibility:</strong> We believe quality AI education should be accessible 
                to everyone, regardless of their technical background or geographic location.
              </li>
              <li className="leading-relaxed">
                <strong>Flexibility:</strong> Our programs accommodate different learning styles and 
                schedules, offering both self-paced and instructor-led options.
              </li>
              <li className="leading-relaxed">
                <strong>Continuous Support:</strong> We provide ongoing support and resources to help 
                learners succeed throughout their AI journey.
              </li>
            </ul>
          </div>
        </section>

        {/* Organization Info */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Organization</h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              IFAIP was founded with the vision of creating a global standard for AI professional 
              development. We are an independent, non-profit organization dedicated to advancing the 
              field of artificial intelligence through education and professional development.
            </p>
            <p className="leading-relaxed">
              Our team consists of experienced AI professionals, educators, and industry experts who 
              are passionate about making AI education accessible and effective. We work with a 
              diverse network of instructors, course providers, and industry partners to deliver 
              comprehensive learning experiences.
            </p>
            <p className="leading-relaxed">
              As a trusted platform for AI education, we are committed to maintaining the highest 
              standards of quality, integrity, and transparency in everything we do.
            </p>
          </div>
        </section>

        {/* Contact/CTA */}
        <section className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-gray-700 mb-4">
            Whether you're looking to advance your career, train your team, or become an instructor, 
            IFAIP has opportunities for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/courses"
              className="inline-block rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-700 text-center"
            >
              Browse Courses
            </a>
            <a
              href="/membership"
              className="inline-block rounded-md border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 text-center"
            >
              Learn About Membership
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
