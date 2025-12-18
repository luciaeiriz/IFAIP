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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <Link
            href={buttonHref}
            className="mb-8 inline-block rounded-md bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            {buttonText}
          </Link>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
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
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

