# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Current State

- **Branch**: `main`.
- **Working Tree Status**: Checkout is wired to the live Django backend end-to-end (order creation, PaymentIntent, Stripe/simulated confirm). Verified with `npm run build` + `npm run lint` and a live browser smoke test against a running Django server.
- **What Works**:
  - Checkout `Pay` now: (1) requires login — redirects to `/login?next=/checkout` if `useAuth().user` is null; (2) POSTs the cart to `/api/orders` (new `POST` handler on the existing proxy), which creates a delivery `Address` via `/api/addresses` first when needed, then calls Django `POST /api/orders/` — real order, server-recomputed totals, real stock decrement; (3) POSTs `{ order_id }` to the new `/api/checkout/intent` proxy → Django `POST /api/checkout/intent/` for a Stripe `client_secret`; (4) confirms payment — real `stripe.confirmCardPayment` if `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is a real key, otherwise the existing card-number-based simulated confirm (decline test card `4000000000000002` still works); (5) on success, maps the real API order (`lib/checkout.ts: mapApiOrderToCheckoutOrder`) into the existing `CheckoutOrder` shape so `/checkout/success` shows the real order number/status without touching those UI components.
  - Errors handled: out-of-stock/oversell rejection from Django (400) surfaces via the existing `ErrorBanner`, cart is preserved; payment decline same treatment; empty cart still redirects to `/cart` (pre-existing, unchanged).
  - In demo mode (no real Stripe keys — the current state of both `.env.local` and backend `.env`), a failed/skipped intent call is non-fatal: the order already exists in Django regardless, and the simulated confirm still runs.
- **What's Broken (pre-existing, not touched this session)**: Django `/admin/login/` returns a bare 500 (confirmed via `curl`, `DEBUG=False` masks the traceback) — unrelated to checkout; verified order creation via `manage.py shell` instead. There's also a latent race in `AuthProvider`/`LoginForm` (`router.replace("/account")` in `AuthProvider`'s effect vs. `router.push(next)` in `LoginForm`) that occasionally detours through `/account` before landing on the `next` URL — cosmetic, self-resolves, pre-existing.
- **Latest Build/Test Status**: `npm run build` ✅, `npm run lint` ✅ (only pre-existing warnings/errors in `Footer.tsx`, `Navbar.tsx`, `Pagination.tsx`, `useLanguage.ts` — none in touched files). Live smoke test with both servers running: logged in as an existing user, added products to cart, paid with the `4242...` test card → real order created (e.g. `DT-341078`), stock decremented in the database, order visible via Django shell (`Order.objects.filter(...)`). Also verified: unauthenticated Pay → redirect to login → back to checkout; decline card (`4000...0002`) → ErrorBanner shown, cart preserved, order still recorded as `pending_payment`.

## Files in Flight

None — checkout wiring is complete and verified.

## Changed This Session

- `src/app/api/orders/route.ts`: added `POST` — creates the delivery `Address` (via `/api/addresses`) when `fulfillment === "delivery"`, then forwards to Django `POST /api/orders/` with the auth cookie as a `Token` header. No offline/mock fallback for `POST` (unlike the existing `GET` stub) since faking stock-aware order creation isn't meaningful; returns 503 if `NEXT_PUBLIC_API_BASE_URL` is unset.
- `src/app/api/checkout/intent/route.ts` (new): proxies `POST /api/checkout/intent/`, mirroring the auth-forwarding pattern used elsewhere.
- `src/lib/checkout.ts`: added `STRIPE_PUBLISHABLE_KEY` (moved here from `PaymentForm.tsx` so `checkout/page.tsx` can read it too), `ApiOrder` type, `mapApiOrderStatus`/`mapApiOrderToCheckoutOrder` (Django order → existing `CheckoutOrder` shape), `extractOrderErrorMessage` (flattens DRF error payloads for the error banner). Removed the old `simulateCheckoutPayment` TODO comment (now implemented).
- `src/components/commerce/PaymentForm.tsx`: `PaymentFormHandle.confirmPayment` now takes an optional `clientSecret`. Real Stripe path calls `stripe.confirmCardPayment(clientSecret, ...)`; mock path unchanged (simulated, ignores the secret).
- `src/app/checkout/page.tsx`: `handlePay` rewritten per the flow above; Pay button also disabled while `useAuth()` is still loading (avoids a false "not logged in" redirect during the initial session fetch).

## Failed Attempts

- None on the implementation side. During manual smoke testing, several browser-automation clicks on the "Add to cart" / "Sign Out" / "Pay" buttons silently didn't register (no network call, no state change) when immediately followed by a navigation in the same batch — a tool/timing artifact, not an app bug. Confirmed by re-clicking (or dispatching `.click()` via console) after a short wait, which worked every time.

## Important Context

- **Demo/simulated payment path is intentional, not a shortcut**: with no real Stripe keys configured anywhere in this repo (frontend `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` unset, backend `STRIPE_SECRET_KEY` unset → defaults to `"mock_secret_key"` in `config/settings.py`), a real call to Stripe's API would always fail. `checkout/page.tsx` gates on `HAS_REAL_STRIPE_KEY` (frontend publishable key presence) so the intent call failing/being skipped in demo mode doesn't block checkout — the order is already real in Django by that point either way.
- Order `status` vocabulary differs between Django (`pending_payment`, `paid`, `preparing`, `ready`, `shipped`, `delivered`, `failed`, `cancelled`, `refunded`) and the frontend's existing `OrderStatus` (`placed`, `paid`, `fulfilling`, `completed`) — mapped via `mapApiOrderStatus` in `lib/checkout.ts`. Since no Stripe webhook listener runs locally (no `stripe listen` forwarding), orders stay `pending_payment` after a "successful" simulated or even real confirm — this is expected/correct given the environment, not a bug.
- The delivery address flow creates a **new** `Address` row on every delivery order (via `/api/addresses` POST) rather than reusing/selecting one of the user's saved addresses — matches the checkout page's existing ad-hoc address form UI without requiring a redesign; Django requires an `address_id` FK, so this bridges the two.
- Product catalog data (`src/data/products.ts`) slugs are kept in sync with the backend's `seed_catalog` management command — `CartItem.slug` is what gets sent as Django's `OrderItemInputSerializer.product` (a `SlugField`).
- `account/orders/page.tsx` and `account/orders/[id]/page.tsx` still assume the old mock order shape (`orderNumber`, `deliveryMethod`, flat `items[].productId/qty/price`) which doesn't match what `/api/orders` GET actually returns when `NEXT_PUBLIC_API_BASE_URL` is set (Django's `number`/`fulfillment`/nested `items[].quantity`) — this mismatch pre-dates this session and is out of scope for the checkout wiring task; worth a follow-up if order history needs to work against the live backend too.
- Django admin (`/admin/login/`) 500s regardless of credentials — pre-existing, unrelated to checkout, not fixed this session (out of scope). Order verification was done via `manage.py shell` instead.
- A throwaway `smoketest` / `smoketest@example.com` Django user (password `SmokeTest123!`) was created for testing and left in place (harmless, useful for future local testing). A temporary `smoke_admin_tmp` superuser created to try reaching the (broken) admin UI was deleted afterward.

## Next Step

1. If order history in `/account/orders` needs to work against the live backend, reconcile its mock shape with Django's real `OrderSerializer` shape (see "Important Context" above).
2. Investigate/fix the pre-existing Django `/admin/login/` 500 error (unrelated to checkout) if admin access is needed.
3. To exercise the real Stripe path, set a real `pk_test_...`/`sk_test_...` pair in `web/.env.local` and `api/backend/.env`, then re-run the smoke test.

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
