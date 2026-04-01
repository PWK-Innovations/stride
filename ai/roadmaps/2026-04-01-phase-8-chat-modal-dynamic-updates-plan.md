# Phase 8: Chat Modal & Dynamic Updates - Implementation Plan

**Date:** 2026-04-01
**Phase:** 8 - Chat Modal & Dynamic Updates
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-04-01-phase-8-chat-modal-dynamic-updates-roadmap.md`
**Previous Phase:** `2026-04-01-phase-7-agentic-ai-multi-calendar-plan.md`

---

## Clean Code Principles

Keep the chat interface simple. Don't build a full chatbot framework — use the existing LangChain agent with conversation memory added. The modal should feel lightweight, not like a separate app within the app.

---

## Goal

Add a chat modal that lets users interact with the scheduling agent throughout the day. Users can report progress, add new tasks, request rescheduling, and ask "what should I do next?" — all via natural language. Also add quick-action shortcuts on timeline blocks so common actions (mark done, skip, running late) don't require opening the chat. By the end of this phase, the schedule is a living document that adapts throughout the day.

---

## Prerequisites

- Phase 7 complete (LangChain agent working, Outlook integration, hybrid architecture)
- Agent tools already defined (`getTaskList`, `getCalendarEvents`, `createScheduledBlocks`, `checkForConflicts`, `updateTask`)

---

## 8.1 Chat Modal UI

### Agent Conversations Table

Create `agent_conversations` table in Supabase:
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `date` (date — scoped to one conversation per user per day)
- `messages` (jsonb — array of `{ role: 'user' | 'assistant', content: string, timestamp: string }`)
- `created_at`, `updated_at`
- Unique constraint on (user_id, date)
- RLS: users can only access their own conversations

### Chat Modal Component

Create `components/features/ChatModal.tsx`:
- Sliding panel from the right side of the screen (or bottom on mobile)
- Persistent chat icon button (floating, bottom-right corner) — click to toggle open/close
- Message list with user messages and agent responses
- Text input at bottom with send button
- Loading indicator while agent is processing (show streaming text as it arrives)
- Auto-scroll to latest message
- Messages persist for the day (load from `agent_conversations` on open)
- Keyboard shortcut: Cmd+K or similar to toggle chat

### Streaming Chat Responses

Create `POST /api/agent/chat` endpoint:
- Accepts: `{ message: string }` + auth
- Loads or creates today's conversation from `agent_conversations`
- Passes full conversation history + current schedule state to LangChain agent
- Streams response back via SSE (same pattern as Phase 7 agent streaming)
- Events: `thinking`, `tool_call` (agent is checking calendar, updating task, etc.), `text` (response chunks), `schedule_update` (schedule changed — frontend should refresh timeline), `done`
- Appends both user message and agent response to `agent_conversations`

### Agent Conversation Memory

Extend the scheduling agent from Phase 7:
- Add conversation history as context when processing chat messages
- Agent sees: system prompt + today's conversation history + current schedule state + user's new message
- Agent can reference earlier messages ("you mentioned earlier that...")
- Conversation resets daily (new day = new conversation)

---

## 8.2 Mid-Day Agent Interactions

### Supported Interactions

The agent should handle these natural language patterns (not hard-coded — the LLM interprets intent):

**Progress updates:**
- "I finished the report" / "done with X" → agent marks task complete, reschedules remaining tasks into freed time
- "I'm running 20 minutes late" → agent shifts remaining tasks forward, applies stability-first rules
- "I'm ahead of schedule" → agent pulls next task forward or suggests a break

**Adding tasks:**
- "Add groceries after work, 30 minutes" → agent creates task, finds a slot, updates schedule
- "I just got assigned a code review, high priority, 1 hour" → agent creates task, reasons about priority, reschedules if needed

**Rescheduling:**
- "Move my workout to after lunch" → agent finds the task, finds a new slot, applies stability-first rules
- "Cancel the report task" → agent removes from schedule, optionally fills the gap
- "My 2pm meeting got canceled" → agent detects freed time, suggests filling it or leaving as a break

**Guidance:**
- "What should I do next?" → agent looks at current time, remaining tasks, and priorities, responds with recommendation and why
- "How's my day looking?" → agent summarizes progress, remaining tasks, and any risks (overloaded, tight gaps)

### Schedule Update Flow

When the agent modifies the schedule via chat:
1. Agent reasons about the change
2. Agent calls relevant tools (updateTask, constraint solver for rescheduling, createScheduledBlocks)
3. API returns a `schedule_update` SSE event with the new schedule
4. Frontend receives event, refreshes timeline view automatically
5. Agent responds with natural language explanation ("Moved your workout to 1:30 PM. Your afternoon looks tight — want me to drop the reading task?")

### Stability-First in Chat Context

Same rules as Phase 7, but applied to mid-day changes:
- Prefer keeping scheduled tasks in their current slots
- If user reports "running late", shift only the next 1-2 tasks, not the whole afternoon
- If a task is added, try to fit it in existing gaps before moving anything
- If the day is overloaded after a change, proactively suggest what to cut/defer

---

## 8.3 Quick-Action Shortcuts

### Timeline Block Actions

Add action buttons to scheduled task blocks on the `DailyTimeline` component:
- **Mark done** (checkmark icon) — marks task complete, triggers agent rescheduling for remaining tasks
- **Skip** (skip icon) — removes task from schedule, agent fills gap or leaves as break
- **Running late** (clock icon) — opens a small input ("how many minutes?"), agent shifts remaining tasks

These are shortcuts that trigger the same agent logic as the chat — they just don't require typing a message. The action is sent to the agent as a structured command (e.g., `{ action: 'mark_done', taskId: '...' }`), and the agent responds in the chat history so the user can see what changed.

### API Integration

Quick-action shortcuts call the same `POST /api/agent/chat` endpoint but with a structured action instead of free text:
- `{ action: 'mark_done', taskId: string }`
- `{ action: 'skip', taskId: string }`
- `{ action: 'running_late', taskId: string, minutes: number }`

The agent processes these the same way as natural language — it's just a faster input path. Response appears in the chat modal (if open) or as a brief toast notification (if closed).

### Toast Notifications

When quick-actions trigger schedule changes and the chat modal is closed:
- Show a brief toast notification: "Marked 'Write report' done. Next up: Code review at 2:30 PM"
- Toast auto-dismisses after 5 seconds
- Clicking the toast opens the chat modal to see full context

---

## Deliverable

Chat modal for conversational agent interaction throughout the day. Quick-action shortcuts on timeline blocks. Schedule adapts in real-time via agent-powered rescheduling with streaming responses.

---

## Acceptance Criteria

- Chat modal opens/closes smoothly, messages persist for the day
- Agent processes natural language updates (progress, new tasks, rescheduling, guidance)
- Streaming shows agent responses in real-time as they generate
- Schedule updates reflect immediately on the timeline
- Quick-action buttons on timeline blocks trigger agent rescheduling
- Toast notifications for quick-actions when chat is closed
- Stability-first rescheduling prevents cascade reshuffles
- Conversation history maintained per day, resets on new day

---

## Next Phase

**Phase 9:** Beta Launch (`2026-02-09-phase-9-beta-launch-plan.md`)
