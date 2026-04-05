# Phase 9: Agentic AI - Implementation Plan

**Date:** 2026-04-01
**Phase:** 9 - Agentic AI
**Status:** Not started
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-9-agentic-ai-roadmap.md`
**Previous Phase:** `2026-04-01-phase-8-desktop-widget-plan.md`
**Next Phase:** `2026-04-01-phase-10-integrations-web-chatbot-plan.md`

---

## Clean Code Principles

This phase replaces the single-shot OpenAI scheduling call with a LangChain agent. The key architectural decision is hybrid: LLM reasons about priorities and ordering, deterministic solver handles time placement. Do not let the LLM do time math — that's where hallucinations happen. Keep the agent focused and constrained with max iteration guardrails.

**Reference implementation:** `aiDocs/stride-agent/` — a standalone Next.js agent already built with LangChain/LangGraph ReAct pattern (`createReactAgent`), GPT-4o, 4 tools (calculator, web search, RAG knowledge base, Google Calendar), SSE streaming (`/api/chat`), session-based conversation memory, and Pino structured logging. This phase adapts that proven pattern into the main Stride app, replacing the demo tools with scheduling-specific tools and adding Supabase-backed conversation persistence.

---

## Goal

Distribute the desktop widget for download. Replace single-shot OpenAI scheduling with a LangChain agent tailored to the widget chatbot. Hybrid architecture: LLM for reasoning, deterministic solver for time placement. Agent reused in Phase 10 for web chatbot. Add chat and mid-day interaction capabilities so users can talk to the agent throughout the day.

---

## Prerequisites

- Phase 8 complete (desktop widget running, syncing with web app)
- Existing scheduling endpoint (`api/schedule/build/`) working with single-shot OpenAI
- Task CRUD and calendar event fetching operational
- SSE infrastructure understanding (will be needed for streaming)
- `electron-builder` installed as dev dependency in `widget/`

---

## 9.0 Widget Distribution & Download

### Why

Phase 8 built the widget, but users have no way to download or install it. Before wiring the agent to the widget chatbot, we need a distributable DMG and visible download paths on the homepage and dashboard so users can actually get the widget.

---

### 9.0.1 Widget Build & Packaging

#### What to Build

- Configure `electron-builder` in `widget/package.json` for macOS DMG
- Add `npm run dist` script to produce a distributable `.dmg` file
- Host the built DMG on GitHub Releases (manual upload for MVP)
- Add a download URL constant or env var (`NEXT_PUBLIC_WIDGET_DOWNLOAD_URL`) pointing to the GitHub release asset

#### What Not to Do

- No auto-update (Squirrel/electron-updater) — manual download for MVP
- No Windows/Linux builds yet — macOS only
- No code signing — unsigned DMG is fine for MVP/demo

---

### 9.0.2 Homepage Widget Section

#### What to Build

- Add a new section to `app/app/page.tsx` between Stats and Testimonial sections
- Use existing section component pattern (headline, subheadline, CTA button)
- Headline: "Stay in flow with the Stride widget" or similar
- Subheadline: brief description of compressed pill + full chatbot modes
- CTA: "Download for macOS" button linking to the GitHub release DMG
- Include a static screenshot/mockup of the widget (place in `public/`)

---

### 9.0.3 Dashboard Download Banner

#### What to Build

- Add a dismissible banner/card at the top of `app/app/app/page.tsx` (dashboard)
- "Get the Stride desktop widget — stay on track without leaving your workflow"
- Download button linking to the DMG
- Dismiss button that saves preference to `localStorage` so it doesn't reappear
- Only show when user hasn't dismissed it

---

## 9.1 LangChain Agent Infrastructure

### Why

The current single-shot OpenAI call generates a schedule in one pass. An agent can reason iteratively — checking constraints, resolving conflicts, and adapting based on tool results. This enables mid-day interactions where the agent can modify an existing schedule intelligently.

### What to Build

- Adapt the ReAct agent from `aiDocs/stride-agent/src/lib/agent.ts` (uses `createReactAgent` from `@langchain/langgraph`, GPT-4o at temperature 0)
- Reuse SSE streaming pattern from `aiDocs/stride-agent/src/app/api/chat/route.ts` (event types: `text`, `tool`, `done`, `error`)
- Reuse conversation memory pattern from `aiDocs/stride-agent/src/lib/memory.ts`; extend with Supabase persistence
- Reuse structured logging helpers from `aiDocs/stride-agent/src/lib/utils/logger.ts` (Pino, `logToolEntry`/`logToolCall`/`logToolError`)
- Install LangChain dependencies (`langchain`, `@langchain/openai`, `@langchain/core`, `@langchain/langgraph`)
- Replace demo tools with scheduling-specific tools:
  - `getTaskList` — fetch user's tasks for today
  - `getCalendarEvents` — fetch busy windows from connected calendars
  - `createScheduledBlocks` — write schedule blocks to the database
  - `checkForConflicts` — validate a proposed schedule against calendar events
  - `updateTask` — mark tasks as done, skipped, or rescheduled
- Create agent executor with:
  - System prompt defining scheduling rules, priorities, and constraints
  - Max iteration guardrail (prevent runaway agent loops)
  - Tool descriptions that guide the LLM toward correct usage
- Store agent configuration in `lib/agent/` directory

### What Not to Do

- Do not give the agent free-form database access — only expose specific tools
- Do not remove the existing scheduling endpoint until the agent is proven stable
- Do not let the agent do time arithmetic — that's the solver's job

---

## 9.2 Hybrid Scheduling Architecture

### Why

LLMs are bad at time math. "Schedule a 2-hour task starting at 2:30pm" should not be an LLM calculation. The deterministic solver handles all time placement, conflict detection, and constraint satisfaction. The LLM decides what to schedule and in what priority order.

### What to Build

- Deterministic constraint solver:
  - Input: ordered list of tasks with durations + busy windows from calendar
  - Output: scheduled blocks with start/end times, no overlaps
  - Respects working hours, break preferences, and calendar events
- Stability-first rescheduling rules:
  - When modifying an existing schedule, prefer minimal adjustments
  - Cap the number of tasks that can move in a single reschedule
  - Anchor completed and in-progress tasks — never move them
- Agent reasons about priority/ordering; solver places blocks
- Store solver in `lib/agent/solver.ts` or similar

### What Not to Do

- Do not build an optimization engine — greedy placement is fine for MVP
- Do not support multi-day scheduling — today only
- Do not let the agent override the solver's time placement

---

## 9.3 Agent-Powered "Build My Day"

### Why

"Build my day" is the core user action. Replacing the single-shot call with the agent flow means the schedule is built through iterative reasoning — the agent can check conflicts, adjust priorities, and explain its decisions.

### What to Build

- New API endpoint (or modify existing `api/schedule/build/`) that invokes the LangChain agent
- SSE streaming endpoint for agent progress (adapt from `aiDocs/stride-agent/src/app/api/chat/route.ts`):
  - Stream events: thinking, tool call (with tool name), tool result, final schedule
  - Frontend shows real-time agent status during schedule build
- Frontend updates: replace loading spinner with agent progress UI (both web app and widget)
- Fallback: if agent fails or times out, fall back to the existing single-shot scheduling
- Keep the existing endpoint as a fallback until agent is stable

### What Not to Do

- Do not block the UI while the agent runs — streaming is essential
- Do not show raw tool calls to the user — translate to human-friendly status messages
- Do not remove the old scheduling code until the agent has been tested in beta

---

## 9.4 Chat & Mid-Day Interactions

### Why

The schedule is not static — users need to report progress, add tasks, request rescheduling, and ask "what's next?" throughout the day. The agent handles these interactions with the same stability-first rules.

### What to Build

**Primary target: widget chatbot.** The agent replaces `ChatController.processCommand()` in the widget. The web app chatbot is deferred to Phase 10 (10.2) — it reuses the same agent endpoint.

- Wire `strideChat.sendMessage()` IPC bridge (already stubbed in `widget/src/preload.ts:154-157`) to call the new agent API endpoint
- Main process forwards chat messages to the agent SSE endpoint and streams responses back to the renderer via IPC `chat-response` events
- Widget `ChatController` becomes a thin wrapper: sends user text → receives streamed agent response → renders messages
- Natural language processing: agent interprets user messages and takes appropriate actions
  - "I finished the report" → mark task done, adjust schedule
  - "Add a 30-min meeting at 3pm" → create task, reschedule around it
  - "I'm running behind" → push remaining tasks, suggest new timeline
  - "What should I do next?" → check schedule, suggest current task
- Agent modifies schedule with stability-first rescheduling rules
- Conversation persistence per user per day (`agent_conversations` table)
- SSE streaming for real-time agent responses in widget
- Message history UI showing the day's conversation

### What Not to Do

- Do not build a general-purpose chatbot — the agent is scheduling-focused
- Do not allow the agent to delete tasks without user confirmation
- Do not persist conversations across days — each day starts fresh
- Do not build web app chat UI in this phase — that's Phase 10.2

---

## Deliverable

Widget downloadable from homepage and dashboard. Agentic AI powers the widget chatbot and schedule building. Agent reused in Phase 10 for web chatbot. Hybrid architecture prevents LLM time-math hallucinations. Chat enables natural-language schedule management throughout the day.

---

## Acceptance Criteria

- Widget DMG downloadable from homepage and dashboard
- "Build my day" uses LangChain agent with streaming progress
- Deterministic solver handles all time placement (no LLM time math)
- Agent respects max iteration guardrail
- Widget chatbot uses live agent (not client-side command parsing)
- Natural language commands modify the schedule correctly
- Stability-first rescheduling: minimal changes when modifying existing schedule
- Conversation persisted per user per day
- Fallback to single-shot scheduling if agent fails
- Structured logging on all agent operations
- All existing tests pass (`npm run test:all`)
- `aiDocs/changelog.md` updated
