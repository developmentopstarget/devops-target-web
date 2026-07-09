# DevOps Target — Support chat (`/support`) Handoff
Screen 8 · v1.0 · guest-ok/private · references `web/docs/design/` foundations.

## Design direction

Full-height chat: header (connection status) → scrollable message thread → quick-reply chips → composer. AI assistant answers first, with seamless handoff to store staff. **Reuses the RDA backend's Channels websocket + `/ai` chat** (already built in `api`) — this is a port, not a from-scratch feature.

## Visual mockup

`devops-target-support.html` — full-height layout with AI + staff + user message bubbles, a typing indicator, quick-reply chips, composer, and an AI disclaimer. Theme toggle in demo bar.

## Layout / sections

1. **Header** — "Support" + connection status dot (Connecting / Connected / Reconnecting) + theme toggle.
2. **Message thread** — day separators; bubbles by sender: `me` (accent, right), `ai` (AI tag), `agent` (Staff tag). Avatars, timestamps, delivery ticks; typing indicator.
3. **Quick replies** — chips (Track my order, Store hours, Return policy, Talk to a human) that prefill/send.
4. **Composer** — auto-grow textarea, send button, Enter-to-send / Shift+Enter newline, AI disclaimer.

## Components

**Reuse:** slim header, IconButton, ThemeToggle, `formatCurrency` (n/a), AuthProvider (for identity/room), Toast; **port from RDA**: Chat websocket logic (`react-use-websocket`), message model, per-user room, `/ai` fallback + guardrails.

**New (build):**
- `/app/support/page.tsx` (client).
- `ChatThread`, `MessageBubble` (variants: me/ai/agent), `TypingIndicator`, `QuickReplies`, `ChatComposer`, `ConnectionStatus`, `useSupportChat` hook (websocket connect/auth/send/history).

## Backend integration (reuse RDA `api`)

- **WebSocket:** connect to `api` Channels endpoint; **authenticate after connect** via first message (RDA pattern — token not in URL). Per-user room `user_<id>`.
- **History:** `GET /api/chat/history/` (exists) on load.
- **AI:** `/ai` path with configurable model/timeout/rate-limit + safe fallback (exists). Distinguish AI vs staff messages via a sender/type field (extend message model with `sender_type: user|ai|staff`).
- **Auth:** guest can start a session (anonymous room) or require login — decide; RDA currently requires auth, so gate `/support` as private or add a guest room.
- Reconnect handling, auth timeout, message validation (≤2000 chars), empty-message reject — all already in RDA; carry them over.

## States

- **Connection:** connecting (disabled composer), connected, reconnecting (banner), auth-timeout/closed.
- **Message:** sending → delivered; failed → retry.
- **AI:** typing indicator while awaiting `/ai`; fallback message on AI error/misconfig (no raw errors).
- **Empty:** first-visit greeting from AI.
- **Handoff:** visual switch when a staff member joins (Staff tag).
- Composer: disabled while disconnected; char limit feedback.

## Accessibility

Thread is an `aria-live="polite"` log; messages have sender labels; composer labeled; Enter/Shift+Enter documented; focus management on new messages; WCAG AA both themes; mobile textarea ≥16px.

---

## Copy-paste prompt for Claude Code

```
Build the support chat page (route `/support`) in the `web` Next.js app. Client-rendered, noindex. This PORTS the existing chat from the Django backend (devops-target-api: Channels websocket + /ai), not a new feature — reuse those endpoints.

Read foundations + reuse: docs/design/*; reuse slim header, IconButton, ThemeToggle, Toast, AuthProvider/useAuth. Add react-use-websocket.
Visual reference: docs/design/mockups/support.html (full-height header/thread/quick-replies/composer; match tokens/spacing; Tailwind classes, not inline CSS).

Build:
- src/app/support/page.tsx (client, full-height flex column).
- Components (one per file, typed): ChatThread (aria-live log, day separators), MessageBubble (variants me/ai/agent with avatar, timestamp, delivery tick), TypingIndicator, QuickReplies (chips prefill/send), ChatComposer (auto-grow textarea, Enter=send / Shift+Enter=newline, char limit 2000, disabled while disconnected), ConnectionStatus (connecting/connected/reconnecting).
- useSupportChat hook: connect to the api Channels websocket, authenticate AFTER connect via the first message (token not in URL — mirror RDA), per-user room user_<id>, load GET /api/chat/history/ on mount, send messages, handle /ai responses + safe fallback, reconnect + auth-timeout handling, reject empty / >2000-char messages.
- Distinguish AI vs staff messages via a sender_type field (user|ai|staff) — extend the client message type; backend field may need adding in api (note as TODO).

Config: websocket + api base URLs from env (NEXT_PUBLIC_API_BASE_URL / NEXT_PUBLIC_WS_BASE_URL). Gate /support per the api's auth model (RDA requires auth → protect route or implement a guest room; pick one and document).

States: connection (connecting disables composer / connected / reconnecting banner / closed), message sending→delivered→failed+retry, AI typing indicator + fallback on AI error, first-visit AI greeting, staff-handoff visual (Staff tag). a11y: aria-live thread, sender labels, labeled composer, focus mgmt on new messages, mobile textarea >=16px, WCAG AA both themes.

When done: npm run build + npm run lint, show summary + changed files, update handoff.md. Do not commit until I approve; stage files explicitly.
```
