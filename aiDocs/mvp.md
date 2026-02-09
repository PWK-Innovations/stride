# MVP Definition: AI-Powered Daily Planner

## Context

- **Timeline**: 7 weeks (1.75 months)
- **Team**: 3 members
- **Note**: AI-assisted development (e.g. Cursor) may speed implementation; calendar OAuth and scheduling edge cases still often take 1.5–2x longer than planned. Scope below is kept minimal to hit 7 weeks.
- **PRD Reference**: [aiDocs/prd.md](../../aiDocs/prd.md)

---

## 1. The ONE Core Problem to Solve

**Problem**: People spend ~10% of work hours manually organizing their time. They struggle with fragmented to-dos and can't estimate durations, leaving them feeling overwhelmed and unable to focus.

**Core solution**: Automate daily schedule construction by reading the user's calendar and placing tasks into available time slots—moving from a passive "container" to an active scheduler that builds a realistic plan.

**Why this matters**: The value is in automation. If users still plan manually, we've failed. The MVP must prove that automated scheduling reduces planning time and creates realistic, actionable schedules.

---

## 2. Minimum Feature Set (MVP)

### Must-have (P0 for MVP)

1. **Task management (minimal)**
   - **Add/list/delete** tasks: **title + duration only**. No edit (delete + re-add for beta).
   - Optional: binary "Do today" vs "Backlog" (no high/medium/low).
   - **Mark done** (required for validation).
2. **Calendar integration (single provider, read-only)**
   - Connect Google Calendar via OAuth.
   - Fetch events for **today only** (no "tomorrow").
   - Display busy blocks on timeline.
   - **Fetch on each "Plan my day" / refresh** — no caching (avoids invalidation; ~2s fetch acceptable for beta).
3. **Scheduling engine (v1)**
   - Input: tasks (title + duration) + today's calendar busy windows + **default working hours** (e.g. 9–5; optional single setting if time permits).
   - Output: planned blocks in free slots; **order**: by "Do today" then list order (no deadline logic).
   - **Overflow**: do not schedule tasks that don't fit; show a simple **"Couldn't schedule today: [Task A, Task B]"** list (no rich overflow UX).
4. **Today view**
   - Timeline: calendar events + scheduled task blocks; clear visual distinction.
   - **Use a timeline library** (e.g. `react-calendar-timeline`); budget 1–2 days integrate + 2–3 days polish.
   - Single action: **"Plan my day"** (generates/refreshes schedule).
   - **PWA**: App installable to desktop/home screen (manifest + service worker); own window and icon. Budget ~1 day (e.g. in Week 4 or 5).
   - **Browser notifications**: At (or near) scheduled block start, show a browser notification for the task (e.g. "Time to: [Task title]"; optional body with duration). Request `Notification.requestPermission()` in-app; client uses today's scheduled_blocks to decide when to show. No push server.
5. **Persistence**
   - Tasks and scheduled blocks in DB; schedule regenerated on each "Plan my day".

### Cut for MVP (defer to post-MVP)

- **Deadlines** (add post-MVP).
- **Tomorrow view / fetch**.
- **Three-level priority** (use binary or order only).
- **Task edit** (delete + re-add only).
- **Calendar event caching**.
- **Fancy overflow handling**.
- **Dynamic re-scheduling**: Manual refresh is acceptable for MVP
- **Feedback loops/learning**: No duration learning; use user-provided estimates
- **Goals (P1)**: Not needed to validate core automation value
- **Break preservation (P1)**: Users can manually add "break" tasks if needed
- **Task prompts (P1)**: Can validate without "what to do now" prompts
- **Priority adjustment (P2)**: Basic priority is sufficient
- **Multi-calendar providers**: Google Calendar only
- **Real-time sync**: Polling/manual refresh is fine
- **Locked blocks**: Not needed for MVP
- **All-day events**: Can handle but not prioritize edge cases
- **Recurring events**: Basic expansion only

---

## 3. What Feels Important But Isn't (for MVP)

### Deadlines (feels important, but isn't for MVP)

- **Why it feels important**: "Realistic" plans often imply due dates.
- **Why it's not MVP**: Deadlines add edge cases (e.g. deadline in 2h, task 3h). Use order/priority only; add deadlines post-MVP.

### Tomorrow / multi-day (feels important, but isn't for MVP)

- **Why it feels important**: Users think about the week.
- **Why it's not MVP**: One day (today) is enough to validate automation; simplifies logic and calendar handling.

### Calendar caching (feels important, but isn't for MVP)

- **Why it feels important**: Faster UX, fewer API calls.
- **Why it's not MVP**: Fetch-on-refresh is simpler and avoids staleness/invalidation; beta can tolerate a short fetch.

### Dynamic re-scheduling (feels critical, but isn't for MVP)

- **Why it feels important**: PRD calls it P0; users want "automatic adjustment"
- **Why it's not MVP**: Manual refresh proves the core value (automated scheduling). Real-time re-scheduling adds significant complexity (change detection, debouncing, conflict resolution) and can be validated later.
- **MVP alternative**: "Refresh Schedule" button that re-runs the engine

### Duration learning/feedback loops (feels important, but isn't for MVP)

- **Why it feels important**: PRD mentions "challenging to estimate durations" and "feedback loops"
- **Why it's not MVP**: Users can provide estimates manually. Learning requires data collection over time and adds ML/complexity. MVP can validate if automated scheduling works with manual estimates.
- **MVP alternative**: User-provided duration estimates; no learning

### Goals (feels important, but isn't for MVP)

- **Why it feels important**: PRD mentions "goal-oriented individuals" and goal incorporation
- **Why it's not MVP**: Core value is automation, not goal tracking. Goals add data model complexity and scheduling logic changes. Can validate automation without goals.
- **MVP alternative**: Users can add goal-related tasks manually

### Break preservation (feels important, but isn't for MVP)

- **Why it feels important**: PRD says "schedule preserves time for breaks" and "realistic and achievable"
- **Why it's not MVP**: Users can add break tasks manually. Automatic break insertion adds scheduling complexity. MVP can validate if the schedule is realistic without auto-breaks.
- **MVP alternative**: Users manually add "Break" tasks

### Task prompts / "What to do now" (feels important, but isn't for MVP)

- **Why it feels important**: PRD mentions "reduce decision fatigue" and "guidance on what to work on next"
- **Why it's not MVP**: The schedule itself provides guidance. Prompts add UI complexity and can be validated post-MVP.
- **MVP alternative**: Users look at the timeline to see what's next

---

## 4. Simplest Technical Approach

### Stack (recommended)

- **Frontend**: React/Next.js (or Vue/SvelteKit)
  - Timeline via library (e.g. `react-calendar-timeline`); 1–2 days integrate + 2–3 days polish
  - Task list/form components
- **Backend**: Node.js/Express (or Python/FastAPI, Go, etc.)
  - REST API for tasks and schedule
  - OAuth flow for Google Calendar
- **Database**: PostgreSQL (or SQLite for ultra-simple MVP)
  - Tables: `users`, `tasks`, `scheduled_blocks`; fetch calendar on demand (no cache table)
- **Calendar**: Google Calendar API (single provider)
  - OAuth 2.0
  - Read-only scope: `https://www.googleapis.com/auth/calendar.readonly`
  - Fetch events for **today** on each "Plan my day"
- **Scheduling algorithm**: Simple greedy placement
  - Sort by "Do today" then list order (no deadline-first)
  - For each task, find earliest free slot that fits
  - If no slot fits, add to simple overflow list (task titles only)

### Architecture (simplified)

```
User → Frontend → Backend API → Database
                ↓
         Google Calendar API (OAuth)
                ↓
         Scheduling Engine (simple greedy)
                ↓
         Store scheduled blocks → Return to Frontend
```

### Deployment (MVP)

- **Frontend**: Vercel/Netlify (or similar)
- **Backend**: Railway/Render/Fly.io (or similar)
- **Database**: Managed PostgreSQL (or SQLite file for ultra-simple)

### Simplifications

- **No deadlines**
- **No calendar caching** (fetch on refresh)
- **No task edit** (delete + re-add)
- **Today only** (no tomorrow / multi-day)
- **No real-time**: Manual refresh only
- **No webhooks**: Poll calendar on refresh
- **No complex scheduling**: Greedy algorithm, no optimization
- **No learning**: User-provided durations only
- **Single user**: No multi-user features (auth for calendar only)

---

## 5. How to Validate with Users

### Success metrics (from PRD, adapted for MVP)

1. **Automation adoption**
   - Measure: Time spent planning (self-reported or via usage logs)
   - Target: Users spend <5% of work hours planning (down from 10%)
   - Validation: Survey before/after, or track "refresh schedule" usage frequency
2. **Retention**
   - Measure: Daily active users (DAU) or "users who refresh schedule daily"
   - Target: 60%+ of users return daily for first week
   - Validation: Analytics on schedule refresh events
3. **Reliability**
   - Measure: Schedule accuracy (tasks fit, no overlaps, realistic)
   - Target: 80%+ of scheduled tasks fit without conflicts
   - Validation: Manual review of schedules, user feedback

### Validation approach

- **Week 1–4**: Build (see revised timeline below); internal smoke test as each slice lands.
- **Week 5–6**: Internal dogfooding (team uses daily) + critical fixes (no external beta yet).
- **Week 7**: Beta with **5–10 users** + rapid iteration. Post-MVP or if time: broader open beta (20–30 users).

### Key validation questions

1. **Does automated scheduling reduce planning time?**
   - Ask users: "How long did you spend planning today?" (before/after)
   - Track: time from task creation to schedule generation
2. **Is the schedule realistic and helpful?**
   - Ask: "Did you follow the schedule?" "Was it realistic?"
   - Track: completion rate of scheduled tasks
3. **Would users use this daily?**
   - Track: daily active usage
   - Ask: "Would you use this instead of [current tool]?"
4. **What breaks?**
   - Track: errors, edge cases (all-day events, time zones, overloaded days)
   - Ask: "What didn't work?"

### MVP validation checklist

- [ ] Users can connect Google Calendar in <2 minutes
- [ ] Users can add tasks (no edit) and generate a schedule in <5 minutes
- [ ] Schedule shows tasks in free time slots (no overlaps with calendar)
- [ ] Schedule is realistic (tasks fit, reasonable ordering)
- [ ] Users refresh schedule at least once per day (retention)
- [ ] Users report reduced planning time (qualitative)

---

## MVP Scope Summary

### In scope

- Tasks: **add, list, delete, mark done**; **title + duration**; optional binary "Do today" vs "Backlog".
- Google Calendar OAuth; **today only**; **fetch on refresh** (no cache).
- Scheduling engine: greedy, **today only**; simple "Couldn't schedule today" list.
- Today view (timeline, library-based); **"Plan my day"** button.
- PWA (installable, own window/icon). Browser notifications for task reminders (client-only, no push server).

### Out of scope (for MVP)

- Deadlines, tomorrow view, task edit, calendar caching, three-level priority, fancy overflow UX.
- Dynamic re-scheduling (manual refresh only)
- Duration learning/feedback loops
- Goals
- Break preservation
- Task prompts
- Multi-calendar providers
- Real-time sync/webhooks
- Locked blocks
- Complex scheduling optimization

### Timeline estimate (7 weeks, 3 people)

- **Week 1**: Data model + task CRUD (add, list, delete, mark done).
- **Week 2**: Google Calendar OAuth + fetch/display **today's** events (plan for 1.5–2 weeks if OAuth/API quirks appear).
- **Week 3**: Scheduling engine v1 (place tasks in free slots, today only; overflow = simple list).
- **Week 4**: Timeline UI (library-based) + wire "Plan my day" to engine. PWA installability (~1 day) and notification wiring can be done alongside timeline polish.
- **Week 5**: Integration bugs + edge case fixes (calendar + scheduling).
- **Week 6**: Internal dogfooding + critical fixes (no external beta yet).
- **Week 7**: Beta with 5–10 users + rapid iteration.

**Risks and buffers**: Calendar OAuth and scheduling edge cases often take longer than estimated; scope assumes some AI-assisted velocity but keep buffer for sickness or blockers.

---

## Next Steps (Post-MVP)

If MVP validates core value, prioritize:

1. Deadlines, tomorrow view, task edit, calendar caching (optional), richer overflow UX
2. Dynamic re-scheduling (automatic refresh on calendar changes)
3. Duration learning (feedback loops)
4. Break preservation
5. Task prompts ("what to do now")
6. Goals
7. Multi-calendar providers
