# Phase 12: Secondary Features - Implementation Plan

**Date:** 2026-04-01
**Phase:** 12 - Secondary Features (Post-Beta)
**Status:** Not started
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-12-secondary-features-roadmap.md`
**Previous Phase:** `2026-04-01-phase-11-beta-launch-plan.md`

---

## Clean Code Principles

This phase is driven entirely by beta feedback. Do not build features speculatively — every item here should be validated by real user demand from Phase 11. If beta users didn't ask for it, it doesn't get built.

---

## Goal

Add goals, personalization loop, and refinements — driven by beta feedback. These are enhancements that deepen the product for engaged users, not new surface area.

---

## Prerequisites

- Phase 11 complete (beta launched, feedback collected)
- Clear signal from beta users on which features matter most
- Core product (widget + agent + calendar) stable

---

## 12.1 Goals

Users want to connect daily tasks to longer-term objectives. Goals provide that connection and let the agent prioritize accordingly.

- Goal data model — goals table with title, description, target date, status
- Goal UI — create/edit/archive goals from the dashboard
- Link tasks to goals — tasks can optionally reference a goal
- Agent prioritizes goal-linked tasks — when building schedules, the agent weights tasks tied to active goals higher
- Goal progress tracking — simple percentage or task-count-based progress indicator

---

## 12.2 Personalization Loop

The agent gets smarter over time by learning from user behavior patterns.

- Track user patterns — duration accuracy (estimated vs. actual), skip patterns, productive hours, task completion rates
- Store pattern data — `user_patterns` table with rolling aggregates
- Agent auto-adjusts — future schedules informed by learned patterns (e.g., if a user consistently underestimates coding tasks by 30%, the agent buffers accordingly)
- Transparency — show users what the agent learned ("You tend to be most productive 9-11am")
- Opt-out — users can reset or disable personalization

---

## 12.3 Refinements (If Validated)

Only build these if beta users specifically request them:

- Multi-day view — see tomorrow and the rest of the week, not just today
- Task edit — modify existing tasks in place rather than delete + re-add
- Calendar caching — cache calendar events locally to reduce API calls and improve load times
- Additional calendar providers — Apple Calendar (CalDAV) if demand exists

---

## Deliverable

Goals and personalization shipped. Refinements only if validated by beta users.

---

## Acceptance Criteria

- Goals can be created, linked to tasks, and influence agent scheduling
- Personalization loop collects data and visibly adjusts schedules after sufficient usage
- No speculative features — every shipped item traces back to beta feedback
- All existing tests still pass
- Changelog and roadmap updated
