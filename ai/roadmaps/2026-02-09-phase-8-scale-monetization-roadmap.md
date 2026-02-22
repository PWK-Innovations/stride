# Phase 8: Scale & Monetization - Roadmap

**Date:** 2026-02-09
**Phase:** 8 - Scale & Monetization (Future)
**Status:** Not started
**Plan:** `2026-02-09-phase-8-scale-monetization-plan.md`
**Previous Phase:** `2026-02-09-phase-7-secondary-features-roadmap.md`

---

## Tasks

### 8.1 Pricing & Billing

- [ ] Define subscription tiers (free, professional, student) in code and DB
- [ ] Enforce free tier limit (e.g. 10 AI schedules/month) in API
- [ ] Integrate Stripe (Checkout or Elements)
- [ ] Store subscription_tier and subscription_id in Supabase (e.g. profiles)
- [ ] Implement Stripe webhooks (created, updated, canceled)
- [ ] Implement student discount (50% off, .edu verification or coupon)
- [ ] Test: signup, upgrade, cancel, webhook sync

### 8.2 Multi-Calendar Support (P1)

- [ ] Choose second provider (Outlook or Apple Calendar)
- [ ] Implement OAuth and token storage per user per provider
- [ ] Fetch events from all connected calendars when building day
- [ ] Merge events into single busy-windows list
- [ ] Show events on timeline (optional source label)
- [ ] Test: two calendars connected, no double-booking

### 8.3 Integrations for Engineers (P1)

- [ ] Choose first integration (Jira, Linear, or GitHub)
- [ ] Implement OAuth/API and import tasks into Stride task list
- [ ] Map external tasks to Stride task model
- [ ] Optional: Focus Time / Deep Work blocking in scheduling
- [ ] Optional: Task chunking (only if validated)
- [ ] Test: import, show in list, build day with imported tasks

### 8.4 Go-to-Market

- [ ] Prepare Product Hunt launch (assets, description)
- [ ] Launch on Product Hunt
- [ ] Set up referral program ("invite a peer" for extended trial)
- [ ] Reddit/community outreach (r/productivity, r/ADHD, r/college, r/cscareerquestions)
- [ ] Create content (blog, YouTube) with PRD positioning

---

## Deliverable

Live product with pricing, key P1 integrations (as prioritized), and GTM in motion.

---

## Acceptance Criteria

- [ ] Billing and tiers working
- [ ] At least one P1 integration (calendar or engineer) shipped
- [ ] Product Hunt and community outreach executed
- [ ] Scope of 8.2–8.4 adjusted based on feedback

---

## Notes

- Prioritize 8.1 (pricing) and 8.4 (launch) first; 8.2 and 8.3 based on user demand.
