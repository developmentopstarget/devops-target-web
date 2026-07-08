# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

## Current State

- Branch: `main` (clean, up to date with origin).
- Remote: `git@github.com:developmentopstarget/devops-target-web.git` (private).
- Deployed target: Vercel.
- Built so far: landing/marketing sections — `Hero`, `Navbar`, `Services`, `About`, `Portfolio`, `Testimonials`, `FAQ`, `ContactCTA`, `Footer` (in `src/components/`), assembled in `src/app/page.tsx`.
- Already rebranded for DevOps Target.
- App Router + TypeScript + Tailwind 4 + Turbopack configured.

## Files in Flight

None. Working tree clean.

## Changed Recently (housekeeping session)

- Repo renamed `website-starter` → `devops-target-web` on GitHub.
- Local folder moved to `~/AI/Projects/devops-target/web`.
- Remote URL updated to the new name; connection verified (`ssh -T git@github.com` OK).
- Repo set to private.

## Important Context

- Frontend of a 2-repo project; backend lives at `../api` (`devops-target-api`).
- The old Django repo (`../api`) still contains a legacy **Vite/JS** frontend under `api/frontend/` — its working logic (AuthContext, ThemeToggle, Chat websocket, Navbar) is to be **ported into this Next.js app as TypeScript**, then retired. Do not build against that old frontend.
- Design workflow: each screen is mocked **mobile-first → desktop** as an HTML mockup, then handed off as a thin spec. Build order: tokens → `/components/ui` primitives → screens → wiring.
- SEO pages (landing, product list, product detail) = Server Components with metadata. App pages (cart, checkout, account, chat, notifications) = Client Components.
- Full plan: see `devops-target-roadmap.md` (in the Mockups design project).

## Next Step

Phase 1 — foundation files not yet created: `design-tokens.md`, component inventory, app map. After that, scaffold `/components/ui` primitives, then build storefront screens.

## Commands to Run First

- `pwd`
- `git branch --show-current`
- `git status`
- `git log --oneline -5`
- `npm install` (if `node_modules` missing)
- `npm run dev` / `npm run build`
