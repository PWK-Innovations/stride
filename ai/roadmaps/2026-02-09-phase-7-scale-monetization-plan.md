# Phase 7: Scale & Monetization - Implementation Plan

**Date:** 2026-02-09  
**Phase:** 7 - Scale & Monetization (Future)  
**Status:** Not started  
**Parent Plan:** `2026-02-09-stride-implementation-plan.md`  
**Roadmap:** `2026-02-09-phase-7-scale-monetization-roadmap.md`  
**Previous Phase:** `2026-02-09-phase-6-secondary-features-plan.md`

---

## Clean Code Principles

Avoid over-engineering. Implement pricing and integrations only when product–market fit is clear. Keep billing and GTM simple at first.

---

## Goal

Prepare for broader launch: pricing (free tier, professional, student discount), optional multi-calendar and engineer integrations, and go-to-market execution. See `aiDocs/prd.md` for pricing and GTM strategy.

---

## Prerequisites

- Phase 6 complete (goals, dynamic updates shipped)
- Clear signal from beta/usage that users will pay
- Decision on which P1 integrations to build first (Outlook/Apple vs. Jira/Linear/GitHub)

---

## 7.1 Pricing & Billing

- **Free tier:** Limit AI schedules (e.g. 10/month); enforce in API when calling OpenAI.
- **Professional:** $12–15/mo via Stripe (subscription); unlock unlimited AI scheduling, full features.
- **Student discount:** 50% off with .edu (or similar) verification; apply at checkout or via coupon.
- Payment flow: Stripe Checkout or Elements; store subscription status in Supabase (e.g. `profiles.subscription_tier`, `subscription_id`).
- Webhooks: handle subscription created/updated/canceled; keep Supabase in sync.

---

## 7.2 Multi-Calendar Support (P1)

- Add Outlook and/or Apple Calendar OAuth and event fetch (similar to Google).
- Store tokens per user per provider in Supabase.
- When building the day, fetch events from all connected calendars; merge into single busy-windows list.
- Timeline shows events from all calendars (optionally with source label).

---

## 7.3 Integrations for Engineers (P1)

- **Jira / Linear / GitHub:** Import tasks (e.g. "My issues" or "Sprint tasks") into Stride task list; map to Stride task model; optional sync (one-way or periodic).
- **Focus Time / Deep Work:** Allow user to block large time blocks as "focus"; scheduling engine avoids or respects these.
- **Task chunking:** Option to break large tasks into smaller blocks (e.g. 2h task → 4×30min); implement only if validated.

Prioritize based on user segment (engineers vs. students vs. professionals).

---

## 7.4 Go-to-Market

- **Product Hunt:** Prepare launch (assets, description, timing).
- **Communities:** Reddit (r/productivity, r/ADHD, r/college, r/cscareerquestions); referral loop ("invite a peer" for extended trial).
- **Content:** Blog posts, YouTube demos; positioning per PRD (Cognitive Orthotic, Deep Work Defense, Digital Executive Assistant).

---

## Deliverable

Stride is live, monetized, and growing. Pricing and key P1 integrations (per feedback) are in place; GTM is executing.

---

## Acceptance Criteria

- [ ] Free tier and professional tier implemented and enforced
- [ ] Student discount available and verified
- [ ] Stripe (or chosen provider) integrated; webhooks update Supabase
- [ ] At least one additional calendar or engineer integration shipped (if prioritized)
- [ ] Product Hunt launch and community outreach started
- [ ] Positioning and messaging aligned with PRD

---

## Notes

- Phase 7 is "future"; scope and order of 7.2–7.4 should be driven by beta and early revenue feedback.
- Avoid building all integrations at once; ship one, learn, then next.
