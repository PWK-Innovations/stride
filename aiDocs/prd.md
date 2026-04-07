# Product Requirements Document: AI-Powered Daily Planner

## 1. Problem Statement

The system we are interested in is a daily planner. Knowledge workers with unstructured or variable schedules — freelancers juggling multiple clients, remote professionals without office routines, developers switching between deep work and meetings, and students balancing coursework with jobs — all face the same core problem: they spend significant mental energy deciding what to work on, when to work on it, and how to adjust when plans inevitably change. This decision fatigue is especially acute for individuals with ADHD or executive function challenges, where task initiation and prioritization are the primary barriers to productivity, not motivation or ability.

These users coordinate tasks, deadlines, meetings, and personal goals across multiple tools such as calendars, to-do lists, and reminders. They constantly evaluate priorities, estimate time requirements, and make tradeoffs between competing responsibilities. They also engage in ongoing feedback loops by adjusting schedules when plans change, responsibilities take longer than expected, or new tasks arise. But the plan they make in the morning rarely survives contact with the day — meetings shift, tasks overrun, unexpected work appears, and the schedule becomes stale.

In summary, our daily planning system addresses two connected problems: how people plan their day from competing responsibilities, and how they keep that plan on track as reality changes throughout the day.

**How we got here — the pivot journey:** Stride's original approach was single-shot AI scheduling: users typed tasks, an OpenAI call produced a daily schedule, done. Customer feedback drove the first evolution — voice memos and photo-to-task were added for zero-friction capture (scan a whiteboard, dictate a task while walking). But the deeper insight came from watching how users actually worked: the morning schedule was dead by lunchtime, and requiring a browser tab for every interaction meant users fell back to sticky notes and mental lists. Existing tools — including ChatGPT — require opening a browser and copy-pasting context. This led to the core pivot: (1) replace the single-shot AI with a fully agentic system (multi-step LangChain agent that reasons, uses tools, and adapts the schedule conversationally throughout the day), and (2) build a standalone desktop widget that lives outside the browser — a small, always-on-top window as accessible as checking the clock. The widget makes the agent accessible without context-switching; the agent makes the schedule alive instead of static.

## 2. Target Users

**Primary Users:** Knowledge workers with unstructured or variable schedules — including freelancers, developers, and remote professionals — who need help deciding what to work on and when, not just a place to store tasks.

**Secondary Users:** Busy college students balancing coursework, jobs, and extracurriculars; individuals with ADHD or executive function challenges who benefit from external structure and proactive "what to do next" guidance.

**NOT For:** Individuals who prefer manual scheduling, those whose daily routines are fixed and predictable, or teams looking for shared project management (Stride is single-user).

## 3. Goals and Success Metrics

**Goals:**

- Deliver as an installable PWA with browser notifications for reminders (app-like window and icon; task reminders at scheduled start time where supported).
- Use AI to build and maintain a realistic daily schedule: AI constructs the schedule from priorities, deadlines, calendar availability, and (where applicable) goals; the system is active, not a passive container.
- Use AI to reduce decision fatigue: AI provides clear guidance on what to work on next (and optionally why), so users don't have to constantly decide.
- Use AI to dynamically adjust schedules when plans change: When meetings shift, tasks overrun, or new items appear, AI re-schedules and updates the plan in real time so the system embodies the ongoing feedback loops from the problem statement.
- Use an agentic AI system to keep the schedule alive throughout the day: Users interact with a conversational agent via a chat interface to report progress, add tasks, and get guidance — the schedule adapts continuously rather than being a static morning artifact.
- Handle overload gracefully: When tasks cannot fit into available hours, the agent proactively surfaces the conflict and suggests what to defer or drop — rather than silently cramming tasks into impossible slots or leaving the user to figure it out.

**Success Metrics:**

- **Time Saved (Automation Adoption):** Users save 15–30 min/day in manual planning time compared to their previous workflow. Measured via user self-report surveys comparing time spent planning before and after adopting Stride.
- **AI Accuracy (AI Effectiveness):** Fewer than 40% of AI-generated schedule slots require manual edits (moves, deletions, or additions). Measured by tracking manual schedule modifications after an AI build.
- **Schedule Realism:** At least 2/3 of users report the AI-built schedule is realistic and actionable. Measured via in-app survey or beta feedback.
- **Engagement (Retention):** 50%+ of active users engage with Stride at least 3x/week. Measured by tracking unique active sessions per user per week.
- **Retention:** Target positive week-over-week retention (users returning the following week). Measured by weekly cohort analysis.
- **Reliability:** Calendar sync completes without errors in 95%+ of attempts. Scheduled task durations and placements are conflict-free.

## 4. Key Features (P0, P1, P2)

**P0: Foundation & UI**

- Next.js website architecture and routing
- User authentication system
- Calendar view component
- Task input/management interface (text, photo-to-task, voice memos)
- Responsive design for web and mobile

**P1: Core Automation, Agentic AI & Desktop Widget**

- Calendar integration (Google Calendar + Outlook Calendar)
- Agentic AI scheduling system (LangChain): multi-step reasoning, tool use, error recovery, and conversational interaction for schedule building and mid-day adjustments
- Hybrid scheduling architecture: LLM handles reasoning, intent, and priority decisions (natural language → structured JSON); deterministic constraint logic handles actual time placement and conflict detection (no LLM time-math hallucinations)
- Dynamic re-scheduling with stability buffer: when plans change, prefer minimal adjustments (cut or defer low-priority tasks) over cascading ripple effects across the entire day. Optimize for psychological comfort, not perfect time utilization — constant reshuffling creates "moving goalpost" anxiety, especially for ADHD users who need anchoring
- Desktop widget: standalone Electron/Tauri window, system tray icon, current task display with time remaining, quick-action buttons (done, skip, running late), text input for agent interaction
- Chat modal on web app for fuller agent interaction (sliding panel, conversational scheduling)
- SSE streaming for real-time agent progress (thinking, tool calls, result) in both widget and web app

**P2: Enhanced User Experience**

- Audio chat: voice input for agent interaction in both web chat panel and desktop widget (reuses Whisper transcription pipeline from Phase 4)
- AI time estimation: GPT-estimated task durations for audio, photo, and chat-created tasks — editable by user before confirmation (manual entry unaffected)
- Widget upgrades: task completion → "start next task?" prompt, "need more time" quick-add options (+15/+30/+60 min), scrollable daily schedule in expanded mode, chat overlay on schedule
- Goal incorporation into scheduling logic
- Personalization loop: the agent learns user patterns over time (e.g., user consistently underestimates deep work by 20%, is more productive in mornings, always skips afternoon tasks) and auto-adjusts future schedules accordingly — duration padding, optimal slot placement, realistic capacity estimates
- Proactive focus guidance ("You have 45 minutes before your next meeting — good time to tackle X")

## 5. User Stories

- As a freelancer, I want to dump my tasks for the day and have the AI figure out when I should do each one, so I stop wasting time reorganizing my calendar between client projects.
- As a remote professional, I want my schedule to automatically adjust when meetings shift or tasks run long, so I always have a realistic plan for the rest of the day.
- As a student, I want the app to look at my current calendar to find the best time for each task so I don't have to plan it myself.
- As someone with ADHD, I want the app to tell me what to work on next and when to start, so I don't get stuck in decision paralysis between tasks.
- As a developer, I want to snap a photo of my whiteboard standup notes and have them become scheduled tasks, so I can go straight from standup to focused work.
- As a busy worker, I want to tell the chat "I finished early" or "I'm running late" and have the schedule adjust automatically, so the plan stays useful all day.
- As a developer in a flow state, I want to glance at a small desktop widget to see my next task without switching to a browser tab.
- As a freelancer between calls, I want to tap "Done" on the widget and immediately see what's next, so I never lose momentum.
- As a goal-oriented individual, I want my daily schedule to help me achieve my specific life goals (social, academic, professional).
- As an overwhelmed user, I want my schedule to include breaks automatically so the plan remains realistic and achievable.

## 6. Competitive Landscape

**Primary Competitors:**

- **Motion** ($19-49/mo): Aggressive AI scheduler with project management. Strengths: comprehensive automation. Weaknesses: high price, glitchy mobile app, unpredictable reshuffling creates stress.
- **Reclaim.ai** ($10-22/mo): Adaptive habit defense within Google Calendar. Strengths: protects focus time, affordable. Weaknesses: basic task management, no native mobile app (mobile web only).
- **Akiflow** ($19/mo): Fast, keyboard-driven task aggregator. Strengths: integration hub (Jira, Slack, Gmail). Weaknesses: expensive, no mobile app.

**Stride's Differentiators:**

- **"AI keeps your day on track"**: Not just a schedule generator — an agentic AI system that monitors and adapts your schedule throughout the day. Competitors produce a static plan; Stride's agent responds when you finish early, run late, get a new task, or lose a meeting. The schedule is alive.
- **Conversational scheduling agent**: A chat interface to interact with your schedule naturally ("I'm running 20 minutes behind", "add groceries after work", "what should I do next?"). No competitor offers this — they all require manual drag-and-drop or button presses.
- **Zero-friction multi-modal input**: Scan whiteboards, syllabi, handwritten notes via photo; record voice memos; type quick text. The full pipeline from capture to scheduled calendar block is seamless (competitors don't have this).
- **PWA-first**: Installable on phones with app-like feel; faster updates than native apps; no app store friction.
- **Price positioning**: $12-15/mo target (between Reclaim and Motion); more features than Reclaim, more affordable than Motion.
- **Stability-first rescheduling**: When plans change, the agent prefers minimal, calm adjustments — cutting or deferring a low-priority task rather than ripple-shuffling the entire afternoon. Competitors like Motion are notorious for anxiety-inducing reshuffles; Stride respects the user's need for anchoring.
- **Personalization over time**: The agent learns how you actually work — if you always underestimate deep work or skip afternoon tasks, future schedules adapt. This is the feature worth paying for monthly.
- **Multi-calendar support**: Google Calendar and Outlook Calendar — covers both personal and enterprise users (Reclaim is Google-only).
- **Always-accessible desktop widget:** Not another browser tab. A small, standalone window that lives on your desktop — check your current task, mark it done, add a new one, or ask "what's next?" without leaving what you're working on. ChatGPT requires opening a browser and copy-pasting context. Motion and Reclaim live in browser tabs. Stride's widget is as accessible as checking the clock.

## 7. Out of Scope

- Manual-only planning tools that rely heavily on users to prioritize work manually.
- Basic "container" apps (like simple Notes apps) that act only as storage for information.
- Physical/analog planning coordination.
- Team/shared calendars — single user only, no team scheduling.
- Calendar providers beyond Google and Outlook (Apple Calendar is future).
- Native mobile apps — PWA only.
- Task manager integrations (Todoist, Notion) — future scope.
- Communication integrations (Slack) — future scope.

## 8. Risks and Mitigations

- **Risk:** The system creates unrealistic daily plans or overloads the user.  
  **Mitigation:** Incorporate ongoing feedback loops and adjust schedules when tasks take longer than expected.

- **Risk:** Technical issues with calendar syncing lead to inaccurate schedules.  
  **Mitigation:** Prioritize robust API connections for real-time syncing to ensure the user always has an accurate plan.

- **Risk:** Users find the initial setup too difficult or continue to manage schedules manually.  
  **Mitigation:** Automate the "best time" selection process to reduce the need for manual input.

- **Risk:** The agentic AI system produces unpredictable or runaway behavior (e.g., infinite loops, unexpected calendar modifications).  
  **Mitigation:** Enforce guardrails: maximum iteration count per agent run, user confirmation before any external writes (Google/Outlook Calendar), scope agent to today's data only, and log all agent actions for debugging.

- **Risk:** Broadening target audience dilutes the product and makes it generic.
  **Mitigation:** Keep the core loop tight (tasks in, schedule out, agent adapts). Target users share the same fundamental need (unstructured time + decision fatigue); features serve all segments without segment-specific customization.

- **Risk:** Desktop widget adds cross-platform complexity (Electron/Tauri packaging, native OS differences, auto-update).
  **Mitigation:** Start with a single platform (macOS or Windows) for MVP. Use Electron for faster iteration; consider Tauri later for smaller binary size. Widget is a thin client — all logic lives in the API backend.

## 9. Pricing and Go-to-Market (High-Level)

**Pricing Strategy:**
- **Free tier:** Limited AI scheduling (e.g., 10 schedules/month) for acquisition.
- **Professional:** $12-15/mo (unlimited AI scheduling, agent chat, photo-to-task, multi-calendar, full features). Target: freelancers, remote professionals, developers.
- **Student discount:** 50% off (standard in productivity tools; critical for student adoption and ADHD community).

**Go-to-Market:**
- **Launch:** Product Hunt (premier platform for AI tools).
- **Communities:** Reddit (r/productivity, r/ADHD, r/freelance, r/remotework, r/college, r/cscareerquestions), ADHD-focused communities (How to ADHD, ADHD Twitter/TikTok), freelancer communities (Indie Hackers, freelance Slack groups), referral loops ("invite a peer" for extended trial).
- **Positioning:** "Cognitive Orthotic" for ADHD users and students (AI decides what's next so you don't have to); "Always-On Scheduling Assistant" for freelancers and remote workers (your day adapts as reality changes); "Deep Work Defense" for developers (protect focus time, AI handles the reshuffling).

## 10. Timeline and Milestones

- **Milestone 1 (P0 — Foundation & UI):** Next.js app layout, routing, auth, calendar view component, task input/management UI (text, photo-to-task, voice memos), and responsive design. Ship a working website users can open and navigate.
- **Milestone 2 (P1 — Core Automation, Agentic AI & Desktop Widget):** Calendar integration (Google Calendar + Outlook Calendar), agentic AI scheduling system (LangChain) with multi-step reasoning and hybrid architecture (LLM reasoning + deterministic solver), desktop widget (standalone Electron/Tauri window, system tray, current task display, quick actions, agent text input), chat modal on web app, SSE streaming for real-time agent progress. Users get an AI-built daily schedule and can interact with the agent from both the widget and the web app.
- **Milestone 3 (P2 — Enhanced UX):** Goal incorporation into scheduling, personalization loop (learn user patterns, auto-adjust), proactive focus guidance. Future: Todoist import, Slack integration.