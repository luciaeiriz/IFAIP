interface Stat {
  value: string
  label: string
}

interface StatsStripProps {
  stats: Stat[]
}

export default function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="bg-primary-600 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white sm:text-4xl mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-primary-100 sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

