# Phase 2: PWA & Hosting - Roadmap

**Date:** 2026-02-09
**Phase:** 2 - PWA & Hosting
**Status:** Not started
**Plan:** `2026-02-09-phase-2-pwa-hosting-plan.md`
**Previous Phase:** `2026-02-09-phase-1-frontend-layout-roadmap.md`

---

## Tasks

### 2.1 Vercel Deployment

- [ ] Connect Stride GitHub repo to Vercel
- [ ] Configure framework preset (Next.js)
- [ ] Set up environment variables in Vercel dashboard
- [ ] Trigger first deployment
- [ ] Verify build succeeds
- [ ] Verify HTTPS is active on the Vercel URL
- [ ] Test sign up / sign in on the live URL
- [ ] Verify Supabase connection works in production

### 2.2 PWA Setup

- [x] Create `public/manifest.json` (name, icons, theme, display: standalone)
- [ ] Create app icons (192x192, 512x512)
- [x] Link manifest in `app/layout.tsx`
- [x] Create `public/sw.js` (minimal service worker, cache static assets)
- [x] Register service worker in `app/layout.tsx`

### 2.3 PWA Testing

- [ ] Test on iOS: Safari → Share → Add to Home Screen
- [ ] Test on Android: Chrome → Menu → Install app
- [ ] Verify standalone mode (no browser chrome)
- [ ] Verify icon and name are correct
- [ ] Verify theme color is applied

---

## Deliverable

App deployed to Vercel with HTTPS. PWA installable and tested on real devices.

---

## Acceptance Criteria

- [ ] App is live on Vercel with HTTPS
- [ ] All environment variables configured
- [ ] PWA manifest and service worker registered
- [ ] App installable on at least one device
- [ ] Standalone mode works (no browser chrome)
- [ ] Icon and name correct

---

## Next Phase

**Phase 3:** Core Data Flow (`2026-02-09-phase-3-core-data-flow-roadmap.md`)
