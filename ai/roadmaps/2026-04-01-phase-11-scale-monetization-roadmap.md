# Phase 11: Scale & Monetization - Roadmap

**Date:** 2026-04-01 (renumbered from Phase 9; originally 2026-02-09, updated)
**Phase:** 11 - Scale & Monetization (Future)
**Status:** Not started
**Plan:** `2026-04-01-phase-11-scale-monetization-plan.md`
**Previous Phase:** `2026-04-01-phase-10-secondary-features-roadmap.md`

---

## Tasks

### 11.1 Pricing & Billing

- [ ] Define subscription tiers (free, professional, student) in code and DB
- [ ] Enforce free tier limit (e.g. 10 AI schedules/month, limited chat messages) in API
- [ ] Integrate Stripe (Checkout or Elements)
- [ ] Store subscription_tier and subscription_id in Supabase (profiles)
- [ ] Implement Stripe webhooks (created, updated, canceled)
- [ ] Implement student discount (50% off, .edu verification or coupon)
- [ ] Test: signup, upgrade, cancel, webhook sync

### 11.2 Additional Calendar Providers

- [ ] Evaluate demand for Apple Calendar (CalDAV)
- [ ] Implement if validated (OAuth, token storage in `calendar_tokens`, event fetching)
- [ ] Merge into existing `fetchAllEvents` flow
- [ ] Test: three calendars connected, no double-booking

### 11.3 Integrations

- [ ] Choose first integration based on user feedback (Todoist, Slack, or Jira/Linear/GitHub)
- [ ] Implement OAuth/API and import tasks into Stride task list
- [ ] Map external tasks to Stride task model
- [ ] Test: import, show in list, build day with imported tasks
- [ ] (If Slack) Implement slash command and notifications
- [ ] Ship, collect feedback, then evaluate next integration

### 11.4 Go-to-Market

- [ ] Prepare Product Hunt launch (assets, description)
- [ ] Launch on Product Hunt
- [ ] Set up referral program ("invite a peer" for extended trial)
- [ ] Reddit/community outreach (r/productivity, r/ADHD, r/freelance, r/remotework, r/college)
- [ ] ADHD community outreach (How to ADHD, ADHD Twitter/TikTok)
- [ ] Create content (blog, YouTube) with PRD positioning

---

## Deliverable

Live product with pricing, key integrations (as prioritized), and GTM in motion.

---

## Acceptance Criteria

- [ ] Billing and tiers working
- [ ] At least one integration shipped (if prioritized by feedback)
- [ ] Product Hunt and community outreach executed
- [ ] Scope adjusted based on feedback

---

## Notes

- Prioritize 11.1 (pricing) and 11.4 (launch) first; 11.2 and 11.3 based on user demand.
