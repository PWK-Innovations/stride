# Phase 8: Desktop Widget - Implementation Plan

**Date:** 2026-04-01
**Phase:** 8 - Desktop Widget
**Status:** Not started
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
