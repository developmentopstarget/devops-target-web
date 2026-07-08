# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

## Current State

- Branch: `main`.
- Working tree: landing page rebuild is complete and unstaged (nothing committed yet — awaiting user approval).
- `npm run build` — passes, `/` prerenders as static content.
- `npm run lint` — clean, no errors/warnings.
- Manually verified in Chrome: light/dark theme toggle, mobile drawer (open/close/Esc), desktop + 390px mobile viewport, add-to-cart (toast + cart badge bump), out-of-stock state, newsletter form.
- Landing route `/` is now the full storefront design from `docs/design/mockups/landing.html`, replacing the previous agency-style marketing page.

## Files in Flight

None — feature is complete and buildable. Next action is user review + commit approval.

## Changed This Session

**Foundation**
- `src/app/globals.css` — replaced with `docs/design/theme.css` token set (`.dark` class variant, light/dark tokens, shadows-as-borders in dark mode).
- `src/app/layout.tsx` — swapped Geist → Inter + JetBrains Mono (`next/font/google`), added `ThemeProvider` (next-themes, `attribute="class"`), updated site metadata/OG copy for the computer-shop brand, `suppressHydrationWarning` on `<html>`.
- Added dependency: `next-themes`.

**Config / data** (`src/config/`, `src/data/`)
- `config/store.ts` — single swap point for city, address, phone, hours (with structured `dayOfWeek`/`opens`/`closes` for JSON-LD), delivery threshold, social links.
- `config/nav.ts` — primary nav + bottom nav link lists.
- `data/categories.ts`, `data/products.ts` — typed placeholder catalog data (6 categories, 8 deal products incl. one `out-of-stock` item for state coverage). Swap for the Django API later.

**`src/components/ui/`** (primitives) — Button (variant incl. new `onAccent` for on-brand-color surfaces), IconButton (+ `iconButtonClassName` export for link-styled icon buttons), Input, Badge, Card, Rating, Skeleton/SkeletonProductCard, Toast/ToastProvider, EmptyState, ErrorBanner, icons.tsx (shared inline SVG set, no icon library dependency).

**`src/components/commerce/`** — PriceTag, StockBadge, ProductCard, ProductGrid (loading/error/empty), CartProvider (context: count + addItem), AddToCartButton (client island).

**`src/components/layout/`** — Container, ThemeProvider (client wrapper), ThemeToggle (hydration-safe via `useSyncExternalStore`, not an effect), CartButton, SearchBar, MobileDrawer (Esc + scrim + scroll lock), MobileBottomNav, Navbar, Footer, AnnouncementBar.

**`src/components/sections/`** (landing-only compositions) — Hero, CategoryTiles, Deals + DealsSection (client island wrapping ProductGrid), ValueProps, BuildPCBanner, StoreLocal, Newsletter (client, submitting/success/error states).

**`src/components/seo/JsonLd.tsx`** — `ElectronicsStore` (LocalBusiness) + `Product` (per deal) JSON-LD, escapes `<` to guard against script-tag breakout.

**`src/app/page.tsx`** — full reassembly: `CartProvider` + `ToastProvider` wrap `AnnouncementBar → Navbar → Hero → CategoryTiles → Deals → ValueProps → BuildPCBanner → StoreLocal → Newsletter → Footer → MobileBottomNav`, plus `generateMetadata` (dynamic description from `storeConfig`) and `<JsonLd />`.

**Removed** (superseded, no longer referenced): `src/components/{Hero,Services,About,Portfolio,Testimonials,FAQ,ContactCTA,Navbar,Footer}.tsx` — the old AI-automation-agency landing sections.

## Failed Attempts

- Initial `BuildPCBanner` CTA used `variant="secondary"` with a `className` override (`bg-white text-accent`) to make it read on the accent gradient. This silently broke in **dark mode**: Tailwind utility precedence is based on stylesheet generation order, not className string order, so `text-primary` (from the variant) intermittently beat `text-accent` (from the override), producing near-invisible light-on-white text. Fixed by adding a real `onAccent` Button variant instead of overriding conflicting color utilities via className — caught only by an actual browser check in dark mode, not by build/lint.

## Important Context

- Frontend of a 2-repo project; backend lives at `../api` (`devops-target-api`).
- Internal links (`/products`, `/products/[slug]`, `/categories/[slug]`, `/deals`, `/cart`, `/login`, `/about`, `/contact`, `/faq`, `/blog`, `/support`) point at routes defined in `docs/design/app-map.md` but **not yet built** — they will 404 until those phases land. This was a deliberate choice over `href="#"` placeholders: real intended IA now, not fake links. In-page anchors (`#build-a-pc`, `#store-local`) do work today.
- Cart/toast state (`CartProvider`/`ToastProvider`) is currently local-only (in-memory, resets on refresh) and scoped inside `page.tsx`, not the root layout — fine for this page; revisit if `/cart` needs to share the same cart instance across routes (likely needs to move to layout or a persisted store then).
- `ThemeToggle` intentionally avoids `useEffect` + `setState` for the mount-detection flag (`react-hooks/set-state-in-effect` lint rule) — uses `useSyncExternalStore` instead. Keep this pattern if touching theme-dependent client components.
- Design workflow: each screen is mocked mobile-first → desktop as an HTML mockup (`docs/design/mockups/`), then handed off as a thin spec. Foundation docs (`design-tokens.md`, `theme.css`, `component-inventory.md`, `app-map.md`) are the source of truth for tokens/components — already created and now consumed.
- SEO pages (landing, product list, product detail) = Server Components with metadata. App pages (cart, checkout, account, chat, notifications) = Client Components.

## Next Step

Get user approval and commit this landing page work (staged explicitly, not `git add .`). Then move to Build priority #2 per `app-map.md`: `/products` listing page (ProductGrid + FilterPanel + SortDropdown + Pagination), reusing the `ui`/`commerce` primitives built here.

## Commands to Run First

- `git status --short`
- `git branch --show-current`
- `npm run build`
- `npm run lint`
- `npm run dev` (verify `http://localhost:3000/` — check both themes and mobile width)
