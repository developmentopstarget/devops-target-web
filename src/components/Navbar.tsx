"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-500/25 tracking-tight">
            DT
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            DevOps<span className="text-violet-400"> Target</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:scale-105"
          >
            Start a project
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-zinc-400 transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-400 transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-400 transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d14] px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-zinc-400 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="#contact"
                className="inline-block rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Start a project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
