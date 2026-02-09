# System Architecture

## Overview

Stride is an AI-powered daily planner. Users add tasks and connect Google Calendar; "Plan my day" runs a scheduling engine that places tasks into today's free slots and shows a timeline. MVP is today-only, no calendar cache, manual refresh. See `aiDocs/mvp.md` for scope and timeline.

## High-Level Architecture

- **Frontend**: Next.js app (React, TypeScript, Tailwind); task list, timeline view, "Plan my day" action.
- **API**: Next.js API routes (or standalone Node server); endpoints for tasks, schedule, calendar OAuth callback, and "Plan my day" (trigger engine + persist blocks).
- **Database**: Persist users (for OAuth identity), tasks, scheduled_blocks; no stored calendar events (fetch on demand).
- **Google Calendar**: OAuth 2.0, read-only; fetch today's events when user hits "Plan my day."
- **Scheduling engine**: Pure function or service: inputs = tasks (title, duration, "Do today" flag), today's busy windows, working hours; output = scheduled_blocks + overflow list; greedy placement, "Do today" then list order.

```mermaid
flowchart LR
  User --> Frontend
  Frontend --> API
  API --> Database
  API --> GoogleCalendar
  API --> SchedulingEngine
  SchedulingEngine --> API
```

## Data Flow: Plan my day

1. User clicks "Plan my day."
2. API fetches today's events from Google Calendar.
3. Load tasks from DB.
4. Run scheduling engine (free windows + working hours).
5. Save scheduled_blocks; return timeline + overflow to frontend.

## Key Decisions

- Calendar fetched on demand (no cache).
- Today only for MVP.
- Single calendar provider (Google).
- Auth is calendar OAuth only (no full auth system for MVP).
