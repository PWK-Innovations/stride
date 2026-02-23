# Phase 2: PWA & Hosting - Roadmap

**Date:** 2026-02-09
**Phase:** 2 - PWA & Hosting
**Status:** Complete
**Plan:** `2026-02-09-phase-2-pwa-hosting-plan.md`
**Previous Phase:** `2026-02-09-phase-1-frontend-layout-roadmap.md`

---

## Tasks

### 2.1 Vercel Deployment

- [x] Connect Stride GitHub repo to Vercel (via GitHub Actions + Vercel CLI)
- [x] Configure framework preset (Next.js)
- [x] Set up environment variables in Vercel dashboard
- [x] Create GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)
- [x] Verify build succeeds
- [ ] Trigger first deployment (manual: push to main)
- [ ] Verify HTTPS is active on the Vercel URL
- [ ] Test sign up / sign in on the live URL
- [ ] Verify Supabase connection works in production

### 2.2 PWA Setup

- [x] Create `public/manifest.json` (name, icons, theme, display: standalone)
- [x] Create app icons (192x192, 512x512, 180x180 for iOS, favicon.ico)
- [x] Link manifest in `app/layout.tsx`
- [x] Create `public/sw.js` (minimal service worker, cache static assets)
- [x] Register service worker in `app/layout.tsx`
- [x] Fix themeColor deprecation (moved to viewport export)
- [x] Add proper apple-touch-icon (180x180)

### 2.3 PWA Testing

- [ ] Test on iOS: Safari → Share → Add to Home Screen
- [ ] Test on Android: Chrome → Menu → Install app
- [ ] Verify standalone mode (no browser chrome)
- [ ] Verify icon and name are correct
- [ ] Verify theme color is applied

### 2.4 CLI Testing & Logging

- [x] Structured logging implemented (`lib/logger.ts` with dev/prod formats)
- [x] Integrated logger into API routes and integration helpers
- [x] CLI test scripts exist and work (`npm run test:supabase`, `test:openai`, `test:google`, `test:all`)
- [x] All CLI tests passing

---

## Deliverable

App deployed to Vercel with HTTPS. PWA installable and tested on real devices.

---

## Acceptance Criteria

- [x] GitHub Actions deploy workflow created
- [x] PWA manifest and service worker registered
- [x] App icons generated (192, 512, 180, favicon)
- [x] Structured logger and CLI test scripts implemented
- [ ] App is live on Vercel with HTTPS (pending: first deploy after secrets configured)
- [ ] App installable on at least one device (pending: manual device testing)
- [ ] Standalone mode works (pending: manual device testing)

---

## Next Phase

**Phase 3:** Core Data Flow (`2026-02-09-phase-3-core-data-flow-roadmap.md`)
