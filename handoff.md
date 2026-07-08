# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

## Current State

- Branch: `main`.
- Committed: landing page (`/`) and product listing (`/products`) — both merged via prior commits (`299a479`, `f340c52`).
- **Uncommitted this session**: product detail page (`/products/[slug]`) — complete and buildable, awaiting review/approval.
- `npm run build` — passes. Routes: `/` (static), `/products` (dynamic, searchParams-driven), `/products/[slug]` (SSG via `generateStaticParams`, all 19 catalog slugs prerendered, `revalidate = 3600`).
- `npm run lint` — clean, no errors/warnings.
- Manually verified `/products/[slug]` in Chrome: gallery thumbnail swap, qty stepper bounds, add-to-cart with qty (toast + cart badge bump), wishlist toggle, out-of-stock state (disabled "Notify me"/"Buy now"), empty-reviews state, tabs (click + content correctness), light/dark theme, desktop (1440px) + mobile (390px) with sticky buy bar, `notFound()` → real 404 for unknown slugs, no console errors.
- Confirmed via `curl`: all 4 tab panels' content (Specs/Overview/Reviews/Shipping) present in raw server-rendered HTML regardless of active tab (SEO requirement), canonical link tag, Product + BreadcrumbList JSON-LD both present.

## Files in Flight

None — `/products/[slug]` is complete and buildable. Next action is user review + commit approval.

## Changed This Session (product detail page)

**Data layer**
- `src/data/product-details.ts` (new) — `ProductDetail`/`ProductReview`/`SpecRow` types, `getProductDetail(product)`. One hand-authored entry (`macbook-air-13-m3`) matches `product-detail.html` mockup exactly (Chip/GPU/Memory/Display/Battery/Ports/Weight specs, the two named reviews). Every other catalog product falls back to `buildFallbackDetail()`, which derives specs from existing `brand`/`ram`/`storage`/`spec` fields and only attaches sample reviews when `reviewCount > 60` — deliberately leaves ~8 products with zero reviews so the "Be the first to review" empty state has real, non-faked coverage.
- `CartProvider.addItem(quantity = 1)` — extended from a no-arg bump so the buy box can add N units in one call.

**`src/components/commerce/`** (new) — `ProductGallery` (client: main image + 4 thumbnail buttons, sale/new badge, dimmed on out-of-stock), `QtyStepper` (client: −/input/+, clamps to min/max), `BuyBox` (server shell: brand/H1/rating-line/PriceTag+Save badge/tax line/stock row/assurance list), `BuyBoxActions` (client island: qty + add-to-cart + buy-now + wishlist), `WishlistButton` (client, local-only toggle), `SpecTable` (server, zebra mono rows), `ProductTabs` (client: `role=tab`/`tabpanel`, arrow-key/Home/End navigation, panels stay in the DOM via `hidden` attribute so all content is server-rendered for SEO regardless of active tab), `ReviewSummary` (client: rating + "Write a review" → toast stub, no real form yet), `ReviewList` (empty/loading/error states mirroring `ProductGrid`'s dormant pattern — loading/error props exist for future async wiring but aren't exercised by this static-data page), `StickyBuyBar` (mobile-only fixed bottom bar, hidden at `lg`).

**`src/components/seo/ProductJsonLd.tsx`** (new) — full `Product` schema (name, sku, description, brand, offers, aggregateRating, review[]) via the shared `JsonLdScript` helper; omits `image` (no real product photography yet — placeholder icons only, didn't want to fabricate a fake image URL).

**`src/components/ui/icons.tsx`** — added `HeartIcon`, `ReturnIcon`.

**`src/app/products/[slug]/page.tsx`** (new) — `generateStaticParams` (all catalog slugs) + `revalidate = 3600`; `generateMetadata` per product (title/description/canonical); `notFound()` for unknown slugs; layout: `Breadcrumbs` → `[lg: ProductGallery | BuyBox]` → `ProductTabs` (Specs/Overview/Reviews/Shipping) → related `ProductGrid` ("You might also like", same-category first, backfilled from rest of catalog) → `Footer` → `StickyBuyBar`. `BreadcrumbJsonLd` (reused from `/products`) + `ProductJsonLd` both render server-side.

## Failed Attempts

- None this session — the one real gotcha (Button variant color-class precedence) was caught and fixed during the landing-page session; see git history (`299a479`) if it recurs elsewhere.

## Important Context

- Frontend of a 2-repo project; backend lives at `../api` (`devops-target-api`).
- **No `MobileBottomNav` on `/products/[slug]`** — deliberate, matches `product-detail.html` mockup exactly: the sticky buy bar replaces it on mobile (having both would be two competing fixed-bottom bars). `<main>` gets `pb-[76px] lg:pb-0` so the sticky bar doesn't cover footer content. If a future page needs both, revisit this pattern rather than copy it blindly.
- Gallery and related-product thumbnails are **decorative icon placeholders** (category icon + 3 generic device icons), not real per-product photography — same placeholder convention as `ProductCard` on `/` and `/products`. `images: string[]` should replace this once the Django API serves real asset URLs; `ProductGallery` and `ProductJsonLd`'s missing `image` field are the two spots to update then.
- Internal links to not-yet-built routes (`/cart`, `/login`, `/categories/[slug]`, etc.) will 404 until those phases land — same accepted tradeoff as prior sessions (real intended IA over `href="#"` placeholders).
- `ProductGrid`'s `loading`/`error`/`onRetry` props (and now `ReviewList`'s) are intentionally unused by any current page — both pages read fully-synchronous static data, so faking a loading flash would be worse UX than not having one. These props exist so a future client-side/API-backed version of either component can flip them on without an API change.
- Design workflow: each screen is mocked mobile-first → desktop as an HTML mockup (`docs/design/mockups/`), then handed off as a thin spec. Foundation docs (`design-tokens.md`, `theme.css`, `component-inventory.md`, `app-map.md`) are the source of truth for tokens/components.
- SEO pages (landing, product list, product detail) = Server Components with metadata. App pages (cart, checkout, account, chat, notifications) = Client Components.

## Next Step

Get user approval and commit `/products/[slug]` (staged explicitly, not `git add .`). Then, per `app-map.md` build priority: `/cart` (client, guest-ok) — the first page that needs `CartProvider` state to actually persist/list items rather than just track a count, which will likely require lifting cart state out of individual page trees into the root layout.

## Commands to Run First

- `git status --short`
- `git branch --show-current`
- `npm run build`
- `npm run lint`
- `npm run dev` (check `/`, `/products`, and `/products/[slug]` — both themes, desktop + mobile width)
