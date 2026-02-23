# Phase 0: Foundation & Auth - Implementation Plan

**Date:** 2026-02-09
**Phase:** 0 - Foundation & Auth
**Status:** In progress
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-09-phase-0-foundation-roadmap.md`

---

## Clean Code Principles

**This is a greenfield project.** Avoid over-engineering, cruft, and legacy-compatibility features. Keep it simple, modern, and focused on MVP.

---

## Goal

Set up the project infrastructure, verify all integrations, and configure authentication. By the end of this phase, we have a Next.js app that connects to Supabase, OpenAI, and Google Calendar, with auth infrastructure in place.

---

## Prerequisites

- Supabase account (free tier is fine for MVP)
- OpenAI API key
- Google Cloud project with Calendar API enabled

---

## 0.1 Project Setup

### Initialize Next.js Project

- Create new Next.js project with App Router, TypeScript, ESLint
- Install dependencies: Tailwind CSS, Supabase client, OpenAI SDK, Google Auth library
- Configure TypeScript (strict mode, path aliases)
- Set up ESLint and Prettier

### Configure Tailwind with oatmeal-olive-instrument Theme

- Copy `tailwind.css` from `reference/oatmeal-olive-instrument/`
- Set up custom theme: olive palette (`olive-50` to `olive-950`), `font-display` (Instrument Serif), `font-sans` (Inter)
- Add Google Fonts: Instrument Serif, Inter
- Test theme by creating a simple page with olive colors and fonts

### Set up Supabase Project

- Create new Supabase project
- Note down: Project URL, anon key, service role key
- Enable Auth providers (email for now; Google OAuth later if needed)

### Configure Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

Add `.env.local` to `.gitignore` (should already be there)

### Set up Project Structure

```
stride/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── (auth)/          # Auth pages (login, callback)
│   └── (app)/           # Main app pages
├── components/          # React components
│   ├── ui/             # UI primitives (buttons, inputs)
│   └── features/       # Feature-specific components
├── lib/                # Utilities and configs
│   ├── supabase/       # Supabase client and helpers
│   ├── openai/         # OpenAI client and helpers
│   └── google/         # Google Calendar helpers
├── types/              # TypeScript types
└── public/             # Static assets
```

---

## 0.2 Database Schema

### Design Tables

**`profiles` table:**
- `id` (uuid, primary key, references auth.users)
- `email` (text)
- `google_access_token` (text, nullable)
- `google_refresh_token` (text, nullable)
- `google_token_expires_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`tasks` table:**
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, references profiles.id)
- `title` (text, not null)
- `notes` (text, nullable)
- `duration_minutes` (integer, default 30)
- `photo_url` (text, nullable) — for Phase 4
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`scheduled_blocks` table:**
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, references profiles.id)
- `task_id` (uuid, references tasks.id, nullable)
- `start_time` (timestamp, not null)
- `end_time` (timestamp, not null)
- `title` (text, not null) — task title or calendar event summary
- `source` (text, not null) — 'ai' or 'calendar'
- `created_at` (timestamp)

### Create Tables in Supabase

- Run SQL in Supabase SQL Editor
- Enable Row Level Security (RLS) on all tables
- Create RLS policies:
  - Users can only read/write their own data
  - `user_id = auth.uid()` for all policies

### Generate TypeScript Types

- Use Supabase CLI or manual type definitions
- Create `types/database.ts` with table types

---

## 0.3 Integration Smoke Tests

### Verify Supabase Connection

Create API route: `app/api/test/supabase/route.ts`
- Insert a test row into `tasks` table
- Read it back
- Delete it
- Return success/failure

Test: `curl http://localhost:3000/api/test/supabase`

### Verify OpenAI API Connection

Create API route: `app/api/test/openai/route.ts`
- Call OpenAI Responses API with simple prompt: "Say 'test successful'"
- Return the response

Test: `curl http://localhost:3000/api/test/openai`

### Verify Google Calendar OAuth Flow

Create API routes:
- `app/api/auth/google/route.ts` — Redirect to Google consent screen
- `app/api/auth/google/callback/route.ts` — Exchange code for tokens, store in Supabase

Create test page: `app/(auth)/test-google/page.tsx`
- Button: "Connect Google Calendar"
- On click: redirect to `/api/auth/google`
- After callback: show "Connected!" and access token expiry

Test: Click button, complete OAuth flow, verify tokens are stored in `profiles` table

---

## 0.4 Auth Setup

### Enable Supabase Auth

- Enable email/password auth in Supabase dashboard
- Configure email templates if needed (confirmation, reset)

### Create Auth Client Helpers

Create `lib/supabase/auth.ts`:
- `signUp(email, password)` — create account via Supabase Auth
- `signIn(email, password)` — sign in via Supabase Auth
- `signOut()` — sign out
- `onAuthStateChange(callback)` — listen for auth state changes
- `getSession()` — get current session

### Protect App Routes

- Set up middleware or layout check for `/app` routes
- Redirect unauthenticated users to `/login`
- Allow public access to marketing pages (home, pricing, about)

### Link Profiles to Auth

- Ensure `profiles.id` references `auth.users.id`
- Create trigger or hook to auto-create profile on signup
- Link tasks and scheduled_blocks to `auth.uid()`

---

## Deliverable

- Next.js app runs locally on `http://localhost:3000`
- Tailwind configured with oatmeal-olive-instrument theme (olive colors, Instrument Serif, Inter)
- Supabase tables created with RLS policies
- API routes for Supabase, OpenAI, and Google Calendar OAuth all return success
- Auth infrastructure in place (Supabase Auth, helpers, route protection)

---

## Acceptance Criteria

- Next.js app runs without errors
- Tailwind theme matches oatmeal-olive-instrument (olive palette, fonts)
- Supabase tables exist with correct schema and RLS policies
- `/api/test/supabase` returns success
- `/api/test/openai` returns "test successful" from OpenAI
- Google OAuth flow completes and stores tokens in `profiles` table
- All secrets in `.env.local` (not committed to git)
- Auth helpers work (signUp, signIn, signOut)
- `/app` routes are protected; unauthenticated users redirected to `/login`

---

## Next Phase

**Phase 1:** Frontend Layout (`2026-02-09-phase-1-frontend-layout-plan.md`)
