# DevOps Target — Landing Page (`/`) Handoff
Screen 1 of the storefront · v1.0 · references `web/docs/design/` foundations.

## Design direction

Local computer store, product-forward, trustworthy. Indigo-on-slate, light-first with dark mode. City-specific signals (pickup, free local delivery, in-store experts, local warranty) run through the hero, value props, and store block — this is what separates it from a generic national store. Mobile-first single column → 4-col catalog on desktop. Server-rendered for SEO.

## Visual mockup

`devops-target-landing.html` — responsive (resize the browser to see mobile→desktop), light/dark toggle in the navbar (sun icon), realistic product data. Built entirely on the locked tokens.

## Section breakdown (top → bottom)

1. **Announcement bar** — free local delivery + same-day pickup. City + threshold are swap points.
2. **Navbar** — logo/wordmark, primary nav (Shop/Laptops/PCs/Components/Deals/Support), search (hidden < `lg`, becomes hamburger), theme toggle, account, cart (count badge), "Shop now" CTA (≥`lg`). Mobile: hamburger opens left drawer.
3. **Hero** — eyebrow "{City}'s computer store", H1, lead, two CTAs (Shop / Build a PC), three trust ticks. Right: featured "Deal of the week" product card (visual placeholder for real image).
4. **Categories** — 6 tiles (Laptops, Desktops & PCs, Components, Monitors, Peripherals, Networking): 2-col mobile → 3 `sm` → 6 `lg`.
5. **This week's deals** — `ProductGrid` of 8 `ProductCard`s (2-col → 3 → 4). Each: thumb, Sale/New badge, StockBadge (in/low), title (2-line clamp), spec line, rating, PriceTag (+ struck compareAt), Add-to-cart.
6. **Value props** — 4 cards: same-day pickup, expert build/repair, local warranty, price-match. 2-col → 4-col.
7. **Build-a-PC banner** — accent gradient, service pitch, CTA.
8. **Store / local** — address, phone, hours + map placeholder. 1-col → 2-col. All fields are swap points.
9. **Newsletter** — email capture (local deals).
10. **Footer** — brand blurb + Shop/Support/Company columns, payment marks, city line.
11. **Mobile bottom nav** (preview) — Home/Shop/Cart/Account, hidden ≥`lg`.

## Components used (from `component-inventory.md`)

Navbar, MobileBottomNav, Drawer, SearchBar, CartButton, IconButton, ThemeToggle, Button (primary/secondary, lg, full), Badge, StockBadge, PriceTag, Rating, ProductCard, ProductGrid, Card, Input, Footer. Build any missing primitive first.

## Responsive behavior

- **Mobile (base):** single column; hamburger + drawer; search hidden; hero visual stacks under copy; 2-col categories/products; full-width CTAs; sticky bottom nav.
- **`sm` (640):** 3-col categories/products; trust row wraps inline.
- **`lg` (1024):** inline nav + search appear, hamburger + bottom nav hide; hero becomes 2-col (copy | product); 6-col categories; 4-col products; store block 2-col.
- No horizontal overflow at 320px. Respect iOS safe-area on bottom nav.

## States

- **ProductCard:** default, hover (lift + `shadow-md`), out-of-stock (dim + disabled CTA), loading (`SkeletonProductCard`).
- **Deals grid:** loading (skeletons), error (ErrorBanner + retry), empty (unlikely on landing — hide section).
- **Add to cart:** success Toast ("Added to cart"); optimistic count badge bump.
- **Newsletter:** inline success/error; disable while submitting.
- **Buttons/links:** hover, active, focus-visible ring.

## SEO / rendering

- Server Component (SSG/ISR). `generateMetadata` with title/description already stubbed in `layout.tsx`.
- Add **LocalBusiness** + **Product** JSON-LD (store name, city, address, phone, hours; featured products).
- Real product/category data from the Django API at build/revalidate; mock array in the HTML is placeholder only.

## Local swap points (replace before launch)

City name (`Springfield`), delivery threshold (`$99`), address (`128 Market Street`), phone (`(555) 019-2847`), hours, map embed, product catalog, payment marks.

## Accessibility

Semantic `header/nav/main/section/footer`; `aria-label` on icon buttons; keyboard-reachable; WCAG AA in both themes; `alt` on real product images; visible focus rings.

---

## Copy-paste prompt for Claude Code

```
Build the landing page (route `/`) for the DevOps Target storefront — a city-specific computer shop — in the `web` Next.js app (Next 16, App Router, React 19, TypeScript, Tailwind v4).

FIRST read these foundation files and follow them exactly:
- docs/design/design-tokens.md
- docs/design/theme.css   (integrate into src/app/globals.css; also apply the Inter + JetBrains Mono swap in src/app/layout.tsx per design-tokens.md — remove Geist)
- docs/design/component-inventory.md
- docs/design/app-map.md
Visual reference: the attached devops-target-landing.html mockup (match layout, spacing, tokens; do not copy its inline CSS — use Tailwind classes bound to the @theme tokens).

Rules:
- Mobile-first, then scale up (sm/lg breakpoints as in the mockup). Light + dark via next-themes (.dark class). LTR/RTL-safe (logical properties).
- Build missing primitives first under src/components/ui, commerce components under src/components/commerce, layout under src/components/layout — one component per file, typed props, no required prop without a default.
- Landing is a Server Component (SSG/ISR). Interactive pieces (theme toggle, cart button, add-to-cart, mobile drawer, newsletter form) are Client Components.
- Use realistic placeholder product/category data via a typed module now; wire to the Django API later. Keep all city/store details (city, address, phone, hours, delivery threshold) in one config/constants file so they're easy to swap.
- Add generateMetadata + LocalBusiness and Product JSON-LD.
- Implement states: ProductCard hover/out-of-stock/skeleton; deals grid loading/error; add-to-cart success toast; newsletter submitting/success/error; visible focus rings.
- Accessibility: semantic landmarks, aria-labels on icon buttons, WCAG AA both themes.

Sections in order: announcement bar, navbar (+ mobile drawer), hero (copy + featured deal), category tiles (6), "This week's deals" ProductGrid (8), value props (4), build-a-PC banner, store/local block (address/hours/map), newsletter, footer, mobile bottom nav.

When done: run `npm run build`, show a summary + changed files, and update handoff.md before stopping. Do not commit until I approve. Stage files explicitly (no `git add .`).
```
