# Feedback Discussion: Post-Presentation Pivot

**Date:** 2026-04-01
**Participants:** Parker Watts, Alex Fankhauser, Caleb Gooch
**Context:** Professor feedback from class presentation, followed by cofounder discussion same day

---

## Background

We presented Stride's current state (Phases 0-6 complete) in class. The professor gave four pieces of feedback that prompted us to rethink parts of our product direction. We met afterward to talk through each point and decide what to change.

---

## 1. Broaden Target Customers

**Professor feedback:** Our scope is too narrow targeting only "startup software engineers." We need to consider a wider customer base.

**Discussion:** The core value prop -- "drop in tasks, AI builds your day" -- isn't specific to engineers. The real pain point is unstructured time and decision fatigue, which hits a much broader audience. We talked through freelancers, remote workers, ADHD communities, healthcare workers, grad students, and small business owners.

**Decision:**
- **Primary users:** Knowledge workers with unstructured or variable schedules -- including freelancers, developers, and remote professionals.
- **Secondary users:** Busy college students with various responsibilities, and people with ADHD or executive function challenges.
- **Rationale:** Freelancers and remote workers have the same "too many tasks, not enough structure" problem as engineers but represent a much larger market. The ADHD angle is strong because "AI decides what you should do next" is genuinely life-changing for people who struggle with task initiation and prioritization -- and those communities (r/ADHD, ADHD Twitter) are incredibly active for organic growth.
- **Action:** Update the PRD problem statement, target users section, and go-to-market positioning to reflect this. The "Cognitive Orthotic" framing from the PRD is a natural fit for the ADHD secondary audience.

---

## 2. Additional Integrations

**Professor feedback:** There are many platforms our users interact with daily that we could integrate with to make Stride more appealing.

**Discussion:** We mapped out the tools our target users actually live in: calendars (Google, Outlook, Apple), task managers (Todoist, Ticktick, Notion), communication (Slack), project management (Jira, Linear, GitHub), and LMS platforms (Canvas, Blackboard) for students. We talked about which ones would have the most impact vs. implementation effort.

**Decision:**
- **In scope now:** Outlook Calendar integration. This immediately doubles our addressable market -- a huge chunk of professionals (especially enterprise/remote workers) are on Microsoft 365. Without it, we're locked to the Google ecosystem.
- **Future integrations (out of scope for now):** Todoist import (bring your existing tasks) and Slack (interact with Stride throughout the day via slash commands and notifications). Both are high-value but we want to ship the agent work first.
- **Rationale:** Calendar is the most foundational integration -- it's the data source for our entire scheduling engine. Adding a second calendar provider proves the architecture generalizes. Task manager and communication integrations are valuable but additive; the core loop works without them.

---

## 3. Agentic AI System

**Professor feedback:** We should add an agentic AI component using LangChain to the project.

**Discussion:** This is the most exciting change. Right now our "Plan my day" flow is a single-shot GPT-4o-mini call: dump tasks + calendar into a prompt, get a schedule back. It works for the happy path but can't recover from edge cases (conflicts, ambiguous tasks, full calendar) and can't adapt throughout the day. The agent proposal from the agentic-chatbot project lays out why scheduling is a natural agent problem: multi-step tool use, conditional logic, dynamic re-planning.

We talked about the UX. The "Build my day" button stays -- it's a great one-click entry point for the morning routine. But we're adding a **chat modal** alongside it for throughout-the-day interaction. Think a sliding panel or floating chat window where you can say things like:

- "I just finished the report early"
- "My 2pm meeting got canceled"
- "Add a new task: pick up groceries, 30 min"
- "I'm running 20 minutes behind"
- "What should I work on next?"

The agent processes these, updates the schedule, and responds conversationally. This replaces the need for discrete buttons for every possible status update.

**Decision:**
- **Build a LangChain-powered scheduling agent** that replaces the single-shot OpenAI call for schedule construction.
- **Agent tools:** `getTaskList`, `getCalendarEvents`, `createScheduledBlock`, `checkForConflicts`, `updateTask`, `askUserForClarification`.
- **Chat modal UX:** "Build my day" button stays for the initial schedule. A persistent chat icon opens a modal/panel for mid-day interactions -- adding tasks, reporting progress, asking what to do next, and triggering rescheduling. The agent responds with both text and schedule updates.
- **Guardrails:** Max iteration count to prevent runaway loops, user confirmation before any external writes (Google Calendar), scoped to today's data only.
- **This becomes a new phase** in the roadmap, pushing beta launch back. The agentic system is a core differentiator, not a nice-to-have, so it needs to ship before we put the product in front of beta users.

---

## 4. Differentiation Strategy

**Professor feedback:** We need to make sure Stride isn't something people could easily replicate with their own AI provider or existing tools. Focus on doing a few things really well rather than many things.

**Discussion:** This is the key strategic question. Anyone can ask ChatGPT "plan my day given these tasks and this calendar." The output will be decent. So why would someone pay for Stride?

We identified three things that ChatGPT (or a DIY setup) fundamentally can't do:

1. **Real-time adaptive scheduling.** ChatGPT generates a schedule once and forgets. Stride's agent monitors your day and adjusts as things change. You finish early, it pulls the next task forward. A meeting gets canceled, it fills the gap. You're running late, it reshuffles the rest. The schedule is alive, not a static artifact. This is the thing that's hardest to replicate.

2. **Zero-friction multi-modal input.** Snap a photo of a whiteboard, record a voice memo, type a quick title -- it all becomes scheduled tasks. ChatGPT can interpret a photo, but it can't turn it into calendar blocks connected to your real calendar. The end-to-end pipeline (capture -> extract -> schedule -> notify) is the product.

3. **"What should I do next?" intelligence.** Not just a schedule, but active guidance. The agent proactively tells you what to focus on, factoring in deadlines, priorities, and how your day has actually gone so far. This is the "cognitive orthotic" positioning -- it's for people who struggle with deciding, not just organizing.

**Decision:**
- **Lead differentiator:** "The AI that keeps your day on track" -- real-time adaptive scheduling powered by the agentic system. This is our moat.
- **Supporting differentiators:** Zero-friction input (photo, voice, text) and proactive "what's next" guidance.
- **What we explicitly won't do:** We're not building a project management tool (Jira/Asana own that), a notes app (Notion), or team scheduling (Motion). Single-user daily scheduling, done better than anything else.
- **Positioning update:** Shift from "AI builds your day" to "AI keeps your day on track." The first is a feature; the second is a relationship with the product throughout the day.

---

## Impact on Roadmap

These decisions affect the phase structure:

- **PRD updates needed:** Problem statement, target users, competitive landscape, differentiators, and go-to-market all need revisions.
- **New phase for agentic AI + Outlook integration:** This is significant enough work to be its own phase before beta launch.
- **Phase 8 (Secondary Features) review needed:** Some items (like dynamic calendar updates and "mark task done" rescheduling) are now subsumed by the agent. Goals may still stand as a separate feature. Need to reconcile what stays, what moves into the agent phase, and what gets cut.
- **Beta launch pushed back:** The agent and Outlook integration need to ship first so beta users experience the full differentiated product.

Exact phase numbering and plan/roadmap docs to be created as a next step.

---

## Action Items

1. Update PRD (problem statement, target users, differentiators, go-to-market)
2. Update architecture doc to reflect agentic AI system and multi-calendar support
3. Create new phase plan + roadmap for agentic AI (LangChain agent, chat modal, Outlook integration)
4. Reconcile Phase 8 (secondary features) -- figure out what the agent absorbs vs. what remains
5. Renumber phases and update the high-level implementation plan
6. Update context.md with new current focus
