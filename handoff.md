# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Current State

- **Branch**: `feature/phase-d-payments-ui`.
- **Working Tree Status**: Completed Phase D Frontend Iranian Payments implementation with Online Zarinpal option set as disabled/coming soon.
- **What Works**:
  - Replaced Stripe payment placeholder with a localized (EN + Farsi/RTL) chooser: "Online Gateway (Zarinpal)" and "Manual Bank Transfer (Card-to-Card / Sheba)".
  - Default payment method is **Manual Bank Transfer** on load.
  - Zarinpal Gateway option is **greyed out and unselectable** (marked `disabled: true` with opacity-50 and cursor-not-allowed). Its description displays a "Coming soon" ("بهزودی" / "Coming soon") subtitle.
  - Submit paths are guarded; Zarinpal initiation will block early if triggered.
  - Next.js API proxy routes created under `src/app/api/payments/`:
    - `bank-accounts`: GET endpoint to fetch active bank accounts (or mocks if API_BASE_URL is unset).
    - `bank-transfer`: POST endpoint to upload receipt screenshot image file and reference number via multipart/form-data.
    - `zarinpal/initiate`: POST endpoint to start Online Zarinpal payment and obtain redirect URL (dormant but fully intact).
  - Interactive "Copy" buttons next to Card Number and Sheba Number with copied-state feedback ("Copied!" / "کپی شد!") resetting after 2 seconds.
  - Modern receipt screenshot file uploader supporting file type constraints (`.png`, `.jpg`, `.jpeg`), size constraints (max 5MB), and showing file metadata and thumbnail previews.
  - Checkout redirect gate to `/login?next=/checkout` immediately on mount if user is unauthenticated.
  - Maps order status `awaiting_verification` to the first stage on the stepper, and renders a distinct Farsi warning badge ("در انتظار تأیید") on order history list (`/account/orders`) and details page (`/account/orders/[id]`).
  - Next.js production build (`npm run build`) and ESLint (`npm run lint`) pass completely and cleanly.

## Files in Flight

None.

## Changed This Session

- `src/components/commerce/OrderSummary.tsx`: Replaced dummy toast checkout stub with Next.js router navigation pushing to `/checkout` on click, and dropped the now-unused `useToast` import.
- `src/app/layout.tsx`: Updated the root HTML element default language to `fa` and direction to `rtl`.
- `src/lib/useLanguage.ts`: Changed initial useState states for `lang` to `"fa"` and `dir` to `"rtl"` to load Farsi (RTL) layout by default.

## Failed Attempts

- None.

## Important Context

- Replaced Stripe entirely as requested.
- Kept the Zarinpal proxy and initiate fetch logic completely intact but dormant (guarded at the beginning of the handler).
- Farsi/RTL is now the default layout on initial page load, and the language toggle switches between Farsi and English correctly as expected.

## Next Step

1. Continue with Phase E/F backend or security integration (e.g. 2FA with django-otp).

## Commands to Run First

- `git status --short`
- `npm run lint`
- `npm run build`

## Completed Milestones

- **Milestone 1 — Storefront Layout and Skeletons**: Core store pages, cart structure, checkout steps, payment mocks are operational.
- **Milestone 2 — Secure Account Route Tree (`/account`)**: Fully implemented profile setting, orders list/details log, addresses CRUD management, and helper API proxies with offline stubs (Completed: 2026-07-09).
- **Layout and Responsive Corrections**: Pixel-perfect mobile-first navigation bar locking, bottom menu global persistence, content offset wrapping, and boundary bleeding prevention complete (Completed: 2026-07-09).
- **Farsi Translation Dynamic Pass**: Complete localization mapping and binding across the storefront utilities, account route tree, buy box sections, shopping cart layouts, home page, product catalog, notification center, and footer (Completed: 2026-07-09).
- **Milestone 3 — Live Checkout Integration**: Checkout `Pay` creates a real, owner-scoped, server-recomputed order via Django (`/api/orders`, `/api/checkout/intent`), decrements real stock, and confirms payment via real Stripe Elements or a clearly-marked simulated path depending on configured keys; errors (auth, oversell, decline, empty cart) all handled (Completed: 2026-07-10).
- **Order History ↔ Live Backend Reconciliation**: `/account/orders` and `/account/orders/[id]` now render real, owner-scoped Django orders (via the existing authenticated `/api/orders` proxy) instead of the old mock shape, with a customer-facing label for Django's full order-status vocabulary, loading/empty/error states, and an offline mock fallback reshaped to match the live API (Completed: 2026-07-10).
- **Mobile Layout Grids and Search Input RTL Alignment**: Mobile navigation elements (bottom navigation order, top header row order, search bar structure) locked to LTR. Search input text, placeholder, and cursor dynamically align right in Farsi mode (Completed: 2026-07-10).
- **Mobile Bottom Nav Translation State Synchronization Fix**: Applied the `t()` helper universally across all mobile bottom navigation tab labels to prevent selection-dependent English fallbacks while preserving the LTR horizontal layout order (Completed: 2026-07-10).
- **Desktop and Mobile Navigation Structural Stabilization**: Cleaned legacy categorical link groups from the desktop navbar, locked the desktop header row elements positioning and direction flow (LTR) across all locales, and added responsive display class controls to hide the MobileBottomNav on larger screen viewports (Completed: 2026-07-10).
- **Desktop Header Widescreen Container Integration**: Wrapped the desktop row inner layout in `Navbar.tsx` with the centralized `Container` layout utility, ensuring logo and right controls align cleanly on widescreen monitors without viewport edge drift (Completed: 2026-07-10).
- **Account Profile Widescreen Bounds Synchronization**: Wrapped the account sidebar and sub-route content views in `src/app/account/layout.tsx` inside the centralized `Container` utility component and removed edge stretching styling classes (`w-full`, `max-w-full`, etc.) from layout/page wrappers, matching the desktop navbar structural limit (Completed: 2026-07-10).
- **Desktop Notification Dropdown Refactor and Profile Page Cleanup**: Refactored the desktop notification bell behavior to toggle an inline contextual dropdown menu directly beneath the bell icon, and completely removed the "Notifications" sidebar item from the account settings sidebar layout (Completed: 2026-07-10).
- **Desktop Notification Dropdown Anchoring and Clipping Fix**: Positioned the desktop notification dropdown directly beneath the bottom edge of the navbar by using `absolute top-full right-0 mt-0 w-80 bg-surface border-x border-b rounded-b-lg shadow-lg z-50` relative to the full-height `h-full` bell icon wrapper container, and removed `overflow-hidden` from the outer `<header>` element to prevent clipping of the dropdown list (Completed: 2026-07-10).
- **Desktop Notification Dropdown Offset & Corner Rounding Adjustments**: Adjusted the absolute positioning offset classes of the desktop notification dropdown to `top-full mt-3 rounded-lg` in `Navbar.tsx`, dropping it safely down to clear the bottom horizontal divider of the navbar and restoring rounded-lg styling on all four corners (Completed: 2026-07-10).
- **Mobile Notification Dropdown Refactor**: Modified mobile notification behavior in `Navbar.tsx` to toggle a floating absolute dropdown card (`absolute top-full right-2 left-2 mt-3 max-w-[calc(100vw-16px)] bg-surface border rounded-lg shadow-xl z-50`) instead of mounting the full-screen drawer. Provided a click-to-close transparent backdrop (`fixed inset-0 z-40 bg-transparent`) to dismiss the drawer when tapping outside (Completed: 2026-07-10).
- **Cart Order Summary Localization Sweep**: Fully localized the checkout/cart summary panels and promo code input blocks into Farsi and English, while locking the container layout strictly to LTR (Completed: 2026-07-10).
- **Profile Dashboard Layout Optimization**: Corrected the profile account sub-route layout stack flow to vertically align sidebar card navigation links on mobile/tablet dimensions and horizontally split only on desktop viewports (Completed: 2026-07-10).
- **Auth Views Language Toggles, Pass Eye reveal & Full Localization**: Integrated inline language toggle switchers in `AuthCard`, native password show/hide eye reveal switches in `Input`, and 100% dynamic English/Farsi localization mapping across login, registration, and forgot-password pages (Completed: 2026-07-10).
- **Authentication Forms Input Alignment & Icon Overlapping Fix**: Enforced Left-to-Right direction (`text-left dir-ltr`) on all username, email, and password inputs, moved field icons to the absolute right side, and spaced the password reveal button (`right-9`) and Lock icon (`right-3`) to prevent layout collision (Completed: 2026-07-10).
- **Hero Location Tag Badge Cleanup**: Removed the Springfield local store tagline pushpin badge from the main landing page hero content block, allowing the main typography title to sit cleanly at the top of the hero grid layout (Completed: 2026-07-10).
- **Secondary Hero Button Shortening**: Updated secondary button labels on the hero section to "Custom PC" (English) and "کیس سفارشی" (Farsi) to be shorter, cleaner, and more direct (Completed: 2026-07-10).
- **Milestone 4 — Store Branding Update and Logo Integration**: Deployed the combined corporate logo and wordmark asset, simplified primary header branding, and updated dynamic and contextual brand references in the footer (Completed: 2026-07-10).
- **Milestone 5 — Phase C Frontend Quote System**: Fully implemented localized product quote buttons, QuoteRequestModal, quotes history route panel under /account/quotes, and custom checkout flow integration to pay for approved quotes via order_id parameter query (Completed: 2026-07-11).
- **Milestone 6 — Phase D Iranian Payments UI**: Implemented chooser for Online Zarinpal and Manual Bank Transfer, active accounts listing with copy feedback, modern receipt file uploader, API route proxies with mocks, and Farsi status badge integrations (Completed: 2026-07-11).
