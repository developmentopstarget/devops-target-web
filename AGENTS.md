<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Project Handoff Rule

Every project must keep a root-level `handoff.md` file.

Before ending a coding session, running `/clear`, switching AI tools, stopping work for the day, opening a PR, merging a PR, debugging a major issue, or changing deployment/config behavior, update `handoff.md`.

The handoff must capture the current project state only. Do not include old unrelated conversation history.

Required sections:

# Goal

What we are trying to build, fix, or ship.

## Current State

Include:
- current branch
- working tree status
- what works
- what is still broken
- latest test/build status if known

## Files in Flight

Files actively edited or likely relevant next.

## Changed This Session

What was touched, created, deleted, refactored, configured, or tested.

## Failed Attempts

What was tried but did not work, including the reason if known.

## Important Context

Decisions, assumptions, constraints, warnings, credentials/account context, deployment notes, or "do not change" items.

## Next Step

The single next action to take first in a fresh session.

## Commands to Run First

Exact commands the next AI/dev session should run before editing.

## Completed Milestones

- **Milestone 1 — Storefront Layout and Skeletons**: Core store pages, cart structure, checkout steps, payment mocks are operational.
- **Milestone 2 — Secure Account Route Tree (`/account`)**: Fully implemented profile setting, orders list/details log, addresses CRUD management, and helper API proxies with offline stubs (Completed: 2026-07-09).

## Project roadmap & status (Option B — all features)

Canonical roadmap: `ROADMAP.md` (this repo). Also mirrored in the Obsidian journal `DevOps-Target.md`. Per-screen UI specs: `web/docs/design/mockups/`. Backend detail: `api/docs/backend-spec.md`.

**Status (2026-07-09):** MVP loop is LIVE — browse real catalog → cart → checkout → real order + atomic stock decrement → Django admin → customer order history. EN + Farsi/RTL (Vazirmatn). Backend increments 1–5 done (118 tests). **Payments = Stripe, a DEV STAND-IN only (to be replaced — Stripe doesn't operate in Iran).**

**Locked decisions:**
- Every product AND service has `pricing_mode = fixed | on_request`. `on_request` → "Request a quote / تماس بگیرید" → admin sets agreed price → customer pays.
- Iran payments: **Zarinpal** (online) + **manual bank transfer** (card-to-card / Sheba) with **receipt-screenshot upload + admin verification**. Never auto-mark a manual payment paid — admin verifies every receipt. Stripe is dev-only.
- Adopt the full Niavaran nested category taxonomy (Persian). Admin must be non-technical-friendly (Farsi admin UI, django-unfold, image uploads).

**Build phases (in order — see ROADMAP.md for detail):**
- **A · Catalog foundation** (backend): Product `pricing_mode`/nullable price/`type`(physical|service)/`condition`(new|used) + Pillow image uploads; full nested Persian category seed.
- **B · Admin friendliness** (backend): Farsi admin UI, `django-unfold` theme, image-upload widget, rich-text descriptions, staff account.
- **C · Quote system** (both): `Quote` model + admin inbox + endpoints; "Request a quote" branch on card+detail; approved quote → payable Order; account requests list + notify.
- **D · Iranian payments** (both): `BankAccount` model; manual `Payment` + receipt + verification (order `awaiting_verification`); Zarinpal gateway; payment-method chooser + receipt upload + admin verify. Replaces the Stripe seam.
- **E · Remaining** : 2FA (django-otp) + `/verify-2fa`; support chat (chat `sender_type` + `/support`).
- **F · Content, polish, launch**: enrich seed + real product photos; `web` CI + branch protection; fix redirect race; deploy Render(api)+Vercel(web) with prod keys/gateway.
