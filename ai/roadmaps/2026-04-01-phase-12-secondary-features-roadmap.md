# Phase 12: Secondary Features - Roadmap

**Date:** 2026-04-01
**Phase:** 12 - Secondary Features (Post-Beta)
**Status:** Not started
**Plan:** `2026-04-01-phase-12-secondary-features-plan.md`
**Previous Phase:** `2026-04-01-phase-11-beta-launch-roadmap.md`

---

## Tasks

### 12.1 Goals

- [ ] Create `goals` table (id, user_id, title, description, target_date, status, created_at)
- [ ] Create Goal CRUD API routes (`app/api/goals/`)
- [ ] Build goal creation/edit UI on dashboard
- [ ] Add goal selector to task creation flow (optional link)
- [ ] Update agent system prompt to prioritize goal-linked tasks
- [ ] Add goal progress indicator (task completion count or percentage)
- [ ] Test goal-linked scheduling end-to-end

### 12.2 Personalization Loop

- [ ] Create `user_patterns` table (user_id, pattern_type, value, sample_size, updated_at)
- [ ] Track duration accuracy — compare estimated vs. actual task durations
- [ ] Track productive hours — when users complete tasks most efficiently
- [ ] Track skip patterns — which task types get skipped or deferred most
- [ ] Feed pattern data into agent scheduling decisions
- [ ] Add "What the agent learned" summary in user profile or settings
- [ ] Add opt-out / reset personalization option
- [ ] Test that personalization improves schedule quality over baseline

### 12.3 Refinements (If Validated)

- [ ] Multi-day view — only if beta users requested it
- [ ] Task edit — only if beta users requested it
- [ ] Calendar caching — only if performance is a validated pain point
- [ ] Apple Calendar (CalDAV) — only if demand exists

---

## Acceptance Criteria

- [ ] All 12.1 and 12.2 tasks complete
- [ ] Every shipped feature traces back to documented beta feedback
- [ ] All existing tests still pass (`npm run test:all`)
- [ ] `aiDocs/changelog.md` updated
- [ ] Roadmap tasks checked off
