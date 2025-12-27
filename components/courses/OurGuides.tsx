export default function OurGuides() {
  const guides = [
    { title: 'Best Online Leadership Programmes', href: '#' },
    { title: 'The Best Business Management Courses', href: '#' },
  ]

  return (
    <section className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h2 className="mb-4 text-xl font-bold text-[#181716]">
        Our Guides
      </h2>
      <div className="space-y-4">
        {guides.map((guide, index) => (
          <a
            key={index}
            href={guide.href}
            className="block text-sm text-gray-700 hover:text-[#181716] transition-colors"
          >
            {guide.title}
            <span className="ml-2 text-green-600">Read More</span>
          </a>
        ))}
      </div>
    </section>
  )
}

