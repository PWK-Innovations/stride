# Phase 1: Frontend Layout - Implementation Plan

**Date:** 2026-02-09
**Phase:** 1 - Frontend Layout
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-09-phase-1-frontend-layout-roadmap.md`
**Previous Phase:** `2026-02-09-phase-0-foundation-plan.md`

---

## Clean Code Principles

Use the oatmeal-olive-instrument template as the foundation. Don't reinvent UI patterns; adapt from the reference folder. Build pages and layouts only — no backend logic in this phase.

---

## Goal

Build the user-facing page structure: sign up/in pages, dashboard layout, and responsive design. By the end of this phase, users can sign up, log in, and see a dashboard shell ready for task and scheduling features.

---

## Prerequisites

- Phase 0 complete (Next.js app, Supabase tables, integrations verified, auth infrastructure, PWA setup)

---

## 1.1 Sign Up & Sign In Pages

### Sign In Page

Create `app/login/page.tsx`:
- Email and password inputs
- "Sign in" button (calls Supabase Auth signInWithPassword)
- Link to signup page ("Don't have an account? Sign up")
- On success: redirect to `/app` (or intended URL)
- Show error messages for invalid credentials
- Style with olive theme (Instrument Serif heading, Inter body)

### Sign Up Page

Create `app/signup/page.tsx`:
- Email and password inputs
- "Create account" button (calls Supabase Auth signUp)
- Link to login page ("Already have an account? Sign in")
- On success: redirect to `/app` or show confirmation
- Show error messages for invalid input (weak password, existing email)
- Style with olive theme

### Auth Flow

- Both pages use auth helpers from Phase 0 (`lib/supabase/auth.ts`)
- After signup, auto-create profile in `profiles` table
- Handle email confirmation flow if enabled in Supabase

---

## 1.2 Dashboard Layout

### App Layout

Create `app/app/layout.tsx`:
- Header with app name ("Stride"), user email/avatar, sign out button
- Navigation (minimal for MVP — just dashboard)
- Main content area for child pages
- Responsive: sidebar on desktop, hamburger or bottom nav on mobile

### Dashboard Page

Create `app/app/page.tsx` (or `app/app/dashboard/page.tsx`):
- Task list area (placeholder — tasks UI built in Phase 2)
- "Build my day" button area (placeholder — wired up in Phase 2)
- Timeline/schedule area (placeholder — timeline built in Phase 2)
- Empty states: "Add tasks to get started", "Connect Google Calendar"

### Sign Out

- Sign out button in header calls `signOut()` from auth helpers
- Redirect to `/login` after sign out
- Clear any client-side state

---

## 1.3 Responsive Design

### Mobile-First Layout

Design for phone screens first (320px-480px width):
- Full-width inputs, large touch targets (min 44px)
- "Build my day" button: prominent, full-width on mobile
- Stack sections vertically on mobile, side-by-side on desktop

### Use oatmeal-olive-instrument Components

Adapt from `reference/oatmeal-olive-instrument/`:
- Buttons, inputs, cards, headers
- Olive palette, Instrument Serif for headings, Inter for body
- Spacing and layout patterns

### Test on Phones

- Test on iOS (Safari) and Android (Chrome)
- Verify touch targets are large enough
- Verify scrolling works smoothly
- Verify text is readable (font size, contrast)

---

## 1.4 Landing & Marketing Pages

Home, pricing, and about pages are already complete from prior work. No changes needed unless issues are found during testing.

---

## Deliverable

- Sign up and sign in pages with Supabase Auth
- Dashboard layout with header, nav, and content areas
- Responsive design (mobile-first, olive theme)
- All marketing pages intact

---

## Acceptance Criteria

- Sign up page creates account via Supabase Auth
- Sign in page authenticates via Supabase Auth
- After login, user sees dashboard
- After sign out, user is redirected to login
- Unauthenticated users cannot access `/app`
- Dashboard has placeholder areas for tasks, schedule, and timeline
- Layout is responsive (works on 320px-480px and desktop)
- UI uses oatmeal-olive-instrument styling (olive colors, fonts)
- Marketing pages (home, pricing, about) are unaffected

---

## Next Phase

**Phase 2:** Core Data Flow (`2026-02-09-phase-2-core-data-flow-plan.md`)
