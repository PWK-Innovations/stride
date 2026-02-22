# Phase 2: Core Data Flow - Roadmap

**Date:** 2026-02-09
**Phase:** 2 - Core Data Flow
**Status:** Mostly complete
**Plan:** `2026-02-09-phase-2-core-data-flow-plan.md`
**Previous Phase:** `2026-02-09-phase-1-frontend-layout-roadmap.md`

---

## Tasks

### 2.1 Task Management (CRUD)

- [x] Define Task TypeScript interface (`types/database.ts`)
- [x] Create API route: `POST /api/tasks` (create task)
- [x] Create API route: `GET /api/tasks` (list tasks)
- [x] Create API route: `DELETE /api/tasks/[id]` (delete task)
- [ ] Test API routes with curl or Postman
- [x] Create task form component (title, duration, notes inputs)
- [x] Create task list component (display tasks, delete button)
- [x] Wire up form submit to `POST /api/tasks`
- [x] Wire up delete button to `DELETE /api/tasks/[id]`
- [x] Wire up page load to `GET /api/tasks`
- [x] Style with oatmeal-olive-instrument (olive colors, Instrument Serif)
- [ ] Test: add task, see it in list, delete it

### 2.2 Calendar Integration

- [x] Update `app/api/auth/google/route.ts` (redirect with `calendar.readonly` scope)
- [x] Update `app/api/auth/google/callback/route.ts` (store tokens in `profiles`)
- [x] Create helper: `lib/google/refreshAccessToken.ts` (refresh expired tokens)
- [x] Create helper: `lib/google/fetchTodaysEvents.ts` (fetch today's events)
- [ ] Test: fetch events from Google Calendar, log to console
- [x] Create helper: `lib/google/parseBusyWindows.ts` (extract start/end times)
- [ ] Test: parse events into busy windows, verify no all-day events included
- [ ] Add "Connect Google Calendar" button to UI
- [ ] Test: complete OAuth flow, verify tokens stored, fetch events works

### 2.3 AI Scheduling Engine (v1)

- [x] Define JSON schema for schedule response (scheduled_blocks, overflow)
- [x] Create helper: `lib/openai/buildSchedulePrompt.ts` (tasks + busy windows → prompt)
- [x] Create helper: `lib/openai/callSchedulingEngine.ts` (call OpenAI with Structured Outputs)
- [ ] Test: call OpenAI with sample tasks and busy windows, verify JSON response
- [ ] Create helper: `lib/openai/parseScheduleResponse.ts` (parse and validate JSON)
- [ ] Test: parse AI response, verify scheduled_blocks and overflow
- [x] Handle edge cases: no tasks, no free time, all tasks overflow
- [x] Create API helper: save scheduled_blocks to Supabase (delete old, insert new)

### 2.4 "Build My Day" Flow

- [x] Create API route: `POST /api/schedule/build`
- [x] Implement: authenticate user, fetch tasks, fetch calendar, call AI, save schedule
- [ ] Test: call API route, verify schedule saved to Supabase
- [x] Add "Build my day" button to dashboard page
- [x] Add loading state (spinner or "Building your day...")
- [x] On success: fetch and display scheduled blocks
- [x] Display overflow list if any ("Couldn't schedule: Task X, Task Y")
- [x] Add error handling (show error message if API fails)
- [ ] Test full flow: add tasks → connect calendar → build day → see schedule

### 2.5 Timeline View

- [x] Evaluate timeline libraries (react-calendar-timeline, react-big-calendar)
- [x] Choose library (recommendation: react-calendar-timeline)
- [x] Install library
- [x] Create `components/features/DailyTimeline.tsx`
- [x] Configure timeline (today, 30-min intervals)
- [x] Test with dummy data
- [x] Fetch calendar events and scheduled blocks on page load
- [x] Map events and blocks to timeline items
- [x] Render calendar events (olive-600 or similar)
- [x] Render scheduled tasks (olive-400 or similar)
- [x] Add visual distinction (color, border, label)
- [x] Show overflow list below timeline ("Couldn't schedule: Task A, Task B")
- [x] Style overflow as alert or info box

---

## Deliverable

User can add tasks, click "Build my day", and see a schedule on a visual timeline with tasks placed in free time slots.

---

## Acceptance Criteria

- [x] All implementation tasks complete (2.1–2.5)
- [x] User can add/delete tasks
- [ ] User can connect Google Calendar (requires credentials to test)
- [x] "Build my day" generates schedule (tasks in free slots)
- [x] Timeline shows calendar events and scheduled tasks with visual distinction
- [x] Schedule and overflow are displayed
- [x] Errors are handled gracefully

---

## Next Phase

**Phase 3:** Photo-to-Task (`2026-02-09-phase-3-photo-to-task-roadmap.md`)
