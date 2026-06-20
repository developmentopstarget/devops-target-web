import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "AI Automation", href: "#services" },
    { label: "Web Development", href: "#services" },
    { label: "Workflow Automation", href: "#services" },
    { label: "Technical Operations", href: "#services" },
    { label: "API Integration", href: "#services" },
    { label: "Deployment & Infra", href: "#services" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="#" className="flex items-center gap-2.5 w-fit">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold">
                DT
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">
                DevOps<span className="text-violet-400"> Target</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              AI automation, web development, and technical operations for
              businesses that need things built right and running reliably.
            </p>

            {/* Placeholder social icons */}
            <div className="mt-6 flex items-center gap-4">
              {["Tw", "Li", "Gh"].map((icon) => (
                <button
                  key={icon}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-semibold text-zinc-500 transition hover:border-white/20 hover:text-white"
                  aria-label={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} DevOps Target. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <span key={label} className="text-xs text-zinc-600">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
