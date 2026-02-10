# Phase 2: UI & PWA - Implementation Plan

**Date:** 2026-02-09  
**Phase:** 2 - UI & PWA (Week 3)  
**Status:** Not started  
**Parent Plan:** `2026-02-09-stride-implementation-plan.md`  
**Roadmap:** `2026-02-09-phase-2-ui-pwa-roadmap.md`  
**Previous Phase:** `2026-02-09-phase-1-core-data-flow-plan.md`

---

## Clean Code Principles

Use the oatmeal-olive-instrument template as the foundation. Don't reinvent UI patterns; adapt from the reference folder.

---

## Goal

Make the app usable on phones and visually aligned with the template. By the end of this phase, users can install the app on their phone, add tasks, build their day, and see a timeline with calendar events and scheduled tasks.

---

## Prerequisites

- Phase 1 complete (task CRUD, calendar integration, AI scheduling, "Build my day" flow)

---

## 2.1 Timeline/Calendar View

### Choose Timeline Library

Evaluate options:
- `react-calendar-timeline` (popular, flexible)
- `react-big-calendar` (Google Calendar-like)
- Custom timeline (only if libraries don't fit)

Recommendation: Start with `react-calendar-timeline`; it's well-maintained and flexible.

### Integrate Timeline Library

- Install library
- Create timeline component: `components/features/DailyTimeline.tsx`
- Configure timeline: show today (midnight to midnight), 30-minute intervals
- Test with dummy data (no real schedule yet)

### Display Calendar Events and Scheduled Tasks

Data sources:
- **Calendar events** (from Google Calendar): busy blocks, shown as one color (e.g., olive-600)
- **Scheduled tasks** (from AI): task blocks, shown as different color (e.g., olive-400)

Fetch both:
- On page load: fetch today's calendar events and scheduled blocks from Supabase
- Map to timeline items (start, end, title, type)
- Render on timeline with visual distinction (color, border, or label)

### Show Overflow List

Below timeline:
- If overflow exists (tasks that didn't fit), show list: "Couldn't schedule today: Task A, Task B"
- Style as a simple alert or info box

---

## 2.2 Responsive Design

### Mobile-First Layout

Design for phone screens first (320px-480px width):
- Task input form: full-width inputs, large touch targets (min 44px)
- Timeline: horizontal scroll or vertical list (test both)
- "Build my day" button: prominent, full-width on mobile

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

## 2.3 PWA Setup

### Create Web App Manifest

Create `public/manifest.json`:
- `name`: "Stride"
- `short_name`: "Stride"
- `description`: "AI-powered daily planner"
- `start_url`: "/"
- `display`: "standalone"
- `theme_color`: olive-600 (from theme)
- `background_color`: olive-100 (from theme)
- `icons`: 192x192 and 512x512 (create or use placeholder)

Link in `app/layout.tsx`:
```
<link rel="manifest" href="/manifest.json" />
```

### Set up Service Worker

Create minimal service worker: `public/sw.js`
- Cache static assets (JS, CSS, fonts)
- Network-first strategy for API calls
- No offline-first requirement for MVP (just basic caching)

Register service worker in `app/layout.tsx` (client-side script)

### Test "Add to Home Screen"

- Test on iOS: Safari → Share → Add to Home Screen
- Test on Android: Chrome → Menu → Install app
- Verify app opens in standalone mode (no browser chrome)
- Verify icon and name are correct

---

## 2.4 Browser Notifications

### Request Notification Permission

Add to app (e.g., after first "Build my day"):
- Check if `Notification.permission` is "default"
- If so, show prompt: "Enable notifications to get reminders for your tasks?"
- On user approval: call `Notification.requestPermission()`

### Schedule Notifications for Task Start Times

After schedule is built:
- For each scheduled block, calculate time until start
- Use `setTimeout` to show notification at start time
- Notification content: title = task title, body = duration

Example notification:
```
Title: "Time to: Review Q3 report"
Body: "Scheduled for 30 minutes"
```

### Test Notifications

- Test on desktop (Chrome, Firefox, Safari)
- Test on mobile (iOS Safari, Android Chrome)
- Verify notifications appear at correct times
- Verify clicking notification opens app

---

## Deliverable

Installable PWA that works on phones. Users can add tasks, build their day, and see a timeline with calendar events and scheduled tasks. Notifications for task start times.

---

## Acceptance Criteria

- [ ] Timeline displays today's calendar events and scheduled tasks
- [ ] Visual distinction between calendar events and scheduled tasks
- [ ] Overflow list shows tasks that didn't fit
- [ ] App is responsive on mobile (320px-480px width)
- [ ] UI uses oatmeal-olive-instrument styling (olive colors, fonts)
- [ ] PWA installable on iOS and Android
- [ ] App opens in standalone mode (no browser chrome)
- [ ] Notification permission requested after first "Build my day"
- [ ] Notifications appear at task start times
- [ ] Full flow works on phone: add task → build day → see timeline → get notification

---

## Next Phase

**Phase 3:** Photo-to-Task (`2026-02-09-phase-3-photo-to-task-plan.md`)
