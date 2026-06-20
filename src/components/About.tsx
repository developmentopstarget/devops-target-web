const values = [
  {
    title: "Lean and focused",
    body: "No bloated teams or unnecessary hand-offs. You work directly with the person building — which means faster decisions, tighter feedback loops, and fewer things lost in translation.",
  },
  {
    title: "Ops-first thinking",
    body: "Everything we build is designed to run without constant supervision. Reliable automation, clean deployments, and systems that hold up under real-world conditions.",
  },
  {
    title: "No lock-in",
    body: "Clean code, documented systems, and tools you already own. When a project ends, you walk away with something you can understand, maintain, and extend.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left — copy */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
              About
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              A technical operator,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                not an agency.
              </span>
            </h2>
            <p className="mt-6 text-zinc-400 leading-8">
              DevOps Target is a lean technical practice built around one idea:
              most businesses are drowning in manual work that should already be
              automated. We step in, map the inefficiencies, and build the systems
              that eliminate them — permanently.
            </p>
            <p className="mt-4 text-zinc-400 leading-8">
              Whether you need a website that actually converts, an AI pipeline that
              handles your data, or a reliable technical partner to keep everything
              running — this is the work we do every day.
            </p>

            {/* Stack badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Next.js",
                "TypeScript",
                "Python",
                "OpenAI",
                "n8n",
                "Make",
                "Vercel",
                "PostgreSQL",
                "REST APIs",
                "Webhooks",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right — values */}
          <div className="flex flex-col gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-6"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <h3 className="font-semibold text-white">{v.title}</h3>
                </div>
                <p className="pl-4 text-sm leading-relaxed text-zinc-400">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
