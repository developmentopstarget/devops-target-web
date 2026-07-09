# DevOps Target — Cart (`/cart`) Handoff
Screen 4 · v1.0 · references `web/docs/design/` foundations.

## Design direction

Clear, reassuring review-your-order page. Two columns on desktop (line items | sticky order summary), stacked on mobile with a sticky checkout affordance. Local signals (free local delivery / same-day pickup, secure Stripe checkout) in the summary. Guest-ok — no login required to view or edit.

## ⚠️ Architectural prerequisite (do this first)

This is the first page where the cart must **persist and list real items**, not just track a count. Before building the UI:

1. **Lift `CartProvider` from page scope to the root layout** (`src/app/layout.tsx`), so cart state is shared across every route (landing, listing, detail, cart). Today it's instantiated inside `page.tsx` trees.
2. **Upgrade the cart model** from a count to line items: `CartItem { productId, slug, name, brand, spec, unitPrice, compareAt?, image?, quantity, maxStock }`. Keep `addItem(product, quantity)`, add `updateQty(id, qty)`, `removeItem(id)`, and derived `subtotal`/`count`.
3. **Persist to `localStorage`** (hydration-safe, same `useSyncExternalStore`/no-effect pattern the ThemeToggle uses) so the cart survives refresh — matches the mockup's "resets on refresh is not acceptable for cart" need.
4. The existing `ToastProvider` and cart badge should now read from the lifted provider.

## Visual mockup

`devops-target-cart.html` — top demo bar toggles Populated / Empty / theme (presentation only, not part of the UI). Populated shows 3 line items (incl. a low-stock one), full order summary with applied promo, and empty state.

## Layout / sections

1. **Navbar / announcement** — reused.
2. **Header** — "Your cart", item count, "← Continue shopping" link.
3. **Desktop** (`≥960px`): `1fr / 340px` — line items | sticky **OrderSummary**.
4. **CartLineItem** (each): thumb, brand eyebrow, title, spec/variant, stock line, **QtyStepper** (reuse), Remove, line price.
5. **OrderSummary**: promo-code Input + Apply, Subtotal, Promo discount, Local delivery (FREE over threshold), Estimated tax, **Total** (large mono), Checkout button, trust row (Stripe, delivery/pickup), payment marks.
6. **Empty state**: cart icon, "Your cart is empty", copy, "Start shopping" CTA.

## Components

**Reuse:** Navbar, AnnouncementBar, Container, QtyStepper, PriceTag, Button, IconButton, Input, EmptyState, Toast, CartProvider (now lifted).

**New (build):**
- `CartLineItem` — row with qty/remove; optimistic update.
- `OrderSummary` — totals math + promo + checkout CTA.
- `PromoCode` — input + apply + applied/invalid states.
- `/app/cart/page.tsx` — client page reading the lifted CartProvider.

## Behavior / calculations

- **Totals** computed client-side from line items: subtotal = Σ(unitPrice×qty); discount from applied promo; delivery FREE if subtotal ≥ threshold (`storeConfig.deliveryThreshold`) else a flat fee; tax = rate × (subtotal − discount) [placeholder rate now, real from backend later]; total = subtotal − discount + delivery + tax.
- **Qty change / remove** update state + totals immediately (optimistic); removing last item → empty state.
- **Promo:** applying a code validates against a placeholder list now (backend later); show applied chip / invalid message.
- Cart count badge in navbar reflects live state.

## Responsive behavior

- **Mobile:** stacked — line items then summary; QtyStepper + remove wrap cleanly; summary full-width; consider a sticky "Checkout · $total" bar (optional, like detail's buy bar).
- **`≥960px`:** two columns, summary sticky.
- No overflow at 320px.

## States

- **Populated / empty** (both in mockup).
- **Line item:** qty updating (disable stepper briefly), removing (fade/optimistic), low/out-of-stock badge; if an item goes out of stock, flag it and block checkout for it.
- **Promo:** idle / applied / invalid / applying.
- **Checkout button:** disabled if cart empty or has an unavailable item; loading on click.
- Focus rings; toasts for remove ("Removed — Undo?") optional.

## Rendering

- **Client Component** (`'use client'`), `noindex` — cart is session-specific, not for SEO.
- Data from the lifted CartProvider (localStorage now; sync to Django cart API later).

## Accessibility

Qty inputs labeled; Remove buttons `aria-label` incl. product name; summary uses a `dl`/rows with clear labels; totals announced; WCAG AA both themes.

---

## Copy-paste prompt for Claude Code

```
Build the cart page (route `/cart`) in the `web` Next.js app. Guest-ok, client-rendered, noindex.

FIRST do the architectural prerequisite, then the UI:
1. Lift CartProvider from page scope into the ROOT layout (src/app/layout.tsx) so cart state is shared across all routes. Wrap the app once; remove the per-page CartProvider instances on `/`, `/products`, `/products/[slug]`.
2. Upgrade the cart model from a count to line items: CartItem { productId, slug, name, brand, spec, unitPrice, compareAt?, image?, quantity, maxStock }. API: addItem(product, quantity=1), updateQty(id, qty), removeItem(id), clear(); derived subtotal + count. Update existing AddToCartButton/BuyBoxActions to pass the product, not just bump a count.
3. Persist cart to localStorage, hydration-safe (use the same useSyncExternalStore/no-effect pattern as ThemeToggle — avoid the react-hooks/set-state-in-effect lint rule). Cart badge + toasts read from the lifted provider.

Read foundations + reuse: docs/design/design-tokens.md, component-inventory.md, app-map.md; reuse Navbar, AnnouncementBar, Container, QtyStepper, PriceTag, Button, IconButton, Input, EmptyState, Toast.
Visual reference: docs/design/mockups/cart.html (match layout/spacing/tokens; Tailwind classes bound to @theme tokens, not inline CSS).

Build NEW (one per file, typed):
- CartLineItem (thumb, brand, title, spec, stock line, QtyStepper, Remove, line price; optimistic updates)
- OrderSummary (Subtotal, Promo discount, Local delivery [FREE if subtotal >= storeConfig.deliveryThreshold else flat fee], Estimated tax [placeholder rate], Total; Checkout button; trust row; payment marks)
- PromoCode (input + Apply; applied chip / invalid message; validate against a placeholder code list now)
- src/app/cart/page.tsx (client, reads lifted CartProvider)

Behavior: totals recompute from line items on any qty/remove/promo change (optimistic); removing last item shows EmptyState ("Your cart is empty" + Start shopping CTA); checkout button disabled when empty or an item is unavailable, loading on click; navbar cart badge reflects live count.
Layout: header (title + count + "Continue shopping") → [>=960px: line items | sticky OrderSummary(340px)] → mobile stacks. Empty state replaces the two-column layout.
States: populated/empty, qty updating, remove (optimistic + optional Undo toast), promo idle/applied/invalid, low/out-of-stock line flagging. Focus rings; a11y (labeled qty inputs, aria-label remove w/ product name, dl summary).

When done: run `npm run build` + `npm run lint`, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
