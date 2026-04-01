# Phase 11: Scale & Monetization - Implementation Plan

**Date:** 2026-04-01 (renumbered from Phase 9; originally 2026-02-09, updated)
**Phase:** 11 - Scale & Monetization (Future)
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-04-01-phase-11-scale-monetization-roadmap.md`
**Previous Phase:** `2026-04-01-phase-10-secondary-features-plan.md`

---

## Clean Code Principles

Avoid over-engineering. Implement pricing and integrations only when product-market fit is clear. Keep billing and GTM simple at first.

---

## Goal

Prepare for broader launch: pricing (free tier, professional, student discount), additional integrations, and go-to-market execution. See `aiDocs/prd.md` for pricing and GTM strategy.

---

## Prerequisites

- Phase 10 complete (goals, personalization shipped)
- Clear signal from beta/usage that users will pay
- Decision on which integrations to build first

---

## 11.1 Pricing & Billing

- **Free tier:** Limit AI schedules (e.g. 10/month) and chat messages; enforce in API.
- **Professional:** $12-15/mo via Stripe (subscription); unlock unlimited AI scheduling, agent chat, full features.
- **Student discount:** 50% off with .edu (or similar) verification; apply at checkout or via coupon.
- Payment flow: Stripe Checkout or Elements; store subscription status in Supabase (e.g. `profiles.subscription_tier`, `subscription_id`).
- Webhooks: handle subscription created/updated/canceled; keep Supabase in sync.

---

## 11.2 Additional Calendar Providers

- Add Apple Calendar support (CalDAV) if users request it.
- Store tokens in `calendar_tokens` table (same schema from Phase 7).
- Merge events from all connected providers via `lib/calendar/fetchAllEvents.ts`.

---

## 11.3 Integrations

Prioritize based on user feedback:

- **Todoist:** Import tasks from Todoist into Stride task list via Todoist REST API. One-way sync (Todoist → Stride). Map Todoist projects to Stride goals if goals exist.
- **Slack:** Slash command (`/stride what's next`), notifications when schedule changes, link to open Stride. Slack App API.
- **Jira / Linear / GitHub:** Import assigned issues as Stride tasks. Optional periodic sync.

Build one integration at a time. Ship, learn, then next.

---

## 11.4 Go-to-Market

- **Product Hunt:** Prepare launch (assets, description, timing). Lead with the conversational agent angle.
- **Communities:** Reddit (r/productivity, r/ADHD, r/freelance, r/remotework, r/college, r/cscareerquestions); ADHD communities (How to ADHD, ADHD Twitter/TikTok); freelancer communities (Indie Hackers, freelance Slack groups).
- **Referral:** "Invite a peer" for extended trial.
- **Content:** Blog posts, YouTube demos. Positioning per PRD: "Cognitive Orthotic" for ADHD, "Always-On Scheduling Assistant" for freelancers, "Deep Work Defense" for developers.

---

## Deliverable

Stride is live, monetized, and growing. Pricing and key integrations (per feedback) are in place; GTM is executing.

---

## Acceptance Criteria

- Free tier and professional tier implemented and enforced
- Student discount available and verified
- Stripe integrated; webhooks update Supabase
- At least one additional integration shipped (if prioritized)
- Product Hunt launch and community outreach started

---

## Notes

- Scope of 11.2-11.4 should be driven by beta and early revenue feedback.
- Avoid building all integrations at once; ship one, learn, then next.
