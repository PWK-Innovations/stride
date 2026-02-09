# Project Context

## Critical Files to Review

- **PRD**: `aiDocs/prd.md` — Product goals, users, P0/P1/P2, success metrics. Start here for what we're building and why.
- **MVP**: `aiDocs/mvp.md` — Ruthless 7-week scope: minimal task model, today-only calendar, "Plan my day," validation plan. Source of truth for in/out of scope.
- **Architecture**: `aiDocs/architecture.md` — System design: frontend/API/DB/calendar/scheduling, data flow, and key constraints.
- **Coding style**: `aiDocs/coding-style.md` — Code style and conventions for TypeScript, React, Next.js, Tailwind.
- **Changelog**: `aiDocs/changelog.md` — High-level changes; update when you push.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS.
- **Backend / Data: Supabase** — Auth, PostgreSQL database, and Storage (for task photos). Next.js API routes use the Supabase client or service role for tasks, schedule, and auth.
- **PWA**: Next.js app is installable (manifest + service worker); users can add to desktop/home screen, get own window and icon; ~1 day to add. Background notifications supported where the browser allows.
- **Notifications**: Browser Notification API for task reminders (e.g. at scheduled block start); request permission in-app; works in Chrome, Firefox, Safari. No push server for MVP.
- **Timeline**: Use a library (e.g. `react-calendar-timeline`); see MVP for budget.
- **API**: Next.js API routes calling Supabase; REST for tasks and schedule; calendar OAuth handled via Next.js (tokens stored per user in Supabase).
- **Database**: Supabase (PostgreSQL); tables: `users`/profiles, `tasks`, `scheduled_blocks`; no calendar cache.
- **Calendar**: Google Calendar API (read-only, OAuth 2.0); fetch on each "Plan my day" (no caching).

## Important Notes

- MVP scope is minimal: today only, no deadlines, no task edit, no calendar caching; see mvp.md before adding features.
- We ship as a PWA for a native-app feel; use browser notifications for reminders.
- Update **Current Focus** in this file regularly (e.g. each week or when switching work).
- Never commit secrets or `.testEnvVars`; use env vars for Supabase (URL, anon key, service role) and Google OAuth.

## Current Focus

- Week 1: Data model and task CRUD (add, list, delete, mark done).
