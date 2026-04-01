# Phase 7: Agentic AI & Multi-Calendar - Implementation Plan

**Date:** 2026-04-01
**Phase:** 7 - Agentic AI & Multi-Calendar
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-04-01-phase-7-agentic-ai-multi-calendar-roadmap.md`
**Previous Phase:** `2026-02-23-phase-6-code-quality-security-plan.md` (in `complete/`)
**Context:** `ai/notes/feedback-discussion.md` — cofounder pivot decisions driving this phase

---

## Clean Code Principles

Avoid over-engineering. Build the agent with the minimum viable tools first. Don't build every possible tool — start with what "Build my day" needs and expand in Phase 8. No premature abstractions around the constraint solver; keep it simple until complexity is justified.

---

## Goal

Replace the current single-shot OpenAI scheduling call with a LangChain-powered agentic system that reasons through multi-step scheduling decisions. Add Outlook Calendar as a second provider. By the end of this phase, "Build my day" is powered by an agent that fetches tasks, reads calendars (Google + Outlook), reasons about priorities, and uses a deterministic solver for time placement.

---

## Prerequisites

- Phase 6 complete (CLI testing, structured logging, security hardening)
- OpenAI API key (already have)
- Microsoft Azure AD app registration (needed for Outlook OAuth)

---

## 7.1 LangChain Agent Infrastructure

### Dependencies

Install required packages:
- `langchain` — core framework
- `@langchain/openai` — OpenAI LLM integration
- `@langchain/core` — base abstractions (tools, messages, prompts)

### Agent Tools

Define LangChain tools wrapping existing functionality. Each tool is a function the agent can call:

- `getTaskList` — Queries Supabase for the user's tasks. Returns task array (title, duration, notes, photo_url).
- `getCalendarEvents` — Fetches today's events from all connected calendar providers (Google and/or Outlook). Merges into a single busy-windows array. Wraps existing `fetchTodaysEvents` + new Outlook equivalent.
- `createScheduledBlocks` — Takes the constraint solver's output and writes scheduled_blocks to Supabase. Deletes existing blocks for today first (same as current behavior).
- `checkForConflicts` — Given a proposed schedule, validates no overlaps with busy windows or between tasks. Returns conflicts if any.
- `updateTask` — Marks a task as completed or updates its status in Supabase.

### Agent Executor

Create the agent executor in `lib/agent/schedulingAgent.ts`:
- System prompt defining the agent's role, rules, and available tools
- Rules baked into the prompt: respect working hours, enforce breaks between tasks, stability-first rescheduling, never schedule during busy windows
- Max iterations: 10 (prevent runaway loops)
- Use `AgentExecutor` from LangChain with `returnIntermediateSteps: true` for debugging/logging
- All agent actions logged via structured logger

### Guardrails

- Max 10 iterations per agent run
- Agent cannot write to Google/Outlook Calendar (read-only)
- Agent scoped to today's data only
- All tool calls logged with input/output for debugging
- If agent exceeds max iterations, return best-effort schedule with warning

---

## 7.2 Hybrid Scheduling Architecture

### Deterministic Constraint Solver

Create `lib/agent/constraintSolver.ts` — a pure function (no LLM) that handles time placement:

Inputs:
- Task list with priorities/ordering from the agent's reasoning
- Busy windows (merged from all calendar providers)
- Working hours (start/end)
- Current time (for mid-day scheduling)
- Break duration between tasks (default 10 minutes)

Logic:
- Walk through free time slots in order
- Place tasks in the order the agent specified (agent decides priority, solver decides exact times)
- Enforce no overlaps with busy windows
- Enforce break rules between consecutive tasks
- If a task doesn't fit in any remaining slot, add to overflow
- Snap to 5-minute increments (matching existing drag-to-reschedule behavior)

Outputs:
- `scheduledBlocks[]` — each with taskId, title, startTime, endTime
- `overflow[]` — tasks that couldn't fit
- `conflicts[]` — any issues detected

This is the key architectural decision: the LLM never does time math. The agent decides WHAT to schedule and in WHAT ORDER; the solver decides WHERE each block goes.

### Stability-First Rescheduling

When rescheduling (not initial build), the solver has additional rules:
- Prefer keeping already-scheduled tasks in their current slots
- Only move tasks if absolutely necessary (conflict with new event, completed task freed a slot)
- Prefer cutting/deferring low-priority tasks over cascading moves
- Track a "change count" — if more than 3 tasks would move, flag for user confirmation

### Integration with Agent

The agent calls the constraint solver as its final step after reasoning about task ordering. The flow:
1. Agent fetches tasks + calendar events (tool calls)
2. Agent reasons about priority ordering, dependencies, and any special instructions from task notes
3. Agent passes ordered task list to constraint solver
4. Solver returns scheduled blocks + overflow
5. Agent reviews the result — if overflow exists, agent reasons about what to suggest deferring
6. Agent calls `createScheduledBlocks` to persist

---

## 7.3 Outlook Calendar Integration

### Azure AD Setup

- Register app in Azure AD portal (Microsoft Entra)
- Configure OAuth 2.0 with scopes: `Calendars.Read`, `User.Read`, `offline_access`
- Set redirect URI to `/api/auth/outlook/callback`
- Store credentials as env vars: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URI`

### Database Schema Update

Replace per-provider columns on `profiles` with a new `calendar_tokens` table:
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `provider` (text: 'google' | 'outlook')
- `access_token` (text)
- `refresh_token` (text)
- `token_expires_at` (timestamptz)
- `created_at`, `updated_at`
- Unique constraint on (user_id, provider)
- RLS: users can only read/write their own rows

Migrate existing Google tokens from `profiles` columns to `calendar_tokens` rows. Remove Google token columns from `profiles` after migration.

### OAuth Flow

Create two new API routes:
- `GET /api/auth/outlook` — Redirects to Microsoft login with required scopes
- `GET /api/auth/outlook/callback` — Exchanges code for tokens, stores in `calendar_tokens`, redirects to `/app`

Install `@azure/msal-node` for Microsoft OAuth handling.

### Fetch Events

Create `lib/outlook/fetchTodaysEvents.ts`:
- Read tokens from `calendar_tokens` where provider = 'outlook'
- Refresh token if expired (Microsoft Graph refresh flow)
- Call Microsoft Graph API: `GET /me/calendarview?startDateTime=...&endDateTime=...`
- Parse response into same `BusyWindow` format as Google events

Create `lib/outlook/refreshAccessToken.ts`:
- POST to Microsoft token endpoint with refresh_token
- Update tokens in `calendar_tokens`

### Merged Calendar Fetching

Create `lib/calendar/fetchAllEvents.ts`:
- Query `calendar_tokens` for all providers the user has connected
- Fetch events from each provider in parallel (`Promise.all`)
- Merge all events into a single `BusyWindow[]` array
- Sort by start time
- This replaces direct Google Calendar calls in the scheduling flow

### Dashboard UI Update

Update `app/app/page.tsx`:
- Show connection status for each provider separately
- "Connect Google Calendar" button (existing)
- "Connect Outlook Calendar" button (new)
- Green checkmarks for each connected provider

---

## 7.4 Agent-Powered "Build My Day"

### Replace Existing Flow

Update `POST /api/schedule/build`:
- Instead of: buildPrompt → callSchedulingEngine (single OpenAI call) → save blocks
- Now: initialize agent → agent runs (fetches tasks, fetches calendar, reasons, calls solver) → save blocks
- Keep the same API contract (request/response shape) so the frontend doesn't need major changes
- The `retry` flag still works: pass existing schedule as context for the agent to reason about a different arrangement

### Streaming Support

Add `POST /api/agent/schedule` as a streaming endpoint:
- Use Server-Sent Events (SSE) to stream agent progress to frontend
- Events: `thinking` (agent reasoning), `tool_call` (which tool is being used), `result` (final schedule), `error`
- Frontend can show real-time status: "Checking your calendar...", "Found 3 meetings...", "Placing tasks..."
- Fall back to non-streaming `POST /api/schedule/build` if SSE connection fails

### Frontend Updates

Update dashboard to show agent status during "Build my day":
- Replace simple "Building your schedule..." spinner with step-by-step progress
- Show agent steps as they stream in (optional — can be a collapsible "see what the AI is doing" section)
- Keep the one-click "Build my day" UX — the agent complexity is invisible unless the user wants to see it

### Testing

- Test agent with various task configurations (empty, few tasks, overloaded day)
- Test with Google-only, Outlook-only, and both calendars connected
- Test constraint solver independently (unit tests for time placement logic)
- Test stability-first rescheduling (retry should produce different but not wildly different results)
- Verify existing integration tests still pass (API contract unchanged)

---

## Deliverable

"Build my day" is powered by a LangChain agent with deterministic time placement. Users can connect Google and/or Outlook Calendar. The agent reasons through priorities, places tasks via constraint solver, and handles overflow gracefully. Streaming shows agent progress in real-time.

---

## Acceptance Criteria

- LangChain agent successfully builds a schedule from tasks + calendar events
- Constraint solver places tasks without overlaps, respects working hours and breaks
- Outlook Calendar OAuth flow works end-to-end (connect, fetch events, show on timeline)
- Both Google and Outlook events merge correctly into busy-windows
- Existing "Build my day" UX still works (one click, schedule appears)
- Agent streaming shows progress steps to the user
- All existing integration tests pass
- Overflow handled gracefully (agent explains what couldn't fit)

---

## Next Phase

**Phase 8:** Chat Modal & Dynamic Updates (`2026-04-01-phase-8-chat-modal-dynamic-updates-plan.md`)
