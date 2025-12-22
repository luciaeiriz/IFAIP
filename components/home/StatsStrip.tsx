interface Stat {
  value: string
  label: string
}

interface StatsStripProps {
  stats: Stat[]
}

export default function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="bg-homepage-accentDark py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl font-bold text-homepage-white sm:text-5xl lg:text-6xl mb-3 tracking-tight transition-transform group-hover:scale-105">
                {stat.value}
              </div>
              <div className="text-sm text-homepage-accentLight sm:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

