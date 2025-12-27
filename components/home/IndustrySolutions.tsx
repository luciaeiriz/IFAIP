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
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center text-3xl font-bold text-homepage-dark sm:text-4xl lg:text-5xl tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {solutions.map((solution, index) => (
            <Link
              key={index}
              href={solution.href}
              className="group rounded-2xl border border-homepage-white bg-homepage-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 text-homepage-accentDark transition-transform group-hover:scale-110">
                {solution.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold text-homepage-dark lg:text-2xl">
                {solution.title}
              </h3>
              <p className="mb-6 text-homepage-dark/60 leading-relaxed">{solution.description}</p>
              <div className="inline-flex items-center text-[#34B682] font-semibold transition-all group-hover:translate-x-1">
                Learn more
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

