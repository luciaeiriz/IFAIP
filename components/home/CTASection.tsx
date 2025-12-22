import Link from 'next/link'

interface CTASectionProps {
  title?: string
  buttonText?: string
  buttonHref?: string
  trustPoints: string[]
}

export default function CTASection({
  title = "Ready to Advance Your AI Career?",
  buttonText = 'Get Started Today',
  buttonHref = '/courses/business',
  trustPoints,
}: CTASectionProps) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-homepage-accentLight/50 bg-homepage-accentLight/50 backdrop-blur-sm px-8 py-12 lg:px-12 lg:py-16 text-center shadow-lg">
          <h2 className="mb-8 text-3xl font-bold text-homepage-dark sm:text-4xl lg:text-5xl tracking-tight">
            {title}
          </h2>
          <Link
            href={buttonHref}
            className="mb-10 inline-block rounded-lg bg-[#36498C] px-10 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-[#36498C]/90 hover:shadow-2xl hover:scale-105 active:scale-100"
          >
            {buttonText}
          </Link>

          <div className="flex flex-nowrap justify-center items-center gap-6 text-sm text-homepage-dark/70 whitespace-nowrap overflow-x-auto">
            {trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 flex-shrink-0">
                <svg
                  className="h-5 w-5 text-homepage-accentDark flex-shrink-0"
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
                <span className="font-medium whitespace-nowrap">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

