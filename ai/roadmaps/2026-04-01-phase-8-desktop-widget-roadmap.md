# Phase 8: Desktop Widget - Roadmap

**Date:** 2026-04-01
**Phase:** 8 - Desktop Widget
**Status:** Not started
**Plan:** `2026-04-01-phase-8-desktop-widget-plan.md`
**Previous Phase:** `2026-04-01-phase-7-final-project-setup-roadmap.md`

---

## Tasks

### 8.1 Widget Shell

- [ ] Evaluate Electron vs. Tauri — choose framework based on team familiarity and bundle size
- [ ] Scaffold widget project (separate directory or monorepo workspace)
- [ ] Create main window — small floating popup (300-400px wide)
- [ ] Implement always-on-top toggle
- [ ] Add system tray icon with open/close click handler
- [ ] Implement launch-on-login (OS startup registration)
- [ ] Set up secure token storage for authenticated session
- [ ] Connect widget to Stride API backend (base URL config, auth headers)
- [ ] Add structured logging to widget (no raw `console.*`)
- [ ] Test widget launches, opens, and closes cleanly on macOS

### 8.2 Widget UI

- [ ] Build current task display (title, time remaining/countdown)
- [ ] Build next-up task preview (title, start time)
- [ ] Implement "Mark done" quick-action button
- [ ] Implement "Skip" quick-action button
- [ ] Implement "Running late" quick-action button
- [ ] Build text input for adding new tasks (POST to Stride API)
- [ ] Build compact schedule overview (condensed list of remaining tasks)
- [ ] Add loading states and success confirmations for actions
- [ ] Style widget UI to match olive design system
- [ ] Test all quick-actions update task state via API

### 8.3 Sync with Main App

- [ ] Implement data refresh — poll API on interval (10-30s) or SSE for push updates
- [ ] Verify changes in widget reflect in web app immediately
- [ ] Verify changes in web app reflect in widget on next refresh
- [ ] Add system/toast notifications for schedule changes
- [ ] Handle offline state — show last-known data with "reconnecting" indicator
- [ ] Test sync end-to-end: create task in web app → appears in widget → mark done in widget → reflected in web app

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] Widget installs and launches on macOS
- [ ] System tray icon works (open/close)
- [ ] Current task and next task display correctly
- [ ] Quick-actions work and sync with web app
- [ ] Text input creates tasks via API
- [ ] Bidirectional sync between widget and web app
- [ ] Structured logging used throughout (no raw `console.*`)
- [ ] `npm run test:all` passes
- [ ] `aiDocs/changelog.md` updated
- [ ] Roadmap tasks checked off

---

## Next Phase

**Phase 9:** Agentic AI (`2026-04-01-phase-9-agentic-ai-roadmap.md`)
