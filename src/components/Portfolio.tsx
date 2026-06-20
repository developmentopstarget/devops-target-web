const projects = [
  {
    tag: "SaaS · Web App",
    title: "Flowdesk",
    description:
      "End-to-end redesign and rebuild of a B2B invoicing platform. Reduced onboarding time by 40% with a guided setup flow.",
    gradient: "from-violet-600 to-indigo-600",
    accentColor: "text-violet-400",
  },
  {
    tag: "E-Commerce · Mobile",
    title: "Terroir",
    description:
      "Premium wine discovery app for iOS. Custom recommendation engine UI, subscriptions, and a cellar-tracking experience.",
    gradient: "from-rose-600 to-pink-600",
    accentColor: "text-rose-400",
  },
  {
    tag: "Fintech · Dashboard",
    title: "Quanta Finance",
    description:
      "Real-time portfolio analytics dashboard. Complex data visualisation made simple with a clean, high-contrast design system.",
    gradient: "from-emerald-600 to-teal-600",
    accentColor: "text-emerald-400",
  },
  {
    tag: "Brand · Website",
    title: "Kinfolk Studio",
    description:
      "Full brand identity and marketing site for a boutique architecture firm. Awarded Awwwards Site of the Day.",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "text-amber-400",
  },
  {
    tag: "Media · Platform",
    title: "Pulse",
    description:
      "Editorial platform for independent journalists. Custom CMS, SEO-first architecture, and a 3x improvement in page speed.",
    gradient: "from-sky-600 to-blue-600",
    accentColor: "text-sky-400",
  },
  {
    tag: "Healthcare · Web App",
    title: "Aura Health",
    description:
      "Patient-facing portal redesign for a telehealth startup. Accessibility-first, HIPAA-compliant, and loved by users.",
    gradient: "from-fuchsia-600 to-purple-600",
    accentColor: "text-fuchsia-400",
  },
];

export default function Portfolio() {
  return (
    <section id="work" className="relative py-24 px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Selected work
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Projects we're proud of
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            A curated selection of recent client work across industries and
            disciplines.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all hover:border-white/10 hover:bg-white/[0.06]"
            >
              {/* Gradient thumbnail */}
              <div
                className={`h-44 w-full bg-gradient-to-br ${project.gradient} opacity-80`}
              />

              {/* Card body */}
              <div className="p-6">
                <p className={`mb-1 text-xs font-semibold ${project.accentColor}`}>
                  {project.tag}
                </p>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
