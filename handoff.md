# Goal

Build `devops-target-web` — the Next.js frontend for the DevOps Target computer shop. Public storefront (SEO, server-rendered) plus the logged-in app (client-rendered). Pairs with the `devops-target-api` Django backend.

## Project Shape (read this first)

This is **one half of a two-repo project**:

- `devops-target-web` (this repo) — Next.js 16 + React 19 + TypeScript + Tailwind 4 (App Router). Frontend only.
- `devops-target-api` — Django + DRF + Channels backend (auth via djoser, live chat, notifications, AI). Separate repo/folder (`../api`).

Locked stack decision: **Next.js for the frontend** (needed for SEO on product pages), **Django for the backend**. Do not reintroduce Vite or FastAPI here.

**Next.js 16 breaking change in play**: `middleware.ts` is renamed to `proxy.ts` (exported function `proxy`, same behavior). This repo now has `src/proxy.ts` — do not recreate a `middleware.ts` file.

## Current State

- Branch: `main`.
- Working tree: storefront (landing, PLP, PDP, cart, checkout) was already committed from prior sessions (`299a479`..`4c70636`). **This session's auth build is uncommitted** — awaiting review/approval before staging/commit.
- `npm run build` — passes. New routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-2fa` (all static/prerendered), `/api/auth/{login,register,logout,me,reset-password,reset-password-confirm,verify-2fa}` (dynamic route handlers), plus `src/proxy.ts` (compiles as "Proxy (Middleware)" in the build output).
- `npm run lint` — clean, no errors/warnings.
- Manually verified in Chrome (dev server): `/login`, `/register`, `/forgot-password` (including its "check your email" success state), `/reset-password` both without and with `?uid=&token=` (invalid-link state vs. the real form), `/verify-2fa` (typed all 6 digits → auto-advance worked, auto-submit fired on the 6th digit, redirected to `/login?next=%2Faccount` since the stub backend has no real session). Confirmed the error-mapping pipeline end-to-end: submitting forgot-password with no `NEXT_PUBLIC_API_BASE_URL` configured surfaced "Auth backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." inline via `ErrorBanner`, proving route handler → `parseAuthErrors` → form state wiring works.
- **No live Django backend was available this session** — `NEXT_PUBLIC_API_BASE_URL` is unset locally, so login/register success paths (and the djoser field-error shapes) are untested against the real API. Everything downstream of "backend responds" (cookie set, `/api/auth/me` round-trip, redirect-after-login) is implemented per the djoser docs and the spec, but not yet verified against `devops-target-api`.

## Files in Flight

None actively mid-edit — the auth build is complete and buildable. Next action is user review + commit approval (stage explicitly, not `git add .`/`-A`).

## Changed This Session (auth screens: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-2fa`)

**Backend integration decision**: token stored in an **httpOnly cookie** (`dt_token`, set/read only inside Next.js Route Handlers), not localStorage/memory — djoser issues a long-lived opaque bearer token, so keeping it out of client JS reach is worth the extra route-handler hop. `NEXT_PUBLIC_API_BASE_URL` is client-exposed (per spec) but only used server-side in these route handlers today; nothing calls the Django API directly from the browser.

**`src/lib/auth/`** (new)
- `config.ts` — `API_BASE_URL`, `AUTH_COOKIE_NAME` (`dt_token`), `AUTH_ENDPOINTS` (djoser under `/api/auth/...` per the corrected prefix — see Important Context; `me` is the separate non-djoser `/api/me/`).
- `types.ts` — `AuthUser`.
- `errors.ts` — `parseAuthErrors()`, mirrors RDA's approach: flattens djoser's per-field arrays + `non_field_errors`/`detail` into a `{ field: message }` map, with `non_field_errors`/`detail` normalized to a `form` key for banner display.
- `client.ts` — browser-side fetch wrappers that call our own `/api/auth/*` routes (never the Django API directly from the client).
- `AuthProvider.tsx` — `useAuth()` + `<AuthProvider>`. Implemented as a **module-level external store read via `useSyncExternalStore`** (same pattern as `CartProvider`), not `useState`/`useEffect` — see Failed Attempts for why. Mounted in `src/app/layout.tsx` (inside `ThemeProvider`, wrapping `CartProvider`/`ToastProvider`).

**`src/app/api/auth/*/route.ts`** (new) — `login`, `register` (chains a login call after djoser's user-creation, since djoser doesn't auto-login — new accounts land signed in), `logout`, `me`, `reset-password` (forgot-password send), `reset-password-confirm`, `verify-2fa` (**stub**, see TODO comment in the file — no real django-otp call yet, just validates the code shape and always succeeds). Each guards on `API_BASE_URL` being set and wraps the backend `fetch` in try/catch.

**`src/proxy.ts`** (new) — optimistic-only check (cookie presence, not validity) that protects `/account/**`, redirecting to `/login?next=<path>`. **`/checkout` is deliberately left open** (guest checkout) — re-read the spec's "protect /account/** and /checkout (guest-ok stays open)" line before changing this; the parenthetical is doing the real work.

**`src/components/auth/`** (new) — `AuthLayout` (centered plain-bg shell), `AuthCard` (brand + title/subtitle + slot + footer), `OtpInput` (6-box, numeric, paste-aware, auto-advance/auto-submit, verified working in Chrome), `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `Verify2FAForm`.

**`src/app/(auth)/`** (new route group, doesn't affect URLs) — `layout.tsx` (noindex) + one `page.tsx` per route. Pages using `useSearchParams` (`login`, `reset-password`, `verify-2fa`) wrap their form in `<Suspense>` to avoid the Next.js de-opt-to-client-rendering warning.

**`src/components/ui/icons.tsx`** — added `LockIcon`, `MailIcon`.

**`src/app/layout.tsx`** — added `AuthProvider` to the provider stack.

**`.env.example`** — added `NEXT_PUBLIC_API_BASE_URL` (this file is git-ignored in this repo — `.env*` has no exception for `.env.example` in `.gitignore` — so this edit is local-only; flagged below).

## Failed Attempts

- **First `AuthProvider` draft used `useState` + `useEffect` to fetch `/api/auth/me` on mount.** Failed lint (`react-hooks/set-state-in-effect`, part of the React Compiler ESLint rules bundled with this Next 16 project) — the rule statically traces setState calls reachable from an effect body, including through async `.then()`/`.finally()` callbacks, and flags it even though the call isn't literally synchronous. Fixed by rewriting `AuthProvider` as a module-level external store consumed via `useSyncExternalStore` (mirrors `CartProvider`'s existing pattern for localStorage hydration) — the current-user fetch kicks off lazily inside `getSnapshot`, guarded by a `hasFetched` flag, exactly like `CartProvider`'s `hasHydrated` guard.
- That rewrite initially returned a fresh `{ user: null, loading: true }` object literal from `getServerSnapshot()` on every call — caught live in Chrome as a "The result of getServerSnapshot should be cached to avoid an infinite loop" console error. Fixed by hoisting a single `SERVER_SNAPSHOT` constant and returning that same reference every time.

## Important Context

- **Corrected djoser prefix**: the user explicitly corrected the spec mid-task — djoser is mounted at `/api/auth/...` on the Django side (`POST /api/auth/token/login/`, `POST /api/auth/users/`, `POST /api/auth/token/logout/`, `POST /api/auth/users/reset_password/`), **not** `/auth/...`. This is reflected in `src/lib/auth/config.ts`. `GET /api/me/` is separate (not under the djoser prefix).
- **2FA is a stub on purpose**: django-otp hasn't landed in the `api` repo yet (planned Phase 4). `/verify-2fa` and `POST /api/auth/verify-2fa` exist as a real UI + seam, but there's no actual challenge/verify backend call — see the `TODO(2fa)` comments in `src/app/api/auth/verify-2fa/route.ts` and `Verify2FAForm.tsx`. There's currently no code path that redirects a logging-in user to `/verify-2fa` (login always completes fully today, since the backend can't issue a 2FA challenge) — that redirect needs to be wired once django-otp exists and login can return a "2FA required" response.
- **Register auto-login is an assumption, not from the written spec**: djoser's `POST /api/auth/users/` doesn't log the user in. The register route handler chains a login call right after so new accounts land signed in (better UX, mirrors typical RDA behavior) — flagged here in case product wants an explicit "verify your email first" gate instead.
- **Discovered, not fixed**: `src/components/commerce/CartProvider.tsx`'s `getServerSnapshot()` has the exact same referential-stability bug described above (`return []` — a fresh array every call) and will throw the same console error under React's stricter dev checks. Pre-existing, unrelated to this session's changes (never edited it) — worth a one-line fix (hoist a shared empty-array constant) as a quick follow-up, but left untouched per "don't touch unrelated files" without explicit approval.
- **Known gap vs. the spec's a11y line ("mobile inputs ≥16px")**: the shared `src/components/ui/Input.tsx` renders at `text-[15px]` sitewide (used by checkout, filters, newsletter, and now auth) — 1px under the guideline that prevents iOS Safari's zoom-on-focus. Left as-is rather than patching the shared component (would be an unrelated, sitewide visual change beyond this task's scope) or hacking `!important` overrides per auth field. Flag for a deliberate, reviewed follow-up if strict compliance matters.
- Token storage tradeoff: httpOnly cookie (server-set via Route Handlers) chosen over localStorage/memory specifically because djoser's token is long-lived and opaque — see `src/lib/auth/config.ts` / the login route handler's comment.
- `NEXT_PUBLIC_API_BASE_URL` must be set (in `.env.local`, not committed) before any of this can talk to a real backend; every route handler returns a clear "Auth backend is not configured" error otherwise (verified live).

## Next Step

Get user review + commit approval for the auth build (stage explicitly). Once `devops-target-api` is reachable, re-verify login/register against real djoser responses (field-error shapes in particular — `parseAuthErrors` was built from djoser's documented shape but not exercised against a live 400 response yet). After that, per prior build-priority notes: `/account` (the first real consumer of `useAuth()`/the `dt_token` cookie, and what `src/proxy.ts` is currently protecting).

## Commands to Run First

- `git status --short`
- `git branch --show-current`
- `npm run build`
- `npm run lint`
- `npm run dev` (check `/login`, `/register`, `/forgot-password`, `/reset-password` with and without `?uid=&token=`, `/verify-2fa` — both themes, desktop + mobile width; set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` first if testing against a real backend)
