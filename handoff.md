# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth via djoser, live chat, notifications, AI). Separate repo/folder (`../api`), locally at `/Users/user/AI/Projects/devops-target/api`.

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

**Next.js 16 breaking change in play**: `middleware.ts` is renamed to `proxy.ts` (exported function `proxy`, same behavior). This repo has `src/proxy.ts` — do not recreate a `middleware.ts` file.

## Current State

- Branch: `main`.
- Auth (djoser-based login/register/forgot/reset/2FA) is committed (`4270e93`) and earlier storefront pages (landing, PLP, PDP, cart, checkout) are committed from prior sessions.
- **This session**: wired the storefront's product catalog to the live Django API (`GET /api/products/`, `GET /api/products/{slug}/`, `GET /api/products/{slug}/reviews/`, `GET /api/categories/`), with `src/data/products.ts`/`src/data/product-details.ts` kept as an automatic fallback. Working tree has these changes staged for review, not yet committed.
- `npm run build` — passes, both with `NEXT_PUBLIC_API_BASE_URL` unset (fallback path, 19 static product pages from the placeholder catalog) and pointed at a live local Django server (fetched 19 real slugs via pagination, `/products` compiles as dynamic `ƒ`).
- `npm run lint` — clean, no errors/warnings.
- **Verified against a real running `devops-target-api` instance** (SQLite, already seeded via `seed_catalog` — 19 products, 6 categories, matching the placeholder catalog 1:1): confirmed `/products` filtering/sorting/pagination, `/products/[slug]` detail + related products + SKU, and the landing page's Hero "deal of the week" + "This week's deals" section all render real API data. Confirmed the fallback path independently: stopped the Django server mid-session and re-requested `/products?minRating=4.5` — dropped from `0` results (live API, no seeded reviews yet so `aggregate_rating` is `null` for everything) to `17` results (local fallback, which uses the placeholder catalog's hardcoded `rating` field) — proves the try/catch-to-null fallback in `src/lib/api/products.ts` actually triggers rather than just compiling.

## Files in Flight

None actively mid-edit — the catalog-API wiring is complete and buildable. Next action is user review + commit approval (stage explicitly, not `git add .`/`-A`).

## Changed This Session

**`src/lib/api/`** (new) — typed client for the Django catalog API:
- `types.ts` — raw DTO shapes matching `backend/shop/serializers.py` exactly (`ApiProduct`, `ApiProductDetail`, `ApiCategory`, `ApiReview`, `ApiPaginatedResponse<T>`). Confirmed field-for-field against the live backend's serializers/models/views in the sibling `api` repo, not guessed.
- `mappers.ts` — `mapApiProduct()`/`mapApiProductDetail()` convert the DTOs into the existing `Product`/`ProductDetail` types (`src/data/products.ts`, `src/data/product-details.ts`) unchanged, so no component had to change shape. Notable derivations (API doesn't send these fields directly): `spec` comes from `specs.spec`; `ram`/`storage` come from `specs.ram_gb`/`specs.storage_gb`; `badge` ("sale"/"new") is derived from `compare_at_price > price` or `created_at` within 30 days, since the API has no badge concept.
- `products.ts` — `fetchProducts(filters)` (reuses `filtersToQueryString()` from `products-filter.ts` so the query-param contract has one source of truth), `fetchProductBySlug(slug)` (fetches detail + `/reviews/` in parallel-ish sequence and merges), `fetchAllProductSlugs()` (walks DRF's `next` pagination cursor, capped at 200 pages, for `generateStaticParams`). All three return `null` on any failure (unconfigured base URL, network error, non-2xx) — callers always have a local fallback.
- `categories.ts` — `fetchCategories()`, returns `null` on failure. Note: `CategoryViewSet` has no pagination class, so it's a plain array response, unlike the products list.

**`src/lib/products-filter.ts`** — exported `filtersToQueryString()` (was private) so the API client and the existing href-building code share one query-string builder; added `emptyFilters` constant (default `ParsedFilters`) for call sites that need "no filters" (deals section, related products).

**`src/app/products/page.tsx`** — product list/pagination/total now come from `fetchProducts(filters)` with fallback to the existing local `filterProducts`/`sortProducts`/`paginate` pipeline over `catalog`. `categoryLabels`/`categoryOptions` names now come from `fetchCategories()` with fallback to local `categories`.

**`src/app/products/[slug]/page.tsx`** — `generateStaticParams` fetches all slugs from the API (falls back to `catalog.map(...)` if unset/unreachable). Product + detail resolution goes through a new `resolveProduct(slug)` helper (API first, local `getProductBySlug`/`getProductDetail` fallback), used by both `generateMetadata` and the page body. Related products fetch from the API filtered by category, falling back to the old same-category-then-rest logic over `catalog`.

**`src/components/sections/Hero.tsx`** — now an async Server Component; the "deal of the week" card fetches the specific featured product (`featuredDealSlug`) via `fetchProductBySlug`, falling back to `dealsOfTheWeek.find(...)`.

**`src/components/sections/Deals.tsx`** — now an async Server Component; fetches page 1 with no filters and takes the first 8 items. Django's default ordering is `-is_featured, -created_at, -id`, so this reliably surfaces the same 8 `is_featured=true` products the placeholder `dealsOfTheWeek` array hand-picked — no dedicated "deals" endpoint needed. Falls back to `dealsOfTheWeek` if the API is unavailable.

## Failed Attempts

- Tried to run a second `next dev` instance (on an incidental free port, 3001) to test against a local Django server started for this session, alongside whatever dev server the user already had running on port 3000 (PID 40061, pre-existing — left untouched). Next.js 16 enforces a single dev-server-per-directory lock and silently exited my second instance after printing "Ready". Worked around it by doing a real `npm run build` + `npx next start -p 3002` cycle instead (with a temporary, gitignored `.env.local` setting `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000` — created and deleted within this session, never committed).

## Important Context

- **The query-param contract in `products-filter.ts` was clearly designed to match the Django API 1:1** — confirmed by reading `backend/shop/views.py` in the sibling `api` repo: `category`/`brand`/`ram`/`storage` (repeatable), `priceMin`/`priceMax`/`minRating`, `inStock=1`, `sort` (`price_asc`/`price_desc`/`newest`/`rating`), `page`. Page size is fixed server-side at 12 (`ProductPagination.page_size = 12`, no client override) — matches the frontend's `PAGE_SIZE` constant.
- **Facet counts (`categoryOptions`/`brandOptions`/`ramOptions`/`storageOptions` in `/products/page.tsx`'s `buildCatalogFacets()`) are intentionally still computed from the local placeholder `catalog`, not the live API**, even when the API is reachable. There is no facet/aggregation endpoint in the given contract (`GET /api/products/` only returns the current filtered page), and building one wasn't in scope. Only `categoryOptions`' `name`/`slug` fields are live-sourced (via `fetchCategories()`); the `count` on each option is still a placeholder-catalog approximation. If real per-category/brand/ram/storage counts are ever needed, that requires a new backend aggregation endpoint — flag this as a known, deliberate gap.
- **`ProductDetail.description` will render as an empty array for every real product right now** — the seeded Django products all have `description: ""` (the `seed_catalog` management command never set it), and `mapApiProductDetail` correctly turns an empty string into `[]`. This isn't a frontend bug; it's a backend data gap. The "Overview" tab will look empty for any product until descriptions are seeded/authored on the Django side.
- **Reviews come from a separate endpoint**, `GET /api/products/{slug}/reviews/` (a DRF `@action` on `ProductViewSet`, not part of the detail payload) — `fetchProductBySlug()` calls both and merges. No products have seeded reviews yet, so `aggregate_rating` is `null` everywhere → mapped `rating: 0` for every live product. This is expected, not a mapping bug (verified directly against the API with curl).
- **`Product.badge` ("sale"/"new") is a frontend-only derived concept** — the API has no equivalent field. `mapApiProduct()` derives it heuristically (sale if `compare_at_price > price`, else new if `created_at` is within 30 days). Revisit this heuristic if the backend ever adds an explicit featured/promo flag beyond `is_featured`.
- `NEXT_PUBLIC_API_BASE_URL` was already established as the base-URL env var (from the prior auth session) — reused as-is, no new env var introduced. `.env.example` is git-ignored in this repo (`.env*` has no exception), so it's a local-only reference file, not something `git status` will ever show as changed.

## Next Step

Get user review + commit approval for the catalog-API wiring (stage explicitly: `src/lib/api/`, `src/lib/products-filter.ts`, `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/Deals.tsx`). After that, worth circling back to the facet-count gap above if real filter counts matter for launch, and to seeding real `description`/reviews data on the Django side so the PDP doesn't look sparse.

## Commands to Run First

- `git status --short`
- `git branch --show-current`
- `npm run build`
- `npm run lint`
- To test against a live backend: `cd ../api/backend && .venv/bin/python manage.py runserver 127.0.0.1:8000`, then in this repo set `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000` in `.env.local` before `npm run dev` (or `npm run build && npx next start`, since `next dev` only allows one instance per directory and env inlining differs between dev/build).
