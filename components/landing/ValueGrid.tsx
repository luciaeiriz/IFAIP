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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-primary-600">{value.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

