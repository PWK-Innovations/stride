# Phase 10: Secondary Features - Implementation Plan

**Date:** 2026-04-01 (renumbered from Phase 8; originally 2026-02-09, reconciled)
**Phase:** 10 - Secondary Features (Post-Beta)
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-04-01-phase-10-secondary-features-roadmap.md`
**Previous Phase:** `2026-04-01-phase-9-beta-launch-plan.md`

---

## Clean Code Principles

Avoid over-engineering. Add features only as validated by beta feedback. Build the smallest version that delivers value.

---

## Goal

Add secondary features validated by beta users: goals, personalization loop, and refinements. Dynamic calendar updates (mark done, running late, skip) are already handled by the Phase 8 chat modal and quick-actions — this phase focuses on what remains.

---

## Prerequisites

- Phase 9 complete (beta launched, feedback collected, priorities decided)
- Beta feedback should drive which features are built and in what order

---

## 10.1 Goals

### Goal Data Model

- New `goals` table: id, user_id, name, category (professional | academic | social | health), created_at, updated_at
- Add `goal_id` (nullable FK) to `tasks` table
- RLS: users can only access their own goals

### UI

- Goals management: add, list, edit, delete goals
- When adding/editing a task, optional "Link to goal" dropdown
- Display goal badge on task card and timeline block (color-coded by category)

### AI Scheduling

- Update agent system prompt: include user goals and task-goal links
- Agent prioritizes goal-linked tasks in prime slots (morning focus time, after breaks)
- No complex optimization; simple "prefer goal-linked tasks in better slots" is enough for v1

---

## 10.2 Personalization Loop

### Usage Pattern Tracking

- Track per-user patterns over time:
  - Average actual duration vs. estimated duration per task type
  - Which tasks get skipped or deferred most often
  - Preferred working hours (when do they actually start/stop)
  - Morning vs. afternoon productivity signals (based on completion patterns)
- Store as aggregated stats in a `user_patterns` table or as metadata on `profiles`

### Agent Adaptation

- Feed pattern data into the agent's system prompt when building schedules
- Agent auto-pads durations if user consistently underestimates (e.g., "this user's deep work tasks typically take 20% longer")
- Agent avoids scheduling important tasks in time windows the user historically skips
- Build incrementally — start with duration adjustment, add time-of-day preferences after

### Privacy

- All pattern data stored per-user in Supabase with RLS
- Users can view and clear their pattern data
- No cross-user data sharing

---

## 10.3 Refinements (If Validated)

- **Multi-day view:** Tomorrow, this week — only if beta users ask for it
- **Task edit:** In-place edit (title, duration, notes) if "delete + re-add" is a major pain
- **Calendar event caching:** Short TTL cache for today's events if fetch-on-demand is too slow

Prioritize based on beta feedback; do not build all three unless needed.

---

## Deliverable

Goals and personalization loop shipped. Refinements only if validated by beta users.

---

## Acceptance Criteria

- Users can add and manage goals (professional, academic, social, health)
- Tasks can be linked to a goal
- Agent scheduling considers goals (prioritizes goal-linked tasks)
- Personalization loop tracks user patterns and adapts scheduling
- Users can view and clear their pattern data
- Refinements deferred or implemented based on feedback

---

## Next Phase

**Phase 11:** Scale & Monetization (`2026-04-01-phase-11-scale-monetization-plan.md`)
