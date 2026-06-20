const services = [
  {
    icon: "◎",
    title: "AI Automation",
    description:
      "Custom AI workflows that eliminate repetitive tasks — document processing, data extraction, intelligent routing, and LLM-powered pipelines tailored to your operations.",
  },
  {
    icon: "✦",
    title: "Web Development",
    description:
      "Fast, production-ready websites and web apps built with Next.js and TypeScript. Clean code, strong SEO foundations, and CMS integration when you need it.",
  },
  {
    icon: "⬡",
    title: "Workflow Automation",
    description:
      "Connect your tools and eliminate manual hand-offs. We build automation across Make, n8n, Zapier, and custom scripts that run reliably in the background.",
  },
  {
    icon: "◈",
    title: "Technical Operations",
    description:
      "Ongoing technical support, monitoring, and maintenance so your systems stay healthy. We act as your embedded technical operator — proactive, not reactive.",
  },
  {
    icon: "⟡",
    title: "API & Backend Integration",
    description:
      "Third-party API wiring, webhook plumbing, and lightweight backend services. We make your stack talk to itself so you don't have to do it manually.",
  },
  {
    icon: "◻",
    title: "Deployment & Infrastructure",
    description:
      "CI/CD pipelines, Vercel and cloud deployments, environment configuration, and the infrastructure scaffolding that turns code into a running product.",
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
            Technical services, end to end
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            From AI automation to live infrastructure — we cover the full technical
            stack so you can focus on running your business.
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
