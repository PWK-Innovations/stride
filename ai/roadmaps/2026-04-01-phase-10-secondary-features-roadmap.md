# Phase 10: Secondary Features - Roadmap

**Date:** 2026-04-01 (renumbered from Phase 8; originally 2026-02-09, reconciled)
**Phase:** 10 - Secondary Features (Post-Beta)
**Status:** Not started
**Plan:** `2026-04-01-phase-10-secondary-features-plan.md`
**Previous Phase:** `2026-04-01-phase-9-beta-launch-roadmap.md`

---

## Tasks

### 10.1 Goals

- [ ] Create `goals` table in Supabase (id, user_id, name, category, timestamps)
- [ ] Add RLS policies on `goals`
- [ ] Add `goal_id` (nullable FK) to `tasks` table
- [ ] Create API routes: goals CRUD
- [ ] Create goals UI (add, list, edit, delete)
- [ ] Add "Link to goal" dropdown to task form
- [ ] Show goal badge on task card and timeline block (color-coded)
- [ ] Update agent system prompt to include goals and task-goal links
- [ ] Test: goals affect task placement (goal-linked tasks in better slots)

### 10.2 Personalization Loop

- [ ] Design `user_patterns` table or metadata schema
- [ ] Track duration accuracy (estimated vs. actual per task type)
- [ ] Track skip/defer patterns (which tasks, what time of day)
- [ ] Track working hour preferences (actual start/stop times)
- [ ] Feed pattern data into agent system prompt
- [ ] Implement duration auto-padding (agent adjusts for users who underestimate)
- [ ] Implement time-of-day preferences (avoid scheduling in historically skipped windows)
- [ ] Add "View my patterns" UI (optional)
- [ ] Add "Clear pattern data" option for privacy
- [ ] Test: agent adapts scheduling based on accumulated pattern data

### 10.3 Refinements (If Validated)

- [ ] Multi-day view (only if beta feedback supports it)
- [ ] Task edit (only if delete + re-add is a major pain)
- [ ] Calendar event caching (only if fetch-on-demand is too slow)

---

## Deliverable

Goals and personalization loop shipped. Refinements only if validated.

---

## Acceptance Criteria

- [ ] All 10.1 and 10.2 tasks checked off
- [ ] Goals and personalization work end-to-end
- [ ] Agent adapts based on user patterns
- [ ] Refinements deferred or implemented based on feedback

---

## Next Phase

**Phase 11:** Scale & Monetization (`2026-04-01-phase-11-scale-monetization-roadmap.md`)
