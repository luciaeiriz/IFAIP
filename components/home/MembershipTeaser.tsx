import Link from 'next/link'

interface MembershipTeaserProps {
  title?: string
  description?: string
  benefits: string[]
}

export default function MembershipTeaser({
  title = 'IFAIP Membership',
  description = 'Join our exclusive membership program and unlock premium benefits',
  benefits,
}: MembershipTeaserProps) {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            Coming Soon
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mb-8 text-lg text-white/90">{description}</p>

          <div className="mb-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-semibold text-white">Benefits Include:</h3>
            <ul className="space-y-2 text-left text-white">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-white"
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
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/membership"
            className="inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-primary-600 shadow-lg transition-colors hover:bg-gray-100"
          >
            Learn More About Membership
          </Link>
        </div>
      </div>
    </section>
  )
}

