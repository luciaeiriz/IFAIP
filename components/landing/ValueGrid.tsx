interface ValueCard {
  icon: React.ReactNode
  title: string
  description: string
}

interface ValueGridProps {
  title?: string
  values: ValueCard[]
}

export default function ValueGrid({
  title = "What you'll be able to do",
  values,
}: ValueGridProps) {
  if (!values || values.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-12 md:py-16 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 sm:mb-12 text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 md:p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 sm:mb-4 text-primary-600">{value.icon}</div>
              <h3 className="mb-2 text-lg sm:text-xl md:text-xl font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

