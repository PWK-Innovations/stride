# Project Context

## Critical Files to Review

- **PRD**: `aiDocs/prd.md` — Product goals, users, P0/P1/P2, success metrics. Start here for what we're building and why.
- **MVP**: `aiDocs/mvp.md` — Focused MVP: Next.js PWA (installable on phones), task input (text + photos), build daily calendar from tasks + Google Calendar. Goals and dynamic updates are secondary. Source of truth for in/out of scope.
- **Architecture**: `aiDocs/architecture.md` — System design: Next.js, Supabase (Auth, DB, Storage), OpenAI API, Google Calendar; data flow and key constraints.
- **Coding style**: `aiDocs/coding-style.md` — Code style and conventions for TypeScript, React, Next.js, Tailwind.
- **Changelog**: `aiDocs/changelog.md` — High-level changes; update when you push.

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

- Data model and task CRUD (add, list, delete, mark done); then calendar connect and "Build my day" with AI (OpenAI API).
