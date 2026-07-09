# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth via djoser, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

**Next.js 16 breaking change in play**: `middleware.ts` is renamed to `proxy.ts` (exported function `proxy`, same behavior). This repo now has `src/proxy.ts` — do not recreate a `middleware.ts` file.

## Current State

- **Branch**: `main`.
- **Working Tree Status**: All core routes and `/account` route tree are fully implemented and verified.
- **What Works**:
  - Storefront pages (Landing `/`, products list `/products`, product detail `/products/[slug]`, cart `/cart`, checkout `/checkout`, confirmation `/checkout/success`).
  - Account root `/account` profile/settings linked to GET/PATCH `/api/auth/me` API proxies (with theme selectors and a layout language direction RTL/LTR toggle).
  - Addresses management panel `/account/addresses` with full add/edit/delete/set-default CRUD linked to `/api/addresses`.
  - Orders list `/account/orders` and dynamic details page `/account/orders/[id]` linked to `/api/orders` and using `OrderStatusStepper`.
  - Security configuration `/account/security` with change-password and 2FA simulation.
  - Notifications list `/account/notifications` and Wishlist `/account/wishlist` (linked to `useCart` hook).
  - Server proxies `/api/auth/me`, `/api/addresses`, `/api/addresses/[id]`, `/api/orders` with local mock state fallbacks when Django backend is offline.
- **Latest Build Status**: `npm run build` compiled and typed checked successfully (Finished TypeScript and finalized static page prerendering successfully).

## Files in Flight

None.

## Changed This Session

- Implemented `/account/layout.tsx` persistent sidebar layout shell.
- Implemented `/account/page.tsx` user profile page with GET/PATCH forms.
- Implemented `/account/addresses/page.tsx` CRUD address book interface.
- Implemented `/account/orders/page.tsx` customer order list.
- Implemented `/account/orders/[id]/page.tsx` itemized receipt details page.
- Implemented `/account/security/page.tsx` change password & simulated 2FA forms.
- Implemented `/account/notifications/page.tsx` notification lists.
- Implemented `/account/wishlist/page.tsx` saved products page linked to cart.
- Added PATCH handler to `/api/auth/me` proxy.
- Created route proxies `/api/addresses/route.ts`, `/api/addresses/[id]/route.ts`, and `/api/orders/route.ts` with global sync mock fallbacks.
- Verified compilation and type checking via `npm run build`.

## Failed Attempts

- Fixed a TypeScript error in `/api/addresses/[id]/route.ts` where `typeof mockAddresses` was referenced but not defined locally; resolved by changing the fallback type annotation to `any[]`.

## Important Context

- **2FA is a stub on purpose**: django-otp hasn't landed in the `api` repo yet (planned Phase 4). `/verify-2fa` and `POST /api/auth/verify-2fa` exist as a real UI + seam, but there's no actual challenge/verify backend call.
- Token storage tradeoff: httpOnly cookie (server-set via Route Handlers) chosen over localStorage/memory.
- `NEXT_PUBLIC_API_BASE_URL` must be set (in `.env.local`, not committed) before talking to a real backend.

## Next Step

1. Connect the local environment to the live `devops-target-api` server.
2. Run end-to-end user checkout flows and order tracking verify tests using the Django admin portal.

## Commands to Run First

- `git status --short`
- `npm run dev`
