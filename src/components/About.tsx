const values = [
  {
    title: "Quality over speed",
    body: "We'd rather take an extra week and ship something extraordinary than rush out something mediocre.",
  },
  {
    title: "Radical transparency",
    body: "You always know where your project stands — weekly updates, open Figma files, shared repos.",
  },
  {
    title: "Long-term thinking",
    body: "We build for maintainability and scalability. No shortcuts that become technical debt six months later.",
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
              About us
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              A small team with{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                big impact.
              </span>
            </h2>
            <p className="mt-6 text-zinc-400 leading-8">
              We're a tight-knit studio of designers, engineers, and strategists
              who've worked with startups, scale-ups, and Fortune 500s. We don't
              do cookie-cutter websites — every engagement is custom, focused, and
              built to move the needle.
            </p>
            <p className="mt-4 text-zinc-400 leading-8">
              Founded in 2016, we've shipped over 150 projects across SaaS,
              e-commerce, fintech, and media. Our process is collaborative, our
              communication is direct, and our work speaks for itself.
            </p>

            {/* Team avatars placeholder */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3">
                {["A", "B", "C", "D"].map((initial, i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0a0f] text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${260 + i * 15}, 70%, 55%), hsl(${240 + i * 15}, 80%, 50%))`,
                    }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-400">
                Meet the team of{" "}
                <span className="font-semibold text-white">12 specialists</span>
              </p>
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
