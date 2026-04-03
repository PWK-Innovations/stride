# Project Context

## Overview

Stride is an AI-powered daily planner that builds your schedule and keeps it on track throughout the day. Users add tasks (text, photos, voice), connect their calendar (Google or Outlook), and hit "Plan my day" — an agentic AI reasons through priorities, constraints, and calendar availability to build the schedule. A chat modal lets users interact with the agent mid-day: report progress, add tasks, request rescheduling.

Built for knowledge workers with unstructured schedules — freelancers, developers, remote professionals, students, and individuals with ADHD. Delivered as a Next.js PWA.

**Lead differentiator:** "AI keeps your day on track" — agentic system that adapts throughout the day with stability-first rescheduling (minimal adjustments, not cascade reshuffles). Hybrid architecture: LLM for reasoning, deterministic solver for time placement.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **AI**: LangChain agent + OpenAI GPT-4o-mini + deterministic constraint solver
- **Calendars**: Google Calendar API + Outlook Calendar (Microsoft Graph API)
- **Hosting**: Vercel (PWA, browser notifications)

## Key Files

| Doc | What | When to Read |
|-----|------|--------------|
| `aiDocs/prd.md` | Product goals, users, features, differentiators | Before any product decisions |
| `aiDocs/mvp.md` | What's in/out of scope | Before adding features |
| `aiDocs/architecture.md` | System design, data flows, key decisions | Before architectural work |
| `aiDocs/coding-style.md` | Code conventions (TypeScript, Tailwind, naming) | Before writing code |
| `aiDocs/changelog.md` | High-level change log | After pushing changes |
| `ai/guides/reference/oatmeal-olive-instrument/` | Design system template (olive palette, Instrument Serif, Inter) | Before UI work |
| `ai/guides/final-rubric.md` | Final grading rubric — scoring criteria, required elements, evidence checklist | Before any submission prep |
| `ai/guides/midterm-rubric.md` | Midterm grading rubric | For reference on midterm expectations |
| `ai/guides/presentation.md` | Presentation planning and structure | Before building slides |
| `ai/guides/logging-testing.md` | Logging and testing patterns guide | Before writing tests or logging |
| `ai/guides/external/` | API references (OpenAI, Google Calendar, Supabase) | During implementation |
| `ai/guides/reference/` | Design system (`oatmeal-olive-instrument/`), class notes, stride-agent docs, Tailwind components | Before UI or agent work |
| `ai/roadmaps/` | High-level plan + phase plans/roadmaps (7-11 active); `complete/` for phases 0-6 | Before starting a phase |
| `ai/notes/final-to-do-checklist.md` | Final to-do checklist cross-referenced against rubric and midterm feedback | For tracking remaining work |
| `ai/notes/midterm-feedback.md` | Midterm feedback from Jason (92), Casey (100), Presentation (70) | For understanding gaps to address |
| `ai/notes/feedback-discussion.md` | Cofounder pivot decisions (2026-04-01) | For context on product direction |

## App Structure (`app/` directory)

- `app/app/` — Protected dashboard (task input, timeline, chat modal)
- `app/api/` — API routes: `tasks/`, `schedule/`, `auth/google/`, `profile/`, `agent/`
- `components/` — `elements/` (atomic UI), `features/` (DailyTimeline, DashboardShell, etc.), `sections/` (marketing), `icons/`
- `lib/` — `supabase/`, `openai/`, `google/`, `outlook/` (Phase 7), `agent/` (Phase 7), `calendar/` (Phase 7), `audio/`, `notifications/`, `hooks/`, `errors/`, `logger.ts`
- `types/database.ts` — Shared interfaces (Profile, Task, ScheduledBlock)
- `middleware.ts` — Route protection (Supabase SSR)

## Important Notes

- **Secrets**: Never commit API keys. Use env vars (see `.env.example`).
- **Scope**: Today-only scheduling. Check `mvp.md` before adding features.
- **Logging**: Use `lib/logger.ts` — no raw `console.*` calls.
- **Changelog**: Update `aiDocs/changelog.md` before every commit. No exceptions. Make additions concise - no fluff.
- **Plans/Roadmaps**: Save in `ai/roadmaps/` with date prefix. Plans use lists, roadmaps use checkboxes. Move to `complete/` when done.

## Current Focus

- Phases 0-6 complete (Foundation through Code Quality & Security).
- Next: Phase 7 — Final Project Setup (CLAUDE.md, structured logging, tests, living docs aligned with rubric).
- Then: Phase 8 — Desktop Widget (Electron/Tauri widget, system tray, quick-actions).
- Then: Phase 9 — Agentic AI (LangChain agent, hybrid scheduling, chat interactions).
- Then: Phase 10 — Integrations & Web Chatbot (Outlook Calendar, web chatbot).
- Then: Phase 11 — Beta Launch (5-10 users, analytics, feedback).
- Then: Phase 12 — Secondary Features (goals, personalization loop).
- PRD/MVP/Architecture updated 2026-04-01 to reflect broadened target users, agentic AI, and multi-calendar support.
