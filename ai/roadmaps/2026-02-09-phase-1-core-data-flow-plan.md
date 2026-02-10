# Phase 1: Core Data Flow - Implementation Plan

**Date:** 2026-02-09  
**Phase:** 1 - Core Data Flow (Week 2)  
**Status:** Not started  
**Parent Plan:** `2026-02-09-stride-implementation-plan.md`  
**Roadmap:** `2026-02-09-phase-1-core-data-flow-roadmap.md`  
**Previous Phase:** `2026-02-09-phase-0-foundation-plan.md`

---

## Clean Code Principles

Avoid over-engineering. Build the simplest version that works. No abstractions until needed.

---

## Goal

Build the "happy path" from task input to AI-generated schedule display. By the end of this phase, a user can add tasks (text only), click "Build my day", and see a schedule with tasks placed in free time slots.

---

## Prerequisites

- Phase 0 complete (Next.js app, Supabase tables, integrations verified)

---

## 1.1 Task Management (CRUD)

### Task Data Model

Define TypeScript interface for Task:
- `id`: string (uuid)
- `user_id`: string (uuid)
- `title`: string
- `notes`: string (optional)
- `duration_minutes`: number (default 30)
- `created_at`: Date
- `updated_at`: Date

### API Routes

Create three API routes:
- `POST /api/tasks` — Create task
- `GET /api/tasks` — List user's tasks
- `DELETE /api/tasks/[id]` — Delete task

Each route:
- Authenticates user (Supabase Auth)
- Uses RLS to ensure user can only access their own tasks
- Returns JSON

### Task List UI

Create basic task list component:
- Form: title input, duration input (number), notes textarea, submit button
- List: show all tasks with title, duration, delete button
- No photos yet (Phase 3)
- Use oatmeal-olive-instrument styling (olive colors, Instrument Serif for headings)

### Persist to Supabase

- On form submit: call `POST /api/tasks`
- On delete: call `DELETE /api/tasks/[id]`
- On page load: call `GET /api/tasks` and display

---

## 1.2 Calendar Integration

### Google Calendar OAuth Flow (Full Implementation)

Update API routes from Phase 0:
- `GET /api/auth/google` — Redirect to Google consent screen with `calendar.readonly` scope
- `GET /api/auth/google/callback` — Exchange code for tokens, store in `profiles` table

Handle token refresh:
- Check if `google_token_expires_at` is in the past
- If expired, use `google_refresh_token` to get new access token
- Update `profiles` table with new token and expiry

### Fetch Today's Events

Create helper function: `lib/google/fetchTodaysEvents.ts`
- Input: user's access token
- Fetch events from Google Calendar API for today (timeMin = start of day, timeMax = end of day)
- Use `singleEvents=true` to expand recurring events
- Return array of events with `start`, `end`, `summary`

### Parse Events into Busy Windows

Create helper function: `lib/google/parseBusyWindows.ts`
- Input: array of calendar events
- Filter out all-day events (they use `date` instead of `dateTime`)
- Extract start/end times
- Return array of busy windows: `{ start: Date, end: Date }`

---

## 1.3 AI Scheduling Engine (v1)

### Build Prompt for OpenAI

Create helper function: `lib/openai/buildSchedulePrompt.ts`
- Input: tasks (array), busy windows (array), working hours (default 9am-5pm)
- Build prompt string:
  - "You are a scheduling assistant. Place these tasks into today's free time slots."
  - "Tasks: [list with title, duration]"
  - "Busy windows: [list with start, end]"
  - "Working hours: 9am-5pm"
  - "Return JSON with scheduled_blocks (task_id, start_time, end_time) and overflow (task_ids that don't fit)."

### Use Structured Outputs

Define JSON schema for schedule response:
- `scheduled_blocks`: array of `{ task_id, start_time, end_time, duration_minutes }`
- `overflow`: array of task_ids (strings)

Call OpenAI Responses API with:
- `model: "gpt-5.2"`
- `instructions`: "You are a scheduling assistant. Return valid JSON only."
- `input`: prompt from above
- `response_format`: JSON schema

### Parse AI Response

Create helper function: `lib/openai/parseScheduleResponse.ts`
- Input: OpenAI response
- Parse `output_text` as JSON
- Validate structure (scheduled_blocks, overflow)
- Return typed object

### Handle Overflow

If tasks don't fit:
- Return overflow list (task IDs or titles)
- Display to user: "Couldn't schedule today: Task A, Task B"

### Persist Scheduled Blocks to Supabase

- Delete existing scheduled_blocks for user (today only)
- Insert new scheduled_blocks from AI response
- Each block references `task_id` and has `start_time`, `end_time`, `source: 'ai'`

---

## 1.4 "Build My Day" Flow

### API Route: Build Schedule

Create: `POST /api/schedule/build`
- Authenticate user
- Fetch user's tasks from Supabase
- Fetch today's events from Google Calendar (using user's tokens)
- Parse busy windows
- Call OpenAI scheduling engine
- Save scheduled_blocks to Supabase
- Return: scheduled blocks + overflow

### Wire Up UI

Add to task list page:
- "Build my day" button
- On click: call `POST /api/schedule/build`
- Show loading state while building
- On success: show simple list of scheduled blocks (e.g., "10:00am - 10:30am: Task A")
- Show overflow list if any

---

## Deliverable

User can:
1. Add tasks (title, duration, notes)
2. Click "Build my day"
3. See a schedule with tasks placed in free time slots (simple list view; no timeline yet)

No photos, no goals, no dynamic updates yet. Just the core flow.

---

## Acceptance Criteria

- [ ] User can add tasks via form
- [ ] Tasks are saved to Supabase and displayed in list
- [ ] User can delete tasks
- [ ] User can connect Google Calendar (OAuth flow)
- [ ] "Build my day" button calls API and returns schedule
- [ ] Schedule shows tasks placed in free time slots (avoid busy windows)
- [ ] Overflow list shows tasks that didn't fit
- [ ] All API calls handle errors gracefully (show error messages)

---

## Next Phase

**Phase 2:** UI & PWA (`2026-02-09-phase-2-ui-pwa-plan.md`)
