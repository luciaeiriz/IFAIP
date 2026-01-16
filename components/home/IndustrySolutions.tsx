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
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 md:mb-16 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-homepage-dark tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-8">
          {solutions.map((solution, index) => (
            <Link
              key={index}
              href={solution.href}
              className="group rounded-2xl border border-homepage-white bg-homepage-white p-6 sm:p-8 md:p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 sm:mb-6 text-homepage-accentDark transition-transform group-hover:scale-110">
                {solution.icon}
              </div>
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-homepage-dark">
                {solution.title}
              </h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-homepage-dark/60 leading-relaxed">{solution.description}</p>
              <div className="inline-flex items-center text-[#34B682] text-sm sm:text-base font-semibold transition-all group-hover:translate-x-1">
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

