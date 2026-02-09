# AI-Powered Daily Planner — Implementation Roadmap (2025-02-09)

This roadmap translates the product requirements in [`ai/prd.md`] into an actionable engineering plan. The goal is to build an **active daily planning system** that constructs a realistic schedule, reduces decision fatigue, and dynamically adapts when the day changes.

## Scope and guiding principles

- **In scope (from PRD P0/P1/P2)**:
  - Automated daily schedule construction
  - Dynamic re-scheduling
  - Calendar integration
  - Goal incorporation, break preservation, task prompts
  - Priority adjustment and decision-fatigue reduction
- **Out of scope (from PRD)**:
  - Manual-only planning tools
  - “Container-only” notes/to-do storage without scheduling automation
  - Analog/physical workflows
- **Primary success measures (from PRD)**:
  - **Automation adoption**: meaningful reduction in time spent planning (vs 10% baseline)
  - **Retention**: users return regularly to plan their days
  - **Reliability**: accurate calendar syncing + scheduling durations that match reality

---

## 1) Work breakdown (what needs to be done)

### Milestone 1 — Foundation (tasks, deadlines, meetings as first-class data)

**Deliverables**

- **Core data model**
  - Tasks: title, notes, duration estimate, priority, deadline/due date, constraints (earliest start, latest end), energy/focus requirement (optional), tags/goals (optional)
  - Calendar events: external event id, start/end, all-day flag, time zone, organizer/metadata needed for display
  - Planned blocks (schedule output): references to tasks/goals/breaks, start/end, “locked” vs “flexible”, provenance (“auto” vs “manual”)
- **Storage layer**
  - CRUD for tasks and planned blocks
  - Clear separation between synced external calendar events and app-generated schedule blocks
- **Basic UX**
  - View/edit tasks (name, duration, deadline, priority)
  - View “Today” schedule (even if initially manual or empty output)

**Acceptance criteria**

- A user can create tasks with deadlines and see them persisted.
- Calendar events can be represented in the system (even before full sync).
- There is a stable internal representation for “planned schedule blocks.”

---

### Milestone 2 — Core automation + calendar integration (P0)

**Deliverables**

- **Calendar integration (initial provider)**
  - OAuth 2.0 connection
  - Read calendar events for a date range
  - Free/busy computation for a given day
  - Sync reliability primitives: retries/backoff, incremental sync token (if supported), or time-window polling
- **Automated daily schedule construction (P0)**
  - Scheduling engine v1 (single-day): takes tasks + constraints + calendar busy windows and outputs planned blocks
  - Placement rules:
    - Never overlap calendar busy events
    - Prefer earliest feasible placement for near deadlines
    - Honor “minimum break” rules (if introduced early) or at least don’t fully saturate the day
  - Conflict detection and reporting (e.g., “not enough time to fit all tasks today”)

**Acceptance criteria**

- For a given date, the system reads external calendar events and identifies open time slots.
- Given a set of tasks, the engine produces a reasonable, non-overlapping daily schedule.
- If the day is overloaded, the system degrades gracefully (flags overflow items).

---

### Milestone 3 — Dynamic re-scheduling + feedback loops (P0)

**Deliverables**

- **Dynamic re-scheduling (P0)**
  - Detect schedule drift:
    - meeting runs late
    - user starts a task late
    - calendar events added/removed/shifted
  - Re-scheduling engine v2:
    - preserves completed blocks
    - moves remaining tasks into next viable slots
    - respects “locked” blocks (manual pins or externally fixed events)
    - avoids thrash (don’t reshuffle everything on minor changes)
- **Feedback loop for duration realism**
  - Capture actual vs planned:
    - start/stop times or “took X minutes” quick capture
  - Improve future estimates:
    - per-task-type or per-user heuristic (e.g., rolling average)
  - Use feedback to prevent overload:
    - buffer time when user tends to overrun

**Acceptance criteria**

- If a calendar event changes, the schedule updates quickly and predictably.
- Users can trust that the schedule won’t become unrealistic after changes.
- The system gradually improves duration accuracy with use.

---

### Milestone 4 — Personalization + optimization (P1/P2)

**Deliverables**

- **Goals (P1)**
  - Goal definitions (categories: professional/academic/social)
  - Mapping tasks to goals
  - Daily plan includes goal-relevant tasks or goal blocks
- **Break preservation (P1)**
  - Configurable rules (e.g., short breaks after focus blocks, lunch window)
  - Maintain flexibility (leave whitespace / buffer blocks)
- **Task prompts (P1)**
  - “What should I do now?” prompt based on the schedule and current time
  - Handling of “I can’t do this task now” → next best suggestion
- **Priority adjustment (P2)**
  - Urgency signals (deadline proximity, missed tasks, goal commitments)
  - Simple user inputs (“make this more important”) that update the next schedule run
- **Decision-fatigue reduction (P2)**
  - Default plan generation without drag-and-drop
  - Minimal user choices to keep the plan accurate (confirm, postpone, swap)

**Acceptance criteria**

- The schedule consistently includes breaks and buffers.
- Users receive actionable next-task prompts that reduce context switching.
- Priorities adjust sensibly with deadlines and user intent.

---

### Cross-cutting work (throughout)

- **Onboarding** (PRD risk mitigation): connect calendar, add first tasks, quick defaults for duration and breaks
- **Observability**: logging/metrics for sync failures and scheduling runs (duration, success/failure)
- **Safety rails**: explainability (“why this task is here”) to build trust

---

## 2) Implementation approach (how it will be done)

### Architectural approach (high-level)

- **Domain-first modeling**: define clear domain objects (Task, CalendarEvent, PlannedBlock, Goal) and keep scheduling logic independent of UI.
- **Adapter pattern for calendars**: implement one provider first (recommend: Google Calendar), behind a provider interface so new providers can be added later.
- **Scheduling engine iteration**:
  - v1: single-day placement from free/busy + tasks
  - v2: re-scheduling with preservation rules and minimal churn
  - v3: incorporate breaks, goals, priority dynamics, and buffers

### Scheduling engine (algorithm strategy)

Start simple and evolve, keeping behavior deterministic and debuggable:

- **Inputs**
  - Day window(s): working hours + any user constraints
  - Busy windows: external events (and optionally locked blocks)
  - Task set: duration estimate, priority, deadline, constraints
  - Policy: break rules, buffers, goal weighting (later)
- **Output**
  - Ordered list of PlannedBlocks with start/end + reason metadata

**Phase 1 (v1)**

- Compute free windows (subtract busy windows from day window).
- Sort tasks by:
  - deadline proximity first (if present)
  - then user priority
  - then duration/fit
- Greedy placement into earliest fitting free window.
- Produce overflow list for tasks that don’t fit.

**Phase 2 (v2)**

- When changes occur:
  - freeze completed blocks
  - keep locked blocks fixed
  - re-run placement for remaining tasks starting “now”
- Add “stability heuristics”:
  - prefer keeping tasks in the same relative order unless necessary
  - only move tasks impacted by conflicts

**Phase 3 (v3)**

- Add breaks/buffers as constraints and generated blocks.
- Blend goals into ranking (e.g., add goal-weighted tasks into candidate set).

### Calendar sync strategy

- **MVP**: polling-based refresh + manual “refresh calendar” button for reliability.
- **Next**: webhooks/push notifications if provider supports it.
- **Resilience**:
  - exponential backoff on API errors
  - visible “sync status” to the user
  - graceful fallbacks when sync is stale (warn + use last known state)

---

## 3) Technical considerations

### Reliability and correctness (trust is the product)

- **Calendar syncing**:
  - handle rate limits and transient failures
  - ensure incremental updates don’t miss changes
  - store sync cursors/tokens where possible
- **Time zones & event types**:
  - all-day events vs timed events
  - daylight saving transitions
  - recurring events expansion strategy (provider-dependent)

### Re-scheduling triggers and behavior

- **Triggers**
  - calendar changed (event added/moved/extended)
  - user indicates “running late” / “start now”
  - task completion recorded (early/late)
- **Avoid thrash**
  - debounce rapid change streams
  - prefer minimal edits to the schedule
  - expose manual pin/lock to protect critical blocks

### Duration estimation and feedback loops

- **Initial estimates**
  - user-provided default (e.g., 30m) + per-task overrides
- **Learning**
  - store actual durations
  - maintain rolling averages per user and optionally per tag/category
- **Practical buffers**
  - add a small buffer between blocks when overrun risk is high

### Explainability and UX

- Show “why” a block was placed:
  - “deadline today”
  - “only available 45m slot”
  - “goal: academics”
- Communicate overload:
  - provide options: defer, split, reduce scope, move to tomorrow

### Performance assumptions

- Typical daily event counts are small, but worst-case schedules need to remain responsive.
- Target scheduling run time: fast enough to feel instant on a single day (sub-second to a few seconds depending on platform).

---

## 4) Dependencies and prerequisites

### External dependencies

- **Calendar provider access**
  - Google Cloud project (if using Google Calendar)
  - OAuth consent screen + credentials
  - Required scopes (start read-only; add write only if needed later)
- **Authentication**
  - User identity system to associate calendar tokens and data
  - Secure token storage and rotation strategy

### Internal prerequisites and sequencing

- **Milestone 1 → Milestone 2**: stable data model + storage required before scheduling engine outputs can be persisted.
- **Milestone 2 → Milestone 3**: reliable calendar sync + deterministic schedule builder needed before dynamic re-scheduling can be trusted.
- **Milestone 3 → Milestone 4**: feedback and re-scheduling stability should exist before adding goal/break optimization.

### Operational prerequisites

- Monitoring/alerting for:
  - calendar sync failures
  - scheduling run failures
  - unusually slow schedule builds

---

## Risks and mitigations (from PRD)

- **Risk: unrealistic plans / overload**
  - **Mitigation**: feedback loops, buffers, break rules, overload detection with clear user choices
- **Risk: calendar sync issues cause inaccurate plans**
  - **Mitigation**: robust API integration, retries/backoff, sync status indicators, incremental updates
- **Risk: setup too difficult; users keep planning manually**
  - **Mitigation**: streamlined onboarding, defaults for durations/breaks, “best time selection” automation from day one

