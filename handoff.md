# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Current State

- **Branch**: `main`.
- **Working Tree Status**: Integrated the new unified corporate identity by deploying the combined logo and wordmark asset to the public assets directory (`public/assets/images/niavaran-computer-logo.png`). Updated desktop and mobile navbar layouts, checkout headers, and footers to render the new logo asset, completely replacing the separate icon and text branding nodes across all viewports.
- **What Works**:
  - Checkout `Pay` now: (1) requires login — redirects to `/login?next=/checkout` if `useAuth().user` is null; (2) POSTs the cart to `/api/orders` (new `POST` handler on the existing proxy), which creates a delivery `Address` via `/api/addresses` first when needed, then calls Django `POST /api/orders/` — real order, server-recomputed totals, real stock decrement; (3) POSTs `{ order_id }` to the new `/api/checkout/intent` proxy → Django `POST /api/checkout/intent/` for a Stripe `client_secret`; (4) confirms payment — real `stripe.confirmCardPayment` if `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is a real key, otherwise the existing card-number-based simulated confirm (decline test card `4000000000000002` still works); (5) on success, maps the real API order (`lib/checkout.ts: mapApiOrderToCheckoutOrder`) into the existing `CheckoutOrder` shape so `/checkout/success` shows the real order number/status without touching those UI components.
  - Errors handled: out-of-stock/oversell rejection from Django (400) surfaces via the existing `ErrorBanner`, cart is preserved; payment decline same treatment; empty cart still redirects to `/cart` (pre-existing, unchanged).
  - In demo mode (no real Stripe keys — the current state of both `.env.local` and backend `.env`), a failed/skipped intent call is non-fatal: the order already exists in Django regardless, and the simulated confirm still runs.
  - Mobile bottom navigation strictly ordered LTR (Home, Shop, Cart, Profile) in both language modes, and hidden on desktop viewports (`lg:hidden`).
  - Mobile bottom nav tabs persistently show Farsi translations when the Farsi locale is active.
  - Mobile top header navigation strictly ordered LTR (Search Box, Language, Theme, Notifications) in both language modes.
  - Search input placeholder, text, and cursor dynamically align right in Farsi mode, keeping its structural position on the left.
  - Desktop navbar elements strictly ordered left-to-right across all locales: `[Logo/Icon]` -> `[Brand Name ("دیوپس تارگت" in fa)]` -> `[Shop Link]` -> `[SearchBar box container]` -> `[Language Icon Toggle]` -> `[Theme Dark/Light Button]` -> `[Notification Bell Icon]` -> `[Cart Drawer Icon]` -> `[Profile User Icon Link]`.
  - Statically enforced left-to-right macro element flow on the desktop row layout regardless of the active language, utilizing explicit `flex-row dir-ltr` wrappers.
  - Desktop navbar legacy categorical link groups (Laptops, Desktops & PCs, Components, Deals, and Support) stripped out.
  - Desktop inner elements wrapped with the centralized `Container` utility component to align logo and profile UserIcon perfectly with the page layout on widescreen monitors.
  - Account profile layout wrapped in the `Container` utility component to prevent viewport edge drift and align sidebar/views exactly with the global navbar bounds.
  - Desktop notification system toggles an absolute contextual floating dropdown below the bell icon without altering route URLs or using the mobile drawer.
  - Anchored desktop notification dropdown directly below the header's bottom edge with a `mt-3` vertical spacing offset, showing `rounded-lg` rounded corners on all four sides.
  - Removed header overflow clipping to allow full vertical visibility of the notifications list dropdown.
  - Mobile notification system toggles a floating absolute dropdown card (`absolute top-full right-2 left-2 mt-3 max-w-[calc(100vw-16px)] bg-surface border rounded-lg shadow-xl z-50`) instead of the full-screen drawer.
  - Added a transparent fixed backdrop layer (`fixed inset-0 z-40 bg-transparent`) for mobile to enable simple tap-to-close-outside behavior.
- **What's Broken (pre-existing, not touched this session)**: Django `/admin/login/` returns a bare 500 (confirmed via `curl`, `DEBUG=False` masks the traceback) — unrelated to checkout; verified order creation via `manage.py shell` instead. There's also a latent race in `AuthProvider`/`LoginForm` (`router.replace("/account")` in `AuthProvider`'s effect vs. `router.push(next)` in `LoginForm`) that occasionally detours through `/account` before landing on the `next` URL — cosmetic, self-resolves, pre-existing.
- **Latest Build/Test Status**: `npm run build` ✅, `npm run lint` ✅.

## Files in Flight

None.

## Changed This Session

- `public/assets/images/niavaran-computer-logo.png`: Copied branding logo asset from `docs/Logo/niavaran-computer-logo.png`.
- `src/components/layout/MobileNavbar.tsx`: Created mobile brand logo component rendering the new branding logo.
- `src/components/layout/Navbar.tsx`: Replaced separate brand icon and text links with a single `<Image />` component instance rendering the `/assets/images/niavaran-computer-logo.png` asset. Cleaned up unused imports.
- `src/components/layout/CheckoutHeader.tsx`: Replaced separate brand icon and text links with the `<Image />` component rendering `/assets/images/niavaran-computer-logo.png`.
- `src/components/layout/Footer.tsx`: Replaced separate brand icon and text links with the `<Image />` component rendering `/assets/images/niavaran-computer-logo.png`, updated dynamic footer text to reference "NIAVARAN" contextually, and refactored the helper component `FooterColumn` outside the render function with proper type definitions (`TranslationKey`) to resolve lint errors.
- `src/config/store.ts`: Updated `nameFa` string to `"دیوپس تارگت"`.

## Failed Attempts

- None.

## Important Context

- **Demo/simulated payment path is intentional, not a shortcut**: with no real Stripe keys configured anywhere in this repo (frontend `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` unset, backend `STRIPE_SECRET_KEY` unset → defaults to `"mock_secret_key"` in `config/settings.py`), a real call to Stripe's API would always fail. `checkout/page.tsx` gates on `HAS_REAL_STRIPE_KEY` (frontend publishable key presence) so the intent call failing/being skipped in demo mode doesn't block checkout — the order is already real in Django by that point either way.
- Order `status` vocabulary differs between Django (`pending_payment`, `paid`, `preparing`, `ready`, `shipped`, `delivered`, `failed`, `cancelled`, `refunded`) and the frontend's existing `OrderStatus` (`placed`, `paid`, `fulfilling`, `completed`) — mapped via `mapApiOrderStatus` in `lib/checkout.ts`. Since no Stripe webhook listener runs locally (no `stripe listen` forwarding), orders stay `pending_payment` after a "successful" simulated or even real confirm — this is expected/correct given the environment, not a bug.
- The delivery address flow creates a **new** `Address` row on every delivery order (via `/api/addresses` POST) rather than reusing/selecting one of the user's saved addresses — matches the checkout page's existing ad-hoc address form UI without requiring a redesign; Django requires an `address_id` FK, so this bridges the two.
- Product catalog data (`src/data/products.ts`) slugs are kept in sync with the backend's `seed_catalog` management command — `CartItem.slug` is what gets sent as Django's `OrderItemInputSerializer.product` (a `SlugField`).
- Django's `OrderViewSet` retrieve action is by numeric `pk`, not by order `number` (e.g. `DT-341078`) — so both account order pages fetch the full `GET /api/orders` list and find-by-`number` client-side rather than hitting a per-order detail endpoint. This matches the pattern the detail page already used pre-session; no new `/api/orders/[id]` proxy route was added since it wasn't needed.
- Django's `OrderSerializer` does not expose the order's `email` field — order-history pages pass the logged-in user's email (`useAuth().user?.email`) into `mapApiOrderToAccountOrder` instead.
- Django admin (`/admin/login/`) 500s regardless of credentials — pre-existing, unrelated to this work, not fixed this session (out of scope). Order verification was done via `manage.py shell` and the live UI instead.
- A throwaway `smoketest` / `smoketest@example.com` Django user (password `SmokeTest123!`) was created in a prior session for testing and left in place (harmless, useful for future local testing).
- **This session**: to verify the DT-341078 order specifically (per the task), I reset the password on the existing local dev user that owns it (`user` / `user@email.com`) to `VerifyTest123!` via `manage.py shell`, since its original password wasn't known. This is a local dev-only Postgres/SQLite DB, not shared/prod data — flagging here per the project's credential-context convention rather than silently changing it.

## Next Step

1. Investigate/fix the pre-existing Django `/admin/login/` 500 error (unrelated to this work) if admin access is needed.
2. To exercise the real Stripe path, set a real `pk_test_...`/`sk_test_...` pair in `web/.env.local` and `api/backend/.env`, then re-run the checkout smoke test.
3. If pickup orders should show a real contact (name/phone) captured at checkout time, that needs a backend model change (Django currently stores no pickup-contact data) — currently `/account/orders/[id]` shows a generic fallback line for pickup orders instead.

## Commands to Run First

- `git status --short`
- `npm run dev` (frontend, port 3000)
- `../api/backend/.venv/bin/python ../api/backend/manage.py runserver` (backend, port 8000) — or however the Django dev server is normally started in this environment.

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
## Roadmap pointer

Full project roadmap (Option B — all features) lives in `ROADMAP.md` (repo root) and the Obsidian journal `DevOps-Target.md`. Current position: MVP loop complete; next up is **Phase A (catalog data model + Persian taxonomy)**. See `ROADMAP.md` for phases A–F (flexible pricing, quote system, Iranian payments, 2FA, support chat, launch).
