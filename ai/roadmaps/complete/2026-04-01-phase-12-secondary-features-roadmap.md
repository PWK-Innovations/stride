# Phase 12: Customer Feedback Features - Roadmap

**Date:** 2026-04-01 (updated 2026-04-07)
**Phase:** 12 - Customer Feedback Features
**Status:** Not started
**Plan:** `2026-04-01-phase-12-secondary-features-plan.md`
**Previous Phase:** `2026-04-01-phase-11-beta-launch-roadmap.md`

---

## Tasks

### 12.1 Audio Chat

- [x] Add mic button to web `ChatPanel.tsx` with recording UI (pulsing indicator, stop button)
- [x] Reuse `useAudioRecorder` hook for browser-side recording in chat
- [x] Create or extend endpoint: audio blob → Whisper transcription → agent chat message
- [x] Stream agent response back via SSE (same as text input)
- [x] Add mic button to widget chat UI
- [x] Wire widget mic recording via Electron IPC (record → send blob → stream response)
- [x] Add visual feedback: recording indicator, optional transcription preview
- [x] Test voice chat end-to-end on web and widget

### 12.2 AI Time Estimation

- [x] Update `extractTasksFromPhoto` GPT prompt to estimate `durationMinutes` per task
- [x] Update `extractTasksFromText` GPT prompt to estimate `durationMinutes` per task
- [x] Update agent `createTask` tool to estimate duration when user doesn't specify
- [x] Update `ExtractedTasksReview` UI to show editable duration field per task
- [x] Agent confirms estimated duration in chat when creating tasks ("~90 min, sound right?")
- [x] Ensure manual web task entry is unaffected (users already set duration)
- [x] Test estimation quality across task types (quick email vs. deep work vs. meetings)

### 12.3 Widget Upgrades

**Task Completion Flow:**
- [x] After marking task done, show "Start [next task] now?" prompt with Yes/No
- [x] If yes, move next task start time to now via reschedule API
- [x] Dismiss prompt if user taps No or outside

**Running Late — Quick Time Add:**
- [x] Replace single "Need more time" button with expandable options: +15, +30, +60 min
- [x] Extend current task end time by selected amount
- [x] Trigger reschedule of subsequent tasks after extension
- [x] Dismiss options on tap-away or after selection

**Scrollable Daily Schedule:**
- [x] Build scrollable timeline view in widget full/expanded mode
- [x] Show scheduled tasks, calendar events, and free time slots
- [x] Add current time indicator (red line)

**Chat Overlay:**
- [x] Move chat input to bottom of expanded widget
- [x] Chat opens as overlay on top of schedule when user taps input or chip
- [x] Chat dismissible to return to schedule view
- [x] Preserve streaming, tool indicators, and suggestion chips

---

## Acceptance Criteria

- [x] All 12.1–12.3 tasks complete
- [x] Voice chat works in web and widget
- [x] AI time estimation active for audio, photo, and chat task creation
- [x] Widget task completion → next task flow working
- [x] Widget quick time-add options working
- [x] Widget expanded mode shows scrollable schedule
- [x] Widget chat opens as overlay
- [x] `npm run test:all` passes
- [x] `aiDocs/changelog.md` updated
- [x] Roadmap tasks checked off

---

## Next Phase

TBD — goals, personalization loop, and refinements deferred to future phases based on continued user feedback.
