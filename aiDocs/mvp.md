# MVP Definition: AI-Powered Daily Planner

## Context

- **PRD Reference:** `prd.md` (same folder)
- **Core idea:** A working Next.js app you can install on your phone. You add your tasks (text, photos, etc.), and the app builds your daily calendar for you.

---

## 1. The ONE Core Thing

**What we're building:** A Next.js app that is downloadable on phones (PWA). Users input what they need to do—tasks, photos, text, etc.—and the app builds out their daily calendar.

**Why it matters:** One place to dump your day; the app figures out when things go. No manual slotting.

---

## 2. Must-Have (MVP Core)

### Working Next.js app + installable on phones

- **Next.js** app: routing, layout, and UI that work on web and mobile.
- **PWA:** Installable on phones (and desktop). Add to home screen, own icon and window. Web app manifest + minimal service worker.

### Task input

- Users can add **tasks** in whatever form we support for MVP:
  - **Text:** title, optional notes, duration (or default).
  - **Photos:** attach images to tasks (e.g. photo of a whiteboard, receipt, handout). Stored and shown with the task; used when building the day (e.g. “tasks with photos” or “today’s items”).
- **Add, list, delete** tasks. Optional: mark done (needed for dynamic updates later).
- No need for full task edit in MVP (delete + re-add is fine).

### Build the daily calendar

- **Single main action:** e.g. “Build my day” or “Plan my day.”
- App takes **today’s tasks** (and any calendar data we use) and **builds the daily schedule**—places tasks into time slots and shows a clear daily calendar/timeline.
- **Calendar integration (MVP):** Connect one calendar (e.g. Google) so we know busy vs free. Fetch today’s events when building the day. Display busy blocks and scheduled tasks on one timeline.
- **Output:** A daily view with tasks placed in time (and overflow or “couldn’t fit” if needed).

### Persistence

- Tasks and the generated schedule are saved (DB or simple backend). Refreshing “Build my day” regenerates from current tasks and calendar.

---

## 3. Secondary Features (After Core Works)

These are important but not required for “we have a working app that builds my day.”

### Goals

- Let users **add goals** (e.g. professional, academic, social).
- When building the day, take goals into account so the daily calendar helps move toward them (e.g. slot goal-related tasks, or show goal progress).

### Dynamic calendar from user input

- When the **user says they finished a task** (or marks it done), the **calendar updates**:
  - Remove or complete that block.
  - Re-place remaining tasks into new slots so the rest of the day stays accurate.
- Optional: user says “I’m running late” or “skip this” and we re-run placement for the rest of the day.

Goal: the plan in the app stays in sync with what the user actually did, without them manually moving everything.

---

## 4. Technical Approach

### Stack

- **Frontend:** Next.js (React, TypeScript), responsive so it works on phones. Use a timeline/calendar component for the daily view.
- **PWA:** Manifest + service worker so “Add to Home Screen” works on iOS/Android and the app feels like a native app.
- **Tasks:** Support text (title, notes, duration) and photo attachments (upload + store URL or blob); show them in the task list and in the built schedule.
- **Backend/API:** Next.js API routes (or small backend) for tasks, schedule, and calendar OAuth.
- **Database:** Store users (for auth/calendar), tasks (with optional photo refs), and scheduled blocks. No need to cache calendar events for MVP (fetch when building the day is fine).
- **Calendar:** One provider (e.g. Google Calendar) via OAuth; read-only; fetch today’s events when building the day.
- **Scheduling:** Simple engine: inputs = tasks (+ optional photos as context) + today’s busy windows (+ working hours). Output = scheduled blocks for today + overflow list. Greedy placement is enough for MVP.

### Architecture (simplified)

```
User (phone or browser) → Next.js app (PWA)
         → API: tasks, schedule, calendar OAuth
         → DB: users, tasks, scheduled_blocks
         → Google Calendar (today’s events)
         → Scheduling engine → daily calendar
```

### Deployment

- Host the Next.js app so it’s HTTPS (required for PWA). e.g. Vercel, Netlify. Ensure manifest and service worker are served correctly so “Add to Home Screen” works on phones.

---

## 5. What We’re Not Doing in MVP

- Multiple calendar providers (one is enough).
- Full task edit (delete + re-add).
- Tomorrow or multi-day view (today only).
- Calendar event caching (fetch when building the day).
- Complex scheduling (no optimization, no learning).
- Goals and dynamic “task finished” updates are **secondary**—we add them once the core flow works.

---

## 6. Validation

### Success = we can use it every day

- **Working app:** Next.js app loads on web and installs on phone; no crashes.
- **Task input:** We can add tasks (text and photos) and see them in a list.
- **Build my day:** One action builds a daily calendar; we see tasks in time slots and calendar busy blocks.
- **Usable on phone:** Layout and “Build my day” work on a phone; we’d actually use it.

### Checklist

- [ ] Next.js app runs and is responsive on mobile.
- [ ] PWA installable on at least one phone (e.g. iPhone or Android).
- [ ] Users can add tasks (text; photos if in scope for first release).
- [ ] “Build my day” (or equivalent) generates a daily schedule from tasks (+ calendar).
- [ ] Daily view shows the built schedule clearly.
- [ ] (Secondary) User can mark a task done and see the calendar update.

---

## 7. Summary

| Layer | MVP | Secondary |
|-------|-----|-----------|
| **App** | Working Next.js app, installable on phones (PWA) | — |
| **Input** | Tasks (text, photos, etc.); add / list / delete | — |
| **Output** | App builds daily calendar from tasks + calendar | — |
| **Extra** | — | Goals; dynamic calendar when user says “finished” (or marks done) |

**In one line:** We have a Next.js app you can download on your phone where you input tasks (and photos/text), and it builds your daily calendar; secondary features are goals and the calendar updating when you finish a task.
