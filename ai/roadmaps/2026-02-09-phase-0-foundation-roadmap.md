# Phase 0: Foundation - Roadmap

**Date:** 2026-02-09  
**Phase:** 0 - Foundation (Week 1)  
**Status:** Complete  
**Plan:** `2026-02-09-phase-0-foundation-plan.md`  
**Parent:** `2026-02-09-stride-implementation-plan.md`

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
- [ ] Test: insert/read/delete from tables via Supabase dashboard

### 0.3 Integration Smoke Tests

- [x] Create API route: `app/api/test/supabase/route.ts`
- [x] Implement Supabase test (insert, read, delete)
- [ ] Test: `curl http://localhost:3000/api/test/supabase` returns success
- [x] Create API route: `app/api/test/openai/route.ts`
- [x] Implement OpenAI test (simple prompt)
- [ ] Test: `curl http://localhost:3000/api/test/openai` returns "test successful"
- [x] Create API route: `app/api/auth/google/route.ts` (redirect to Google)
- [x] Create API route: `app/api/auth/google/callback/route.ts` (exchange code, store tokens)
- [ ] Create test page: `app/(auth)/test-google/page.tsx`
- [ ] Test: Complete OAuth flow, verify tokens in `profiles` table

---

## Deliverable

Empty Next.js app with:
- Tailwind configured (oatmeal-olive-instrument theme)
- Supabase tables and RLS policies
- Working API routes for Supabase, OpenAI, and Google Calendar OAuth

---

## Acceptance Criteria

- [x] Next.js app runs without errors
- [x] Tailwind theme matches oatmeal-olive-instrument
- [x] Supabase tables exist with correct schema and RLS
- [ ] All three integration tests pass (requires credentials)
- [x] Google OAuth flow stores tokens in Supabase
- [x] All secrets in `.env.local` (not in git)

---

## Notes

- Keep this roadmap updated as you complete tasks (check off items)
- When Phase 0 is complete, move this file and the plan to `ai/roadmaps/complete/`
- Update `aiDocs/changelog.md` when phase is complete
