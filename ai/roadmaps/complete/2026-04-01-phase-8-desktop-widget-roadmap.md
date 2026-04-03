# Phase 8: Desktop Widget - Roadmap

**Date:** 2026-04-01
**Phase:** 8 - Desktop Widget
**Status:** In progress
**Plan:** `2026-04-01-phase-8-desktop-widget-plan.md`
**Previous Phase:** `2026-04-01-phase-7-final-project-setup-roadmap.md`

---

## Tasks

### 8.1 Widget Shell

- [x] Evaluate Electron vs. Tauri — choose framework based on team familiarity and bundle size
- [x] Scaffold widget project (separate directory or monorepo workspace)
- [x] Create main window — small floating popup (300-400px wide)
- [x] Implement always-on-top toggle
- [x] Add system tray icon with open/close click handler
- [x] Implement launch-on-login (OS startup registration)
- [x] Set up secure token storage for authenticated session
- [x] Connect widget to Stride API backend (base URL config, auth headers)
- [x] Add structured logging to widget (no raw `console.*`)
- [x] Test widget launches, opens, and closes cleanly on macOS

### 8.2 Widget UI

- [x] Build current task display (title, time remaining/countdown)
- [x] Build next-up task preview (title, start time)
- [x] Implement "Mark done" quick-action button
- [x] Implement "Skip" quick-action button
- [x] Implement "Running late" quick-action button
- [x] Build text input for adding new tasks (POST to Stride API)
- [x] Build compact schedule overview (condensed list of remaining tasks)
- [x] Add loading states and success confirmations for actions
- [x] Style widget UI to match olive design system
- [x] Test all quick-actions update task state via API

### 8.3 Sync with Main App

- [x] Implement data refresh — poll API on interval (10-30s) or SSE for push updates
- [x] Verify changes in widget reflect in web app immediately
- [x] Verify changes in web app reflect in widget on next refresh
- [x] Add system/toast notifications for schedule changes
- [x] Handle offline state — show last-known data with "reconnecting" indicator
- [x] Test sync end-to-end: create task in web app → appears in widget → mark done in widget → reflected in web app

### 8.4 Widget Modes (Compressed + Full)

- [x] Add `WidgetMode` type and state management to main process
- [x] Implement compressed mode window sizing (220x48, rounded rectangle, border-radius 12px)
- [x] Implement full mode window sizing (380x620, border-radius 12px)
- [x] Add mode toggle IPC channels (`set-widget-mode`, `get-widget-mode`, `mode-changed`)
- [x] Expose `strideWidget` bridge in preload (`getMode`, `setMode`, `onModeChanged`)
- [x] Build compressed view component (task title, countdown, expand button)
- [x] Build full mode header (Stride branding, compress/close buttons, drag region)
- [x] Build task bar component (compact current task for top of full mode)
- [x] Implement window resize transition between modes
- [x] Make entire compressed pill draggable (`-webkit-app-region: drag`)
- [x] Make full mode header draggable, content area non-draggable
- [x] Persist window position across sessions (electron-store)
- [x] Persist preferred mode across sessions (electron-store)
- [x] Add mode toggle to system tray context menu
- [x] Update type declarations in `global.d.ts`
- [ ] Test mode switching does not lose data or break polling

### 8.5 Chat UI (Gemini-style)

- [x] Create Gemini popup reference guide (`ai/guides/external/gemini-popup-reference.md`)
- [x] Build chat message list component with user/assistant bubbles and auto-scroll
- [x] Style chat bubbles (user = olive right-aligned, assistant = dark card left-aligned)
- [x] Build suggestion chips component ("What's next?", "Add a task", "How's my day?", "What can you do?")
- [x] Build chat text input with send button (rounded, Enter to submit)
- [x] Implement ChatController for message state management
- [x] Add client-side command parsing ("add [task]" creates task, "what's next" shows schedule, "help" shows capabilities)
- [x] Wire chat input → ChatController → API calls
- [x] Show "thinking..." typing indicator during processing
- [x] Chat "add [task name]" creates task via existing API and confirms in chat
- [x] Chat "what's next" / "what's my schedule" returns formatted schedule
- [x] Add `strideChat` bridge in preload for future Phase 9 agent integration
- [x] Style chat area with Gemini-inspired clean typography and olive accents
- [x] Add fade-in animation for new messages
- [x] Suggestion chips trigger correct actions on click
- [x] Empty state shows suggestion chips + welcome message

### 8.7 Widget Login & Session Management

- [x] Create `widget/src/auth.ts` — Supabase REST auth module (login + refresh)
- [x] Create login view component (`widget/src/renderer/components/login-view.ts`)
- [x] Add `login()`, `logout()`, `refreshSession()` to preload `strideApi` bridge
- [x] Store refresh token alongside access token in electron-store
- [x] Update renderer to show login screen when not authenticated
- [x] Wire login form → Supabase auth → store token → render widget
- [x] Update `index.html` CSP to allow Supabase domain in `connect-src`
- [x] Add login form styles (dark theme, olive accents)
- [x] Update `global.d.ts` with login/logout/refreshSession types
- [x] Update widget colors from yellow-olive (#808000) to sage green (#6B7355)
- [x] Change compressed mode from pill (35px radius) to rounded rectangle (12px radius, 48px height)

### 8.6 Bug Fixes & Extensive Testing

#### Auth Fix

- [x] Diagnose "failed to add task" error (root cause: no Bearer token support in backend)
- [x] Create `app/lib/supabase/api-auth.ts` — shared utility for Bearer + cookie auth
- [x] Update `api/tasks/route.ts` to use `getAuthenticatedUser()`
- [x] Update `api/tasks/[id]/route.ts` to use `getAuthenticatedUser()`
- [x] Update `api/schedule/route.ts` to use `getAuthenticatedUser()`
- [x] Update `api/schedule/[id]/route.ts` to use `getAuthenticatedUser()`
- [x] Add auth status indicator in widget (shows when token is missing)
- [x] Add clear error messages for 401 responses in widget API client

#### Compressed Mode Testing

- [ ] Widget launches in compressed mode by default
- [ ] Current task title displays correctly in pill (truncated if long)
- [ ] Countdown timer updates every 60 seconds
- [ ] "No task right now" shows in muted text when schedule is empty
- [ ] Clicking expand button transitions to full mode
- [ ] Entire pill is draggable to any screen position
- [ ] Dragged position persists after widget restart

#### Full Mode Testing

- [ ] Full mode opens at correct dimensions (380x620)
- [ ] Header shows "Stride" branding with compress/close buttons
- [ ] Current task bar displays at top with task info and countdown
- [ ] Chat message area is scrollable
- [ ] Suggestion chips appear in empty chat state
- [ ] Clicking a suggestion chip sends it as a user message
- [ ] Chat input accepts text and sends on Enter
- [ ] User messages appear right-aligned in olive
- [ ] Assistant responses appear left-aligned in dark card
- [ ] "Thinking..." indicator shows during processing
- [ ] Auto-scroll to newest message on arrival
- [ ] Compress button returns to compressed mode
- [ ] Close button hides window (tray icon remains active)

#### Chat Command Testing

- [ ] "add groceries" creates a task named "groceries" via API
- [ ] "what's next" returns formatted next task info
- [ ] "what's my schedule" returns today's full schedule
- [ ] "help" / "what can you do" returns capabilities list
- [ ] Unrecognized input returns helpful fallback message
- [ ] Task creation failure shows error message in chat

#### Auth Testing

- [ ] Task creation with valid Bearer token succeeds (status 201)
- [ ] Task creation with empty/missing token returns clear auth error
- [ ] Widget shows auth status indicator when token is missing
- [ ] Setting token in widget enables API calls
- [ ] All 4 API routes accept Bearer token authentication
- [ ] Cookie auth (web app) continues to work unchanged after changes

#### Integration Testing

- [ ] Create task in widget chat → appears in web app task list
- [ ] Complete task in web app → disappears from widget on next poll
- [ ] Mode switch does not interrupt polling cycle
- [ ] Mode switch does not lose chat message history
- [ ] Tray menu mode toggle matches actual widget state
- [ ] Multiple rapid mode switches do not cause layout corruption

#### Login & Session Testing

- [ ] Login screen appears on first launch (no stored token)
- [ ] Valid email/password signs in and transitions to widget
- [ ] Invalid credentials show error message on login screen
- [ ] Token persists after widget restart (no re-login needed)
- [ ] Logout clears tokens and returns to login screen
- [ ] Expired token triggers re-authentication flow

#### Edge Case Testing

- [ ] Widget handles backend offline gracefully in both modes
- [ ] Extremely long task titles truncate properly in both modes
- [ ] Chat with 50+ messages still scrolls smoothly
- [ ] Window resize animation does not flicker on macOS
- [ ] Widget remains responsive during API calls
- [ ] System sleep/wake does not break widget state or polling

---

## Acceptance Criteria

- [x] All 8.1/8.2/8.3 tasks checked off
- [x] Widget installs and launches on macOS
- [x] System tray icon works (open/close)
- [x] Current task and next task display correctly
- [x] Quick-actions work and sync with web app
- [x] Text input creates tasks via API
- [x] Bidirectional sync between widget and web app
- [x] Structured logging used throughout (no raw `console.*`)
- [x] `npm run test:all` passes
- [x] `aiDocs/changelog.md` updated
- [x] Roadmap tasks checked off
- [ ] All 8.4/8.5/8.6/8.7 tasks checked off
- [ ] Compressed mode shows current task in floating pill
- [ ] Full mode shows Gemini-style chat with suggestion chips
- [ ] Widget is draggable and position persists
- [ ] Chat commands create tasks and query schedule
- [ ] Bearer token auth works for all API routes
- [ ] Mode switching is smooth with no data loss
- [ ] All edge cases handled gracefully
- [ ] Widget login screen works without DevTools
- [ ] Widget colors match website green (not yellow)

---

## Next Phase

**Phase 9:** Agentic AI (`2026-04-01-phase-9-agentic-ai-roadmap.md`)
