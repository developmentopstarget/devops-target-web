import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16 lg:px-8">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute bottom-0 -left-32 h-[350px] w-[350px] rounded-full bg-violet-800/10 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
            Available for new projects
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          We build digital
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            experiences that last.
          </span>
        </h1>

        {/* Sub-copy */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Strategy, design, and engineering for ambitious brands. We turn complex
          problems into elegant, high-performing products that your users will
          love.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
          >
            Start a project
          </Link>
          <Link
            href="#work"
            className="rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            See our work
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-12">
          {[
            { value: "150+", label: "Projects shipped" },
            { value: "98%", label: "Client satisfaction" },
            { value: "8yrs", label: "In the industry" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
