# Final Presentation — Slide-by-Slide Reference

This document mirrors the actual Canva deck (35 slides) as of April 2026.

---

## Slide 1: Title

- "Stride — A daily planner for focused work"
- Header: Stride / Team 2

---

## Slide 2: Our Team

- Parker Watts — Project Manager
- Alex Fankhauser — Software Engineer
- Caleb Gooch — Product Engineer

---

## Slide 3: "The Problem, Refined"

- "Knowledge workers with unstructured schedules lose momentum every time their day changes."
- Three pain points: Decision Paralysis, Context Switching, Constant Replanning

---

## Slide 4: System Design (Before Stride)

- "System Design" — system diagram showing the manual rescheduling loop
- Knowledge Workers → Tasks (scattered across tools) + Calendars (Google, Outlook) → User builds a plan for the day → Changes (disruptions, shifting priorities, tasks taking longer or finishing early, new requests) → Manual Rescheduling Loop (Change happens → User stops working → Mentally reshuffles → Momentum Breaks → Resume)
- Ecosystem: Workers with unstructured schedules — tasks come from multiple tools, priorities shift throughout the day, and frequent interrupts make static plans obsolete within hours
- Goal: Turn available time into focused, productive work. Reduce cognitive load
- Leverage Point: Human Coordination. Every change routes through the user and requires them to reason, plan, and act

---

## Slide 5: With Stride

- Same structure as slide 4 but with Stride's solution
- "Stride plans out the day" replaces "User builds a plan for the day"
- Stride Scheduling Loop: Change happens → User taps the widget → Stride replans → Back to work
- Leverage Point: Eliminate scheduling cost. The Stride agent reasons, plans, and acts — the user just approves

---

## Slide 6: Founding Hypothesis

- Header: "Our Hypothesis"
- "Founding Hypothesis"
- "Knowledge workers will use an AI-powered schedule that adapts throughout the day — via a desktop widget and chat agent — and will report less time planning and more time in focused work."

---

## Slide 7: Falsification Tests — What We Set Out to Prove

- Header: "Falsification Tests"
- Title: "What We Set Out to Prove"
- Three columns:

**Planning Pain:**
- Do knowledge workers actually struggle with daily planning?
- Threshold: **50%+ rank planning as a top-3 challenge**
- Executed at midterm — 75% passed

**Automation Acceptance:**
- Will users accept AI-generated schedules without manual edits?
- Threshold: **60%+ of schedules accepted as-is**
- *Testing ahead*

**Reduced Planning Overhead:**
- Will users report the AI-built schedule feels realistic?
- Threshold: **67%+ report schedule is realistic and actionable**
- *Testing ahead*

---

## Slide 8: The Journey, Part 1: The Agentic AI — Sarah

- Sarah — Developer at AWS
- **Decision paralysis** — knows what needs doing, can't pick what's next
- What We Heard → What We Built:
  - Sarah's paralysis → we built the agentic AI that can make scheduling decisions for her
  - Return interview: accepted 4/5 schedules, wants next-task suggestion when finishing early

---

## Slide 9: The Journey, Part 1: Single-Shot → AI Chatbot

- Left: old Single-Shot (midterm landing page screenshot)
- Right: AI Chatbot (new dashboard with task creation UI)
- Arrow showing the evolution

---

## Slide 10: The Journey, Part 2: The Desktop Widget — Pete

- Pete — Developer at Bacon Work
- Lost momentum switching between tools (context switching). No way to track progress without leaving his workflow.
- What We Heard → What We Built:
  - Pete wanted progress tracking → we built the desktop widget
  - Return interview: loved the accountability, wants more flexible time options

---

## Slide 11: The Journey, Part 2: Browser → Widget

- Left: Browser (web app screenshot)
- Right: Widget (desktop widget screenshot showing task with timer)
- Arrow showing the evolution

---

## Slide 12: Differentiation / Competitors

- Header: "The Journey, Part 2: The Desktop Widget"
- Main Differentiation: "Why don't I just use ChatGPT for this?" — Pete
- Because ChatGPT lives in a browser tab. So does every competitor. Stride's desktop widget is always on screen — no context switching, no copy-pasting.
- Competitors:
  - **ChatGPT** — Requires a browser tab and manual context every session.
  - **Motion** — Automates scheduling, but has no desktop presence — lives in a browser.
  - **Reclaim.ai** — Calendar blocking, but complex setup and no quick-access widget.
- 2x2 grid: Simple/Complex vs Manual/Automatic — Stride in Simple + Automatic quadrant

---

## Slide 13: The Journey, Part 3: Customer Testing Results

- Three columns: Michael, Hailey, Baylor

**Michael — PM at Redo:**
- Accepted 4/5 generated plans
- Described 4 as realistic
- Wants full-day view in widget
- Wants team calendar sync for meeting coordination
- Key Insight: Widget needs full schedule view and more functionality.
- **Inspired Widget Functionality Upgrades**

**Hailey — Analyst at Anglepoint:**
- Described the widget as easy to use
- Accepted 2/5 generated plans
- Tool underestimated task duration when she didn't specify
- Default 30-min was too short for her work
- Key Insight: Need smarter default durations based on task type.
- **Inspired AI Time Estimation**

**Baylor — Developer at Bidi:**
- Loved photo/audio task creation.
- Accepted 4/5 plans.
- Wants full daily schedule in widget.
- Wants audio chat with Stride agent.
- Key Insight: Users want voice interaction beyond task creation.
- **Inspired Chatbot Audio Input**

---

## Slide 14: The Journey, Part 3: Customer Testing Results — Videos

- Three product screenshots/videos side by side:
  - **AI Time Estimation** — web app task creation form
  - **Widget Functionality Upgrades** — widget with full daily schedule view, Done/Skip/Need more time buttons
  - **Chatbot Audio Input** — widget with chat input and daily schedule

---

## Slide 15: Where We Stand — Falsification Tests

- Header: "Where We Stand + What We Learned"

**Planning Pain Point:**
- 75% of workers interviewed ranked planning as a top-3 pain point.
- This passes our threshold of 50%.

**Automation Acceptance:**
- 68% of generated schedules were accepted without any alteration.
- This passes our threshold of 60%.

**Reduced Planning Overhead:**
- 80% of generated schedules were described as realistic and actionable (17 without alteration, 3 with minor user alteration).
- This passes our threshold of 67%.

---

## Slide 16: What We'd Do Differently

- Header: "Where We Stand + What We Learned"
- Two columns:

**What We'd Do Differently:**
- Start with the widget earlier — it's the differentiator
- Build agent-first instead of single-shot-then-pivot
- More customers found earlier in the process

**Honest Limitations:**
- Agent can be slow on complex schedules
- Default task durations need work
- Limited tool integrations
- No team-level scheduling yet

---

## Slide 17: Links + Q&A

- Header: "Links + Q&A"
- GitHub Repository: https://github.com/PWK-Innovations/stride
- Deployed Site: https://stride-amber.vercel.app/

---

## Slide 18: Appendix (divider)

- "Appendix"

---

## Slide 19: Appendix a — Deep Analysis of Customer (Personas)

Three columns:

**The Focus-Driven Worker:**
- Core Pain: The "23-Minute Rule." It takes ~23 minutes or more to regain deep focus (flow) after a single tool-switch or interruption.
- The Cost: Context switching when switching between tools costs employees roughly 1-2 hours of daily productivity.
- Key Insight: Knowledge workers with unstructured schedules need flow preservation — an AI that manages their day so they can work efficiently, rather than constantly replan their time.

**The Overwhelmed Starter:**
- Core Pain: Intention vs. Action. They know what needs to get done, but juggling competing tasks makes starting any of them the hardest part.
- The Cost: 47% of students say time management is their main challenge. Hours lost to decision paralysis lead to missed deadlines and lost sleep.
- Key Insight: These users need a low-friction "cognitive orthotic" — an AI that can make decisions by telling them what to do next and when to start.

**The Derailed Professional:**
- Core Pain: The morning plan never survives the day. Meetings shift, tasks overrun, and new requests appear. By noon, the schedule is fiction.
- The Cost: They either spend 15-30 minutes replanning manually or abandon the plan entirely and wing it. Either way, important work slips.
- Key Insight: These professionals don't need a better schedule generator, they need a living schedule. An AI agent that adapts the plan in real-time with minimal manual effort.

---

## Slide 20: Appendix b — Customer Interview Notes Pre-development 1

Three columns: Baylor, Pete, Matt

**Baylor — Developer at Bidi:**
- Uses Google Sheets to manage a backlog of tickets and daily tasks.
- Described his ideal workflow as recording a short daily planning "standup" and having tasks automatically created from the audio.
- Finds manual task entry repetitive and time-consuming.
- Wants a system that prioritizes automatic + simple inputs over complex setup.
- Key Insight: Audio/photo input and automatic task generation are key for our product.

**Pete — Developer at Bacon:**
- Uses Notebook LM to store planning notes and meeting summaries.
- Struggles most with prioritization and tracking progress linearly through projects.
- Often loses momentum when switching between tools to update task status.
- Liked the idea of a persistent popup for progress updates and dynamic reprioritization.
- Key Insight: Need a popup assistant and dynamic schedule rebuilding.

**Matt — Developer at Snare:**
- Uses a whiteboard and notes app to organize tasks.
- Said task management itself isn't a major pain point for him.
- Prefers lightweight workflows and doesn't want heavy automation.
- Works best with fixed routines rather than rapidly changing schedules.
- Key Insight: Stride is best for developers with rapidly changing days, not fixed workflows.

---

## Slide 21: Appendix b — Customer Interview Notes Pre-development 2

- Sarah — Developer at AWS
- Uses an internal task management system at work. Has daily standups to make updates.
- Loses valuable development time parsing through various communication channels when working remote.
- Feels overwhelmed with her backlog, which leads to decision paralysis.
- Wants help with estimating task duration and setting concrete priorities.
- Key Insight: The AI can bring value by simply choosing the next task for people who struggle with decision paralysis.

---

## Slide 22: Appendix b — Customer Interview Notes Test Users 1

Three columns: Michael, Hailey, Pete

**Michael — PM at Redo:**
- Really liked the tool and thought the functionality was great.
- Accepted 4 of 5 generated plans; described 4 as realistic.
- Wished he could see the full daily schedule within the widget.
- Wants Stride to be able to sync the Google calendars of other employees in his team to ensure meeting schedules work for all involved.
- Key Insight: AI-generated schedules are generally reliable. His suggestion could be a future development, but Google does this well already.

**Hailey — Analyst at Anglepoint:**
- Described the widget as easy to use.
- Accepted 2 of 5 generated plans; described 3 as realistic (one after minor alteration).
- Had an issue with the tool underestimating task length when she did not state a duration.
- Wants to be able to split larger tasks around prescheduled blocks like meetings.
- Key Insight: Need to review the default 30-minute task length and integrate task-splitting functionalities for longer tasks.

**Pete — Developer at Bacon:**
- Loved the widget as a way to stay accountable and focused on the active task.
- Accepted 3 of 5 generated plans; described 4 as realistic (one after minor alteration).
- Saw mixed results when trying to move tasks via the chat bot.
- Wants the widget to allow for more time to be added when clicking "Need more time" than just 15 min.
- Key Insight: Stride is better at generating the full plan than it currently is at updating that plan. Needs attention.

---

## Slide 23: Appendix b — Customer Interview Notes Test Users 2

Two columns: Sarah, Baylor

**Sarah — Developer at AWS:**
- Thought the app and widget were valuable to keep her on track by helping her see what task is active and what comes next.
- Accepted 4 of 5 generated plans; described 4 as realistic.
- Wants the widget to suggest moving up the next task when marking one as done early.
- Wants Stride to be able to pull from her internal task system.
- Key Insight: The app does help with decision paralysis. There are lots of possibilities for further iterations to improve.

**Baylor — Developer at Bidi:**
- Loved the ability to upload photos or record audio for automated task creation.
- Accepted 4 of 5 generated plans; described 5 as realistic (one after minor alteration).
- Wants to be able to see the full daily schedule in the widget.
- Wants to be able to chat with the Stride agent using audio (like with the task creation) within the widget.
- Key Insight: The widget can be upgraded to be even more effective. Needs consideration as maybe not all suggestions fit in this sprint.

---

## Slide 24: Appendix c — Falsification Test 1

- **Planning Pain Point**
- Method: Interview software engineers at startup companies. Ask about their current processes and how (if at all) planning struggles affect their productivity. Ask them to rank their top-3 pain productivity challenges.
- Threshold: If fewer than 50% of developers rank daily planning as a top-3 productivity challenge, our hypothesis is false. A rate of 50+% demonstrates a consistent need across our target customer group.
- Results: Out of 4 developers interviewed, 3 of them indicated daily planning as a top-3 productivity challenge. This is a rate of 75%. While promising, concrete verification will require a larger sample size.

---

## Slide 25: Appendix c — Falsification Test 2

- **Automation Acceptance**
- Method: Have knowledge workers test the app and review 5 different generated schedules (with either real or hypothetical daily tasks). Ask if each schedule is free of conflicts and if they would accept it without alteration.
- Threshold: If less than 60% of generated schedules are accepted, our hypothesis is false. An acceptance rate of 60+% demonstrates consistent AI decision quality.
- Results: Out of 5 customers interviewed, 17 of 25 schedules were accepted. This is a rate of 68%, which is above the threshold.

---

## Slide 26: Appendix c — Falsification Test 3

- **Schedule Realism**
- Method: Have knowledge workers test the app and review 5 different generated schedules. Then ask the following questions: 1. With minor adjustments, is this a realistic schedule? 2. Could you actually follow it?
- Threshold: If less than 67% of generated schedules are described as realistic and actionable, our hypothesis is false. A success rate of 67+% validates consistent practical utility of the app.
- Results: Out of 5 customers interviewed, 20 of 25 schedules were accepted (3 of which required up to two minor alterations). This is a rate of 80%, which is above the threshold.

---

## Slide 27: Appendix d — 2x2 Differentiation Grid

- 2x2 grid: Simple/Complex (Y-axis) vs Manual/Automatic (X-axis)
- ChatGPT: Simple + Manual
- Motion: center (slightly Manual + Complex)
- Reclaim.ai: Complex + slightly Automatic
- Stride: Simple + Automatic

---

## Slide 28: Appendix e — Systems Architecture Design 1 — Without Stride

- Full system diagram (same as slide 4 but in appendix format)
- Manual Rescheduling Loop with red dashed border

---

## Slide 29: Appendix e — Systems Architecture Design 1 — After Stride Implementation

- Full system diagram (same as slide 5 but in appendix format)
- Stride Scheduling Loop with green border

---

## Slide 30: Appendix f — Alternative Problems Considered

Three columns:

**Relocation & Travel Decision:**
- The options are overwhelming. There are too many cities with no clear way to compare.
- Cost of living, job market, lifestyle, and culture all matter. Weighing them together feels impossible.
- Hours disappear into Reddit threads, blogs, and spreadsheets with no clear answer at the end.
- Personal priorities exist, but there's no way to match them to the right place without a research spiral.
- Key Insight: People don't lack information about cities; they lack a way to make it personal and actionable.

**Creative Content Creation:**
- Small teams and solo founders need ads that convert but can't afford agencies or designers.
- There's no way to know what messaging, format, or targeting will perform before spending money.
- The result is generic ads that don't stand out — and no clear path to fixing them.
- Quality creative and strategic guidance shouldn't be accessible to only big teams.
- Key Insight: Small businesses need creative and strategic guidance built-in to the creation process.

**Finding the Perfect Gift:**
- The occasion is on the calendar but you don't know where to even start.
- Generic gifts feel lazy, but thoughtful, handmade gifts require time and insight.
- The result is endless scrolling through Amazon with no real confidence in what gets chosen.
- The right gift requires knowing the person, the relationship, and the moment — all at once.
- Key Insight: The hardest part of gift-giving is translating how well you know someone into the right item.

---

## Slide 31: Appendix g — Pivot Plans

Two columns:

**Success Pivots:**
- Task Ingestion: Integrate with multiple channels — Slack, email, GitHub, etc. — to fully automate task ingestion daily.
- Team-Level Planning: Expand from individual daily plans to coordinating across a team or group.
- Meta Glasses Colab: Integrate with smart glasses to offer dynamic task creation and real-time progress tracking.

**Failure Pivots:**
- API-First Scheduling Engine: Sell the scheduling intelligence as an API that plugs into the tools they already use (Asana, Jira, etc.).
- Sell the Widget, Not the App: If web app engagement is low but widget usage is high, strip down to just the widget and chat agent.
- Accountability Partner: If users don't consistently use the planning function, pivot to an AI companion that keeps people on track.

---

## Slide 32: Appendix h — How Customer Feedback Influenced Iterations — Summary

| Customer | What We Heard | What We Built |
|---|---|---|
| Baylor - Dev at Bidi | Wanted audio translation for task input | Voice-to-task feature + audio input for chatbot |
| Pete - Dev at Bacon | Lost momentum switching tools to track progress | Desktop widget with task tracking and quick actions |
| Sarah - Dev at AWS | Decision paralysis choosing what to work on next | Agentic chatbot + widget suggests next task on completion |
| Hailey - Analyst at Anglepoint | Tool underestimated task durations | AI-suggested task length in web app |
| Michael - PM at Redo | Wanted full daily schedule visibility | Full calendar view in widget |

---

## Slide 33: Appendix i — Slack Verification of Mixed Task Tracking Tools — Planning Pain Point

- Screenshot of Slack poll: "Quick poll; which software do you use to track tasks:"
- Options: Linear (11), GitHub/GitLab Issues (6), Notion (11), Asana (4), Trello (2), Physical whiteboard / sticky notes (7), Slack threads / DMs (6), Nothing / just vibes (3), Other

---

## Slide 34: Appendix j — Midterm Iteration Demo Video

- Screenshot/placeholder of midterm demo video (Stride landing page + Cloudflare support dashboard)

---

## Slide 35: Appendix k — Final Iteration Demo Video (Backup Demo Video)

- Screenshot/placeholder of final demo video (Stride landing page + Cloudflare support dashboard)

---

## Narrative Arc Summary

| Beat | Slides | Purpose |
|---|---|---|
| **The Setup** | 1-7 | Title, team, problem, system diagrams, hypothesis, falsification test promises |
| **The Journey** | 8-14 | Three iteration stories with real customers driving real changes |
| **The Payoff** | 15-16 | Deliver on the promise — results, metrics, honest learnings |
| **The Close** | 17 | Links + Q&A |
| **Appendix** | 18-35 | Personas, interview notes, falsification test details, differentiation, architecture, alternatives, pivots, iteration summary, Slack poll, demo videos |

---

## Speaker Assignments (suggestion)

- **Parker:** Slides 1-7 (opening, team, problem, system diagrams, hypothesis, falsification setup)
- **Caleb:** Slides 8-14 (customer personas, iteration stories, customer testing)
- **Alex:** Slides 15-17 (falsification results, learnings, links + live demo)
