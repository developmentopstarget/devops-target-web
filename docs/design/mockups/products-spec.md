# DevOps Target — Product Listing (`/products`) Handoff
Screen 2 of the storefront · v1.0 · references `web/docs/design/` foundations.

## Design direction

Efficient catalog browsing. Sidebar filters on desktop, filter/sort drawers on mobile. Product-forward grid reusing the exact `ProductCard` from the landing page, so the storefront language stays identical. Server-rendered for SEO; filters/sort/pagination driven by URL search params so results are shareable and indexable.

## Visual mockup

`devops-target-products.html` — resize for mobile→desktop; sun icon toggles theme. Shows the populated state with active-filter chips, a full FilterPanel, sort, 12-product grid (incl. an out-of-stock card), and pagination.

## Layout / sections

1. **Announcement + Navbar + Footer + MobileBottomNav** — reused from landing (no rebuild).
2. **Breadcrumbs** — Home / Shop / {Category}.
3. **Page header** — H1 (category or "All products") + result count (mono number).
4. **Mobile filter/sort bar** (< `lg`) — two buttons opening the Filter drawer and Sort sheet.
5. **Desktop layout** (≥ `lg`) — `264px` sticky **FilterPanel** sidebar + results column.
6. **Toolbar** — active-filter **Chips** (removable) + "Clear all" on the left; **SortDropdown** on the right (desktop).
7. **ProductGrid** — 2-col → 3 (`sm`) → 4 (`xl`). Reuses `ProductCard`.
8. **Pagination** — numbered + prev/next, compact on mobile.

## Components

**Reuse (already built):** Navbar, Footer, MobileBottomNav, AnnouncementBar, Container, ProductCard, ProductGrid, PriceTag, StockBadge, Rating, Badge, Button, IconButton, Input, Toast, CartProvider, ThemeToggle.

**New (build these):**
- `FilterPanel` — filter groups: Category (checkbox + count), Price (min/max inputs), Brand (checkbox + count), RAM & Storage (pill toggles), Rating (radio), In-stock-only (checkbox). Sidebar on desktop, drawer body on mobile.
- `FilterDrawer` — mobile Drawer wrapping FilterPanel with sticky footer (Clear / "Show N results").
- `SortDropdown` — Relevance, Price ↑, Price ↓, Newest, Top rated.
- `ActiveFilterChips` — removable chips reflecting applied filters + Clear all.
- `Pagination` — page numbers, prev/next, ellipsis.
- `Breadcrumbs`.

## State & URL model

- **State lives in URL search params** (`?category=laptops&brand=apple&ram=16&sort=price_asc&page=2`). Server reads params, filters/sorts/paginates data, renders. Chips + controls reflect params; changing a control updates the URL.
- This keeps the page a **Server Component** (SEO + shareable). Only the interactive bits (drawer open/close, pill toggles before submit) are client islands.

## Responsive behavior

- **Mobile (base):** header, sticky filter/sort bar, 2-col grid; filters open in a right-side Drawer with Clear/Show footer; sort in a bottom sheet; pagination compact.
- **`sm` (640):** 3-col grid.
- **`lg` (1024):** sidebar FilterPanel appears (sticky), mobile bar + drawer hide, inline sort shows.
- **`xl` (1280):** 4-col grid.
- No overflow at 320px; safe-area on bottom nav.

## States

- **Grid loading:** `SkeletonProductCard` × page size.
- **Empty / no results:** `EmptyState` ("No products match these filters") + "Clear all filters" action.
- **Error:** `ErrorBanner` + retry.
- **Out-of-stock card:** dimmed thumb, disabled CTA → "Notify me" (shown in mockup).
- **ProductCard:** hover lift; add-to-cart → Toast + cart badge bump.
- **Filter/sort controls:** focus rings; drawer Esc + scrim close + scroll-lock.

## SEO / rendering

- Server Component; `generateMetadata` per category (title/description).
- Canonical URL handling for filtered views (canonical → base category; avoid indexing infinite filter combos — `noindex` deep filter combos or use canonical).
- BreadcrumbList JSON-LD.
- Data from Django API later; placeholder `data/products.ts` for now (extend with brand/ram/storage fields for filtering).

## Accessibility

Filters as real `fieldset`/`legend` + labeled inputs; drawer focus-trapped; chips' remove buttons have `aria-label`; sort is a labeled `select`; WCAG AA both themes; keyboard reachable.

---

## Copy-paste prompt for Claude Code

```
Build the product listing page (route `/products`, and reuse for `/categories/[slug]`) in the `web` Next.js app.

FIRST read the foundations and reuse existing components:
- docs/design/design-tokens.md, docs/design/component-inventory.md, docs/design/app-map.md
- Reuse already-built components: Navbar, Footer, MobileBottomNav, AnnouncementBar, Container, ProductCard, ProductGrid, PriceTag, StockBadge, Rating, Badge, Button, IconButton, Input, Toast, ThemeToggle, CartProvider.
Visual reference: docs/design/mockups/products.html (match layout/spacing/tokens; use Tailwind classes bound to @theme tokens, don't copy inline CSS).

Build these NEW components (src/components/commerce or src/components/ui as appropriate, one per file, typed props):
- FilterPanel (groups: Category checkbox+count, Price min/max, Brand checkbox+count, RAM pills, Storage pills, Rating radio, In-stock-only) 
- FilterDrawer (mobile Drawer wrapping FilterPanel, sticky Clear / "Show N" footer, Esc+scrim close, scroll lock)
- SortDropdown (Relevance, Price asc/desc, Newest, Top rated)
- ActiveFilterChips (removable chips + Clear all)
- Pagination (numbers, prev/next, ellipsis)
- Breadcrumbs

Behavior & rendering:
- Page is a Server Component (SEO). Filter/sort/pagination state lives in URL search params (e.g. ?category=laptops&brand=apple&ram=16&sort=price_asc&page=2). Server reads params → filters/sorts/paginates the product data → renders. Controls update the URL (client islands only where needed: drawer open/close, pill pre-submit toggles).
- Extend data/products.ts with fields needed for filtering (brand, ram, storage, price number, rating, createdAt, stock). Keep placeholder data now; wire to Django API later.
- generateMetadata per category; add BreadcrumbList JSON-LD; set canonical to the base category and avoid indexing deep filter combinations.

Layout: breadcrumbs → page header (title + result count) → mobile filter/sort bar (<lg) → [lg: 264px sticky FilterPanel sidebar | results]. Results column = toolbar (ActiveFilterChips left, SortDropdown right) → ProductGrid (2→3→4 cols) → Pagination.

States: grid loading (SkeletonProductCard), empty (EmptyState + clear filters), error (ErrorBanner + retry), out-of-stock card (dim + "Notify me"), add-to-cart toast. Focus rings; a11y (fieldset/legend filters, aria-labels on chip remove buttons, focus-trapped drawer).

When done: run `npm run build` + `npm run lint`, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
