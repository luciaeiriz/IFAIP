interface TrustStripProps {
  label?: string
  companies: string[]
}

export default function TrustStrip({
  label = 'Trusted by',
  companies,
}: TrustStripProps) {
  if (!companies || companies.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {companies.map((company, index) => (
              <div
                key={index}
                className="text-lg font-semibold text-gray-700 transition-opacity hover:opacity-70"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

