# Stride Implementation Plan

**Date:** 2026-04-01
**Status:** High-level roadmap (final)
**Scope:** MVP → P1 → P2 (see `aiDocs/mvp.md` and `aiDocs/prd.md`)

---

> **AI: Do NOT edit this to-do list.** This is a manually maintained checklist. Only the team updates it.

## Final To-Do List

**Deadline:** April 7 at 23:59 — everything pushed.
**Presentation:** 20 min, in-person demo. Schedule: April 8, 13, or 15.
**Midterm:** 93.40% (A) — Casey 100, Jason 92, Presentation 70.

### Product Design

- [x] **Quantify PRD metrics** — Update `aiDocs/prd.md` Section 3 with hard numbers (15-30 min/day saved, <40% manual edits, 2/3 report realistic schedule, 50%+ use 3x/week, retention target)
- [x] **Report where you stand against metrics** — Don't just define metrics; report actual status against each success/failure indicator. Where do you actually stand? (Rubric 4: Success & Failure Planning)
- [x] **Update mvp.md and PRD to reflect pivot** — Both docs must reflect the current agentic AI direction. mvp.md is a required deliverable — it defines the concrete, scope-constrained version of what you are actually building. The PRD can include broader vision and future features, but mvp.md is the anchor for what you are delivering now. Pivot plans should have decision criteria tied to metrics/thresholds and real evidence.
- [x] **Execute & document falsification tests 1-3** — Run all three tests, expand sample sizes where possible. Document method, threshold, results, and interpretation for each in `ai/notes/falsification-results.md`
- [x] **New customer interviews** — 3-5 people outside your circle (strangers, target users, domain contacts via Reddit/Discord/LinkedIn). Document in `ai/notes/customer-interviews-final.md`
- [x] **Show feedback loop** — Identify specific features or decisions that changed because of new feedback (engage → learn → change → re-engage)
- [x] **Commit versioned system diagram** — Midterm diagram was slides-only (Jason flagged this). Commit an actual diagram file (e.g. PNG/SVG + source) as a versioned artifact that shows evolution from midterm.
- [x] **Sharpen problem statement** — Should be more precise and grounded than at midterm. Refine based on evidence from building and falsification tests. Distinct from PRD metrics — this is about the core problem definition itself. (Rubric 2: Problem Identification)
- [x] **Update competitive analysis** — Revisit competitive landscape based on what you learned while building. Solution positioning should reflect validated understanding, not initial assumptions. (Rubric 3: Customer Focus)
- [x] **Build final slide deck** — Start from where midterm left off, not a re-presentation. Show product throughout. Include: evolved system diagram, falsification results, customer feedback loop, technical process narrative.

### Technical

- [x] **Final phases implementation** — Make meaningful progress on Phase 8 (Desktop Widget), Phase 9 (Agentic AI), and Phase 10 (Integrations & Web Chatbot). Phase 7 complete. Phase 8 in progress (8.1-8.3 done, 8.4-8.7 implemented, testing remaining).
- [x] **Commit incrementally** — Not one big burst. Check off phase roadmap tasks as completed.
- [x] **Update CLAUDE.md** — Align with Casey's slides (behavioral guidance is an explicit sub-criterion in AI Development Infrastructure).
- [x] **Prepare live demo** — Test core flow (sign up → add tasks → build schedule → view timeline) on presentation machine
- [x] **Record backup demo video**
- [x] **Rehearse** — Full dry run under 20 min. Presentation was **70/100 at midterm — biggest area for improvement.** Specific prep:
  - Each member can clearly explain their individual contributions (rubric required element)
  - Include honest "what we'd do differently" discussion (rubric: Storytelling & Journey)
  - Q&A prep on trade-offs, limitations, and technical decisions (rubric emphasizes thoughtful responses)

### Final Checks (Before Submitting)

- [x] **ai/, aiDocs/, and planning folders are NOT gitignored** — Graders must see roadmaps, plans, changelogs, and context.md. These are graded artifacts. Only gitignore secrets and library folders (.env, .testEnvVars, MCP configs, node_modules/, venv/).
- [x] **mvp.md exists and is current** — Required deliverable. Defines the concrete, scope-constrained version of what you are actually building. PRD can include broader vision; mvp.md anchors what you are delivering now.
- [x] **CLAUDE.md has behavioral guidance** — Explicit sub-criterion in AI Development Infrastructure.
- [x] **Changelog reflects work since midterm** — Not empty or stale.
- [x] **No secrets committed in repo** — Scan git history. .env, API keys, tokens must not be in any commit. (Rubric: AI Development Infrastructure)
- [x] **context.md uses bookshelf pattern and is current** — References key docs with 1-2 sentence descriptions so a new AI session can orient immediately. (Rubric: AI Development Infrastructure)
- [x] **.testEnvVars in .gitignore** — Verify it's listed. Rubric explicitly mentions this.
- [x] **Structured logging integrated in app code** — Not just a standalone logger file. Must be used in actual application code. (Rubric: Structured Logging & Debugging)
- [x] **Test scripts pass** — `npm run test:all` exits cleanly. Ensure test-log-fix loop is visible in git history (test fail → log diagnosis → fix commits). (Rubric: Structured Logging & Debugging)
- [x] **Living docs updated** — `aiDocs/changelog.md` reflects work since midterm, `aiDocs/context.md` is current.
- [x] **Roadmap tasks checked off** — All completed phase tasks marked done before submission. (Rubric: Phase-by-Phase Implementation)
- [x] **Architecture docs + coding-style docs exist and are current** — `aiDocs/coding-style.md` and architecture docs present and up to date. (Rubric: AI Development Infrastructure)
- [x] **Proper exit codes (0/1/2) on test scripts** — CLI scripts should exit 0 on success, 1 on failure, 2 on usage error. (Rubric: Structured Logging & Debugging)

### Artifacts to Submit (April 7 at 23:59)

- [x] **Link to team GitHub repo** submitted on Canvas
- [x] All code pushed and working
- [x] Updated docs pushed (PRD with quantitative metrics, changelog, context.md, mvp.md)
- [x] **Deep customer analysis** — dedicated artifact showing who your customer is (format up to you). Include at least 2 real customer conversation docs.
- [x] **Founding hypothesis** — the hypothesis your current approach is based on, documented and included in presentation
- [x] New customer interview notes (`ai/notes/customer-interviews-final.md`)
- [x] Falsification test results documented (`ai/notes/falsification-results.md`)
- [x] **2x2 differentiation grid** — competitive positioning artifact included in presentation materials
- [x] **Systems architecture diagram** — must identify leverage points, the problem, and where in the system your solution targets. Committed as versioned artifact (not slides-only — Jason flagged this at midterm)
- [x] Presentation slides committed or linked in repo
- [x] Backup demo recording
- [ ] Peer evaluation form submitted (each team member, separate deliverable)

---

## Philosophy: Clean, Modern, MVP-First

**This is a greenfield project.** We are building from scratch with modern tools and best practices. Avoid:
- Over-engineering (YAGNI - You Aren't Gonna Need It)
- Premature optimization
- Legacy compatibility layers
- Unnecessary abstractions
- Cruft and technical debt from day one

**Principles:**
- Ship MVP fast, iterate based on user feedback
- Use modern tools as intended (Next.js App Router, Supabase, OpenAI API)
- Keep it simple until complexity is justified by real user needs
- Write clean, readable code over clever code
- Test the core flow (task input → AI schedule → display) early and often

---

## Completed Phases (0-6)

Phases 0-6 are complete. See `ai/roadmaps/complete/` for detailed plan and roadmap docs.

| Phase | Name | Summary |
|-------|------|---------|
| 0 | Foundation & Auth | Next.js setup, Supabase, database schema, auth, integration smoke tests |
| 1 | Frontend Layout | Auth pages, dashboard layout, responsive design, marketing pages |
| 2 | PWA & Hosting | Vercel deploy, PWA manifest/service worker, device testing |
| 3 | Core Data Flow | Task CRUD, Google Calendar OAuth, AI scheduling engine, "Build my day", timeline view |
| 4 | Photo-to-Task | Photo upload/extraction via OpenAI Vision, audio-to-task via Whisper |
| 5 | Polish & Validation | Error handling, UX improvements, keyboard shortcuts, schedule persistence, drag-to-reschedule, notifications |
| 6 | Code Quality & Security | CLI test scripts (18 tests), structured logging (16+ files), security hardening, .env.example |

---

## Phase 7: Final Project Setup

**Goal:** Align project infrastructure with the final rubric before building new features. Ensure CLAUDE.md, structured logging, test scripts, and living docs are all rubric-ready so subsequent phases produce grading-ready git history.

### 7.1 CLAUDE.md Alignment
- Update CLAUDE.md to reflect behavioral guidance from Casey's lectures and rubric requirements
- Ensure it references key docs (coding-style, architecture, context.md)

### 7.2 Structured Logging Verification
- Verify structured logging (`lib/logger.ts`) is integrated in actual application code, not just standalone
- Confirm no raw `console.*` calls remain in app code

### 7.3 Test Scripts & Exit Codes
- Run `npm run test:all` — ensure all CLI tests pass
- Verify proper exit codes (0/1/2) on all scripts

### 7.4 Living Docs & Roadmap Hygiene
- Update `aiDocs/changelog.md` with work since midterm
- Verify `aiDocs/context.md` uses bookshelf pattern and is current
- Check off completed roadmap tasks across all phase roadmaps
- Verify `aiDocs/coding-style.md` and architecture docs exist and are current

### 7.5 Add Helpful Skills
- Add skills for common workflows (update changelog, check roadmap tasks, etc.)

**Deliverable:** Project infrastructure is rubric-aligned. CLAUDE.md, logging, tests, and docs are all verified. Clean foundation for Phases 8+.

---

## Phase 8: Desktop Widget

**Goal:** Build a standalone desktop widget that lives outside the browser — a small, always-accessible popup for mid-day interaction. This is the core differentiator: users stay in flow without switching to a browser tab. Includes two interaction modes (compressed pill + full chatbot), Gemini-style chat UI, and built-in authentication.

### 8.1 Widget Shell
- Lightweight Electron wrapper — small floating window, always on top option
- System tray icon; click to open/close the popup
- Launches on login, minimal footprint
- Authenticated session stored locally; communicates with the Stride API backend

### 8.2 Widget UI
- Current task display with time remaining
- Next-up task preview
- Quick-action buttons: mark done, skip, running late
- Text input for adding tasks or sending messages
- Compact schedule overview (condensed timeline)

### 8.3 Sync with Main App
- Widget and web app share the same backend — changes in either reflect immediately
- Widget is the condensed daily driver; web app is the full planning view
- System/toast notifications for schedule changes

### 8.4 Widget Modes (Compressed + Full)
- Compressed mode: 220x48px floating rounded rectangle showing current task + countdown
- Full mode: 380x620px window with header, task bar, chat UI, and input
- Mode switching via IPC, position + mode persistence via electron-store
- Draggable in both modes, tray menu mode toggle

### 8.5 Chat UI (Gemini-style)
- Full mode chatbot interface inspired by Google Gemini's popup
- User/assistant message bubbles, suggestion chips, typing indicator
- Client-side command parsing: "add [task]", "what's next", "schedule", "help"
- ChatController manages message state; `strideChat` bridge prepped for Phase 9 agent

### 8.6 Bug Fixes & Auth
- Bearer token auth added to all API routes (widget sends HTTP, not cookies)
- Shared `api-auth.ts` utility: checks Bearer token first, falls back to cookie auth
- Clear 401 error messages in widget API client

### 8.7 Widget Login & Session Management
- Login screen in widget: email/password form, authenticates directly with Supabase REST API
- Stores access + refresh tokens in electron-store; auto-authenticates on restart
- CSP updated for Supabase domain; colors updated to match website green palette

**Deliverable:** Standalone desktop widget with two modes (compressed + full chat), built-in login, Gemini-style chat UI with command parsing, and Bearer token auth. Runs outside the browser. Syncs with the main web app.

---

## Phase 9: Agentic AI

**Goal:** Distribute the desktop widget for download. Replace single-shot OpenAI scheduling with a LangChain agent tailored to the widget chatbot. Hybrid architecture: LLM for reasoning, deterministic solver for time placement. Agent reused in Phase 10 for web chatbot.

**Reference implementation:** `aiDocs/stride-agent/` — a standalone Next.js agent already built with LangChain/LangGraph ReAct pattern, GPT-4o, 4 tools (calculator, web search, RAG knowledge base, Google Calendar), SSE streaming (`/api/chat`), session-based conversation memory, and Pino structured logging. This phase integrates that agent pattern into the main Stride app with scheduling-specific tools.

### 9.0 Widget Distribution & Download
- Build macOS DMG with electron-builder, host on GitHub Releases
- Homepage section promoting the widget with download CTA
- Dashboard dismissible banner prompting widget download

### 9.1 LangChain Agent Infrastructure
- Adapt the ReAct agent from `aiDocs/stride-agent/` (uses `createReactAgent` from LangGraph, GPT-4o at temperature 0)
- Replace demo tools with scheduling tools (getTaskList, getCalendarEvents, createScheduledBlocks, checkForConflicts, updateTask)
- Reuse SSE streaming pattern from `aiDocs/stride-agent/src/app/api/chat/route.ts`
- Reuse conversation memory pattern; extend with Supabase persistence (`agent_conversations` table)
- Create agent executor with system prompt, scheduling rules, max iteration guardrail

### 9.2 Hybrid Scheduling Architecture
- Deterministic constraint solver for time placement (no LLM time-math)
- Stability-first rescheduling rules (prefer minimal adjustments, cap change count)
- Agent reasons about priority/ordering; solver places blocks

### 9.3 Agent-Powered "Build My Day"
- Replace existing OpenAI call with LangChain agent flow
- SSE streaming endpoint for agent progress (thinking, tool calls, result)
- Frontend and widget both show real-time agent status during schedule build

### 9.4 Chat & Mid-Day Interactions (Widget Chatbot)
- Primary target: widget chatbot — agent replaces `ChatController.processCommand()`
- Wire `strideChat.sendMessage()` IPC to agent SSE endpoint; stream responses back via IPC
- Natural language: progress updates, new tasks, rescheduling, guidance ("what's next?")
- Agent modifies schedule with stability-first rules
- Conversation persistence per user per day (`agent_conversations` table)
- Web app chatbot deferred to Phase 10.2

**Deliverable:** Widget downloadable from homepage and dashboard. Agentic AI powers the widget chatbot and schedule building. Agent reused in Phase 10 for web chatbot.

---

## Phase 10: Integrations & Web Chatbot

**Goal:** Add Outlook Calendar as second provider. Add a lightweight chatbot to the web app for users who don't have the widget installed.

### 10.1 Outlook Calendar Integration
- Azure AD app registration, Microsoft OAuth flow
- New `calendar_tokens` table (multi-provider token storage); migrate Google tokens
- Fetch Outlook events via Microsoft Graph API; merge all providers into single busy-windows list

### 10.2 Web Chatbot
- Sliding chat panel on the web app dashboard — lightweight interface to the same agent
- For users on mobile or without the desktop widget
- Same SSE streaming, same agent, same conversation history

### 10.3 Additional Integrations (If Validated)
- Todoist task import, Slack notifications — one at a time, driven by customer feedback

**Deliverable:** Outlook Calendar supported. Web chatbot provides agent access on all platforms. Optional integrations based on user demand.

---

## Phase 11: Beta Launch

**Goal:** Launch to 5-10 external users and gather feedback on the full product (widget + agent + multi-calendar).

### 11.1 Beta Preparation
- Set up analytics (build day, chat messages, quick-actions, calendar connections)
- Set up error logging (Sentry or similar) including agent errors
- Create onboarding flow (connect calendar, add task, build day, install widget)

### 11.2 Beta Launch
- Invite 5-10 users (freelancers, developers, students, ADHD community)
- Monitor usage, errors, and agent performance daily
- Collect feedback via survey and 1-on-1 calls

### 11.3 Rapid Iteration
- Fix critical bugs within 24 hours
- Quick UX wins based on feedback
- Prioritize next features

**Deliverable:** Full product validated with real users. Feedback collected, priorities identified.

---

## Phase 12: Secondary Features (Post-Beta)

**Goal:** Add goals, personalization loop, and refinements — driven by beta feedback.

### 12.1 Goals
- Goal data model, UI, link tasks to goals, agent prioritizes goal-linked tasks

### 12.2 Personalization Loop
- Track user patterns (duration accuracy, skip patterns, productive hours)
- Agent auto-adjusts future schedules based on learned patterns

### 12.3 Refinements (If Validated)
- Multi-day view, task edit, calendar caching — only if users ask for them

**Deliverable:** Goals and personalization shipped. Refinements only if validated.

---

## Dependencies & Critical Path

**Critical path (must happen in order):**
1. Phase 7 (Final Project Setup) — must complete before building new features
2. Phase 8 (Widget) → Phase 9 (Agent) — agent lives inside the widget
3. Phase 10 (Integrations) can partially overlap with Phase 9
4. Phase 11 (Beta) → Phase 12 (Secondary Features) based on feedback

**External dependencies:**
- Electron or Tauri for desktop widget (Phase 8)
- LangChain packages (Phase 9)
- Azure AD app registration for Outlook OAuth (Phase 10)
- Sentry or similar for error logging (Phase 11)

---

## Success Criteria (MVP)

From `aiDocs/mvp.md`, the MVP is successful if:
- Next.js app runs and is responsive on mobile
- PWA installable on at least one phone (iPhone or Android)
- Desktop widget runs standalone and stays in sync with web app
- Users can add tasks (text, photos, voice)
- "Build my day" generates a daily schedule via agentic AI from tasks + calendar
- Agent accessible from both widget and web app for mid-day interactions
- Daily view shows the built schedule clearly
- Users would actually use this daily (validated in beta)

---

## What We're NOT Building (Yet)

To avoid scope creep and over-engineering:
- No tomorrow or multi-day view (today only)
- No task edit (delete + re-add is fine)
- No calendar event caching (fetch on demand is fine)
- No calendar providers beyond Google and Outlook (Apple Calendar is future)
- No personalization loop (user-provided estimates until Phase 12)
- No team features (single-user only)
- No task manager integrations (Todoist, Notion — future)

These can be added post-beta if validated by users.

---

## Next Steps

1. Phases 0–8 are complete (see `ai/roadmaps/complete/`)
2. **Next: Phase 9** (Agentic AI) — widget distribution, LangChain agent replaces client-side command parsing
3. **Then Phase 10** (Integrations) — Outlook Calendar, web chatbot reuses Phase 9 agent
4. **Then Phase 11** (Beta Launch) — validate full product with real users

---

## Notes

- This plan assumes a small team (1-3 people) working full-time
- Timeline is aggressive but achievable with AI-assisted development
- Adjust phases based on real progress and blockers
- Prioritize shipping over perfection; iterate based on user feedback
- Update `aiDocs/context.md` → "Current Focus" as you move through phases