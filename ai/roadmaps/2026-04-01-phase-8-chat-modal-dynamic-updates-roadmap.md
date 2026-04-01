# Phase 8: Chat Modal & Dynamic Updates - Roadmap

**Date:** 2026-04-01
**Phase:** 8 - Chat Modal & Dynamic Updates
**Status:** Not started
**Plan:** `2026-04-01-phase-8-chat-modal-dynamic-updates-plan.md`
**Previous Phase:** `2026-04-01-phase-7-agentic-ai-multi-calendar-roadmap.md`

---

## Tasks

### 8.1 Chat Modal UI

- [ ] Create `agent_conversations` table in Supabase (id, user_id, date, messages jsonb, timestamps)
- [ ] Add unique constraint on (user_id, date) and RLS policies
- [ ] Create `POST /api/agent/chat` — SSE streaming endpoint for chat messages
- [ ] Implement: load/create today's conversation, pass history + schedule state to agent, stream response
- [ ] Implement SSE event types: `thinking`, `tool_call`, `text`, `schedule_update`, `done`
- [ ] Append user message + agent response to `agent_conversations` after each exchange
- [ ] Create `components/features/ChatModal.tsx` — sliding panel with message list, input, send button
- [ ] Add floating chat icon button (bottom-right, persistent on dashboard)
- [ ] Implement streaming text display (agent response appears word-by-word)
- [ ] Implement auto-scroll to latest message
- [ ] Load conversation history from `agent_conversations` when modal opens
- [ ] Add keyboard shortcut to toggle chat (Cmd+K)
- [ ] Mobile-responsive: full-width bottom sheet on small screens
- [ ] Test: open chat, send message, see streaming response, close and reopen (messages persist)

### 8.2 Mid-Day Agent Interactions

- [ ] Extend agent with conversation memory (pass today's chat history as context)
- [ ] Handle progress updates: "I finished X" → mark task done, reschedule remaining
- [ ] Handle delays: "I'm running late" → shift remaining tasks with stability-first rules
- [ ] Handle new tasks: "Add X, Y minutes" → create task, find slot, update schedule
- [ ] Handle rescheduling: "Move X to after lunch" → find task, find new slot, update schedule
- [ ] Handle cancellation: "Cancel X" → remove from schedule, optionally fill gap
- [ ] Handle guidance: "What should I do next?" → recommend based on time, priorities, remaining tasks
- [ ] Handle status: "How's my day looking?" → summarize progress and risks
- [ ] Emit `schedule_update` SSE event when agent modifies schedule
- [ ] Frontend: refresh timeline automatically on `schedule_update` event
- [ ] Agent responds with natural language explanation of changes
- [ ] Test: each interaction type produces correct schedule changes
- [ ] Test: stability-first rules prevent cascade reshuffles

### 8.3 Quick-Action Shortcuts

- [ ] Add action buttons to timeline blocks in `DailyTimeline.tsx`: mark done (checkmark), skip (skip icon), running late (clock icon)
- [ ] "Running late" button opens small input for minutes
- [ ] Quick-actions call `POST /api/agent/chat` with structured action payload
- [ ] Agent processes structured actions same as natural language
- [ ] Quick-action responses appear in chat history
- [ ] Create toast notification component for quick-action feedback when chat is closed
- [ ] Toast shows brief summary ("Marked 'X' done. Next up: Y at Z")
- [ ] Toast auto-dismisses after 5 seconds, click opens chat
- [ ] Test: mark done → task removed from timeline, remaining tasks rescheduled
- [ ] Test: skip → task removed, gap handled
- [ ] Test: running late → remaining tasks shifted appropriately
- [ ] Test: toast appears when chat is closed, chat shows action when open

---

## Deliverable

Chat modal for conversational scheduling throughout the day. Quick-action shortcuts on timeline blocks. Real-time schedule adaptation via streaming agent responses.

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] Chat modal works smoothly on desktop and mobile
- [ ] Agent handles all interaction types correctly
- [ ] Schedule updates reflect immediately on timeline
- [ ] Quick-actions provide fast path for common operations
- [ ] Conversation persists per day, resets on new day
- [ ] Streaming responses feel responsive and natural

---

## Next Phase

**Phase 9:** Beta Launch (`2026-04-01-phase-9-beta-launch-roadmap.md`)
