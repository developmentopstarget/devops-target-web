"use client";

export default function ContactCTA() {
  return (
    <section id="contact" className="relative py-24 px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center shadow-2xl backdrop-blur-sm sm:px-16">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
              Open for new projects
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Got something that needs{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              building?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Tell us what you&apos;re working on. We&apos;ll reply within one business day
            with whether we&apos;re a good fit and what a next step looks like.
          </p>

          {/* Simple contact form — no backend yet */}
          <form
            className="mx-auto mt-10 flex max-w-xl flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
              />
            </div>
            <input
              type="text"
              placeholder="What do you need? (e.g. AI automation, website, API integration)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
            />
            <textarea
              rows={4}
              placeholder="Brief description — what's the problem you're trying to solve?"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              Send message
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-600">
            We respond within 1 business day. No sales calls, no pressure.
          </p>
        </div>
      </div>
    </section>
  );
}
