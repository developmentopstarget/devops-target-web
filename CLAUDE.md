@AGENTS.md

# CLAUDE.md

## Project

This is a reusable website starter for fast business, portfolio, landing-page, and client website builds.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- ESLint
- Turbopack

## Main Goal

Build polished, responsive, production-ready websites quickly while keeping code clean, reusable, and easy to customize.

## Coding Rules

- Do not commit unless the user explicitly approves.
- Do not edit `.env` files or secrets.
- Do not add generated build folders such as `.next/`, `out/`, or `dist/`.
- Keep changes focused and reviewable.
- Prefer reusable components.
- Prefer simple, maintainable code over clever code.
- Use TypeScript properly.
- Use responsive Tailwind classes.
- Keep mobile layout clean.
- Avoid fake broken links.
- Avoid heavy dependencies unless necessary.
- Run `npm run build` after meaningful changes.
- Show a short summary and changed files before asking for commit approval.

## Design Rules

- Build modern, clean, high-quality UI.
- Use strong spacing, typography, contrast, and responsive layout.
- Use tasteful gradients, cards, borders, shadows, and section separation.
- Avoid clutter.
- Do not use paid assets.
- Use placeholder content that is easy to replace.
- Prefer reusable website sections:
  - Navbar
  - Hero
  - Services
  - About
  - Portfolio / work cards
  - Testimonials
  - FAQ
  - Contact CTA
  - Footer

## Workflow

For every feature:

1. Inspect the current files.
2. Make a short implementation plan.
3. Edit files.
4. Run `npm run build`.
5. Show summary.
6. Show changed files.
7. Do not commit until the user approves.

## Deployment Target

Primary deployment target is Vercel.

Secondary deployment target for static sites is GitHub Pages.

## Project Handoff Rule

Every project must keep a root-level `handoff.md` file.

Before ending a coding session, running `/clear`, switching AI tools, stopping work for the day, opening a PR, merging a PR, debugging a major issue, or changing deployment/config behavior, update `handoff.md`.

The handoff must capture the current project state only. Do not include old unrelated conversation history.

Required sections:

# Goal

What we are trying to build, fix, or ship.

## Current State

Include:
- current branch
- working tree status
- what works
- what is still broken
- latest test/build status if known

## Files in Flight

Files actively edited or likely relevant next.

## Changed This Session

What was touched, created, deleted, refactored, configured, or tested.

## Failed Attempts

What was tried but did not work, including the reason if known.

## Important Context

Decisions, assumptions, constraints, warnings, credentials/account context, deployment notes, or "do not change" items.

## Next Step

The single next action to take first in a fresh session.

## Commands to Run First

Exact commands the next AI/dev session should run before editing.

## Completed Milestones

- **Milestone 1 — Storefront Layout and Skeletons**: Core store pages, cart structure, checkout steps, payment mocks are operational.
- **Milestone 2 — Secure Account Route Tree (`/account`)**: Fully implemented profile setting, orders list/details log, addresses CRUD management, and helper API proxies with offline stubs (Completed: 2026-07-09).

