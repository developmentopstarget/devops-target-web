# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Current State

- **Branch**: `feature/phase-d-payments-ui`.
- **Working Tree Status**: Completed full i18n pass on checkout, success, and order details pages, routing all user-facing strings through the existing translation dictionary in `src/lib/useLanguage.ts` and removing inline language ternaries.
- **What Works**:
  - Replaced Stripe payment placeholder with a localized (EN + Farsi/RTL) chooser.
  - Default payment method is **Manual Bank Transfer** on load.
  - Zarinpal Gateway option is **greyed out and unselectable** (marked `disabled: true` with opacity-50 and cursor-not-allowed). Its description displays a "Coming soon" ("بهزودی" / "Coming soon") subtitle.
  - Checkout page constrains its width on large viewports (`lg+`) instead of stretching edge-to-edge.
  - "View order" button on success page redirects to `/account/orders`.
  - Quote modal renders in a body portal (`createPortal`) with SSR guards.
  - 100% localization of checkout steps, pickup/delivery fields, error banners, success pages, stepper labels, order lists, and order detail pages.
  - Status labels in `checkout.ts` map to translation keys instead of hardcoded English.
  - No inline lang ternaries.
  - Localized date formatting for orders.
  - Next.js production build (`npm run build`) and ESLint (`npm run lint`) pass completely and cleanly.

## Files in Flight

None.

## Changed This Session

- `src/lib/useLanguage.ts`:
  - Added new English and Persian keys for checkout steps, checkout success, order history, order items quantities, payment receipts, fulfillment details, and order status labels.
- `src/lib/checkout.ts`:
  - Replaced hardcoded English labels in `ORDER_STATUS_LABELS` with translation keys mapping to `TranslationKey` from `useLanguage.ts`.
  - Updated `getOrderStatusLabel` return types.
- `src/app/checkout/page.tsx`:
  - Localized all messages, validations, secure payment taglines, titles, and payment summaries using `t()`.
  - Extracted loading spinner to a separate client-side nested loader `CheckoutLoading` to cleanly support SSR/Suspense.
- `src/components/commerce/ContactStep.tsx`:
  - Localized titles, field labels, and email updates opt-in text.
- `src/components/commerce/DeliveryMethod.tsx`:
  - Localized delivery method names, prices, and descriptions.
- `src/components/commerce/AddressForm.tsx`:
  - Localized pickup contact, delivery address, street address, city, postal code, and phone fields.
- `src/components/layout/CheckoutHeader.tsx`:
  - Localized the "Secure checkout" badge label.
- `src/app/checkout/success/page.tsx`:
  - Localized "No recent order found" empty state titles and action buttons.
- `src/components/commerce/OrderConfirmation.tsx`:
  - Localized order confirmed headers, description text, and dynamic fulfillment summaries.
  - Switched placed date format to use `lang === "fa" ? "fa-IR" : "en-US"` locale.
- `src/components/commerce/OrderStatusStepper.tsx`:
  - Localized stepper stage titles (Placed, Paid, Ready for pickup, Picked up, Shipped, Delivered).
- `src/components/commerce/OrderReview.tsx`:
  - Localized order review items, quantities, subtotal, promo, delivery fees, estimated tax, and totals.
- `src/app/account/orders/page.tsx`:
  - Localized breadcrumbs, empty state descriptions, table headers (Order Number, Date Placed, Total Amount), badge statuses, quantities, andfulfillment details.
  - Localized date format to use Farsi locale `fa-IR` when language is `fa`.
- `src/app/account/orders/[id]/page.tsx`:
  - Localized breadcrumbs, details page title, back actions, tracker headers, badge status, items list, fulfillment/contact details, payment receipt rows, print invoice actions, and support actions.
  - Localized date format to use Farsi locale `fa-IR` when language is `fa`.

## Failed Attempts

- None.

## Important Context

- Farsi/RTL is now the default layout on initial page load, and the language toggle switches between Farsi and English correctly as expected with no leftover English on the checkout, success, or orders pages.

## Next Step

1. Continue with Phase E/F backend or security integration (2FA OTP verification / `/verify-2fa`).

## Commands to Run First

- `npm run lint`
- `npm run build`

## Completed Milestones

- **Milestone 1 — Storefront Layout and Skeletons**: Core store pages, cart structure, checkout steps, payment mocks are operational.
- **Milestone 2 — Secure Account Route Tree (`/account`)**: Fully implemented profile setting, orders list/details log, addresses CRUD management, and helper API proxies with offline stubs (Completed: 2026-07-09).
- **Layout and Responsive Corrections**: Pixel-perfect mobile-first navigation bar locking, bottom menu global persistence, content offset wrapping, and boundary bleeding prevention complete (Completed: 2026-07-09).
- **Farsi Translation Dynamic Pass**: Complete localization mapping and binding across the storefront utilities, account route tree, buy box sections, shopping cart layouts, home page, product catalog, notification center, and footer (Completed: 2026-07-09).
- **Milestone 3 — Live Checkout Integration**: Checkout `Pay` creates a real, owner-scoped, server-recomputed order via Django, decrements real stock, and confirms payment via real Stripe Elements or a clearly-marked simulated path depending on configured keys; errors handled (Completed: 2026-07-10).
- **Order History ↔ Live Backend Reconciliation**: `/account/orders` and `/account/orders/[id]` render real, owner-scoped Django orders (Completed: 2026-07-10).
- **Mobile Layout Grids and Search RTL Alignment**: Mobile nav elements locked to LTR. Search input alignments corrected (Completed: 2026-07-10).
- **Mobile Bottom Nav Translation Sync**: Applied `t()` helper universally across mobile nav tab labels (Completed: 2026-07-10).
- **Desktop/Mobile Nav Stabilization**: Desktop navbar categorical cleanup, LTR navbar locking, and MobileBottomNav visibility control complete (Completed: 2026-07-10).
- **Widescreen Container Alignments**: Integrated `Container` wraps in navbar and profile dashboard (Completed: 2026-07-10).
- **Desktop & Mobile Notifications Dropdowns**: Bell dropdown menus aligned contextually under the icons instead of full page drawers (Completed: 2026-07-10).
- **Cart Summary & Auth Pages Localization Sweep**: Dynamic English/Farsi localization mappings completed with password eye toggles (Completed: 2026-07-10).
- **Milestone 4 — Store Branding Update**: Combined corporate logo asset and wordmark integrated on header and footer (Completed: 2026-07-10).
- **Milestone 5 — Phase C Frontend Quote System**: Implemented quote request modals, history lists, and custom checkout flows (Completed: 2026-07-11).
- **Milestone 6 — Phase D Iranian Payments UI**: chooser for Online Zarinpal and Manual Bank Transfer, active accounts listing with copy feedback, modern receipt file uploader, API route proxies with mocks, and Farsi status badge integrations (Completed: 2026-07-11).
- **Milestone 7 — Comprehensive i18n & Localization Pass**: Completed routing all user-facing strings through `useLanguage` for the checkout, success, and orders pages, with type-safe order status badge translations (Completed: 2026-07-11).
