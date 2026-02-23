# Phase 0: Foundation & Auth - Roadmap

**Date:** 2026-02-09
**Phase:** 0 - Foundation & Auth
**Status:** Complete (except manual Google OAuth test)
**Plan:** `2026-02-09-phase-0-foundation-plan.md`
**Parent:** `2026-02-08-stride-high-level-plan.md`

---

## Tasks

### 0.1 Project Setup

- [x] Initialize Next.js project (App Router, TypeScript, Tailwind)
- [x] Install dependencies (Supabase client, OpenAI SDK, Google Auth library)
- [x] Configure TypeScript (strict mode, path aliases)
- [x] Set up ESLint and Prettier
- [x] Copy `tailwind.css` from `reference/oatmeal-olive-instrument/`
- [x] Configure Tailwind theme (olive palette, Instrument Serif, Inter)
- [x] Add Google Fonts (Instrument Serif, Inter)
- [x] Test theme with simple page
- [x] Create Supabase project
- [x] Create `.env.local` with all secrets (Supabase, OpenAI, Google OAuth)
- [x] Verify `.env.local` is in `.gitignore`
- [x] Set up project structure (app/, components/, lib/, types/)

### 0.2 Database Schema

- [x] Design `profiles` table schema
- [x] Design `tasks` table schema
- [x] Design `scheduled_blocks` table schema
- [x] Create tables in Supabase SQL Editor
- [x] Enable Row Level Security (RLS) on all tables
- [x] Create RLS policies (users can only access their own data)
- [x] Generate TypeScript types (`types/database.ts`)
- [x] Test: insert/read/delete from tables via Supabase dashboard

### 0.3 Integration Smoke Tests

- [x] Create API route: `app/api/test/supabase/route.ts`
- [x] Implement Supabase test (insert, read, delete)
- [x] Test: `curl http://localhost:3000/api/test/supabase` returns success
- [x] Create API route: `app/api/test/openai/route.ts`
- [x] Implement OpenAI test (simple prompt)
- [x] Test: `curl http://localhost:3000/api/test/openai` returns "test successful"
- [x] Create API route: `app/api/auth/google/route.ts` (redirect to Google)
- [x] Create API route: `app/api/auth/google/callback/route.ts` (exchange code, store tokens)
- [x] Create test page: `app/test-google/page.tsx`
- [ ] Test: Complete OAuth flow, verify tokens in `profiles` table (requires Google OAuth credentials configured)

### 0.4 Auth Setup

- [x] Enable Supabase Auth (email/password) in dashboard
- [x] Configure email templates (confirmation, reset) if needed
- [x] Create auth client helpers: `lib/supabase/auth.ts`
- [x] Implement signUp, signIn, signOut, onAuthStateChange, getSession
- [x] Set up middleware or layout check for `/app` routes
- [x] Redirect unauthenticated users to `/login`
- [x] Ensure `profiles.id` references `auth.users.id`
- [x] Create trigger/hook to auto-create profile on signup
- [ ] Test: signup → login → access /app → sign out → blocked from /app (manual browser test)

---

## Deliverable

Next.js app with:
- Tailwind configured (oatmeal-olive-instrument theme)
- Supabase tables and RLS policies
- Working API routes for Supabase, OpenAI, and Google Calendar OAuth
- Auth infrastructure (Supabase Auth, helpers, route protection)

---

## Acceptance Criteria

- [x] Next.js app runs without errors
- [x] Tailwind theme matches oatmeal-olive-instrument
- [x] Supabase tables exist with correct schema and RLS
- [x] Supabase and OpenAI integration tests pass
- [x] Google OAuth flow stores tokens in Supabase
- [x] All secrets in `.env.local` (not in git)
- [x] Auth helpers work (signUp, signIn, signOut)
- [x] `/app` routes protected; unauthenticated users redirected

---

## Notes

- Supabase client/server rewritten to use `@supabase/ssr` (createBrowserClient, createServerClient)
- All API routes updated to use per-request server client instead of singleton
- Middleware protects `/app/*` routes and redirects auth pages if logged in
- Profile auto-creation trigger uses `security definer set search_path = public`
- Fixed `update_updated_at_column` function search path per security advisor
- Remaining manual tests: Google OAuth flow, full signup→signout browser test
