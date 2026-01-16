interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesSectionProps {
  title?: string
  features: Feature[]
}

export default function FeaturesSection({
  title = 'Why Choose IFAIP?',
  features,
}: FeaturesSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 md:mb-16 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-homepage-dark tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-homepage-accentLight/50 bg-homepage-white p-6 sm:p-8 md:p-8 text-center transition-all hover:border-homepage-accentDark/30 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 sm:mb-6 flex justify-center text-homepage-accentDark transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-homepage-dark">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-homepage-dark/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

