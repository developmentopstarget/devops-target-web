# DevOps Target — Checkout (`/checkout`) Handoff
Screen 5 · v1.0 · references `web/docs/design/` foundations.

## Design direction

Focused, low-distraction checkout: slimmed header (brand + "Secure checkout" lock only, no full nav), single accordion-ish column of steps, sticky order summary. Local-shop first: **Same-day pickup vs Local delivery** is the primary delivery choice. Guest-ok. Client-rendered, `noindex`.

## Visual mockup

`devops-target-checkout.html` — theme toggle in the slim header. Steps: Contact → Delivery method (pickup/delivery radio cards) → Address → Payment (Stripe placeholder) → sticky summary with "Pay $total".

## Layout / sections

1. **Slim header** — brand + "Secure checkout" lock + theme toggle. No nav/cart icons (reduce exits).
2. **Two-column** (`≥920px`: `1fr / 360px`): steps | sticky OrderSummary.
3. **Step 1 Contact** — email + opt-in checkbox.
4. **Step 2 Delivery method** — radio cards: **Same-day pickup** (store address, ~2 hr) / **Local delivery** (next business day, free over threshold). Selecting pickup **hides the address card**.
5. **Step 3 Address** — name, address, city, postal, phone (only when delivery chosen; for pickup, collect pickup-person name/phone instead).
6. **Step 4 Payment** — Stripe Elements (card number, expiry, CVC) + "billing same as delivery" toggle.
7. **OrderSummary** — compact line items (reuse cart totals logic), subtotal, promo, delivery/pickup, tax, total, **Pay {total}** button, Stripe trust line.

## Order confirmation (separate route)

`/checkout/success` (or `/order/[id]`): success icon, order number, pickup/delivery summary, itemized receipt, `OrderStatusStepper` (Placed → Paid → Ready/Shipped → Picked up/Delivered), "Continue shopping" + "View order" CTAs. Reached after Stripe payment succeeds.

## Components

**Reuse:** OrderSummary/totals logic (from cart), Button, Input, Select, Badge, Toast, CartProvider (read items), `formatCurrency`, `storeConfig`.

**New (build):**
- `/app/checkout/page.tsx` (client), `/app/checkout/success/page.tsx`.
- `CheckoutSteps` container; `ContactStep`, `DeliveryMethod` (pickup/delivery radio cards), `AddressForm` (reused later in account), `PaymentForm` (Stripe Elements wrapper), `OrderReview`.
- `OrderStatusStepper`, `OrderConfirmation`.

## Behavior / integration

- Reads cart from the lifted `CartProvider`; empty cart → redirect to `/cart`.
- **Stripe:** use `@stripe/stripe-js` + `@stripe/react-stripe-js`; create a PaymentIntent via the Django backend later (`/api/checkout/intent`), confirm card payment, then create the order and route to success. For now (no backend), stub the intent + simulate success so the flow is demoable; mark the stub clearly.
- Delivery method toggles address requirement; pickup uses `storeConfig` address + a ~2 hr ready estimate.
- Totals recomputed from cart (subtotal, promo, delivery fee rule, tax placeholder, total).

## States

- Field validation (inline errors, required); email format; card errors from Stripe.
- Submit: button loading ("Processing…"), disabled if invalid/empty cart.
- Payment error banner (declined/network) with retry, cart preserved.
- Pickup vs delivery switch; billing-same-as toggle.
- Success page states: paid, and (later) pending/failed.

## Accessibility & security

Labeled fields, `fieldset`/`legend` per step, keyboard order top-to-bottom; PaymentForm via Stripe Elements (PCI-safe, card never touches our server); WCAG AA both themes; announce payment errors.

---

## Copy-paste prompt for Claude Code

```
Build the checkout flow (routes `/checkout` and `/checkout/success`) in the `web` Next.js app. Client-rendered, guest-ok, noindex.

Read foundations + reuse: docs/design/design-tokens.md, component-inventory.md, app-map.md; reuse OrderSummary totals logic + formatCurrency + storeConfig + the lifted CartProvider + Button/Input/Select/Badge/Toast.
Visual reference: docs/design/mockups/checkout.html (match layout/spacing/tokens; Tailwind classes bound to @theme tokens, not inline CSS).

Build:
- src/app/checkout/page.tsx (client): slim header (brand + "Secure checkout" lock + ThemeToggle, no nav/cart), two-column (>=920px: steps 1fr | sticky OrderSummary 360px). Steps: Contact (email + opt-in) → DeliveryMethod (radio cards: Same-day pickup [storeConfig address, ~2hr] vs Local delivery [free over storeConfig.deliveryThreshold]) → AddressForm (shown only for delivery; pickup collects pickup-person name/phone) → PaymentForm (Stripe Elements) + billing-same-as toggle.
- Components (one per file, typed): DeliveryMethod, AddressForm (reusable for account later), PaymentForm (Stripe Elements wrapper), OrderReview, OrderStatusStepper, OrderConfirmation.
- src/app/checkout/success/page.tsx: success icon, order number, pickup/delivery summary, itemized receipt, OrderStatusStepper, Continue shopping / View order CTAs.

Behavior:
- Read cart from CartProvider; empty cart → redirect to /cart.
- Stripe: integrate @stripe/stripe-js + @stripe/react-stripe-js. PaymentIntent will come from the Django backend later (POST /api/checkout/intent); for now STUB the intent and simulate a successful payment so the flow is demoable end-to-end — clearly mark the stub with a TODO and keep the real-call seam obvious.
- Totals reuse cart logic (subtotal, promo, delivery rule, tax placeholder, total). On pay success → create order (stub) → route to /checkout/success.

States: inline field validation + required; submit loading ("Processing…"), disabled when invalid/empty; Stripe card errors + payment-error banner with retry (cart preserved); pickup/delivery toggle hides/shows address; success page paid state. Focus rings; fieldset/legend per step; a11y announcements for payment errors; WCAG AA both themes.

When done: npm run build + npm run lint, show summary + changed files, update handoff.md. Add @stripe deps to package.json. Do not commit until I approve; stage files explicitly.
```
