# Phase 9: Agentic AI - Roadmap

**Date:** 2026-04-01
**Phase:** 9 - Agentic AI
**Status:** Not started
**Plan:** `2026-04-01-phase-9-agentic-ai-plan.md`
**Previous Phase:** `2026-04-01-phase-8-desktop-widget-roadmap.md`

---

**Reference implementation:** `aiDocs/stride-agent/` — adapt the existing ReAct agent (LangGraph, GPT-4o, SSE streaming, conversation memory, Pino logging) with scheduling-specific tools.

---

## Tasks

### 9.0 Widget Distribution & Download

- [x] Install `electron-builder` as dev dependency in `widget/`
- [x] Configure `electron-builder` in `widget/package.json` (macOS DMG target)
- [x] Add `npm run dist` script for building distributable
- [ ] Build DMG and upload to GitHub Releases
- [x] Add `NEXT_PUBLIC_WIDGET_DOWNLOAD_URL` env var to `.env.example`
- [x] Create widget screenshot/mockup for homepage (place in `app/public/`)
- [x] Add widget download section to homepage (`app/app/page.tsx`) between Stats and Testimonial
- [x] Add dismissible download banner to dashboard (`app/app/app/page.tsx`)
- [x] Banner dismissal persists via localStorage
- [ ] Test download link works from both homepage and dashboard

### 9.1 LangChain Agent Infrastructure

- [x] Adapt ReAct agent from `aiDocs/stride-agent/src/lib/agent.ts` (`createReactAgent`, GPT-4o)
- [x] Reuse SSE streaming pattern from `aiDocs/stride-agent/src/app/api/chat/route.ts`
- [x] Reuse conversation memory pattern from `aiDocs/stride-agent/src/lib/memory.ts`; extend with Supabase persistence
- [x] Reuse structured logging helpers from `aiDocs/stride-agent/src/lib/utils/logger.ts`
- [x] Install LangChain dependencies (`langchain`, `@langchain/openai`, `@langchain/core`, `@langchain/langgraph`)
- [x] Create `lib/agent/` directory for agent code
- [x] Define `getTaskList` tool — fetch user's tasks for today
- [x] Define `getCalendarEvents` tool — fetch busy windows from connected calendars
- [x] Define `createScheduledBlocks` tool — write schedule blocks to database
- [x] Define `checkForConflicts` tool — validate proposed schedule against calendar
- [x] Define `updateTask` tool — mark tasks done, skipped, or rescheduled
- [x] Write agent system prompt with scheduling rules, priorities, constraints
- [x] Create agent executor with max iteration guardrail
- [x] Add structured logging for all agent operations (tool calls, iterations, errors)
- [ ] Test agent can invoke each tool correctly in isolation
- [ ] Test agent can build a simple schedule end-to-end

### 9.2 Hybrid Scheduling Architecture

- [x] Build deterministic constraint solver (`lib/agent/solver.ts`)
- [x] Solver input: ordered task list with durations + busy windows
- [x] Solver output: scheduled blocks with start/end times, no overlaps
- [x] Solver respects working hours and break preferences
- [x] Implement stability-first rescheduling rules
- [x] Cap maximum tasks that can move in a single reschedule
- [x] Anchor completed and in-progress tasks (never move them)
- [x] Wire agent to use solver for time placement (agent decides order, solver places)
- [ ] Test solver produces valid schedules with no time overlaps
- [ ] Test rescheduling moves minimal tasks

### 9.3 Agent-Powered "Build My Day"

- [x] Adapt SSE streaming endpoint from `aiDocs/stride-agent/` for agent progress
- [x] Stream events: thinking, tool call, tool result, final schedule
- [x] Update or create API endpoint that invokes LangChain agent for "Build my day"
- [ ] Build agent progress UI in web app (replace loading spinner)
- [ ] Build agent progress UI in desktop widget
- [x] Translate raw tool calls to human-friendly status messages
- [x] Implement fallback to single-shot scheduling if agent fails/times out
- [ ] Test streaming works end-to-end (API → frontend)
- [ ] Test fallback triggers correctly on agent failure
- [ ] Test "Build my day" produces correct schedule via agent

### 9.4 Chat & Mid-Day Interactions (Widget Chatbot)

- [ ] Create `agent_conversations` table (user_id, date, messages JSONB, created_at)
- [ ] Build chat API endpoint — accepts user message, returns agent response via SSE
- [x] Wire widget `strideChat.sendMessage()` IPC to agent SSE endpoint
- [x] Main process streams agent responses back to renderer via `chat-response` IPC
- [x] Replace `ChatController.processCommand()` with agent API calls
- [x] ChatController becomes thin wrapper (send text → render streamed response)
- [ ] Handle "I finished [task]" — mark task done, adjust schedule
- [ ] Handle "Add [task]" — create task, reschedule
- [ ] Handle "I'm running behind" — push remaining tasks
- [ ] Handle "What's next?" — check schedule, suggest current task
- [ ] Persist conversation per user per day
- [ ] Load conversation history on chat open
- [ ] SSE streaming for real-time agent responses in widget chat
- [ ] Test chat modifies schedule correctly via agent
- [ ] Test conversation persists across chat opens within same day
- [ ] Test conversations reset on new day

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] Widget DMG downloadable from homepage and dashboard
- [ ] "Build my day" uses LangChain agent with streaming
- [ ] Solver handles all time placement (no LLM time math)
- [ ] Agent stays within max iteration guardrail
- [ ] Widget chatbot uses live agent (not client-side command parsing)
- [ ] Natural language commands modify schedule correctly
- [ ] Stability-first rescheduling verified (minimal changes)
- [ ] Conversation persisted per user per day
- [ ] Fallback to single-shot scheduling works
- [ ] Structured logging on all agent operations
- [ ] `npm run test:all` passes
- [ ] `aiDocs/changelog.md` updated
- [ ] Roadmap tasks checked off

---

## Next Phase

**Phase 10:** Integrations & Web Chatbot (`2026-04-01-phase-10-integrations-web-chatbot-roadmap.md`)
