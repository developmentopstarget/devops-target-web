"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What kinds of businesses do you work with?",
    a: "Small and mid-size businesses, founders, and operators who need reliable technical work done without hiring a full-time developer. Our clients range from solo consultants needing a professional web presence to operations teams automating internal workflows.",
  },
  {
    q: "How does a typical project start?",
    a: "We start with a short scoping call to understand what you need and what's already in place. From there we put together a fixed-scope proposal — clear deliverables, timeline, and price — so there are no surprises.",
  },
  {
    q: "What does AI automation actually mean for my business?",
    a: "It means identifying the tasks your team does manually and repeatedly — data entry, report generation, lead processing, document handling — and building systems that do them automatically. We build these with tools like OpenAI, n8n, Make, and custom scripts depending on what fits best.",
  },
  {
    q: "How long does a website project take?",
    a: "A focused marketing or portfolio site typically takes 2–4 weeks. A more complex web app with authentication, a CMS, or third-party integrations runs 4–8 weeks. We scope it clearly upfront so you know what to expect.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. We offer monthly technical operations retainers covering monitoring, maintenance, updates, and small improvements. Many clients keep us on after launch to handle the ongoing technical side of their business.",
  },
  {
    q: "What tools and platforms do you work with?",
    a: "On the web side: Next.js, TypeScript, Vercel, Tailwind. For automation: n8n, Make, Zapier, OpenAI, Python. For integrations: REST APIs, webhooks, HubSpot, Airtable, QuickBooks, Shopify, and most standard SaaS tools. If you use it, we can probably connect to it.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
            FAQ
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Common questions
          </h2>
          <p className="mt-4 text-zinc-400">
            The things people usually ask before we get started.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-white/5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-white">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
