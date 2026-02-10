# Auth: Login & Signup - Roadmap

**Date:** 2026-02-09  
**Phase:** Auth (Login & Signup) — future  
**Status:** Not started  
**Parent:** `2026-02-09-stride-implementation-plan.md`

---

## Goal

Add login and signup behind the project using Supabase Auth. Users must sign in to access the app; marketing pages (home, pricing, about) remain public.

---

## Tasks

### Auth with Supabase

- [ ] Enable Supabase Auth (email/password and/or magic link) in Supabase dashboard
- [ ] Create login page: `app/login/page.tsx` (or `app/(auth)/login/page.tsx`)
  - Email + password (and/or “Send magic link”)
  - Link to signup page
  - Redirect to `/app` (or intended URL) after successful login
- [ ] Create signup page: `app/signup/page.tsx` (or `app/(auth)/signup/page.tsx`)
  - Email + password (and/or magic link)
  - Link to login page
  - Redirect to `/app` or onboarding after signup
- [ ] Use Supabase client auth: `signInWithPassword`, `signUp`, `signOut`, `onAuthStateChange`
- [ ] Optional: password reset flow (forgot password page + Supabase reset)
- [ ] Protect app routes: require authenticated user for `/app` (middleware or layout check)
- [ ] Redirect unauthenticated users from `/app` to `/login` (with return URL if desired)
- [ ] Ensure `profiles` (or auth.users) is used for user identity; link tasks/schedules to `auth.uid()`
- [ ] Test: signup → login → access app → sign out → blocked from app

---

## Deliverable

- Login and signup pages using Supabase Auth.
- App routes (`/app`) protected; only authenticated users can use the planner.

---

## Acceptance Criteria

- [ ] Login page works with Supabase Auth
- [ ] Signup page works with Supabase Auth
- [ ] Unauthenticated users cannot access `/app`
- [ ] Authenticated users are redirected to app after login/signup
- [ ] Session persists across reloads (Supabase client handles this)

---

## Notes

- Can be done after Phase 2 (or in parallel). Required before or during beta if you want per-user data behind auth.
- See Phase 0 / Phase 1 for existing Google OAuth (calendar); this phase is for **app** login/signup (identity), not calendar OAuth.
