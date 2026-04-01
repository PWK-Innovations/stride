# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stride is an AI-powered daily planner PWA built with Next.js for knowledge workers with unstructured schedules — freelancers, developers, remote professionals, students, and individuals with ADHD. Users add tasks (text, photos, voice), connect their calendar (Google or Outlook), and hit "Build my day" — an agentic AI system (LangChain + OpenAI) schedules tasks into free time slots and displays a timeline. A chat modal lets users interact with the agent throughout the day to report progress, add tasks, and trigger rescheduling. Today-only scheduling, no multi-day planning.

## Commands

- `npm run dev` — Start dev server (default port 3000, docs reference 3001)
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, ESLint 9)
- No test framework is currently configured

## Architecture

**Stack:** Next.js 16 (App Router) / React 19 / TypeScript 5 / Tailwind CSS 4 / Supabase / LangChain + OpenAI API / Google Calendar API / Microsoft Graph API

**Directory layout:**
- `app/` — Next.js App Router pages and API routes
- `app/api/` — API routes: `tasks/` (CRUD), `schedule/build` (AI scheduling), `auth/google` (OAuth), `test/` (smoke tests)
- `components/` — Three layers: `elements/` (atomic UI), `features/` (composed features like DailyTimeline, DashboardShell), `sections/` (marketing page sections), `icons/`
- `lib/` — Feature-organized utilities: `supabase/`, `openai/`, `google/`, `notifications/`
- `types/database.ts` — Shared TypeScript interfaces (Profile, Task, ScheduledBlock)
- `middleware.ts` — Route protection via Supabase SSR (protects `/app/*`, redirects auth users from `/login`)

**"Build my day" flow (POST /api/schedule/build):**
1. Authenticate user → initialize LangChain agent
2. Agent fetches tasks from Supabase + calendar events from all connected providers (Google/Outlook)
3. Agent reasons about priorities and constraints (LLM) → deterministic constraint solver places time blocks (no LLM time-math)
4. If overloaded, agent suggests what to defer/drop → save scheduled_blocks to Supabase → return schedule + overflow

**Mid-day chat flow (POST /api/agent/chat):**
1. User sends message via chat modal ("I finished early", "add groceries", "what's next?")
2. LangChain agent processes with conversation context + current schedule state
3. Stability-first rescheduling: minimal adjustments over cascade reshuffles
4. Updated schedule saved → timeline refreshes → agent responds conversationally

**Database (Supabase PostgreSQL):** Core tables — `profiles` (user + calendar OAuth tokens per provider), `tasks` (user's tasks), `scheduled_blocks` (generated schedule), `agent_conversations` (chat history per user per day). All have RLS policies scoping to authenticated user. Schema in `lib/supabase/schema.sql`. Auto-creates profile on signup via trigger.

**External docs** (outside this repo, in `../aiDocs/`): PRD, architecture, MVP scope, coding style, changelog. Implementation roadmaps in `../ai/roadmaps/`.

## Code Conventions

Always reference `aiDocs/context.md` to guide coding and make appropriate updates.

From `aiDocs/coding-style.md`:

- **TypeScript strict mode**, no `any` — use `unknown` or proper types. Explicit return types on exports.
- **Formatting:** 2 spaces, semicolons, double quotes, trailing commas in multiline.
- **Naming:** PascalCase for components and component files (`TaskList.tsx`), camelCase for utilities/hooks (`formatTime.ts`). Next.js conventions for `page.tsx`/`layout.tsx`.
- **Components:** Functional only, named exports preferred (default export OK for Next.js pages). Props defined with `interface`. Presentational where possible — data fetching in hooks/server components/API routes.
- **Imports order:** external → internal → types, blank line between groups. Use `import type` where applicable.
- **Tailwind:** Use olive palette (`olive-*`), `font-display` (Instrument Serif), `font-sans` (Inter). Utility classes only, no inline styles for layout. Theme defined in `globals.css` using `@theme` directive with OKLCH colors.
- **Client components** marked with `'use client'`; server components for data fetching.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

## Current Status

Phases 0–6 complete (Foundation, Frontend Layout, PWA & Hosting, Core Data Flow, Photo/Audio-to-Task, Polish & Validation, Code Quality & Security). Next: Agentic AI system (LangChain agent, chat modal, Outlook Calendar integration), then Beta Launch. See `aiDocs/context.md` for current focus and `ai/notes/feedback-discussion.md` for the pivot decisions.
