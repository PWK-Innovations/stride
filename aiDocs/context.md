# Project Context

## Quick Overview

Stride is an AI-powered daily planner that builds your schedule and keeps it on track throughout the day. Give it your tasks (text, photos, or voice memos) and your calendar (Google or Outlook) — hit "Plan my day" and an agentic AI builds your schedule. Then interact with the agent via a chat modal to report progress, add tasks, and get guidance as your day unfolds. No manual time-blocking, no drag-and-drop, no configuration rituals.

Built for knowledge workers with unstructured schedules — freelancers, developers, remote professionals, students, and individuals with ADHD. Delivered as a Next.js PWA so it works on any device.

## Differentiator

**"AI keeps your day on track"** — not just a schedule generator, but an agentic system that adapts throughout the day. Drop in tasks however you want (quick text, a photo of a syllabus, a voice note), connect your calendar (Google or Outlook), and tap one button. The AI figures out durations, priorities, and placement. Then keep the schedule alive via a chat modal: "I finished early", "I'm running late", "what should I do next?"

Key differentiators:
- **Agentic AI scheduling** — LangChain-powered agent with multi-step reasoning, not a single-shot prompt. Handles conflicts, overload, and mid-day changes conversationally
- **Stability-first rescheduling** — minimal adjustments over cascade reshuffles; respects the user's need for anchoring (especially critical for ADHD users)
- **Zero-friction multi-modal input** — text, photos (OCR), voice memos (Whisper transcription), keeping input friction as low as possible
- **Hybrid architecture** — LLM for reasoning/intent, deterministic solver for time placement (no hallucinated overlaps)
- **Multi-calendar** — Google Calendar and Outlook Calendar; covers personal and enterprise users
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
- **Backend / Data: Supabase** — Auth (user identity), PostgreSQL (profiles, tasks, scheduled_blocks, agent_conversations), Storage (task photos). Calendar providers **attached per user**: OAuth tokens stored per provider in Supabase after user connects.
- **AI: LangChain + OpenAI** — Agentic scheduling system. LangChain agent orchestrates multi-step tool use (fetch tasks, fetch calendar, reason, place blocks). OpenAI GPT-4o-mini provides LLM reasoning. Deterministic constraint solver handles time placement. Called from Next.js API routes only; API keys in env (never in client).
- **PWA**: Next.js app is installable (manifest + service worker); add to desktop/home screen, own window and icon. Browser notifications for task reminders where supported.
- **API**: Next.js API routes: Supabase for tasks/schedule/auth; LangChain agent for AI scheduling and chat; calendar OAuth and fetch per provider (tokens per user in Supabase).
- **Calendars**: Google Calendar API (read-only, OAuth 2.0) and Outlook Calendar via Microsoft Graph API (read-only, OAuth 2.0); fetch today's events from all connected providers when building the day (no caching for MVP).

## Important Notes

- MVP scope: today only, two calendar providers (Google + Outlook), task input (text + photos + voice), "Build my day" triggers agentic AI scheduling, chat modal for mid-day agent interaction. See mvp.md before adding features.
- We ship as a PWA so users can install on their phones; use browser notifications for reminders.
- Update **Current Focus** in this file regularly when priorities change.
- **Secrets**: Never commit API keys. Use env vars for Supabase (URL, anon key, service role), OpenAI API key, and Google OAuth client credentials.

## Current Focus

- Phases 0–6 complete (Foundation through Code Quality & Security).
- Phase 6 delivered: CLI testing infrastructure (18-test integration suite), structured logging (debug level, LOG_LEVEL env var, zero console.* calls), security hardening (input sanitization, npm audit, .env.example, credentials scan).
- Next: Agentic AI system (LangChain agent, chat modal, Outlook Calendar integration), then Beta Launch. PRD, MVP, and architecture docs updated 2026-04-01 to reflect broadened target users, agentic AI, and multi-calendar support.