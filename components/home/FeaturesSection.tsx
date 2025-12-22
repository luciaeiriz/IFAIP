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
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center text-3xl font-bold text-homepage-dark sm:text-4xl lg:text-5xl tracking-tight">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-homepage-accentLight/50 bg-homepage-white p-8 text-center transition-all hover:border-homepage-accentDark/30 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 flex justify-center text-homepage-accentDark transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold text-homepage-dark lg:text-2xl">
                {feature.title}
              </h3>
              <p className="text-homepage-dark/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

