# Phase 2: PWA & Hosting - Implementation Plan

**Date:** 2026-02-09
**Phase:** 2 - PWA & Hosting
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-09-phase-2-pwa-hosting-roadmap.md`
**Previous Phase:** `2026-02-09-phase-1-frontend-layout-plan.md`

---

## Clean Code Principles

Deploy early so PWA features can be tested on real devices over HTTPS. Keep the service worker minimal — cache static assets only, no offline-first for MVP.

---

## Goal

Deploy the app to Vercel for HTTPS hosting, set up PWA support (manifest, service worker, icons), and verify "Add to Home Screen" on iOS and Android. By the end of this phase, the app is live on a public URL and installable as a PWA.

---

## Prerequisites

- Phase 1 complete (sign up/in pages, dashboard layout, responsive design)
- Vercel account (free tier is fine)
- Git repo connected to Vercel

---

## 2.1 Vercel Deployment

### Connect Repository

- Connect the Stride GitHub repo to Vercel
- Configure framework preset (Next.js)
- Set up environment variables in Vercel dashboard (Supabase, OpenAI, Google OAuth)

### Deploy

- Trigger first deployment
- Verify build succeeds
- Verify HTTPS is active on the Vercel URL

### Verify Production

- Test sign up / sign in on the live URL
- Verify Supabase connection works in production
- Verify environment variables are correct

---

## 2.2 PWA Setup

### Create Web App Manifest

Create `public/manifest.json`:
- `name`: "Stride"
- `short_name`: "Stride"
- `description`: "AI-powered daily planner"
- `start_url`: "/"
- `display`: "standalone"
- `theme_color`: olive-600 (from theme)
- `background_color`: olive-100 (from theme)
- `icons`: 192x192 and 512x512

Link in `app/layout.tsx`:

```html
<link rel="manifest" href="/manifest.json" />
```

### Set up Service Worker

Create minimal service worker: `public/sw.js`
- Cache static assets (JS, CSS, fonts)
- Network-first strategy for API calls
- No offline-first requirement for MVP (just basic caching)

Register service worker in `app/layout.tsx` (client-side script)

---

## 2.3 PWA Testing

### Test "Add to Home Screen"

- Test on iOS: Safari → Share → Add to Home Screen
- Test on Android: Chrome → Menu → Install app

### Verify Standalone Mode

- Verify app opens in standalone mode (no browser chrome)
- Verify icon and name are correct
- Verify theme color is applied

---

## Deliverable

- App deployed to Vercel with HTTPS
- PWA installable (manifest, service worker, icons)
- "Add to Home Screen" tested on iOS and Android
- Standalone mode verified

---

## Acceptance Criteria

- App is live on a Vercel URL with HTTPS
- Environment variables configured in Vercel
- Build and deploy succeed
- PWA manifest and service worker are registered
- App installable on at least one device (iOS or Android)
- Standalone mode works (no browser chrome)
- Icon and name are correct

---

## Next Phase

**Phase 3:** Core Data Flow (`2026-02-09-phase-3-core-data-flow-plan.md`)
