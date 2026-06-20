const projects = [
  {
    tag: "AI Automation · Document Processing",
    title: "Invoice Extraction Pipeline",
    description:
      "Built an LLM-powered pipeline that ingests PDF invoices from email, extracts line items, and pushes structured data into Airtable — replacing 6 hours of manual entry per week.",
    gradient: "from-violet-600 to-indigo-600",
    accentColor: "text-violet-400",
  },
  {
    tag: "Web Development · SaaS",
    title: "Client Portal — Consulting Firm",
    description:
      "Custom Next.js portal for a boutique consultancy. Secure client login, project status dashboards, and document delivery. Deployed to Vercel with a Notion-backed CMS.",
    gradient: "from-sky-600 to-blue-600",
    accentColor: "text-sky-400",
  },
  {
    tag: "Workflow Automation · E-Commerce",
    title: "Order Fulfilment Sync",
    description:
      "Connected Shopify, a 3PL warehouse API, and a customer-facing status page using n8n. Eliminated daily manual stock reconciliation for a 200-order/day operation.",
    gradient: "from-emerald-600 to-teal-600",
    accentColor: "text-emerald-400",
  },
  {
    tag: "Technical Ops · Infrastructure",
    title: "Deployment Overhaul",
    description:
      "Migrated a legacy PHP site to a Next.js stack on Vercel, set up CI/CD via GitHub Actions, and introduced staging environments and automated smoke tests.",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "text-amber-400",
  },
  {
    tag: "API Integration · Internal Tool",
    title: "CRM ↔ Accounting Sync",
    description:
      "Bidirectional sync between HubSpot and QuickBooks Online via a lightweight middleware service. Kills duplicate data entry and keeps deal and invoice status in lock-step.",
    gradient: "from-rose-600 to-pink-600",
    accentColor: "text-rose-400",
  },
  {
    tag: "AI Automation · Lead Generation",
    title: "AI Outreach Qualifier",
    description:
      "Automated lead enrichment and scoring pipeline using OpenAI + Clay. Qualifies inbound leads against ICP criteria and drafts personalised outreach for human review.",
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
            Real problems, shipped solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            A selection of recent automation, development, and infrastructure
            projects.
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
