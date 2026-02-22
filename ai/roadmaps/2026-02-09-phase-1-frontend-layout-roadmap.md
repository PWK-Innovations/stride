# Phase 1: Frontend Layout - Roadmap

**Date:** 2026-02-09
**Phase:** 1 - Frontend Layout
**Status:** In progress
**Plan:** `2026-02-09-phase-1-frontend-layout-plan.md`
**Previous Phase:** `2026-02-09-phase-0-foundation-roadmap.md`

---

## Tasks

### 1.1 Sign Up & Sign In Pages

- [ ] Create `app/login/page.tsx` (email/password form)
- [ ] Implement sign in with Supabase Auth (signInWithPassword)
- [ ] Add link to signup page
- [ ] On success: redirect to `/app`
- [ ] Show error messages for invalid credentials
- [ ] Style with olive theme (Instrument Serif heading, Inter body)
- [ ] Create `app/signup/page.tsx` (email/password form)
- [ ] Implement sign up with Supabase Auth (signUp)
- [ ] Add link to login page
- [ ] On success: redirect to `/app` or show confirmation
- [ ] Show error messages for invalid input
- [ ] Style with olive theme
- [ ] Handle email confirmation flow if enabled
- [ ] Test: signup → login → access app → sign out → blocked from app

### 1.2 Dashboard Layout

- [ ] Create `app/app/layout.tsx` (header, nav, main content area)
- [ ] Add app name ("Stride") to header
- [ ] Add user email/avatar to header
- [ ] Add sign out button to header
- [x] Create `app/app/page.tsx` (dashboard)
- [x] Add task list placeholder area
- [x] Add "Build my day" button placeholder area
- [x] Add timeline/schedule placeholder area
- [x] Add empty states ("Add tasks to get started", "Connect Google Calendar")
- [ ] Wire up sign out button (signOut → redirect to /login)
- [x] Style with olive theme

### 1.3 Responsive Design

- [x] Design mobile-first layout (320px-480px)
- [x] Make inputs full-width on mobile
- [x] Ensure touch targets are min 44px
- [x] Make "Build my day" button prominent and full-width on mobile
- [x] Adapt components from `reference/oatmeal-olive-instrument/`
- [x] Apply olive palette, Instrument Serif (headings), Inter (body)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify scrolling, readability, touch targets

### 1.4 Landing & Marketing Pages

- [x] Home page aligned with reference (HeroWithDemoOnBackground, features, testimonial)
- [x] Pricing page aligned with reference template
- [x] About page aligned with reference (about-02 structure)
- [x] Typography: Heading (Instrument Serif), Subheading (section titles), Text (body)
- [x] Hero images: reference-style assets, hero photo fills column (match reference)
- [x] About hero: two-column with photo, image sized like reference (min-height for photo column)
- [x] About team section: TeamThreeColumnGrid with real team (Parker Watts, Alex Fankhauser, Caleb Gooch)
- [x] Team photos: local images (parker.png, alex.png, caleb.png) with object-view-box zoom/crop
- [x] About "Why we built Stride": two-column section, image on left
- [x] "Why we built Stride" image: local running.png (vertical), aspect 4/5
- [x] Placeholder/feature images from reference or Unsplash where appropriate
- [x] Testimonial (e.g. Jordan Rogers) and footer links

---

## Deliverable

Sign up/in pages, dashboard layout, responsive design, and marketing pages.

---

## Acceptance Criteria

- [ ] All 1.1 and 1.2 tasks checked off
- [ ] Sign up and sign in work with Supabase Auth
- [ ] Dashboard layout is functional (header, nav, content areas)
- [ ] Unauthenticated users redirected to /login
- [x] Responsive design works on mobile
- [x] Marketing pages are complete and unaffected
- [ ] Olive theme applied consistently

---

## Next Phase

**Phase 2:** PWA & Hosting (`2026-02-09-phase-2-pwa-hosting-roadmap.md`)
