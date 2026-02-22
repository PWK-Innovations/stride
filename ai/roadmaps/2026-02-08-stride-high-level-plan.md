# Stride Implementation Plan

**Date:** 2026-02-09
**Status:** High-level roadmap
**Scope:** MVP → P1 → P2 (see `aiDocs/mvp.md` and `aiDocs/prd.md`)

---

## Philosophy: Clean, Modern, MVP-First

**This is a greenfield project.** We are building from scratch with modern tools and best practices. Avoid:
- Over-engineering (YAGNI - You Aren't Gonna Need It)
- Premature optimization
- Legacy compatibility layers
- Unnecessary abstractions
- Cruft and technical debt from day one

**Principles:**
- Ship MVP fast, iterate based on user feedback
- Use modern tools as intended (Next.js App Router, Supabase, OpenAI API)
- Keep it simple until complexity is justified by real user needs
- Write clean, readable code over clever code
- Test the core flow (task input → AI schedule → display) early and often

---

## Phase 0: Foundation & Auth

**Goal:** Set up the project infrastructure, verify all integrations, configure auth, and set up PWA.

### 0.1 Project Setup
- Initialize Next.js project (App Router, TypeScript, Tailwind)
- Configure Tailwind with oatmeal-olive-instrument theme (olive palette, Instrument Serif, Inter)
- Set up Supabase project (Auth, Database, Storage)
- Configure environment variables (Supabase, OpenAI, Google OAuth)
- Set up basic project structure (app/, components/, lib/, types/)

### 0.2 Database Schema
- Design and create tables: `profiles`, `tasks`, `scheduled_blocks`
- Set up Row Level Security (RLS) policies
- Create database types for TypeScript

### 0.3 Integration Smoke Tests
- Verify Supabase connection (read/write test)
- Verify OpenAI API connection (simple text generation test)
- Verify Google Calendar OAuth flow (redirect → token exchange → store tokens)

### 0.4 Auth Setup
- Enable Supabase Auth (email/password)
- Create auth client helpers (signUp, signIn, signOut, onAuthStateChange)
- Set up middleware/layout check for /app routes
- Redirect unauthenticated users to /login
- Link profiles table to auth.users

### 0.5 PWA Setup
- Create web app manifest (name, icons, theme color)
- Set up service worker (minimal; cache static assets)
- Test "Add to Home Screen" on iOS and Android
- Verify standalone mode (own window, no browser chrome)

**Deliverable:** Next.js app with Supabase, OpenAI, and Google Calendar integrations verified. Auth infrastructure in place. PWA installable.

---

## Phase 1: Frontend Layout

**Goal:** Build the user-facing page structure: auth pages, dashboard, responsive design.

### 1.1 Sign Up & Sign In Pages
- app/login/page.tsx (email/password form, link to signup, redirect to /app)
- app/signup/page.tsx (email/password form, link to login, redirect to /app)
- Styled with olive theme

### 1.2 Dashboard Layout
- app/app/layout.tsx (header/nav, user info, sign out, main content area)
- Dashboard page with task list area, "Build my day" button area, timeline area

### 1.3 Responsive Design
- Mobile-first layout, touch targets, olive theme components

### 1.4 Landing & Marketing Pages
- Home, pricing, about (already complete)

**Roadmap:** `2026-02-09-phase-1-frontend-layout-roadmap.md`

---

## Phase 2: Core Data Flow

**Goal:** Build the "happy path" from task input to AI-generated schedule display.

### 2.1 Task Management (CRUD)
- Task data model (title, notes, duration, created_at)
- API routes: create task, list tasks, delete task
- Basic task list UI (no photos yet; text only)
- Persist tasks to Supabase

### 2.2 Calendar Integration
- Google Calendar OAuth flow (full implementation)
- Store OAuth tokens per user in Supabase
- Fetch today's events from Google Calendar
- Parse events into "busy windows" (start/end times)

### 2.3 AI Scheduling Engine (v1)
- Build prompt for OpenAI: tasks + busy windows + working hours → scheduled blocks
- Use Structured Outputs to ensure valid JSON response
- Parse AI response into scheduled blocks
- Handle overflow (tasks that don't fit)
- Persist scheduled blocks to Supabase

### 2.4 "Build My Day" Flow
- API route: `/api/schedule/build` (fetches calendar, calls AI, saves schedule)
- Wire up task list → "Build my day" button → API call → display schedule

### 2.5 Timeline View
- Choose and integrate timeline library
- Display today's calendar: busy blocks + scheduled tasks
- Visual distinction between calendar events and scheduled tasks
- Show overflow list (tasks that didn't fit)

**Deliverable:** User can add tasks (text only), click "Build my day", and see a schedule with tasks placed in free time slots on a timeline view.

---

## Phase 3: Photo-to-Task

**Goal:** Enable users to add tasks by uploading photos (whiteboards, syllabi, handwritten notes).

### 3.1 Photo Upload
- Add photo upload UI (camera or file picker)
- Upload photos to Supabase Storage
- Store photo URLs on tasks

### 3.2 Photo-to-Task with OpenAI
- Send photo to OpenAI API (multi-modal input)
- Extract tasks from photo (title, duration, optional deadline)
- Parse AI response and create tasks in database
- Show extracted tasks to user (allow edit/confirm before saving)

### 3.3 Photo Display
- Show photo thumbnails on tasks
- Allow users to view full-size photos

**Deliverable:** Users can take a photo of a whiteboard or syllabus, and the app extracts tasks from it. Photos are stored and shown with tasks.

---

## Phase 4: Polish & Validation

**Goal:** Refine the core experience and validate with real users.

### 4.1 Error Handling & Edge Cases
- Handle OpenAI API errors (rate limits, timeouts, invalid responses)
- Handle Google Calendar API errors (token refresh, rate limits, no events)
- Handle edge cases: no tasks, no free time, all-day events, time zones
- Show user-friendly error messages

### 4.2 UX Improvements
- Loading states (spinners, skeletons)
- Empty states (no tasks, no schedule, no calendar connected)
- Confirmation dialogs (delete task, disconnect calendar)
- Keyboard shortcuts (add task, build day)

### 4.3 Performance Optimization
- Optimize API routes (parallel fetches where possible)
- Optimize timeline rendering (virtualization if needed)
- Minimize OpenAI API calls (cache prompts, use reusable prompts)

### 4.4 Internal Dogfooding
- Use the app daily for 1-2 weeks
- Identify friction points and bugs
- Iterate on UX based on team feedback

### 4.5 Browser Notifications
- Request notification permission in-app
- Schedule notifications for task start times (client-side, derived from scheduled_blocks)
- Test notifications on desktop and mobile

**Deliverable:** Polished MVP ready for external beta. Core flow (task input → build day → timeline) is smooth and reliable. Notifications for task start times.

---

## Phase 5: Beta Launch

**Goal:** Launch to 5-10 external users and gather feedback.

### 5.1 Beta Preparation
- Set up analytics (track "Build my day" usage, task creation, photo uploads)
- Set up error logging (Sentry or similar)
- Create onboarding flow (connect calendar, add first task, build first day)
- Write beta invite email and feedback survey

### 5.2 Beta Launch
- Invite 5-10 users (mix of students, professionals, engineers)
- Monitor usage and errors daily
- Collect feedback via survey and direct conversations

### 5.3 Rapid Iteration
- Fix critical bugs within 24 hours
- Implement quick wins (small UX improvements, error messages)
- Prioritize P1 features based on feedback

**Deliverable:** MVP validated with real users. Clear signal on what works, what doesn't, and what to build next.

---

## Phase 6: Secondary Features (Post-MVP)

**Goal:** Add goals and dynamic calendar updates (P1 from MVP doc).

### 6.1 Goals
- Goal data model (professional, academic, social)
- UI to add/edit goals
- Link tasks to goals
- AI scheduling: incorporate goals into placement logic (prioritize goal-related tasks)

### 6.2 Dynamic Calendar Updates
- "Mark task done" UI (checkbox or button)
- When task is marked done: remove from schedule, re-run AI placement for remaining tasks
- Show updated schedule in real-time
- Handle "running late" or "skip task" scenarios

### 6.3 Refinements
- Multi-day view (tomorrow, this week) - if validated by users
- Task edit (if delete + re-add is too cumbersome)
- Calendar event caching (if fetch-on-demand is too slow)

**Deliverable:** P1 features (goals, dynamic updates) shipped. Users can set goals and the schedule adapts when they finish tasks.

---

## Phase 7: Scale & Monetization (Future)

**Goal:** Prepare for broader launch and implement pricing.

### 7.1 Pricing & Billing
- Implement free tier (limited AI schedules per month)
- Implement professional tier ($12-15/mo via Stripe)
- Implement student discount (50% off with .edu email)
- Payment flow and subscription management

### 7.2 Multi-Calendar Support (P1)
- Add Outlook and Apple Calendar integrations
- Allow users to connect multiple calendars
- Merge events from all calendars into one timeline

### 7.3 Integrations for Engineers (P1)
- Jira, Linear, GitHub integration (import tasks)
- Focus Time / Deep Work blocking (protect large time blocks)
- Task chunking (break large tasks into smaller blocks)

### 7.4 Go-to-Market
- Product Hunt launch
- Reddit community outreach (r/productivity, r/ADHD, r/college)
- Referral program (invite a peer for extended trial)
- Content marketing (blog posts, YouTube demos)

**Deliverable:** Stride is live, monetized, and growing. Broader feature set for different user segments (students, professionals, engineers).

---

## Dependencies & Critical Path

**Critical path (must happen in order):**
1. Phase 0 (Foundation & Auth) → Phase 1 (Frontend Layout) → Phase 2 (Core Data Flow)
2. Phase 3 (Photo-to-Task) can happen in parallel with Phase 2 if needed
3. Phase 4 (Polish) → Phase 5 (Beta) must be sequential
4. Phase 6+ (Secondary Features) can be prioritized based on beta feedback

**External dependencies:**
- Supabase project setup (can be done in Phase 0)
- Google Cloud project + OAuth credentials (can be done in Phase 0)
- OpenAI API key (can be done in Phase 0)
- Domain name + hosting (Vercel/Netlify; can be done in Phase 0 for PWA)

---

## Success Criteria (MVP)

From `aiDocs/mvp.md`, the MVP is successful if:
- Next.js app runs and is responsive on mobile
- PWA installable on at least one phone (iPhone or Android)
- Users can add tasks (text + photos)
- "Build my day" generates a daily schedule from tasks + calendar
- Daily view shows the built schedule clearly
- Users would actually use this daily (validated in beta)

---

## What We're NOT Building (Yet)

To avoid scope creep and over-engineering:
- ❌ Tomorrow or multi-day view (today only for MVP)
- ❌ Task edit (delete + re-add is fine for MVP)
- ❌ Calendar event caching (fetch on demand is fine for MVP)
- ❌ Multiple calendar providers (Google only for MVP)
- ❌ Real-time sync (manual refresh is fine for MVP)
- ❌ Complex scheduling optimization (greedy placement is fine for MVP)
- ❌ Duration learning / feedback loops (user-provided estimates for MVP)
- ❌ Break preservation (users can add break tasks manually for MVP)
- ❌ Team features (single-user only for MVP)

These can be added in P1/P2 if validated by users.

---

## Next Steps

1. **Review this plan** with the team
2. **Use phase plan/roadmap docs** in `ai/roadmaps/`: each phase (0–7) has a plan and roadmap pair
3. **Complete Phase 0** (Foundation & Auth) — finish auth setup
4. **Start Phase 1** (Frontend Layout) and build the auth UI + dashboard

---

## Notes

- This plan assumes a small team (1-3 people) working full-time
- Timeline is aggressive but achievable with AI-assisted development (Cursor)
- Adjust phases based on real progress and blockers
- Prioritize shipping over perfection; iterate based on user feedback
- Update `aiDocs/context.md` → "Current Focus" as you move through phases
