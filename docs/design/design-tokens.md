# DevOps Target — Design Tokens
Foundation v1.0 · single source of truth for colors, type, spacing, radius, shadows, breakpoints.

> Stack note: the `web` app is **Tailwind CSS v4 (CSS-first)**. These tokens are implemented in `src/app/globals.css` via `@theme` — see `theme.css` in this folder for the ready-to-paste block. Dark mode uses a `.dark` class on `<html>` (managed by `next-themes`). This doc is the human-readable reference; `theme.css` is the machine source.

## Design direction

Clean, modern SaaS/commerce styling. Calm and technical ("developer tool" confidence, Linear/Vercel-adjacent) applied to a **computer/hardware shop**. Light-first with a first-class dark mode (surfaces/borders/shadows redefined per theme, never auto-inverted). Indigo accent on neutral slate. Strong hierarchy, generous whitespace, realistic product content. Mobile-first.

## Color — Light (default)

| Token | Value | Tailwind ref | Use |
|---|---|---|---|
| `--bg` | `#F8FAFC` | slate-50 | Page background |
| `--surface` | `#FFFFFF` | white | Cards, navbar, product tiles |
| `--surface-2` | `#F1F5F9` | slate-100 | Hover / secondary surfaces |
| `--border` | `#E2E8F0` | slate-200 | Default borders, dividers |
| `--border-strong` | `#CBD5E1` | slate-300 | Inputs, button outlines |
| `--text-primary` | `#0F172A` | slate-900 | Headings, body, prices |
| `--text-secondary` | `#5B6472` | slate-500/600 | Supporting text, specs |
| `--text-tertiary` | `#94A3B8` | slate-400 | Meta, placeholders |
| `--accent` | `#4F46E5` | indigo-600 | Primary actions, active nav, links |
| `--accent-hover` | `#4338CA` | indigo-700 | Hover state |
| `--accent-soft` | `#EEF2FF` | indigo-50 | Active backgrounds, icon chips, badges |

## Color — Dark

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0F19` | Page background |
| `--surface` | `#141A26` | Cards, navbar |
| `--surface-2` | `#1B2333` | Hover / secondary surfaces |
| `--border` | `#262F42` | Default borders |
| `--border-strong` | `#33405A` | Inputs, outlines |
| `--text-primary` | `#F1F5F9` | Headings, body, prices |
| `--text-secondary` | `#9AA5B8` | Supporting text |
| `--text-tertiary` | `#6B7688` | Meta, placeholders |
| `--accent` | `#6366F1` | indigo-500 — brighter for dark bg |
| `--accent-hover` | `#818CF8` | indigo-400 |
| `--accent-soft` | `#1E1B4B` | indigo-950 — active/badge bg |

## Color — Semantic (both themes)

Soft-bg + solid-text pattern; all pairings pass WCAG AA against their surface. First value = light, second = dark (brighter).

| Role | Light | Dark | Commerce use |
|---|---|---|---|
| success | `#16A34A` | `#22C55E` | In stock, order placed, payment ok |
| warning | `#D97706` | `#F59E0B` | Low stock, pending |
| danger | `#DC2626` | `#F87171` | Out of stock, errors, destructive |
| info | `#0891B2` | `#22D3EE` | Shipping/info notices |
| price / sale | `#DC2626` | `#F87171` | Sale price emphasis (use sparingly) |

Rule: **dark mode uses 1px borders instead of shadows** for separation (shadows barely read on dark). Light mode uses soft shadows and light borders.

## Typography

- **UI font:** **Inter** (400/500/600/700/800) — LOCKED. Loaded via `next/font/google` (Inter v4 variable, self-hosted at build). Replaces the repo's default Geist. Exposed as `--font-inter`.
- **Numeric/mono font:** **JetBrains Mono** (500/600/700) — used only for **prices, SKUs, order numbers, spec values, and kbd hints**, to give a technical feel without mono everywhere. Exposed as `--font-jetbrains`.
- **RTL companion:** Inter does not cover Arabic/Farsi. For the RTL locale add **Noto Sans Arabic** (same weights), applied when `dir="rtl"`.

Integration (apply during first build, atomically with `theme.css` → `globals.css`):

```ts
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400","500","600","700","800"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["500","600","700"] });
// add `${inter.variable} ${jetbrainsMono.variable}` to <html> className; remove Geist imports
```

| Role | Size (mobile → desktop) | Weight | Tracking |
|---|---|---|---|
| Display / page H1 | 24px → 32px | 800 | -0.02em |
| Section H2 | 18px → 22px | 700 | -0.01em |
| Card / product title H3 | 15px → 16px | 600 | normal |
| Body | 14px → 15px | 400–500 | normal |
| Price (large) | 20px → 24px (JetBrains Mono) | 700 | -0.02em |
| Price (inline/card) | 14px → 15px (JetBrains Mono) | 600 | -0.01em |
| Meta / specs / timestamps | 12px → 12.5px | 400–500 | normal |
| Micro labels (pills, kbd, badges) | 10.5–11.5px | 700 | 0.04em, uppercase |

Mobile inputs must be **≥16px** font-size to prevent iOS auto-zoom (carried lesson from RDA).

## Spacing scale (Tailwind default 4px base)

Use the standard Tailwind scale. Conventions for this app:

- Card padding: `p-4` (16px) mobile → `p-5`/`p-6` (20–24px) desktop.
- Grid gaps: `gap-4` (16px) mobile → `gap-6` (24px) desktop.
- Section vertical rhythm: `py-10` (40px) mobile → `py-16`/`py-20` (64–80px) desktop.
- Page gutters: `px-4` mobile → `px-6` sm → `px-8` lg; max content width `max-w-7xl` centered.

## Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px (`rounded-lg`) | Inputs, badges, small buttons |
| `--radius-md` | 12px (`rounded-xl`) | Cards, product tiles, buttons |
| `--radius-lg` | 16px (`rounded-2xl`) | Modals, sheets, hero panels |
| `--radius-full` | 9999px | Avatars, pills, icon buttons |

## Shadows (light mode only; dark uses borders)

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,.06)` | Resting cards |
| `--shadow-md` | `0 4px 12px rgba(15,23,42,.08)` | Hover lift on product cards, dropdowns |
| `--shadow-lg` | `0 12px 32px rgba(15,23,42,.14)` | Modals, popovers, cart drawer |

## Breakpoints (standard Tailwind viewport)

| Name | Min width | Key layout changes |
|---|---|---|
| base | 0 | Mobile-first. Single column, bottom nav / hamburger, full-width buttons, 2-col product grid |
| `sm` | 640px | 2–3 col product grid, inline secondary actions |
| `md` | 768px | Tablet: 3-col grid, sidebar filters can appear |
| `lg` | 1024px | Full inline top nav + search, hamburger hides, 4-col product grid, product detail 2-col (gallery / buy box) |
| `xl` | 1280px | Max content width, wider gutters, 4–5 col grid |

Nothing overflows horizontally at 320px. Respect iOS safe areas on mobile bottom nav.

## Accessibility

- All text/background pairings pass **WCAG AA** in both themes.
- Every interactive element keyboard-reachable with a visible focus ring (`--accent` outline).
- Semantic HTML: `nav`, `main`, `aside`, `button`, `ul/li` for product grids.
- Support **LTR and RTL** — use logical properties / Tailwind `ps-*`/`pe-*`/`ms-*`/`me-*` and `rtl:`/`ltr:` variants, never hard-coded left/right for content flow.

## Related

- `theme.css` — Tailwind v4 `@theme` implementation of these tokens.
- `component-inventory.md` — components that consume these tokens.
- `app-map.md` — where components are used.
