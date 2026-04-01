# Phase 7: Agentic AI & Multi-Calendar - Roadmap

**Date:** 2026-04-01
**Phase:** 7 - Agentic AI & Multi-Calendar
**Status:** Not started
**Plan:** `2026-04-01-phase-7-agentic-ai-multi-calendar-plan.md`
**Previous Phase:** `2026-02-23-phase-6-code-quality-security-roadmap.md` (in `complete/`)

---

## Tasks

### 7.1 LangChain Agent Infrastructure

- [ ] Install dependencies: `langchain`, `@langchain/openai`, `@langchain/core`
- [ ] Create `lib/agent/tools.ts` — define agent tools: `getTaskList`, `getCalendarEvents`, `createScheduledBlocks`, `checkForConflicts`, `updateTask`
- [ ] Create `lib/agent/schedulingAgent.ts` — agent executor with system prompt, tool bindings, max iteration guardrail (10)
- [ ] Write system prompt with scheduling rules (working hours, breaks, stability-first, no busy window overlap)
- [ ] Add structured logging for all agent tool calls (input/output)
- [ ] Test: agent can fetch tasks and calendar events via tool calls
- [ ] Test: agent respects max iteration limit

### 7.2 Hybrid Scheduling Architecture

- [ ] Create `lib/agent/constraintSolver.ts` — deterministic time placement function
- [ ] Implement: walk free slots, place tasks in agent-specified order, enforce breaks, snap to 5-min increments
- [ ] Implement overflow handling (tasks that don't fit → overflow array)
- [ ] Implement stability-first rescheduling rules (prefer keeping existing slots, cap change count at 3)
- [ ] Wire constraint solver into agent flow (agent reasons → solver places → agent reviews)
- [ ] Test: solver places tasks without overlaps
- [ ] Test: solver respects working hours and break rules
- [ ] Test: solver handles edge cases (no tasks, no free time, all overflow)
- [ ] Test: stability-first rules prevent cascade reshuffles on retry

### 7.3 Outlook Calendar Integration

- [ ] Register Azure AD app, configure OAuth scopes (`Calendars.Read`, `User.Read`, `offline_access`)
- [ ] Add env vars: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URI`
- [ ] Update `.env.example` with new Microsoft env vars
- [ ] Install `@azure/msal-node`
- [ ] Create `calendar_tokens` table in Supabase (id, user_id, provider, access_token, refresh_token, token_expires_at, timestamps)
- [ ] Add RLS policies on `calendar_tokens` (user can only access own rows)
- [ ] Migrate existing Google tokens from `profiles` columns to `calendar_tokens` rows
- [ ] Remove Google token columns from `profiles` table (after migration verified)
- [ ] Create `GET /api/auth/outlook` — redirect to Microsoft OAuth
- [ ] Create `GET /api/auth/outlook/callback` — exchange code, store tokens, redirect to `/app`
- [ ] Create `lib/outlook/refreshAccessToken.ts`
- [ ] Create `lib/outlook/fetchTodaysEvents.ts` — call Microsoft Graph API, return `BusyWindow[]`
- [ ] Create `lib/calendar/fetchAllEvents.ts` — fetch from all connected providers in parallel, merge into single `BusyWindow[]`
- [ ] Update Google Calendar helpers to read tokens from `calendar_tokens` instead of `profiles`
- [ ] Update dashboard: "Connect Outlook Calendar" button, per-provider connection status
- [ ] Test: Outlook OAuth flow end-to-end (connect, fetch events)
- [ ] Test: Google + Outlook events merge correctly
- [ ] Test: existing Google-only flow still works after migration

### 7.4 Agent-Powered "Build My Day"

- [ ] Update `POST /api/schedule/build` to use LangChain agent instead of direct OpenAI call
- [ ] Maintain same API response shape (schedule + overflow) for frontend compatibility
- [ ] Wire `retry` flag to pass existing schedule as agent context
- [ ] Create `POST /api/agent/schedule` — SSE streaming endpoint for agent progress
- [ ] Implement SSE event types: `thinking`, `tool_call`, `result`, `error`
- [ ] Update dashboard: show streaming agent progress during "Build my day"
- [ ] Add collapsible "see what the AI is doing" section (optional detail view)
- [ ] Test: full "Build my day" flow with agent (Google-only, Outlook-only, both)
- [ ] Test: retry produces different but reasonable schedules
- [ ] Test: streaming endpoint delivers progress events correctly
- [ ] Test: graceful fallback if SSE connection fails
- [ ] Verify all existing integration tests pass with new agent backend

---

## Deliverable

"Build my day" powered by LangChain agent with hybrid architecture (LLM reasoning + deterministic solver). Google and Outlook Calendar both supported. Streaming shows agent progress.

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] Agent builds schedules correctly from tasks + multi-calendar events
- [ ] Constraint solver produces conflict-free schedules
- [ ] Outlook OAuth and event fetching works end-to-end
- [ ] Streaming shows meaningful progress to user
- [ ] No regressions in existing functionality

---

## Next Phase

**Phase 8:** Chat Modal & Dynamic Updates (`2026-04-01-phase-8-chat-modal-dynamic-updates-roadmap.md`)
