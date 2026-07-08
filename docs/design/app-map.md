# DevOps Target — App Map / IA
Foundation v1.0 · routes, rendering strategy, and auth gating for the computer shop.

> Rendering legend:
> - **SSR/SSG** = Server Component, server-rendered for SEO (public, indexable).
> - **Client** = Client Component (interactive, behind auth or session-specific, not indexed).
> - **Mixed** = server shell + client islands.
>
> Auth legend: **Public** (no login), **Guest-ok** (works logged-out, better logged-in), **Private** (login required, gated by middleware).

## Route map

### Storefront — public, SEO-critical
| Route | Render | Auth | Purpose / key components |
|---|---|---|---|
| `/` | SSG/ISR | Public | Landing: Hero, featured categories, featured/deal products (ProductGrid), value props, Footer |
| `/products` | SSR/ISR | Public | Full catalog: ProductGrid + FilterPanel + SortDropdown + Pagination |
| `/products/[slug]` | SSR/ISR | Public | Product detail: ProductGallery, BuyBox, SpecTable, Tabs (Specs/Reviews/Shipping), related ProductGrid. Rich metadata + JSON-LD Product schema |
| `/categories/[slug]` | SSR/ISR | Public | Category listing (same as `/products` scoped) |
| `/search` | SSR (query) | Public | SearchBar results as ProductGrid; empty/no-results EmptyState |
| `/deals` | SSR/ISR | Public | Sale/clearance grid |
| `/about` | SSG | Public | Marketing (reuse existing landing sections) |
| `/contact` | SSG + client form | Public | Contact form → backend |
| `/faq` | SSG | Public | FAQ accordion |
| `/blog`, `/blog/[slug]` | SSG/ISR | Public | Optional — SEO content/guides |

### Commerce — guest-ok
| Route | Render | Auth | Purpose |
|---|---|---|---|
| `/cart` | Client | Guest-ok | CartLineItem list + CartSummary; promo code |
| `/checkout` | Client | Guest-ok | AddressForm, shipping, PaymentForm (Stripe); guest or logged-in |
| `/checkout/success` / `/order/[id]` | Client | Guest-ok | Order confirmation, OrderStatusStepper, receipt |

### Account — private (login required)
| Route | Render | Auth | Purpose |
|---|---|---|---|
| `/account` | Client | Private | Profile/settings overview; LocaleToggle, ThemeToggle |
| `/account/orders` | Client | Private | Order history list |
| `/account/orders/[id]` | Client | Private | Order detail, status, reorder |
| `/account/addresses` | Client | Private | AddressCard CRUD |
| `/account/security` | Client | Private | Password change, **2FA** setup/challenge (django-otp) |
| `/account/notifications` | Client | Private | Notifications center (Django notifications API) |
| `/account/wishlist` | Client | Private | Saved products |
| `/support` (or `/chat`) | Client | Guest-ok/Private | Live chat with AI-assist (reuse RDA Channels websocket + `/ai`) |

### Auth — public entry
| Route | Render | Auth | Purpose |
|---|---|---|---|
| `/login` | Client | Public | Login (djoser token); redirect to intended destination |
| `/register` | Client | Public | Register |
| `/forgot-password` | Client | Public | Request reset email |
| `/reset-password` | Client | Public | Set new password |
| `/verify-2fa` | Client | Public (mid-auth) | 2FA challenge step |

### Admin
- **Django admin** (`api` service, separate origin) is the product/order/user management UI for launch — no custom Next.js admin needed initially.
- Optional later: `/admin` dashboard in `web` (Private, staff-only) for richer merchandising.

## Navigation model

- **Desktop:** sticky Navbar (logo, nav, search, theme, cart, bell, avatar). Footer on every page.
- **Mobile:** compact Navbar + **MobileBottomNav** (Home / Shop / Cart / Account), hidden on `/checkout` and chat composer. Filters/sort/cart open as Drawers/Sheets.
- **Breadcrumbs** on catalog/category/product.

## Rendering & SEO rules

- Product, category, and landing pages are **server-rendered with metadata** (`generateMetadata`) and **Product/BreadcrumbList JSON-LD**. This is the entire reason for Next.js over Vite — keep these server-first.
- Cart, checkout, account, chat are **client** and `noindex`.
- Use **ISR** (revalidate) for catalog/product so pages stay fast and fresh without full rebuilds.
- `sitemap.xml` + `robots.txt` generated from published products/categories.

## i18n / RTL

- Locale-aware routing (`next-intl` or App Router i18n). Set `<html dir>` per locale.
- English (LTR) + at least one RTL locale (Arabic/Farsi). All layouts use logical properties so mirroring is automatic.

## Auth gating

- Middleware protects `/account/**` (and `/admin` if added) → redirect to `/login?next=<path>`, restore destination after login (RDA pattern).
- `/cart` and `/checkout` remain guest-ok; prompt login/register at payment if desired.

## Build priority (screen design order)

1. Landing `/` (adapt existing sections) → 2. `/products` listing → 3. `/products/[slug]` detail → 4. `/cart` → 5. `/checkout` + success → 6. `/login` `/register` → 7. `/account` + orders → 8. 2FA + security → 9. `/support` chat → 10. remaining marketing/blog.

## Related
- `design-tokens.md` / `theme.css` — tokens.
- `component-inventory.md` — components each screen composes.
- `../../../handoff.md` — repo state; `devops-target-roadmap.md` (Mockups) — full plan.
