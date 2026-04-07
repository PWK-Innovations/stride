# Phase 12: Customer Feedback Features - Implementation Plan

**Date:** 2026-04-01 (updated 2026-04-07)
**Phase:** 12 - Customer Feedback Features
**Status:** Not started
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-12-secondary-features-roadmap.md`
**Previous Phase:** `2026-04-01-phase-11-beta-launch-plan.md`

---

## Clean Code Principles

These features come directly from customer feedback. Reuse existing infrastructure (audio pipeline, agent, widget) wherever possible. Keep each sub-phase independently shippable. No speculative features — only what was requested.

---

## Goal

Add voice chat, AI time estimation, and widget UX upgrades based on customer feedback collected during and after beta.

---

## Prerequisites

- Phase 11 complete (beta launched, feedback collected, analytics operational)
- Audio-to-task pipeline working (Phase 4)
- Desktop widget functional (Phase 8)
- Agentic AI operational (Phase 9)
- Web chatbot working (Phase 10)

---

## 12.1 Audio Chat

### Why

Users want to talk to the chatbot instead of typing, especially on the widget where keyboard input is awkward. The audio-to-task pipeline (Whisper transcription) already exists — we reuse it for chat input.

### What to Build

- Mic button in the web chat panel (`ChatPanel.tsx`) — tap to record, tap again to stop
- Mic button in the widget chat UI — same recording flow via Electron IPC
- Reuse `useAudioRecorder` hook for browser-side recording (web app)
- Widget records via Electron audio APIs, sends audio blob to backend
- New endpoint or extend existing: audio blob → Whisper transcription → feed transcription as chat message to agent
- Streaming agent response works the same as text input (SSE)
- Visual feedback: recording indicator (pulsing dot), transcription preview before sending (optional — could auto-send)

### What Not to Do

- Do not build speech-to-text on device — Whisper API is sufficient
- Do not add text-to-speech for agent responses (future feature if requested)
- Do not change the agent itself — only the input method changes

---

## 12.2 AI Time Estimation

### Why

When tasks come in via audio, image, or chat, the user doesn't specify duration — everything defaults to 30 minutes. GPT can estimate reasonable durations based on task descriptions, and the user can adjust before confirming.

### What to Build

- Add duration estimation to task extraction prompts (photo, audio, chat-created tasks)
- For `extractTasksFromPhoto` and `extractTasksFromText`: update the GPT prompt to include a `durationMinutes` estimate in the structured output (already returns `ExtractedTask[]` — add or populate the duration field)
- For agent `createTask` tool: when user doesn't specify duration, have the agent estimate based on task description and include in the tool call
- Extracted tasks review UI (`ExtractedTasksReview.tsx`): show the estimated duration as an editable field so users can adjust before confirming
- Agent chat: when creating a task, include the estimated duration in the confirmation message ("I'll add 'Write quarterly report' — estimated 90 minutes. Sound right?")
- Manual task entry on web dashboard: no changes needed (users already set duration themselves)

### What Not to Do

- Do not build ML-based estimation — GPT prompt-based estimation is sufficient
- Do not track estimation accuracy yet — that's for a future personalization phase
- Do not change the scheduler or solver — they already use `durationMinutes` from tasks

---

## 12.3 Widget Upgrades

### Why

Customer feedback identified several widget UX gaps: completing a task should flow into starting the next one, "running late" needs quick time-add options, and the expanded view should show the full daily schedule like the web app.

### What to Build

**Task Completion Flow:**
- When a task is marked as done, show a prompt: "Start [next task] now?" with Yes/No
- If yes, move the next task's start time to now and adjust the schedule accordingly
- Use the existing reschedule infrastructure (`lib/agent/reschedule.ts`)

**Running Late — Quick Time Add:**
- When user clicks "Need more time", show quick options: +15 min, +30 min, +60 min
- Extend the current task's end time by the selected amount
- Trigger a reschedule of subsequent tasks to accommodate the extension
- Dismiss the options if user taps elsewhere

**Scrollable Daily Schedule:**
- In full/expanded mode, show a scrollable daily schedule view similar to `DailyTimeline` on the web
- Time slots with scheduled tasks, calendar events, and free time visible
- Current time indicator
- Tappable tasks to see details

**Chat Overlay:**
- Move chat to the bottom of the expanded widget
- Chat opens as an overlay on top of the schedule when the user starts a conversation (taps input or suggestion chip)
- Chat can be dismissed to return to the schedule view
- Preserve existing chat functionality (streaming, tool indicators, suggestion chips)

### What Not to Do

- Do not replicate the full web dashboard in the widget
- Do not add drag-to-reschedule in the widget (web-only for now)
- Do not change the compressed mode — it stays as-is

---

## Deliverable

Voice chat working in both web and widget. AI time estimation for non-manual task entry. Widget upgraded with task completion flow, quick time-add, daily schedule view, and chat overlay.

---

## Acceptance Criteria

- Voice input works in web chat panel and widget chat
- AI estimates task duration for audio, photo, and chat-created tasks
- Estimated durations are editable by users before confirmation
- Widget shows "Start next task?" prompt after completing a task
- Widget "Need more time" shows +15/+30/+60 min options
- Widget expanded mode shows scrollable daily schedule
- Widget chat opens as overlay on schedule
- All existing tests pass (`npm run test:all`)
- `aiDocs/changelog.md` updated
