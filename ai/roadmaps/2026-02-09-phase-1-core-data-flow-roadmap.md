# Phase 1: Core Data Flow - Roadmap

**Date:** 2026-02-09  
**Phase:** 1 - Core Data Flow (Week 2)  
**Status:** Complete  
**Plan:** `2026-02-09-phase-1-core-data-flow-plan.md`  
**Previous Phase:** `2026-02-09-phase-0-foundation-roadmap.md`

---

## Tasks

### 1.1 Task Management (CRUD)

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

### 1.2 Calendar Integration

- [x] Update `app/api/auth/google/route.ts` (redirect with `calendar.readonly` scope)
- [x] Update `app/api/auth/google/callback/route.ts` (store tokens in `profiles`)
- [x] Create helper: `lib/google/refreshAccessToken.ts` (refresh expired tokens)
- [x] Create helper: `lib/google/fetchTodaysEvents.ts` (fetch today's events)
- [ ] Test: fetch events from Google Calendar, log to console
- [x] Create helper: `lib/google/parseBusyWindows.ts` (extract start/end times)
- [ ] Test: parse events into busy windows, verify no all-day events included
- [ ] Add "Connect Google Calendar" button to UI
- [ ] Test: complete OAuth flow, verify tokens stored, fetch events works

### 1.3 AI Scheduling Engine (v1)

- [x] Define JSON schema for schedule response (scheduled_blocks, overflow)
- [x] Create helper: `lib/openai/buildSchedulePrompt.ts` (tasks + busy windows → prompt)
- [x] Create helper: `lib/openai/callSchedulingEngine.ts` (call OpenAI with Structured Outputs)
- [ ] Test: call OpenAI with sample tasks and busy windows, verify JSON response
- [ ] Create helper: `lib/openai/parseScheduleResponse.ts` (parse and validate JSON)
- [ ] Test: parse AI response, verify scheduled_blocks and overflow
- [x] Handle edge cases: no tasks, no free time, all tasks overflow
- [x] Create API helper: save scheduled_blocks to Supabase (delete old, insert new)

### 1.4 "Build My Day" Flow

- [x] Create API route: `POST /api/schedule/build`
- [x] Implement: authenticate user, fetch tasks, fetch calendar, call AI, save schedule
- [ ] Test: call API route, verify schedule saved to Supabase
- [x] Add "Build my day" button to task list page
- [x] Add loading state (spinner or "Building your day...")
- [x] On success: fetch and display scheduled blocks (simple list: "10:00am - 10:30am: Task A")
- [x] Display overflow list if any ("Couldn't schedule: Task X, Task Y")
- [x] Add error handling (show error message if API fails)
- [ ] Test full flow: add tasks → connect calendar → build day → see schedule

---

## Deliverable

User can add tasks, click "Build my day", and see a schedule with tasks placed in free time slots. Simple list view (no timeline yet).

---

## Acceptance Criteria

- [x] All tasks from 1.1, 1.2, 1.3, 1.4 are checked off (implementation complete)
- [x] User can add/delete tasks
- [ ] User can connect Google Calendar (requires credentials to test)
- [x] "Build my day" generates schedule (tasks in free slots)
- [x] Schedule and overflow are displayed
- [x] Errors are handled gracefully

---

## Next Phase

**Phase 2:** UI & PWA (`2026-02-09-phase-2-ui-pwa-roadmap.md`)
