# Phase 8: Secondary Features - Roadmap

**Date:** 2026-02-09
**Phase:** 8 - Secondary Features (Post-MVP)
**Status:** Not started
**Plan:** `2026-02-09-phase-8-secondary-features-plan.md`
**Previous Phase:** `2026-02-09-phase-7-beta-launch-roadmap.md`

---

## Tasks

### 8.1 Goals

- [ ] Design goals data model (table or columns)
- [ ] Add `goal_id` to tasks (nullable FK)
- [ ] Create API routes: goals CRUD
- [ ] Create goals UI (add, list, edit, delete)
- [ ] Add "Link to goal" to task form
- [ ] Show goal on task card and timeline block
- [ ] Update AI scheduling prompt to include goals and task–goal links
- [ ] Test: goals affect placement (e.g. goal-linked tasks in better slots)

### 8.2 Dynamic Calendar Updates

- [ ] Add "Mark done" to task and timeline block
- [ ] Persist completion (e.g. completed_at, status)
- [ ] On mark done: remove or gray out block; optionally trigger re-schedule
- [ ] API route or flow: re-run scheduling for remaining tasks from "now"
- [ ] Add user approval step for re-schedule ("Reschedule the rest of the day?")
- [ ] Handle "skip task" and "running late" as inputs to re-placement
- [ ] Refresh timeline after re-schedule (no full reload)
- [ ] Test full flow: mark done → confirm re-schedule → see updated day

### 8.3 Refinements (If Validated)

- [ ] Multi-day view (only if beta feedback supports it)
- [ ] Task edit (only if delete + re-add is a major pain)
- [ ] Calendar event caching (only if fetch-on-demand is too slow)

---

## Deliverable

Goals and dynamic updates (mark done, re-schedule) shipped. Refinements only if validated.

---

## Acceptance Criteria

- [ ] All 8.1 and 8.2 tasks checked off
- [ ] Goals and dynamic updates work end-to-end
- [ ] Re-scheduling has user approval where specified
- [ ] Refinements deferred or implemented based on feedback

---

## Next Phase

**Phase 9:** Scale & Monetization (`2026-02-09-phase-9-scale-monetization-roadmap.md`)
