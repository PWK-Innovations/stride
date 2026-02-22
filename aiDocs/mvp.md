# MVP Definition: AI-Powered Daily Planner

## Context

- **PRD Reference:** `prd.md` (same folder)
- **Core idea:** A working Next.js web app (also a PWA) where you add tasks (text, photos, etc.) and the app builds your daily calendar for you.

---

## MVP Goal

Build a working web app (also a PWA) that proves the concept: **add tasks (text or photos) → AI builds your daily schedule → view and use the result.**

This is NOT a production-ready product. This is a demo to validate:

1. The AI scheduling pipeline produces realistic daily plans
2. Task input (text + photos) flows smoothly into schedule construction
3. Users can successfully complete the core flow on web and mobile
4. The calendar integration provides useful context for AI placement

---

## MVP Scope: What's In

- Next.js web app, installable as a PWA (phone + desktop)
- Task input: text (title, notes, duration) and photo attachments
- Add, list, delete tasks
- Google Calendar integration (read-only, one provider)
- "Plan my day" — AI builds a daily schedule from tasks + calendar
- Daily timeline view with scheduled tasks and calendar events
- Supabase backend: auth, database, photo storage
- OpenAI API for schedule construction

### Must-Have (MVP Core)

**Working Next.js app + installable on phones**

- **Next.js** app: routing, layout, and UI that work on web and mobile.
- **PWA:** Installable on phones (and desktop). Add to home screen, own icon and window. Web app manifest + minimal service worker.

**Task input**

- Users can add **tasks** in whatever form we support for MVP:
  - **Text:** title, optional notes, duration (or default).
  - **Photos:** attach images to tasks (e.g. photo of a whiteboard, receipt, handout). Stored and shown with the task; used when building the day (e.g. "tasks with photos" or "today's items").
- **Add, list, delete** tasks. Optional: mark done (needed for dynamic updates later).
- No need for full task edit in MVP (delete + re-add is fine).

**Build the daily calendar**

- **Single main action:** e.g. "Build my day" or "Plan my day."
- App takes **today's tasks** (and any calendar data we use) and **builds the daily schedule**—places tasks into time slots and shows a clear daily calendar/timeline.
- **Calendar integration (MVP):** Connect one calendar (e.g. Google) so we know busy vs free. Fetch today's events when building the day. Display busy blocks and scheduled tasks on one timeline.
- **Output:** A daily view with tasks placed in time (and overflow or "couldn't fit" if needed).

**Persistence**

- Tasks and the generated schedule are saved in **Supabase**. Refreshing "Build my day" regenerates from current tasks and calendar.

### Secondary Features (After Core Works)

These are important but not required for "we have a working app that builds my day."

**Goals**

- Let users **add goals** (e.g. professional, academic, social).
- When building the day, take goals into account so the daily calendar helps move toward them (e.g. slot goal-related tasks, or show goal progress).

**Dynamic calendar from user input (Desktop Popup)**

- A **popup/overlay on the user's computer** lets them interact with the AI without opening the full app.
- Mark a task done, say "I'm running late," "skip this," or add something new — the **AI reschedules the rest of the day** automatically.
- Goal: the plan stays in sync with what the user actually did, without context-switching into the full app.

**Task Backlog**

- Users can maintain a **backlog** of tasks that aren't scheduled for today.
- When today's tasks are finished early, the AI can pull from the backlog to fill remaining time.
- Tasks not scheduled on a given day stay in the backlog for future days.

---

## MVP Scope: What's Out

- Multiple calendar providers (one is enough).
- Full task edit (delete + re-add).
- Tomorrow or multi-day view (today only).
- Calendar event caching (fetch when building the day).
- Complex scheduling (no optimization, no learning).
- Goals and dynamic "task finished" updates are **secondary**—we add them once the core flow works.

---

## User Flow

### Flow 1: Website / Phone (Full App)

1. **Open app** → land on login/signup page
2. **Log in** → authenticate via Supabase (email/password or OAuth)
3. **Dashboard** → after login, user lands on the dashboard — the central hub for adding tasks, viewing the schedule, and connecting calendar
4. **Add tasks** → tap "+" to add tasks via text or photo; tasks appear in the task list
5. **Connect calendar** → one-time Google Calendar OAuth from the dashboard; busy blocks pulled in automatically
6. **"Plan my day"** → tap the main action button; AI reads tasks + calendar and builds the schedule
7. **View schedule** → daily timeline shows tasks placed in time slots alongside calendar events; overflow list for anything that didn't fit
8. **Execute** → work through the day following the AI-built plan

### Flow 2: Desktop Popup (Quick Updates)

1. **Popup opens** → small overlay/widget accessible from desktop (browser extension, PWA window, or mini-view)
2. **Mark task done** → check off a completed task directly from the popup
3. **Report a change** → "I'm running late," "skip this," or "new task came up"
4. **AI reschedules** → the AI dynamically rebuilds the remaining schedule based on the update
5. **Updated view** → popup shows the adjusted timeline; user stays on task without opening the full app

This keeps users engaged throughout the day without context-switching into the full app every time something changes.

---

## Validation

### Success = we can use it every day

- **Working app:** Next.js app loads on web and installs on phone; no crashes.
- **Task input:** We can add tasks (text and photos) and see them in a list.
- **Build my day:** One action builds a daily calendar; we see tasks in time slots and calendar busy blocks.
- **Usable on phone:** Layout and "Build my day" work on a phone; we'd actually use it.

### Checklist

- [ ] Next.js app runs and is responsive on mobile.
- [ ] PWA installable on at least one phone (e.g. iPhone or Android).
- [ ] Users can add tasks (text; photos if in scope for first release).
- [ ] "Build my day" (or equivalent) generates a daily schedule from tasks (+ calendar).
- [ ] Daily view shows the built schedule clearly.
- [ ] (Secondary) User can mark a task done and see the calendar update.

---

## Summary

| Layer | MVP | Secondary |
|-------|-----|-----------|
| **App** | Working Next.js app, installable on phones (PWA) | — |
| **Input** | Tasks (text, photos, etc.); add / list / delete | — |
| **Output** | App builds daily calendar from tasks + calendar | — |
| **Updates** | — | Desktop popup for quick task updates; AI reschedules dynamically |
| **Extra** | — | Goals; dynamic calendar when user says "finished" (or marks done) |

**In one line:** We have a Next.js web app (also a PWA) where you input tasks (text/photos), and it builds your daily calendar; a desktop popup lets you update progress so the AI keeps your schedule accurate throughout the day.
