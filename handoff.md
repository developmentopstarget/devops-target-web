# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Current State

- **Branch**: `main`.
- **Working Tree Status**: Layout overrides, Farsi localization bindings, avatar scrubs, and the Vazirmatn RTL font swap are completed and verified with an optimized Next.js production build pass.
- **What Works**:
  - Account Layout Core Fix: completely rewrote `src/app/account/layout.tsx` to remove the outer grid columns, explicit min-widths, and large padding. Reads navigation tab strings dynamically from the localization helper.
  - Form Card Liquidation: modified `src/app/account/page.tsx` to remove theme/language preference cards and nested grid splits, laying out components in a clean vertical `w-full block space-y-4` stack. Integrates full dynamic translation binding for all form labels, buttons, and toasts.
  - Navbar Header and Controls: strictly rendering only three controls on the right on mobile screens in `src/components/layout/Navbar.tsx` (RTL toggle, theme selector, bell icon), and completely deleted any `UserIcon` profile/avatar shortcut elements from the top header tracking bar.
  - SearchBar Localization: SearchBar placeholder and aria-label are bound dynamically to the dictionary mapping.
  - Product Details View Localization: dynamic bindings are implemented across the `BuyBox`, `BuyBoxActions`, `ProductTabs`, `StickyBuyBar`, `ReviewSummary`, and `ReviewList` components. The breadcrumbs and "You might also like" heading are localized.
  - Cart View Localization: `CartPage`, `CartLineItem`, and `StockBadge` read all static strings, quantities, action labels ("Remove", "Add to cart"), and inventory alerts from the dictionary.
  - Home Page Localization: `HeroContent`, `DealsHeader`, `BuildPCBanner`, `CategoryTiles`, `ValueProps`, `StoreLocal`, and `Newsletter` are fully localized client-side.
  - Catalog Page Localization: `CatalogHeader` localizes headers and product counts dynamically using the unified `productsMetrics` key without string concatenation bugs. `FilterPanel`, `FilterDrawer`, `SortDropdown`, `ProductCard` (sale/new badges), `Rating` (aria-labels), and `Pagination` are fully localized.
  - Footer Localization: `Footer` is a client component translating all descriptions, columns, and navigation links dynamically.
  - Mobile Notification Drawer & Notifications Center: completely bound all notification array items (titles, bodies, timestamps, clear actions, mark-as-read toasts) to the `useLanguage` dictionary.
  - Pinned Bottom Menu: `src/components/layout/MobileBottomNav.tsx` uses `fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface border-t flex justify-around items-center px-4 max-w-full` ensuring it stays perfectly flat at the bottom of the device viewport across all screens without falling apart.
  - Farsi/RTL Font: Vazirmatn (400/500/600/700/800, subsets `arabic`+`latin`) loaded via `next/font/google` as `--font-vazir` and applied through a `[lang="fa"], [dir="rtl"]` rule in `globals.css`. English/LTR stays on Inter; `.font-mono` (JetBrains Mono — prices/SKUs/specs) is preserved in both languages via a `:not(.font-mono)` guard.
- **Latest Build Status**: Optimized production build (`npm run build`) completed successfully with zero compilation or TypeScript errors. Verified live in the browser: toggling to Farsi renders body text in Vazirmatn (confirmed via computed `font-family`) while prices stay in JetBrains Mono; toggling back to English stays on Inter.

## Files in Flight

None.

## Changed This Session

- Added Vazirmatn (Google Font, `--font-vazir`) to `src/app/layout.tsx` alongside the existing Inter/JetBrains Mono variables.
- Added a `[lang="fa"], [dir="rtl"]` font-family rule to `src/app/globals.css` (with `:not(.font-mono)` guard) so Farsi/RTL renders in Vazirmatn while prices/SKUs/specs stay JetBrains Mono.
- Updated `docs/design/design-tokens.md` typography section: Farsi companion font is now Vazirmatn (replaces the earlier Noto Sans Arabic placeholder).
- Updated `handoff.md` to log current progress and milestones.

## Failed Attempts

- A stray `next dev` process from an earlier session (not the one started this session) kept serving a stale bundle after the `globals.css` edit — hot reload silently didn't pick up the new rule even though the terminal logged successful compiles. Killing it, clearing `.next/cache`, and starting a fresh `npm run dev` fixed it. If font/CSS changes don't show up in-browser, check for a duplicate dev server first before assuming the CSS rule is wrong.

## Important Context

- **2FA is a stub on purpose**: django-otp hasn't landed in the `api` repo yet (planned Phase 4). `/verify-2fa` and `POST /api/auth/verify-2fa` exist as a real UI + seam, but there's no actual challenge/verify backend call.
- Token storage tradeoff: httpOnly cookie (server-set via Route Handlers) chosen over localStorage/memory.
- `NEXT_PUBLIC_API_BASE_URL` must be set (in `.env.local`, not committed) before talking to a real backend.

## Next Step

1. Connect local environment to `devops-target-api` server.
2. Run end-to-end user checkout flows and order tracking verify tests using the Django admin portal.

## Commands to Run First

- `git status --short`
- `npm run dev`

## Completed Milestones

- **Milestone 1 — Storefront Layout and Skeletons**: Core store pages, cart structure, checkout steps, payment mocks are operational.
- **Milestone 2 — Secure Account Route Tree (`/account`)**: Fully implemented profile setting, orders list/details log, addresses CRUD management, and helper API proxies with offline stubs (Completed: 2026-07-09).
- **Layout and Responsive Corrections**: Pixel-perfect mobile-first navigation bar locking, bottom menu global persistence, content offset wrapping, and boundary bleeding prevention complete (Completed: 2026-07-09).
- **Farsi Translation Dynamic Pass**: Complete localization mapping and binding across the storefront utilities, account route tree, buy box sections, shopping cart layouts, home page, product catalog, notification center, and footer (Completed: 2026-07-09).
