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
    <section className="bg-white py-12 lg:py-16 relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <span className="mb-6 inline-block rounded-full bg-homepage-accentLight px-5 py-2.5 text-sm font-semibold text-homepage-dark border border-homepage-accentLight">
            Coming Soon
          </span>
          <h2 className="mb-6 text-3xl font-bold text-homepage-dark sm:text-4xl lg:text-5xl tracking-tight">
            {title}
          </h2>
          <p className="mb-10 text-lg text-homepage-dark/70 lg:text-xl leading-relaxed">{description}</p>

          <div className="mb-10 rounded-2xl bg-homepage-accentLight/50 p-8 border border-homepage-accentLight/50">
            <h3 className="mb-6 text-xl font-bold text-homepage-dark">Benefits Include:</h3>
            <ul className="space-y-3 text-left text-homepage-dark">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-homepage-accentDark"
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
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/membership"
            className="inline-block rounded-lg bg-[#36498C] px-10 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-[#36498C]/90 hover:shadow-2xl hover:scale-105 active:scale-100"
          >
            Learn More About Membership
          </Link>
        </div>
      </div>
    </section>
  )
}

