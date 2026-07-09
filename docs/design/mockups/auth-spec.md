# DevOps Target — Auth (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-2fa`) Handoff
Screen 6 · v1.0 · **first backend-wired screen** · references `web/docs/design/` foundations.

## Design direction

Centered auth card on a plain background, brand mark at top. Consistent across all auth routes. Public entry; client-rendered; `noindex`. This is where the frontend **connects to the Django backend** (djoser) instead of placeholder data — the RDA backend already has auth built.

## Visual mockup

`devops-target-auth.html` — one file showing all variants for review: Login, Register (with an inline validation-error example), Forgot password, and 2FA code entry. Theme toggle in the demo bar.

## Routes & screens

- `/login` — email/username + password, remember-me, forgot link, link to register. Redirect to `?next=` destination after success (RDA pattern).
- `/register` — username + email + password, link to login.
- `/forgot-password` — email → send reset link; success confirmation state.
- `/reset-password` — new password + confirm (token from URL).
- `/verify-2fa` — 6-digit OTP entry (auto-advance boxes), resend, backup code.

## Components

**Reuse:** Input, Button, Toast, IconButton, ThemeToggle, Card, `storeConfig`.

**New (build):**
- `AuthCard` shell (brand + title + subtitle + slot).
- `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OtpInput` (6-box, paste-aware, auto-advance), `AuthLayout`.
- `src/lib/auth/` — API client + `AuthProvider` (token storage, current user, login/register/logout), `useAuth` hook. Middleware for protected routes.

## Backend integration (Django / djoser — already exists in `api`)

- **Base URL** from env (`NEXT_PUBLIC_API_BASE_URL`), pointing at `devops-target-api`.
- **Login:** `POST /auth/token/login/` (djoser Token auth) → store token; **Register:** `POST /auth/users/`; **Me:** `GET /api/me/`; **Logout:** `POST /auth/token/logout/`.
- **Password reset:** djoser `POST /auth/users/reset_password/` + `.../reset_password_confirm/`.
- **2FA:** django-otp (to be added in the api Phase 4) — challenge endpoint after login when enabled.
- Token storage: httpOnly cookie preferred (needs a small Next route handler) or memory+refresh; **decide and document**. Mirror RDA's error-parsing (`parseAuthErrors`) so field errors (username/email/password/non_field_errors) surface inline.
- CORS/CSRF: `api` must allow the `web` origin (already env-driven in RDA settings).

## States

- Field validation (inline, per-field from backend response); email format; password rules.
- Submit loading ("Signing in…"), disabled while pending.
- Auth error banner (invalid credentials, taken username/email) — map djoser errors to fields.
- Forgot: success ("Check your email") state.
- 2FA: invalid/expired code, resend cooldown, auto-submit on 6th digit.
- Redirect to `?next=` or `/account` after login; preserve attempted destination (RDA behavior).

## Accessibility

Labeled inputs, `autocomplete` (email, current-password, new-password, one-time-code), OTP boxes with `inputmode="numeric"` + `aria-label`, visible focus rings, error text tied via `aria-describedby`, WCAG AA both themes. Mobile inputs ≥16px.

---

## Copy-paste prompt for Claude Code

```
Build the auth screens in the `web` Next.js app: /login, /register, /forgot-password, /reset-password, /verify-2fa. Public, client-rendered, noindex. THIS is the first screen set wired to the Django backend (devops-target-api, djoser).

Read foundations + reuse: docs/design/*; reuse Input, Button, Toast, ThemeToggle, Card, storeConfig.
Visual reference: docs/design/mockups/auth.html (centered AuthCard; match tokens/spacing; Tailwind classes, not inline CSS).

Build:
- AuthLayout + AuthCard shell (brand, title, subtitle, slot), centered on plain bg.
- LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, OtpInput (6 boxes, numeric, paste-aware, auto-advance, auto-submit on complete).
- Route pages under src/app/(auth)/ for each.
- src/lib/auth/: typed API client + AuthProvider (current user + token, login/register/logout) + useAuth hook. Add middleware.ts to protect /account/** and /checkout (guest-ok stays open) — redirect unauthenticated to /login?next=<path>, restore after login.

Backend integration (djoser, base URL from process.env.NEXT_PUBLIC_API_BASE_URL):
- login POST /auth/token/login/ (store token), register POST /auth/users/, me GET /api/me/, logout POST /auth/token/logout/, reset POST /auth/users/reset_password/ + reset_password_confirm/.
- Prefer storing the token in an httpOnly cookie via a Next route handler; if using memory/localStorage instead, document the tradeoff. Parse djoser field errors (username/email/password/non_field_errors) and show them inline per field (mirror the RDA parseAuthErrors approach).
- 2FA challenge endpoint is a placeholder until django-otp lands in the api repo — wire /verify-2fa to a stubbed verify call with a clear TODO seam.
- Put the API base URL + auth endpoints in one config module. Add NEXT_PUBLIC_API_BASE_URL to .env.example.

States: inline per-field validation from backend, submit loading + disabled, auth error mapping, forgot "check your email" success, 2FA invalid/expired + resend cooldown + auto-submit, redirect to ?next= or /account after login. autocomplete attributes, aria-describedby error links, focus rings, mobile inputs >=16px, WCAG AA both themes.

When done: npm run build + npm run lint, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
