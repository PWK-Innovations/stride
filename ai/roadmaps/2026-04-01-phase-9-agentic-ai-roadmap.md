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

### 9.1 LangChain Agent Infrastructure

- [ ] Adapt ReAct agent from `aiDocs/stride-agent/src/lib/agent.ts` (`createReactAgent`, GPT-4o)
- [ ] Reuse SSE streaming pattern from `aiDocs/stride-agent/src/app/api/chat/route.ts`
- [ ] Reuse conversation memory pattern from `aiDocs/stride-agent/src/lib/memory.ts`; extend with Supabase persistence
- [ ] Reuse structured logging helpers from `aiDocs/stride-agent/src/lib/utils/logger.ts`
- [ ] Install LangChain dependencies (`langchain`, `@langchain/openai`, `@langchain/core`, `@langchain/langgraph`)
- [ ] Create `lib/agent/` directory for agent code
- [ ] Define `getTaskList` tool — fetch user's tasks for today
- [ ] Define `getCalendarEvents` tool — fetch busy windows from connected calendars
- [ ] Define `createScheduledBlocks` tool — write schedule blocks to database
- [ ] Define `checkForConflicts` tool — validate proposed schedule against calendar
- [ ] Define `updateTask` tool — mark tasks done, skipped, or rescheduled
- [ ] Write agent system prompt with scheduling rules, priorities, constraints
- [ ] Create agent executor with max iteration guardrail
- [ ] Add structured logging for all agent operations (tool calls, iterations, errors)
- [ ] Test agent can invoke each tool correctly in isolation
- [ ] Test agent can build a simple schedule end-to-end

### 9.2 Hybrid Scheduling Architecture

- [ ] Build deterministic constraint solver (`lib/agent/solver.ts`)
- [ ] Solver input: ordered task list with durations + busy windows
- [ ] Solver output: scheduled blocks with start/end times, no overlaps
- [ ] Solver respects working hours and break preferences
- [ ] Implement stability-first rescheduling rules
- [ ] Cap maximum tasks that can move in a single reschedule
- [ ] Anchor completed and in-progress tasks (never move them)
- [ ] Wire agent to use solver for time placement (agent decides order, solver places)
- [ ] Test solver produces valid schedules with no time overlaps
- [ ] Test rescheduling moves minimal tasks

### 9.3 Agent-Powered "Build My Day"

- [ ] Adapt SSE streaming endpoint from `aiDocs/stride-agent/` for agent progress
- [ ] Stream events: thinking, tool call, tool result, final schedule
- [ ] Update or create API endpoint that invokes LangChain agent for "Build my day"
- [ ] Build agent progress UI in web app (replace loading spinner)
- [ ] Build agent progress UI in desktop widget
- [ ] Translate raw tool calls to human-friendly status messages
- [ ] Implement fallback to single-shot scheduling if agent fails/times out
- [ ] Test streaming works end-to-end (API → frontend)
- [ ] Test fallback triggers correctly on agent failure
- [ ] Test "Build my day" produces correct schedule via agent

### 9.4 Chat & Mid-Day Interactions

- [ ] Create `agent_conversations` table (user_id, date, messages JSONB, created_at)
- [ ] Build chat API endpoint — accepts user message, returns agent response via SSE
- [ ] Implement chat UI in web app (adapt from `aiDocs/stride-agent/src/app/components/`)
- [ ] Implement chat UI in desktop widget
- [ ] Handle "I finished [task]" — mark task done, adjust schedule
- [ ] Handle "Add [task]" — create task, reschedule
- [ ] Handle "I'm running behind" — push remaining tasks
- [ ] Handle "What's next?" — check schedule, suggest current task
- [ ] Persist conversation per user per day
- [ ] Load conversation history on chat open
- [ ] SSE streaming for real-time agent responses in chat
- [ ] Test chat modifies schedule correctly via agent
- [ ] Test conversation persists across chat opens within same day
- [ ] Test conversations reset on new day

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] "Build my day" uses LangChain agent with streaming
- [ ] Solver handles all time placement (no LLM time math)
- [ ] Agent stays within max iteration guardrail
- [ ] Chat works in both widget and web app
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
