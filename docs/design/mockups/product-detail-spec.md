# DevOps Target — Product Detail (`/products/[slug]`) Handoff
Screen 3 of the storefront · v1.0 · references `web/docs/design/` foundations.

## Design direction

The conversion + SEO page. Two-column on desktop (sticky gallery | buy box), single column on mobile with a sticky bottom buy bar. Specs presented in a clean mono table (fits a hardware store). Trust/local signals in the buy box (same-day pickup, local warranty, returns). Server-rendered with full Product JSON-LD.

## Visual mockup

`devops-target-product-detail.html` — resize for mobile→desktop; theme toggle in navbar. Working: quantity stepper, tab switching. Shows gallery + thumbnails, buy box, spec table, tabs (Specs/Overview/Reviews/Shipping), related grid, and the sticky mobile buy bar.

## Layout / sections

1. **Navbar / announcement / footer** — reused.
2. **Breadcrumbs** — Home / Shop / {Category} / {Product}.
3. **Product top** (`lg`: 1.1fr / 0.9fr, sticky gallery):
   - **ProductGallery** — main image (4:3) + thumbnail strip; sale badge overlay. Mobile: swipeable; desktop: click thumb to swap, optional zoom.
   - **BuyBox** — brand eyebrow, H1, rating line (stars + count link to reviews + SKU), PriceTag (current + struck compareAt + "Save $X"), tax/delivery line, stock row, **QtyStepper**, Add-to-cart + wishlist + Buy-now, assurance list (pickup / warranty / returns).
4. **Tabs** — Specs (SpecTable), Overview (copy), Reviews (summary + list + write-review), Shipping & returns.
5. **Related products** — 2-col → 4-col ProductGrid ("You might also like").
6. **Sticky mobile buy bar** (< `lg`) — price + Add-to-cart, fixed bottom.

## Components

**Reuse:** Navbar, Footer, AnnouncementBar, Container, Breadcrumbs, ProductCard, ProductGrid, PriceTag, StockBadge, Rating, Badge, Button, IconButton, Toast, CartProvider, ThemeToggle.

**New (build):**
- `ProductGallery` — main + thumbnails, client (image swap/zoom/swipe).
- `BuyBox` — composition (mostly server; add-to-cart + qty are client).
- `QtyStepper` — −/input/+, min 1, max = stock; client.
- `SpecTable` — key/value rows, mono values, zebra.
- `ProductTabs` — client tabs (Specs/Overview/Reviews/Shipping); keep panels in DOM for SEO or render server-side with client toggle.
- `ReviewList` / `ReviewSummary` (+ future write-review).
- `StickyBuyBar` — mobile only, client.
- `WishlistButton` — client toggle.

## Rendering / SEO (critical page)

- **Server Component**; `generateStaticParams` for known slugs + ISR for freshness.
- `generateMetadata` per product (title, description, OG image = product image).
- **Product JSON-LD**: name, image, brand, sku, description, `offers` (price, priceCurrency, availability), `aggregateRating`, `review`.
- BreadcrumbList JSON-LD.
- Canonical self-URL.
- Data from Django API later; extend `data/products.ts` with detail fields (images[], full specs map, description, reviews[], brand, sku) — keep placeholder now.

## Responsive behavior

- **Mobile:** single column (gallery → buy box → tabs → related); sticky bottom buy bar; tab head scrolls horizontally.
- **`lg` (1024):** two columns, gallery sticky; buy bar hides (CTAs live in the buy box); related 4-col.
- No overflow at 320px; safe-area on sticky bar.

## States

- **In / low / out of stock:** stock row + CTA change; out-of-stock → "Notify me" (disabled add), sticky bar mirrors.
- **QtyStepper:** disable `−` at 1, `+` at max stock; reflect in add-to-cart.
- **Add to cart:** Toast + cart badge bump; button loading during add.
- **Gallery:** selected-thumb state; loading skeleton for main image.
- **Reviews:** empty ("Be the first to review"), loading, error.
- **Not found:** unknown slug → `notFound()` (Next 404).
- Focus rings; tabs keyboard-navigable (roving tabindex / arrow keys).

## Accessibility

Gallery thumbs are buttons with `aria-label`; tabs use proper `role="tab"`/`tabpanel`/`aria-selected`; stepper input labeled; single H1 (product name); WCAG AA both themes.

---

## Copy-paste prompt for Claude Code

```
Build the product detail page (route `/products/[slug]`) in the `web` Next.js app.

FIRST read foundations and reuse existing components:
- docs/design/design-tokens.md, docs/design/component-inventory.md, docs/design/app-map.md
- Reuse: Navbar, Footer, AnnouncementBar, Container, Breadcrumbs, ProductCard, ProductGrid, PriceTag, StockBadge, Rating, Badge, Button, IconButton, Toast, CartProvider, ThemeToggle.
Visual reference: docs/design/mockups/product-detail.html (match layout/spacing/tokens; use Tailwind classes bound to @theme tokens, don't copy inline CSS).

Build NEW components (one per file, typed props):
- ProductGallery (client: main image + thumbnail strip, swap, mobile swipe, desktop zoom optional)
- QtyStepper (client: −/input/+, min 1, max = stock)
- BuyBox (brand, H1, rating line, PriceTag with compareAt + save, tax/delivery line, stock row, QtyStepper, Add-to-cart + Wishlist + Buy-now, assurance list) — server shell + client islands for qty/add
- SpecTable (key/value rows, mono values, zebra)
- ProductTabs (client: Specs / Overview / Reviews / Shipping; role=tab/tabpanel, arrow-key nav; render content server-side so it's in the DOM for SEO)
- ReviewSummary + ReviewList (empty/loading/error states)
- StickyBuyBar (mobile-only client: price + add-to-cart)
- WishlistButton (client toggle)

Rendering & SEO (this is the key SEO page):
- Server Component. generateStaticParams for known product slugs + ISR. generateMetadata per product (title, description, OG image). Unknown slug → notFound().
- Add Product JSON-LD (name, image, brand, sku, description, offers{price, priceCurrency, availability}, aggregateRating, review) + BreadcrumbList JSON-LD. Canonical self URL.
- Extend data/products.ts with detail fields (images[], specs map, description, brand, sku, reviews[]) and a getProductBySlug helper; keep placeholder data, wire to Django API later.

Layout: breadcrumbs → [lg: sticky ProductGallery (1.1fr) | BuyBox (0.9fr)] → ProductTabs (Specs/Overview/Reviews/Shipping) → related ProductGrid ("You might also like"). Mobile: single column + StickyBuyBar fixed at bottom.

States: in/low/out-of-stock (out → "Notify me", disabled add, mirrored in sticky bar); qty bounds; add-to-cart toast + badge + button loading; gallery selected-thumb + image skeleton; reviews empty/loading/error; focus rings; keyboard-navigable tabs.

When done: run `npm run build` + `npm run lint`, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
