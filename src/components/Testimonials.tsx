const testimonials = [
  {
    quote:
      "Working with Agency was the best product decision we made last year. They took our messy MVP and turned it into something our enterprise clients actually trust.",
    name: "Sarah Chen",
    role: "CEO, Flowdesk",
    initials: "SC",
    color: "from-violet-500 to-indigo-500",
  },
  {
    quote:
      "The team's attention to detail is extraordinary. Every edge case was considered, every animation intentional. We shipped on time and under budget.",
    name: "Marcus Webb",
    role: "Product Lead, Quanta Finance",
    initials: "MW",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote:
      "They don't just execute — they push back when something isn't right. That kind of honest partnership is rare. I'd hire them again without hesitation.",
    name: "Priya Sharma",
    role: "Founder, Aura Health",
    initials: "PS",
    color: "from-rose-500 to-pink-500",
  },
  {
    quote:
      "Our Awwwards win was a direct result of their design sensibility. More importantly, our conversion rate jumped 28% in the first month after launch.",
    name: "James Okafor",
    role: "Creative Director, Kinfolk Studio",
    initials: "JO",
    color: "from-amber-500 to-orange-500",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Testimonials
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Trusted by founders & teams
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-8"
            >
              {/* Quote mark */}
              <div className="mb-4 text-4xl leading-none text-violet-500 select-none">
                &ldquo;
              </div>
              <p className="mb-6 text-[15px] leading-relaxed text-zinc-300">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
