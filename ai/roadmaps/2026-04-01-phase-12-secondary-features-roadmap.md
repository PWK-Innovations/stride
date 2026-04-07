# Phase 12: Customer Feedback Features - Roadmap

**Date:** 2026-04-01 (updated 2026-04-07)
**Phase:** 12 - Customer Feedback Features
**Status:** Not started
**Plan:** `2026-04-01-phase-12-secondary-features-plan.md`
**Previous Phase:** `2026-04-01-phase-11-beta-launch-roadmap.md`

---

## Tasks

### 12.1 Audio Chat

- [ ] Add mic button to web `ChatPanel.tsx` with recording UI (pulsing indicator, stop button)
- [ ] Reuse `useAudioRecorder` hook for browser-side recording in chat
- [ ] Create or extend endpoint: audio blob → Whisper transcription → agent chat message
- [ ] Stream agent response back via SSE (same as text input)
- [ ] Add mic button to widget chat UI
- [ ] Wire widget mic recording via Electron IPC (record → send blob → stream response)
- [ ] Add visual feedback: recording indicator, optional transcription preview
- [ ] Test voice chat end-to-end on web and widget

### 12.2 AI Time Estimation

- [ ] Update `extractTasksFromPhoto` GPT prompt to estimate `durationMinutes` per task
- [ ] Update `extractTasksFromText` GPT prompt to estimate `durationMinutes` per task
- [ ] Update agent `createTask` tool to estimate duration when user doesn't specify
- [ ] Update `ExtractedTasksReview` UI to show editable duration field per task
- [ ] Agent confirms estimated duration in chat when creating tasks ("~90 min, sound right?")
- [ ] Ensure manual web task entry is unaffected (users already set duration)
- [ ] Test estimation quality across task types (quick email vs. deep work vs. meetings)

### 12.3 Widget Upgrades

**Task Completion Flow:**
- [ ] After marking task done, show "Start [next task] now?" prompt with Yes/No
- [ ] If yes, move next task start time to now via reschedule API
- [ ] Dismiss prompt if user taps No or outside

**Running Late — Quick Time Add:**
- [ ] Replace single "Need more time" button with expandable options: +15, +30, +60 min
- [ ] Extend current task end time by selected amount
- [ ] Trigger reschedule of subsequent tasks after extension
- [ ] Dismiss options on tap-away or after selection

**Scrollable Daily Schedule:**
- [ ] Build scrollable timeline view in widget full/expanded mode
- [ ] Show scheduled tasks, calendar events, and free time slots
- [ ] Add current time indicator (red line)
- [ ] Tappable tasks for detail view

**Chat Overlay:**
- [ ] Move chat input to bottom of expanded widget
- [ ] Chat opens as overlay on top of schedule when user taps input or chip
- [ ] Chat dismissible to return to schedule view
- [ ] Preserve streaming, tool indicators, and suggestion chips

---

## Acceptance Criteria

- [ ] All 12.1–12.3 tasks complete
- [ ] Voice chat works in web and widget
- [ ] AI time estimation active for audio, photo, and chat task creation
- [ ] Widget task completion → next task flow working
- [ ] Widget quick time-add options working
- [ ] Widget expanded mode shows scrollable schedule
- [ ] Widget chat opens as overlay
- [ ] `npm run test:all` passes
- [ ] `aiDocs/changelog.md` updated
- [ ] Roadmap tasks checked off

---

## Next Phase

TBD — goals, personalization loop, and refinements deferred to future phases based on continued user feedback.
