const services = [
  {
    icon: "✦",
    title: "Brand Strategy",
    description:
      "We define your positioning, voice, and visual identity to build a brand that resonates and endures in a crowded market.",
  },
  {
    icon: "◈",
    title: "UI / UX Design",
    description:
      "Research-driven design that balances beauty with function. From wireframes to polished interfaces, every pixel is intentional.",
  },
  {
    icon: "⬡",
    title: "Web Development",
    description:
      "Fast, accessible, and scalable web applications built with modern stacks — Next.js, TypeScript, and the best tools available.",
  },
  {
    icon: "◎",
    title: "Mobile Apps",
    description:
      "Native-quality mobile experiences for iOS and Android. Smooth, performant, and built to retain users long-term.",
  },
  {
    icon: "⟡",
    title: "SEO & Growth",
    description:
      "Technical SEO, content strategy, and conversion optimization that compound over time and drive sustainable growth.",
  },
  {
    icon: "◻",
    title: "Product Consulting",
    description:
      "Embedded advisory for teams that want senior-level product and engineering perspective without the full-time hire.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 px-6 lg:px-8">
      {/* Subtle divider glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
            What we do
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Full-spectrum digital services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            From first concept to final launch, we cover every discipline your
            product needs.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-8 transition-all hover:border-violet-500/30 hover:bg-white/[0.06]"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-violet-600/5 to-transparent" />

              <div className="mb-4 text-2xl text-violet-400">{service.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
