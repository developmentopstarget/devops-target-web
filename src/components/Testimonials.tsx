const testimonials = [
  {
    quote:
      "We were spending hours every week on data entry that should have been automated years ago. They scoped it, built it, and shipped it in under two weeks. It just runs now.",
    name: "Client A",
    role: "Operations Manager, Professional Services",
    initials: "CA",
    color: "from-violet-500 to-indigo-500",
  },
  {
    quote:
      "The website they built is the first one I've had that I actually understand how to maintain. Clean, fast, and the handover documentation was genuinely useful.",
    name: "Client B",
    role: "Founder, Consulting Firm",
    initials: "CB",
    color: "from-sky-500 to-blue-500",
  },
  {
    quote:
      "I needed someone who could bridge the gap between our business tools and our tech stack. They mapped everything out, built the integrations, and documented how it all works.",
    name: "Client C",
    role: "Director, E-Commerce Brand",
    initials: "CC",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote:
      "Reliable, direct communication, and no BS. They flagged problems before I had to ask about them and fixed them the same day. That's exactly what I need from a technical partner.",
    name: "Client D",
    role: "CEO, SaaS Startup",
    initials: "CD",
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
            What clients say
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
