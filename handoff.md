# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth via djoser, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

**Next.js 16 breaking change in play**: `middleware.ts` is renamed to `proxy.ts` (exported function `proxy`, same behavior). This repo now has `src/proxy.ts` — do not recreate a `middleware.ts` file.

## Current State

- Branch: `main`.
- Working tree: storefront (landing, PLP, PDP, cart, checkout) and basic structure are intact.
- **This session's changes**: fixed referential stability leak in `CartProvider.tsx` (`getServerSnapshot` now returns a cached empty array reference `EMPTY_CART` to prevent React 19 warning/infinite loop).
- `npm run build` — passes.
- `npm run lint` — clean, no errors/warnings.
- **Backend state**: No live Django backend running locally during verification; authentication state was checked using stubs and static route handler setups.

## Files in Flight

None.

## Changed This Session

- Audited the current Next.js workspace structure against the project roadmap in Obsidian (`DevOps-Target.md`).
- Modified `src/components/commerce/CartProvider.tsx` to resolve the referential stability leak in `getServerSnapshot()`.
- Validated project build and lint (`npm run lint && npm run build` successfully passed).

## Failed Attempts

- None this session.

## Important Context

- **2FA is a stub on purpose**: django-otp hasn't landed in the `api` repo yet (planned Phase 4). `/verify-2fa` and `POST /api/auth/verify-2fa` exist as a real UI + seam, but there's no actual challenge/verify backend call.
- Token storage tradeoff: httpOnly cookie (server-set via Route Handlers) chosen over localStorage/memory.
- `NEXT_PUBLIC_API_BASE_URL` must be set (in `.env.local`, not committed) before talking to a real backend.

## Next Step

1. Stage and commit the `CartProvider.tsx` fix.
2. Build `/categories/[slug]` dynamic routing to support navbar/category tiles navigation.
3. Build the `/account` profile/settings route and nested sub-routes (orders, addresses, security, notifications).
4. Run live verification of authentication routes against the `devops-target-api` server once running.

## Commands to Run First

- `git status --short`
- `git diff`
- `npm run dev`
