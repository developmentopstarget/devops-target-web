# DevOps Target — Account area (`/account/**`) Handoff
Screen 7 · v1.0 · private (login required) · references `web/docs/design/` foundations.

## Design direction

App-style account area: left sidebar nav (horizontal scroll on mobile) + content panel. Consistent with the storefront tokens. All routes gated by auth middleware; client-rendered; `noindex`. Reads/writes to the Django backend.

## Visual mockup

`devops-target-account.html` — shows the Profile view plus Orders and Security panels together for review. Theme toggle in demo bar. Includes a working 2FA/toggle switch and language/theme selects (LTR/RTL).

## Routes

- `/account` — Profile/settings (username, email, language [LTR/RTL], theme) + recent orders + security summary.
- `/account/orders` — full order history list.
- `/account/orders/[id]` — order detail (items, status stepper, addresses, receipt, reorder).
- `/account/addresses` — AddressCard CRUD (reuse checkout AddressForm).
- `/account/wishlist` — saved products (ProductGrid).
- `/account/notifications` — notifications center (Django notifications API — already in `api`).
- `/account/security` — password change, **2FA** enable/disable + enrollment (QR/secret), login alerts.

## Components

**Reuse:** Navbar (or slim account header), Container, Button, Input, Select, Badge, Toast, ProductGrid (wishlist), AddressForm (from checkout), OrderStatusStepper (from checkout), `formatCurrency`, AuthProvider/useAuth.

**New (build):**
- `AccountLayout` — sidebar nav + content; active-route highlight; mobile horizontal nav.
- `ProfileForm`, `OrderCard`, `OrderList`, `OrderDetail`, `AddressCard`, `SecurityPanel` (Toggle/Switch), `TwoFactorSetup` (QR + verify), `NotificationsCenter`.
- `Switch` (toggle) primitive → add to `ui/`.

## Backend integration

- **Profile:** `GET/PATCH /api/me/` (extend RDA's MeView to accept updates + language/theme prefs).
- **Orders:** `GET /api/orders/`, `GET /api/orders/{id}/` (built in api Phase 3).
- **Addresses:** `GET/POST/PATCH/DELETE /api/addresses/`.
- **Notifications:** existing `GET /api/notifications/`, `mark-read`, `mark-all-read`.
- **2FA:** django-otp enroll/verify/disable (api Phase 4).
- **Password change:** djoser `POST /auth/users/set_password/`.
- All gated by auth token; middleware redirects unauthenticated to `/login?next=`.

## States

- Loading skeletons per panel; empty states (no orders → "Start shopping", no addresses, empty wishlist, no notifications).
- Save: optimistic + toast ("Saved"), error toast on failure.
- Orders: status pills (Preparing/Ready/Shipped/Delivered/Cancelled); order detail stepper.
- Security: 2FA enable flow (show QR/secret → verify code → backup codes), disable confirm; password change validation.
- LTR/RTL language switch updates `dir` app-wide.

## Accessibility

Sidebar is a labeled `nav`; active item `aria-current`; forms labeled; toggles are real `role="switch"` buttons; WCAG AA both themes; keyboard reachable.

---

## Copy-paste prompt for Claude Code

```
Build the account area (/account and subpages) in the `web` Next.js app. Private (login required), client-rendered, noindex.

Read foundations + reuse: docs/design/*; reuse Container, Button, Input, Select, Badge, Toast, ProductGrid, AddressForm (from checkout), OrderStatusStepper (from checkout), formatCurrency, AuthProvider/useAuth (from auth screens).
Visual reference: docs/design/mockups/account.html (sidebar + content; match tokens/spacing; Tailwind classes, not inline CSS).

Build:
- Add a Switch (toggle) primitive to src/components/ui (role="switch", keyboard-operable).
- AccountLayout (left sidebar nav [Profile, Orders, Addresses, Wishlist, Notifications, Security, Sign out]; horizontal-scroll nav on mobile; active-route highlight via aria-current).
- Routes under src/app/account/: page.tsx (Profile + recent orders + security summary), orders/page.tsx, orders/[id]/page.tsx (OrderDetail + OrderStatusStepper), addresses/page.tsx (AddressCard CRUD reusing AddressForm), wishlist/page.tsx (ProductGrid), notifications/page.tsx, security/page.tsx (password change + 2FA enable/disable + login alerts).
- Components: ProfileForm, OrderCard, OrderList, OrderDetail, AddressCard, SecurityPanel, TwoFactorSetup (QR + verify code + backup codes), NotificationsCenter.

Backend integration (base URL from NEXT_PUBLIC_API_BASE_URL, auth token from AuthProvider):
- Profile GET/PATCH /api/me/ (incl. language + theme prefs). Orders GET /api/orders/ + /api/orders/{id}/. Addresses CRUD /api/addresses/. Notifications GET /api/notifications/ + mark-read + mark-all-read (already exist). Password change djoser POST /auth/users/set_password/. 2FA enroll/verify/disable via django-otp (STUB with clear TODO until it lands in the api repo).
- These order/address/2FA endpoints may not exist yet — build against the documented shapes, guard with loading/empty/error states, and stub calls that 404 with a clear TODO so the UI is complete and ready to connect.
- middleware protects /account/** → redirect unauthenticated to /login?next=<path>.

States: per-panel loading skeletons; empty states (no orders/addresses/wishlist/notifications); save optimistic + toast; order status pills + detail stepper; 2FA enable (QR→verify→backup codes) + disable confirm; password validation; LTR/RTL language switch updates dir app-wide.
a11y: labeled sidebar nav + aria-current, labeled forms, role=switch toggles, focus rings, WCAG AA both themes.

When done: npm run build + npm run lint, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
