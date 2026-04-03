# Phase 8: Desktop Widget - Implementation Plan

**Date:** 2026-04-01
**Phase:** 8 - Desktop Widget
**Status:** In progress
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-8-desktop-widget-roadmap.md`
**Previous Phase:** `2026-04-01-phase-7-final-project-setup-plan.md`
**Next Phase:** `2026-04-01-phase-9-agentic-ai-plan.md`

---

## Clean Code Principles

This phase introduces a desktop application layer (Electron or Tauri). Keep the widget thin — it is a UI shell that communicates with the existing Stride API backend. Do not duplicate business logic in the widget; it should be a view into the same data the web app uses. Resist adding features that belong in later phases (agent chat is Phase 9).

---

## Goal

Build a standalone desktop widget that lives outside the browser — a small, always-accessible popup for mid-day interaction. This is the core differentiator: users stay in flow without switching to a browser tab. The widget shows current task, quick-actions, and a text input, and syncs with the main web app via the shared backend.

---

## Prerequisites

- Phase 7 complete (project infrastructure rubric-aligned)
- Stride API backend running (tasks, schedule, auth endpoints)
- Core web app functional (task input, "Build my day", timeline view)

---

## 8.1 Widget Shell

### Why

The widget must feel native — it sits in the system tray, launches on login, and opens as a small floating window. Users should be able to glance at it without context-switching out of their current work.

### What to Build

- Choose framework: Electron (mature, larger footprint) or Tauri (Rust-based, smaller binary). Evaluate based on team familiarity and bundle size
- Small floating window with always-on-top option
- System tray icon; click to open/close the popup
- Launch on login (OS-specific startup registration)
- Minimal footprint — widget should not consume significant CPU/memory when idle
- Authenticated session stored locally (secure token storage); communicates with Stride API backend via HTTP/SSE

### What Not to Do

- Do not embed a full browser or replicate the entire web app in the widget
- Do not store task data locally — always fetch from the API (single source of truth)
- Do not build auto-update in this phase — manual updates are fine for beta

---

## 8.2 Widget UI

### Why

The widget UI must be compact and glanceable. Users should see their current task, what's next, and have quick-action buttons — all without scrolling or navigating.

### What to Build

- Current task display with title and time remaining (countdown or end time)
- Next-up task preview (title and start time)
- Quick-action buttons: mark done, skip, running late
- Text input for adding tasks (sent to Stride API, same as web app task creation)
- Compact schedule overview — condensed timeline of remaining tasks for today
- Visual feedback for actions (loading states, success confirmations)

### What Not to Do

- Do not build a full task editor — add-only from the widget, edit from the web app
- Do not show historical tasks or multi-day views
- Do not add chat/agent interaction in this phase — that's Phase 9

---

## 8.3 Sync with Main App

### Why

The widget and web app must always show the same data. A user who marks a task done in the widget should see it reflected immediately in the web app, and vice versa.

### What to Build

- Widget and web app share the same backend — all mutations go through the Stride API
- Real-time or near-real-time sync: either poll on a short interval (10-30s) or use SSE/WebSocket for push updates
- System/toast notifications for schedule changes (new task added, schedule rebuilt, task completed from other device)
- Handle offline gracefully — show last-known state with a "reconnecting" indicator

### What Not to Do

- Do not build a local database or offline-first architecture — online-only is fine for MVP
- Do not implement conflict resolution — last-write-wins via the API is sufficient

---

## Deliverable

Standalone desktop widget that shows current task, quick-actions, and text input. Runs outside the browser via Electron or Tauri. Syncs with the main web app through the shared Stride API.

---

## Acceptance Criteria

- Widget installs and launches on macOS (Windows support is nice-to-have)
- System tray icon present; click opens/closes the widget
- Current task and next task displayed correctly
- Quick-actions (mark done, skip, running late) work and reflect in the web app
- Text input creates a task via the API
- Changes in the web app reflect in the widget (and vice versa)
- Widget uses structured logging (no raw `console.*`)
- All existing tests pass (`npm run test:all`)
- `aiDocs/changelog.md` updated
- Compressed mode shows current task in floating pill
- Full mode shows Gemini-style chat with suggestion chips
- Widget is draggable and position persists
- Chat commands create tasks and query schedule
- Bearer token auth works for all API routes
- Mode switching is smooth with no data loss
- All edge cases handled gracefully

---

## 8.4 Widget Modes (Compressed + Full)

### Why

Users need two interaction levels. A compressed pill for passive glancing at the current task without distraction. A full chatbot view (inspired by Google Gemini's popup) for active interaction — adding tasks, asking questions, viewing schedule. The widget must be draggable anywhere on screen.

### What to Build

- **Compressed mode:** 220x48px floating rounded rectangle showing current task title + countdown + expand button. Entire surface is draggable. 12px border-radius.
- **Full mode:** 380x620px rounded window with header (drag region, Stride branding, compress/close buttons), task bar (current task strip), chat area, suggestion chips, and chat input.
- **Mode switching:** IPC between main process and renderer. Main process handles window resizing. Renderer swaps between `buildCompressedLayout()` and `buildFullLayout()`.
- **Position persistence:** Save window position to electron-store on move events. Restore on startup.
- **Mode persistence:** Save preferred mode to electron-store. Start in last-used mode.

### What Not to Do

- Do not build the actual AI agent — that's Phase 9. Chat uses client-side command parsing for now.
- Do not add window resizing by the user — modes have fixed dimensions.
- Do not animate the mode transition beyond window resize — keep it snappy.

---

## 8.5 Chat UI (Gemini-style)

### Why

The full mode is a chatbot interface inspired by Google Gemini's popup. It lets users interact with Stride conversationally — add tasks, ask about their schedule, get help. This sets up the UI shell for Phase 9's agentic AI backend.

### What to Build

- **Chat messages:** User messages (olive, right-aligned) and assistant messages (dark card, left-aligned) in a scrollable area with auto-scroll.
- **Suggestion chips:** "What's next?", "Add a task", "How's my day?", "What can you do?" — shown in empty state, clickable.
- **Chat input:** Rounded text input at bottom with send button. Enter to submit.
- **ChatController:** Manages message state. Parses simple commands client-side:
  - "add [task]" → creates task via API
  - "what's next" / schedule queries → fetches and formats schedule
  - "help" → returns capabilities
  - Other → helpful fallback ("I'll be smarter soon! For now try...")
- **strideChat bridge:** Preload exposes IPC hooks for Phase 9 agent to replace client-side parsing.

### What Not to Do

- Do not build the LangChain agent — Phase 9.
- Do not persist chat history to database — in-memory only for Phase 8.
- Do not add voice input or file attachments.

---

## 8.6 Bug Fixes & Testing

### Why

The "failed to add task" bug blocks all widget API functionality. Root cause: backend uses cookie-based Supabase auth, widget sends HTTP with no cookies. Fix by adding Bearer token support to API routes. Extensive testing ensures everything works before moving to Phase 9.

### What to Build

- **`api-auth.ts`:** Shared utility that checks `Authorization: Bearer <token>` header first, falls back to cookie auth. Used by all API routes that need auth.
- **Widget login screen:** Email/password login form in the widget that authenticates directly with Supabase REST API. Stores access + refresh tokens in electron-store. Auto-shows on first launch or when session is missing. Replaces the old "set your token in DevTools" workflow.
- **`auth.ts` module:** Widget-side auth module calling Supabase's `/auth/v1/token` endpoint with the public anon key. Handles `grant_type=password` login and `grant_type=refresh_token` session refresh.
- **CSP update:** Widget's `index.html` Content-Security-Policy updated to allow `connect-src` to Supabase domain for auth requests.
- **Better error messages:** 401 responses show "Not authenticated — check your access token" instead of generic error.
- **Comprehensive test suite:** 40+ manual test cases covering modes, chat, auth, integration, and edge cases.

---

## 8.7 Widget Login & Session Management

### Why

Users need to sign in to the widget without opening DevTools. The widget must authenticate directly with Supabase to get a valid access token for API calls. A proper login flow makes the widget self-contained and usable by non-developers.

### What to Build

- **Login screen:** Email/password form shown when no valid session exists. Styled to match the dark theme and olive design system. Replaces the previous "Not connected" banner.
- **Direct Supabase auth:** Widget calls Supabase REST API (`/auth/v1/token`) using the public anon key — no service role key needed. Handles `grant_type=password` for login and `grant_type=refresh_token` for session refresh.
- **Session persistence:** Access token and refresh token stored in electron-store (encrypted). Widget auto-authenticates on restart.
- **Preload API:** Expose `login(email, password)`, `logout()`, and `refreshSession()` via the `strideApi` bridge.
- **Login gate in renderer:** Init checks authentication state. If not authenticated, shows login screen instead of widget. On successful login, transitions to normal widget view with polling.
- **CSP update:** Add Supabase domain to `connect-src` in `index.html` Content-Security-Policy.

### What Not to Do

- Do not use the service role key in the widget — only the public anon key.
- Do not add OAuth/social login — email/password is sufficient for MVP.
- Do not add account creation — users sign up via the web app, sign in via the widget.

### Color & Shape Refinements

- Widget accent colors updated from yellow-olive (`#808000`) to muted sage green (`#6B7355`) to match the website's oklch olive palette.
- Compressed mode changed from pill (border-radius 35px) to rounded rectangle (border-radius 12px, 220x48px).
