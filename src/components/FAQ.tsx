"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does your process work?",
    a: "We start with a discovery session to understand your goals and constraints, then move into strategy, design, and development sprints. You'll have visibility and input at every stage through shared tools and weekly syncs.",
  },
  {
    q: "What does a typical project cost?",
    a: "Projects range from $15k for a focused marketing site to $150k+ for a complex web application. We provide a detailed fixed-price proposal after discovery, so there are no surprises.",
  },
  {
    q: "How long does a project take?",
    a: "Most branding and website projects wrap up in 6–10 weeks. Larger product builds typically run 3–6 months. We work in focused sprints to keep momentum high.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Yes — we love working with founders at the idea and MVP stage. We offer a lean starter package designed to validate your concept and build credibility without overspending.",
  },
  {
    q: "What happens after launch?",
    a: "We offer ongoing retainer support for maintenance, iteration, and growth. Many clients work with us for years after their initial launch.",
  },
  {
    q: "Can you work with our existing tech stack?",
    a: "In most cases, yes. We're framework-agnostic on the frontend and have experience integrating with most backends and CMSes. We'll let you know in discovery if we see any blockers.",
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
            Everything you need to know before we start working together.
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
