import Link from 'next/link'
import StatsStrip from '@/components/home/StatsStrip'
import FeaturesSection from '@/components/home/FeaturesSection'
import IndustrySolutions from '@/components/home/IndustrySolutions'
import PopularCourses from '@/components/home/PopularCourses'
import MembershipTeaser from '@/components/home/MembershipTeaser'
import CTASection from '@/components/home/CTASection'
import { BookIcon, UserIcon, ChartIcon } from '@/components/landing/icons'

export default function HomePage() {
  const stats = [
    { value: '10,000+', label: 'Certified Professionals' },
    { value: '50+', label: 'Expert Instructors' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '40+', label: 'Countries' },
  ]

  const features = [
    {
      icon: <BookIcon />,
      title: 'Industry-Recognized Certifications',
      description:
        'Earn certificates that are recognized by leading companies and institutions worldwide.',
    },
    {
      icon: <UserIcon />,
      title: 'Expert-Led Training',
      description:
        'Learn from industry experts with years of real-world experience in AI and machine learning.',
    },
    {
      icon: <ChartIcon />,
      title: 'Global Professional Network',
      description:
        'Connect with AI professionals from around the world and expand your career opportunities.',
    },
  ]

  const industrySolutions = [
    {
      icon: (
        <svg
          className="h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'AI for Business',
      description:
        'Transform your business operations with AI-powered solutions tailored to your industry needs.',
      href: '/ai-for-business',
    },
    {
      icon: (
        <svg
          className="h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: 'AI for Restaurants',
      description:
        'Revolutionize your restaurant operations with intelligent systems for inventory, ordering, and customer experience.',
      href: '/ai-for-restaurants',
    },
    {
      icon: (
        <svg
          className="h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      title: 'AI for Fleet Management',
      description:
        'Optimize your fleet operations with intelligent AI systems for routing, maintenance, and logistics.',
      href: '/ai-for-fleet',
    },
  ]

  const membershipBenefits = [
    'Exclusive resources',
    'Course discounts',
    'Professional network',
  ]

  const trustPoints = [
    'No prior experience required',
    'Flexible online learning',
    'Industry-recognized certificates',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              Empowering AI Professionals Worldwide
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Master the Future of Artificial Intelligence
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-3xl text-xl text-white/90 sm:text-2xl">
              Join the International Federation for Artificial Intelligence Professionals 
              and unlock world-class training programs designed to advance your career 
              in the rapidly evolving field of AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-md bg-white px-8 py-3 text-base font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
              >
                Explore Courses
              </Link>
              <Link
                href="/about"
                className="rounded-md border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                Learn About IFAIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <StatsStrip stats={stats} />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Industry Solutions */}
      <IndustrySolutions solutions={industrySolutions} />

      {/* Popular Courses */}
      <PopularCourses />

      {/* Membership Teaser */}
      <MembershipTeaser benefits={membershipBenefits} />

      {/* CTA Section */}
      <CTASection trustPoints={trustPoints} />
    </div>
  )
}
