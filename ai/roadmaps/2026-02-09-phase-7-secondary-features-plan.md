# Phase 7: Secondary Features - Implementation Plan

**Date:** 2026-02-09
**Phase:** 7 - Secondary Features (Post-MVP)
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-09-phase-7-secondary-features-roadmap.md`
**Previous Phase:** `2026-02-09-phase-6-beta-launch-plan.md`

---

## Clean Code Principles

Avoid over-engineering. Add goals and dynamic updates only as validated by beta feedback. Build the smallest version that delivers value.

---

## Goal

Add P1 features from the MVP doc: goals and dynamic calendar updates. By the end of this phase, users can set goals and the schedule adapts when they finish tasks.

---

## Prerequisites

- Phase 6 complete (beta launched, feedback collected, P1 priorities decided)
- Beta feedback should drive whether goals and/or dynamic updates are built first

---

## 7.1 Goals

### Goal Data Model

- New table or columns: goals (e.g. `goals` table: id, user_id, name, category [professional | academic | social], created_at)
- Link tasks to goals: add `goal_id` (nullable) to `tasks` table

### UI

- Goals management: add, list, edit, delete goals
- When adding/editing a task, optional "Link to goal" dropdown
- Display goal on task card and on timeline block (e.g. badge or color)

### AI Scheduling

- Update scheduling prompt: include user goals and task–goal links
- Instruct AI to prioritize or slot goal-related tasks when possible
- No complex optimization; simple "prefer goal-linked tasks in prime slots" is enough for v1

---

## 7.2 Dynamic Calendar Updates

### Mark Task Done

- Add "Mark done" (checkbox or button) on task and on timeline block
- On mark done: update task (e.g. `completed_at` or `status`) and remove or gray out the scheduled block

### Re-run Placement

- When user marks a task done (or "skip" / "running late"), call scheduling engine with remaining tasks and updated "now" time
- Persist new scheduled_blocks; refresh timeline
- Optional: confirm with user ("Reschedule the rest of the day?") to avoid surprise reshuffles (per PRD: "with user approval")

### Real-time Feel

- Show updated schedule without full page reload (optimistic update or refetch after API success)
- Handle "running late" and "skip task" as input to re-placement (e.g. "user skipped task X, reschedule from now")

---

## 7.3 Refinements (If Validated)

- **Multi-day view:** Tomorrow, this week — only if beta users ask for it
- **Task edit:** In-place edit (title, duration, notes) if "delete + re-add" is a major pain point
- **Calendar event caching:** Short TTL cache for today's events if fetch-on-demand is too slow

Prioritize based on beta feedback; do not build all three unless needed.

---

## Deliverable

Goals and dynamic updates shipped. Users can set goals, link tasks to goals, mark tasks done, and see the rest of the day re-scheduled with user approval.

---

## Acceptance Criteria

- Users can add and manage goals (professional, academic, social)
- Tasks can be linked to a goal
- AI scheduling considers goals (e.g. prioritizes goal-linked tasks)
- "Mark task done" updates task and schedule
- Re-scheduling runs for remaining tasks (with user approval where appropriate)
- Refinements (multi-day, task edit, caching) only if validated by users

---

## Next Phase

**Phase 8:** Scale & Monetization (`2026-02-09-phase-8-scale-monetization-plan.md`)
