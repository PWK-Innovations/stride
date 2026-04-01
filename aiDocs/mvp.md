# MVP Definition: AI-Powered Daily Planner

## Context

- **PRD Reference:** `prd.md` (same folder)
- **Core idea:** A working Next.js web app (also a PWA) where you add tasks (text, photos, voice) and an agentic AI builds and maintains your daily calendar — not just once in the morning, but throughout the day as plans change.
- **Target users:** Knowledge workers with unstructured or variable schedules (freelancers, developers, remote professionals), busy college students, and individuals with ADHD or executive function challenges.

---

## MVP Goal

Build a working web app (also a PWA) that proves the concept: **add tasks (text, photos, or voice) → AI builds your daily schedule → interact with the agent to keep it on track → view and use the result.**

This is NOT a production-ready product. This is a demo to validate:

1. The AI scheduling pipeline produces realistic daily plans
2. Task input (text, photos, voice) flows smoothly into schedule construction
3. Users can successfully complete the core flow on web and mobile
4. The calendar integration (Google + Outlook) provides useful context for AI placement
5. The agentic AI system can reason through multi-step scheduling decisions and adapt the schedule conversationally throughout the day
6. The hybrid architecture (LLM for reasoning, deterministic solver for time placement) produces reliable, conflict-free schedules

---

## MVP Scope: What's In

- Next.js web app, installable as a PWA (phone + desktop)
- Task input: text (title, notes, duration), photo attachments, and voice memos
- Add, list, delete tasks
- Calendar integration: Google Calendar + Outlook Calendar (read-only)
- "Plan my day" — agentic AI builds a daily schedule from tasks + calendar using multi-step reasoning
- Chat modal for mid-day agent interaction (report progress, add tasks, request rescheduling)
- Daily timeline view with scheduled tasks and calendar events
- Supabase backend: auth, database, photo storage
- Hybrid AI architecture: LangChain agent (reasoning/intent) + deterministic constraint solver (time placement)
- Stability-first rescheduling: minimal adjustments over cascade reshuffles

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
- App takes **today's tasks** (and any calendar data we use) and **builds the daily schedule**—an agentic AI reasons through tasks, priorities, and constraints, then places tasks into time slots.
- **Calendar integration:** Connect Google Calendar and/or Outlook Calendar so we know busy vs free. Fetch today's events when building the day. Display busy blocks and scheduled tasks on one timeline.
- **Hybrid architecture:** The LangChain agent handles reasoning (priority, ordering, dependencies); a deterministic solver handles time placement (no LLM time-math hallucinations).
- **Output:** A daily view with tasks placed in time. When tasks can't all fit, the agent proactively suggests what to defer or drop rather than silently overloading.

**Chat modal for mid-day updates**

- **Persistent chat icon** opens a modal/sliding panel for conversational interaction with the scheduling agent.
- Users can report progress ("I finished the report early"), add tasks ("add groceries, 30 min"), report delays ("I'm running 20 minutes behind"), or ask for guidance ("what should I do next?").
- The agent processes updates and adjusts the schedule with stability-first rescheduling — minimal changes over cascade reshuffles.
- The "Build my day" button remains for the initial morning schedule; the chat modal is for throughout-the-day interaction.

**Persistence**

- Tasks and the generated schedule are saved in **Supabase**. Refreshing "Build my day" regenerates from current tasks and calendar.

### Secondary Features (After Core Works)

These are important but not required for "we have a working app that builds my day."

**Goals**

- Let users **add goals** (e.g. professional, academic, social).
- When building the day, take goals into account so the daily calendar helps move toward them (e.g. slot goal-related tasks, or show goal progress).

**Personalization Loop**

- The agent **learns user patterns over time** (e.g. user consistently underestimates deep work by 20%, is more productive in mornings, always skips afternoon tasks).
- Future schedules auto-adjust: duration padding, optimal slot placement, realistic capacity estimates.

**Task Backlog**

- Users can maintain a **backlog** of tasks that aren't scheduled for today.
- When today's tasks are finished early, the AI can pull from the backlog to fill remaining time.
- Tasks not scheduled on a given day stay in the backlog for future days.

**Future Integrations**

- Todoist task import (bring existing tasks into Stride).
- Slack notifications and slash commands (interact with Stride from Slack).
- Apple Calendar support.

---

## MVP Scope: What's Out

- Calendar providers beyond Google and Outlook (Apple Calendar is future).
- Full task edit (delete + re-add).
- Tomorrow or multi-day view (today only).
- Calendar event caching (fetch when building the day).
- Personalization loop (learning user patterns) — secondary, after core agent works.
- Task manager integrations (Todoist, Notion) and communication integrations (Slack) — future scope.
- Goals are **secondary** — we add them once the core agent flow works.

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

### Flow 2: Chat Modal (Mid-Day Updates)

1. **Open chat** → click persistent chat icon on dashboard to open agent modal/sliding panel
2. **Natural language interaction** → type "I finished the report early", "I'm running 20 minutes late", "add groceries after work, 30 min", or "what should I do next?"
3. **Agent processes** → the LangChain agent reasons through the update, checks calendar, identifies impact
4. **Stability-first rescheduling** → agent makes minimal adjustments (defer or cut low-priority tasks) rather than cascade-reshuffling the whole day
5. **Updated view** → timeline refreshes with changes; agent explains what it did and why

This keeps the schedule alive throughout the day via conversation rather than discrete button presses.

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
- [ ] "Build my day" (or equivalent) generates a daily schedule from tasks (+ calendar) via agentic AI.
- [ ] Daily view shows the built schedule clearly.
- [ ] Chat modal allows mid-day agent interaction (add task, report progress, request reschedule).
- [ ] Agent rescheduling uses stability-first approach (minimal changes, not cascade reshuffles).
- [ ] Outlook Calendar integration works alongside Google Calendar.

---

## Summary

| Layer | MVP | Secondary |
|-------|-----|-----------|
| **App** | Working Next.js app, installable on phones (PWA) | — |
| **Input** | Tasks (text, photos, voice); add / list / delete | — |
| **Output** | Agentic AI builds daily calendar from tasks + calendar (Google + Outlook) | — |
| **Agent Chat** | Chat modal for mid-day updates (progress, new tasks, rescheduling) | — |
| **Extra** | — | Goals; personalization loop; Todoist/Slack integrations |

**In one line:** We have a Next.js web app (also a PWA) where you input tasks (text/photos/voice), an agentic AI builds your daily calendar, and a chat modal lets you interact with the agent throughout the day to keep your schedule on track.
