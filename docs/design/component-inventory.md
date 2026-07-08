# DevOps Target — Component Inventory
Foundation v1.0 · reusable components with variants, props, and states.

> Build order: implement **primitives** (`/components/ui`) first, then **commerce** and **layout** compositions, then screens. Every component consumes tokens from `design-tokens.md` / `theme.css` — no hard-coded colors. All are TypeScript, mobile-first, LTR/RTL-safe, keyboard accessible. Props below are the intended public API; keep required props minimal with sensible defaults.

## 1. Primitives — `components/ui/`

### Button
- **Variants:** `primary` (accent bg), `secondary` (surface + border), `ghost` (transparent), `danger` (danger bg), `link`.
- **Sizes:** `sm`, `md` (default), `lg`, `icon`.
- **Props:** `variant`, `size`, `fullWidth?`, `loading?`, `disabled?`, `iconStart?`, `iconEnd?`, `as?` (button/anchor).
- **States:** default, hover, active, focus-visible (ring), disabled, **loading** (spinner + label hidden/disabled).

### IconButton
- Square, `rounded-full`. Props: `icon`, `label` (aria), `size`, `variant`. Used for theme toggle, bell, search trigger, qty +/−.

### Input / Textarea
- **Props:** `label`, `hint?`, `error?`, `iconStart?`, `type`, `required?`.
- **States:** default, focus (accent ring), error (danger border + message), disabled. Mobile font ≥16px.

### Select
- Native-first styled select (accessible). Props: `label`, `options`, `value`, `onChange`, `error?`.

### Badge / Pill
- **Variants:** `neutral`, `accent`, `success`, `warning`, `danger`, `info`.
- Use: stock status, "Sale", "New", category tags. Micro-label typography.

### Tag / Chip (removable)
- For active filters. Props: `label`, `onRemove?`.

### Avatar
- Props: `src?`, `name` (initials fallback), `size`. `rounded-full`.

### Card
- Slots: `header?`, `body`, `footer?`. Resting `shadow-sm` (light) / border (dark), hover `shadow-md` where interactive.

### Modal / Dialog
- Props: `open`, `onClose`, `title`, `size`. Focus-trapped, Esc + backdrop close, scroll-locked. `rounded-2xl`.

### Drawer / Sheet
- Side (cart, filters) and bottom (mobile actions). Props: `open`, `onClose`, `side` (`right`/`bottom`). Backdrop dismiss.

### Dropdown / Popover
- Anchored menu. Outside-click + Esc close, route-change close (RDA lesson). Used by avatar menu, notifications, sort.

### Toast
- **Variants:** success, error, info, warning. Auto-dismiss + manual close. Stacked, top/bottom configurable. For "Added to cart", errors.

### Tooltip
- Hover/focus label for icon-only controls.

### Skeleton
- Shimmer blocks. Presets: `SkeletonText`, `SkeletonCard`, `SkeletonProductCard`, `SkeletonRow`.

### EmptyState
- Props: `icon`, `title`, `description`, `action?`. Icon tile + text + CTA (no illustrations).

### ErrorState / ErrorBanner
- Inline banner (danger soft bg) with message + `Retry`. Prefer keeping cached data visible beneath.

### Pagination
- Props: `page`, `pageCount`, `onChange`. Numbered + prev/next; compact on mobile.

### Breadcrumbs
- RTL-safe separators. For catalog → category → product.

### Rating (stars)
- Props: `value`, `count?`, `readOnly?`. Half-star support.

### Tabs / SegmentedControl
- For product detail (Specs / Reviews / Shipping) and account sections.

## 2. Commerce — `components/commerce/`

### PriceTag
- **Props:** `amount`, `currency`, `compareAt?` (strikethrough original), `size` (`sm`/`lg`).
- JetBrains Mono. Sale shows compareAt struck + current in danger. RTL/currency-position aware.

### StockBadge
- Maps stock → Badge: in-stock (success), low-stock (warning, "Only N left"), out-of-stock (danger).

### QtyStepper
- **Props:** `value`, `min` (0/1), `max` (stock), `onChange`. `−`/input/`+`. Disables at bounds; loading while updating.

### ProductCard
- **Props:** `product`, `onAddToCart?`, `href`.
- Composition: image (aspect-square), StockBadge, title (2-line clamp), key spec line, Rating, PriceTag, add-to-cart Button.
- **States:** default, hover (lift `shadow-md`), loading (`SkeletonProductCard`), out-of-stock (dimmed + disabled CTA).

### ProductGrid
- Responsive grid (2 → 3 → 4 → 5 cols). Handles loading (skeletons) and empty (EmptyState).

### ProductGallery
- Product detail image viewer: main image + thumbnails, swipe on mobile, zoom on desktop.

### SpecTable
- Key/value hardware specs (CPU, RAM, storage…). Mono values. Zebra rows.

### BuyBox
- Product detail purchase panel: PriceTag, StockBadge, QtyStepper, Add-to-cart + Buy-now Buttons, delivery estimate, wishlist toggle.

### CartLineItem
- Image, title, unit PriceTag, QtyStepper, line total, remove. Compact mobile layout.

### CartSummary / OrderSummary
- Subtotal, shipping, tax, discount, total (mono). Promo-code Input. Checkout Button.

### FilterPanel
- Category, price range, brand, spec facets (RAM, storage), in-stock toggle. Sidebar on desktop, Drawer on mobile. Shows active filter Chips + "Clear all".

### SortDropdown
- Relevance, price ↑/↓, newest, rating.

### AddressForm / AddressCard
- Checkout + account. RTL-aware fields; country/region Select.

### PaymentForm
- Stripe Elements wrapper. Loading, card error, processing states.

### OrderStatusStepper
- Placed → Paid → Shipped → Delivered. Horizontal (desktop) / vertical (mobile).

## 3. Layout & navigation — `components/layout/`

### Navbar (top)
- Logo mark + wordmark, primary nav, search (⌘K hint, collapses to icon < `lg`), theme toggle, cart button (item-count badge), notifications bell (auth), avatar menu (auth) / Login+Register (guest). Sticky.

### MobileBottomNav
- Fixed bottom bar (safe-area aware): Home, Shop, Cart, Account. Hidden on checkout/chat composer.

### SearchBar / SearchOverlay
- Input + suggestions; overlay on mobile. Submits to `/search`.

### CartButton
- Icon + count badge; opens cart Drawer or routes to `/cart`.

### NotificationsDropdown
- Bell + unread dot + popover list + "View all". Backed by the Django notifications API.

### AvatarMenu
- Identity header, Account, Orders, Security, divider, Sign out (danger).

### Footer
- Columns (Shop, Support, Company, Legal), newsletter Input, payment/social icons, locale + theme.

### ThemeToggle
- Sun/moon IconButton via next-themes. Persists; no flash on load.

### LocaleToggle (LTR/RTL)
- Language switch that sets `dir` + locale. English (LTR) / Arabic or Farsi (RTL).

### AppShell / Container
- Max-width, gutters, section spacing wrapper.

## 4. Cross-cutting states (every data view implements)

| State | Component | Notes |
|---|---|---|
| loading | Skeleton preset | Initial load only; keep chrome static |
| empty | EmptyState | Icon + copy + CTA |
| error | ErrorState/Banner | Retry; keep cached data if present |
| success feedback | Toast | "Added to cart", "Order placed" |

## Related
- `design-tokens.md` / `theme.css` — tokens these consume.
- `app-map.md` — which screens compose which components.
