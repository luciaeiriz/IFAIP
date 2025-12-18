import Link from 'next/link'

interface IndustrySolution {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

interface IndustrySolutionsProps {
  title?: string
  solutions: IndustrySolution[]
}

export default function IndustrySolutions({
  title = 'Industry Solutions',
  solutions,
}: IndustrySolutionsProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-primary-600">{solution.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {solution.title}
              </h3>
              <p className="mb-4 text-gray-600">{solution.description}</p>
              <Link
                href={solution.href}
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
              >
                Learn more
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

