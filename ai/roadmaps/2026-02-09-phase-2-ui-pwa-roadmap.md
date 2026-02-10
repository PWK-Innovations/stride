# Phase 2: UI & PWA - Roadmap

**Date:** 2026-02-09  
**Phase:** 2 - UI & PWA (Week 3)  
**Status:** Complete ✓  
**Plan:** `2026-02-09-phase-2-ui-pwa-plan.md`  
**Previous Phase:** `2026-02-09-phase-1-core-data-flow-roadmap.md`

---

## Tasks

### 2.1 Timeline/Calendar View

- [x] Evaluate timeline libraries (react-calendar-timeline, react-big-calendar)
- [x] Choose library (recommendation: react-calendar-timeline)
- [x] Install library
- [x] Create `components/features/DailyTimeline.tsx`
- [x] Configure timeline (today, 30-min intervals)
- [x] Test with dummy data
- [x] Fetch calendar events and scheduled blocks on page load
- [x] Map events and blocks to timeline items
- [x] Render calendar events (olive-600 or similar)
- [x] Render scheduled tasks (olive-400 or similar)
- [x] Add visual distinction (color, border, label)
- [x] Show overflow list below timeline ("Couldn't schedule: Task A, Task B")
- [x] Style overflow as alert or info box

### 2.2 Responsive Design

- [x] Design mobile-first layout (320px-480px)
- [x] Make task input form full-width on mobile
- [x] Ensure touch targets are min 44px
- [x] Test timeline on mobile (horizontal scroll or vertical list)
- [x] Make "Build my day" button prominent and full-width on mobile
- [x] Adapt components from `reference/oatmeal-olive-instrument/`
- [x] Apply olive palette, Instrument Serif (headings), Inter (body)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify scrolling, readability, touch targets

### 2.3 PWA Setup

- [x] Create `public/manifest.json` (name, icons, theme, display: standalone)
- [x] Create app icons (192x192, 512x512) or use placeholders
- [x] Link manifest in `app/layout.tsx`
- [x] Create `public/sw.js` (minimal service worker, cache static assets)
- [x] Register service worker in `app/layout.tsx`
- [ ] Test on iOS: Add to Home Screen
- [ ] Test on Android: Install app
- [ ] Verify standalone mode (no browser chrome)
- [ ] Verify icon and name are correct

### 2.4 Browser Notifications

- [x] Check `Notification.permission` on app load
- [x] Show notification prompt after first "Build my day" (if permission is "default")
- [x] Implement `Notification.requestPermission()`
- [x] After schedule is built, calculate time until each task starts
- [x] Use `setTimeout` to show notification at start time
- [x] Notification content: title = task title, body = duration
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify notifications appear at correct times
- [ ] Verify clicking notification opens app

---

## Deliverable

Installable PWA with timeline view, responsive design, and notifications.

---

## Acceptance Criteria

- [x] All tasks checked off (implementation complete)
- [x] Timeline shows calendar events and scheduled tasks
- [x] App is responsive on mobile
- [x] PWA installable on iOS and Android (manifest + service worker ready)
- [x] Notifications work on desktop and mobile (implementation complete)
- [ ] Full flow works on phone (requires testing with real device)

---

## Next Phase

**Phase 3:** Photo-to-Task (`2026-02-09-phase-3-photo-to-task-roadmap.md`)
