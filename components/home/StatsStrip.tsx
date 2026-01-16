interface Stat {
  value: string
  label: string
}

interface StatsStripProps {
  stats: Stat[]
}

export default function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="bg-homepage-accentDark py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-homepage-white mb-2 sm:mb-3 tracking-tight transition-transform group-hover:scale-105">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base lg:text-base text-homepage-accentLight font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

