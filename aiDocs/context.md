# Project Context

## Quick Overview

Stride is an AI-powered daily planner that builds your schedule for you. Give it your tasks (text or photos) and your Google Calendar — hit "Plan my day" and the AI does the rest. No manual time-blocking, no drag-and-drop, no configuration rituals. Just a clean daily view of what to do and when.

Built as a Next.js PWA so it works on any device.

## Differentiator

Drop in tasks however you want (quick text, a photo of a syllabus, a voice note), connect your calendar, and tap one button. The AI figures out durations, priorities, and placement. Zero configuration tax. The less the user has to think about the tool, the more they actually use it.

Key differentiators:
- **Zero-config scheduling** — no manual durations, priority sliders, or project setup required
- **Multi-modal input** — text, photos (OCR), keeping input friction as low as possible
- **PWA-first** — installable on any phone, no app store gatekeeping, instant updates
- **Today-focused** — one day at a time, not an overwhelming weekly/monthly planner

## Critical Files to Review

- **PRD**: `aiDocs/prd.md` — Product goals, users, P0/P1/P2, success metrics. Start here for what we're building and why.
- **MVP**: `aiDocs/mvp.md` — Focused MVP: Next.js PWA (installable on phones), task input (text + photos), build daily calendar from tasks + Google Calendar. Goals and dynamic updates are secondary. Source of truth for in/out of scope.
- **Architecture**: `aiDocs/architecture.md` — System design: Next.js, Supabase (Auth, DB, Storage), OpenAI API, Google Calendar; data flow and key constraints.
- **Coding style**: `aiDocs/coding-style.md` — Code style and conventions for TypeScript, React, Next.js, Tailwind.
- **Template reference**: `ai/guides/reference/oatmeal-olive-instrument/` — Oatmeal-olive-instrument template (olive palette, Instrument Serif, Inter; components and layout patterns). Base all app UI and structure on this folder.
- **Changelog**: `aiDocs/changelog.md` — High-level changes; update when you push.

## Guides & Roadmaps

- **Guides**: `ai/guides/` — API references for implementation: `openai-api-reference.md`, `google-calendar-api-reference.md`, `supabase-api-reference.md`. Use these when building the scheduling engine, calendar integration, and backend services.
- **Implementation plan**: `ai/roadmaps/2026-02-09-stride-implementation-plan.md` — High-level phases (0–7). Each phase has a detailed plan and roadmap in `ai/roadmaps/` (e.g. `2026-02-09-phase-1-core-data-flow-plan.md` and `-roadmap.md`).

## Behavior

- Whenever creating plan docs and roadmap docs, always save them in ai/roadmaps. Prefix the name with the date. Add a note that we need to avoid over-engineering, cruft, and legacy-compatibility features in this clean code project. Make sure they reference each other.
- Plans can have items and to-do lists but should NOT use checkboxes (`- [ ]`). Roadmaps built from plans should have checkboxes for tracking progress.
- Whenever finishing with implementing a plan / roadmap doc pair, make sure the roadmap is up to date (tasks checked off, etc). Then move the docs to ai/roadmaps/complete. Then update aiDocs/changelog.md accordingly.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS.
- **Backend / Data: Supabase** — Auth (user identity), PostgreSQL (profiles, tasks, scheduled_blocks), Storage (task photos). Google Calendar is **attached per user**: OAuth tokens stored in Supabase after user connects.
- **AI: OpenAI API** — Used for schedule construction and smart placement. Called from Next.js API routes only; API key in env (never in client).
- **PWA**: Next.js app is installable (manifest + service worker); add to desktop/home screen, own window and icon. Browser notifications for task reminders where supported.
- **API**: Next.js API routes: Supabase for tasks/schedule/auth; OpenAI for AI scheduling; Google Calendar OAuth and fetch (tokens per user in Supabase).
- **Calendar**: Google Calendar API (read-only, OAuth 2.0); fetch today's events when building the day (no caching for MVP).

## Important Notes

- MVP scope: today only, one calendar (Google), task input (text + photos), "Build my day" / "Plan my day" builds the schedule. See mvp.md before adding features.
- We ship as a PWA so users can install on their phones; use browser notifications for reminders.
- Update **Current Focus** in this file regularly when priorities change.
- **Secrets**: Never commit API keys. Use env vars for Supabase (URL, anon key, service role), OpenAI API key, and Google OAuth client credentials.

## Current Focus

- Phase 3 complete (Core Data Flow). Task CRUD, Google Calendar integration, AI scheduling, "Build my day" flow, and timeline view all working. Google Calendar connect button wired into dashboard.
- Next up: Phase 4 (Photo-to-Task with AI vision).