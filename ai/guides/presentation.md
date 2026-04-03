# Stride — Final Presentation Guide

## Midterm Recap (Do NOT re-present — use as foundation)

### Team
- **Parker Watts** — Project Manager
- **Alex Fankhauser** — Software Engineer
- **Caleb Gooch** — Product Engineer

### Midterm Core Narrative
- **Problem:** "The 1:00 PM Decision Gap" — startup software engineers lose productive focus by constantly reshuffling tasks across disconnected tools (Asana, Calendar, Slack). ~15 minutes lost reorganizing after finishing a major task.
- **Pain points:** Constant reprioritization, decision fatigue, context switching
- **Customers:** Startup software engineers (primary), busy students with part-time jobs (secondary), overbooked professionals (tertiary). NOT people with fixed routines.
- **Hypothesis:** Startup developers will use an AI-generated, auto-updating daily plan — requiring minimal manual setup — and will report more deep work hours and higher task completion rates.
- **Solution:** Add tasks (text, photos, audio) → tap "Build My Day" → AI builds schedule from tasks + calendar → small popup for progress updates → Stride dynamically rebuilds schedule.

### Midterm Falsification Tests
1. **Planning Pain (Executed):** Interviewed 4 developers, 3/4 (75%) ranked daily planning as top-3 productivity challenge. Threshold was 50%. Passed but sample size small.
2. **Automation Acceptance (Not executed at midterm):** Test if >40% of generated tasks are manually edited/rejected.
3. **Engagement (Not executed at midterm):** Test if <50% of early adopters use planner 3+ times/week over first 2 weeks.

### Midterm Customer Interviews
- **Baylor (Bidi):** Uses Google Sheets for tickets. Wants audio-to-task. Led to voice input feature.
- **Pete (Bacon):** Uses NotebookLM. Struggles with prioritization and linear progress tracking. Inspired tracking widget concept.
- **Matt (Snare):** Whiteboard + notes app. Task management not a major pain point. Fixed routines. Confirmed "not our user."
- **Sarah (AWS):** Internal task system. Loses time parsing communication channels. Decision paralysis from backlog. Wants AI task duration estimation.

### Midterm System Diagrams
- **Before Stride:** Manual reprioritization loop — plans change → user reshuffles → momentum breaks → repeat. Leverage point: Human coordination (every change routes through user).
- **With Stride:** Stride automation loop — AI plans day → user works → plans change → Stride reshuffles → user approves with one button → no momentum lost. Leverage point: Assisted coordination (system proposes, user approves).

### Midterm Differentiation
- 2x2 grid: Simple vs Complex, Manual vs Automatic. Stride positioned as Simple + Automatic.
- **Motion:** Requires manual task entry and project setup before automation.
- **Reclaim.ai:** Automates scheduling but needs deep configuration.
- **Traditional tools:** Fully manual planning and constant reshuffling.

### Midterm Success/Failure Criteria
- **Success:** Users save 15-30 min/day on planning; <40% manual editing of auto-generated tasks; 2/3 users report schedule feels realistic.
- **Failure:** Time inputting > time saved; >40% manual replanning; users report unrealistic schedules.
- **Success pivots:** Expand integrations (GitHub, Slack, Asana, Outlook); improve AI time estimation; onboard small startup teams.
- **Failure pivots:** Shift to plugins for existing tools; improve context engineering; move toward new problem/hypothesis.

### Links
- **GitHub:** https://github.com/PWK-Innovations/stride
- **Deployed:** https://stride-amber.vercel.app

---

## Final Presentation Structure (20 minutes)

Per the rubric: Do NOT re-present midterm. Start from where midterm left off. Show what changed, deepened, or pivoted.

### Recommended Flow (Refinement Path)

**1. Opening — Where We Left Off (1-2 min)**
- Brief context: Stride is an AI daily planner for knowledge workers
- One sentence on midterm state
- Transition: "Here's what happened when we actually built it"

**2. What Changed — System Understanding (2-3 min)**
- Updated system diagram — what did we learn by building?
- What we got wrong or didn't see at midterm
- New elements, relationships, or feedback loops discovered
- Leverage points we tried to pull and what happened

**3. Problem Evolution (2-3 min)**
- How the problem was tested, refined, and sharpened
- Falsification test results (ALL tests must be executed now)
- What evidence validated or challenged our hypothesis
- Problem statement should be more precise than midterm

**4. Customer Deep-Dive (2-3 min)**
- Interviews beyond friends and family (target users, strangers, domain contacts)
- What specifically changed in our customer understanding
- Updated competitive analysis based on building experience
- Show: engage → learn → change → re-engage loop

**5. Live Demo (3-4 min)**
- Show the product working — core flow
- Weave product throughout (don't save for end)
- Have backup recording ready

**6. Technical Process (3-4 min)**
- Document-driven development: PRD → mvp.md → plan → roadmap → implementation
- AI development infrastructure: context.md, CLAUDE.md, ai/ folder structure
- Phase-by-phase implementation with roadmap checklists
- Structured logging integrated into app + test-log-fix loop evidence
- Git history showing iterative progress

**7. Success/Failure Measurement (1-2 min)**
- Where do we actually stand against our own metrics?
- What did we learn about measurement itself?
- Pivot plans informed by real data

**8. What We Learned (1-2 min)**
- Honest discussion: surprises, challenges, what we'd do differently
- Growth from midterm

**9. Q&A (remaining time)**
- Be ready to discuss trade-offs and limitations honestly

---

## Key Rubric Requirements Checklist

### Must-Have for Final (Changed from Midterm)
- [ ] Working in-person demo (code must exist and run)
- [ ] Interviews outside immediate social circle
- [ ] All falsification tests executed with documented results
- [ ] Living documents — current context.md, updated roadmaps, PRD reflects actual project
- [ ] Structured logging integrated into actual application code
- [ ] CLAUDE.md with behavioral guidance
- [ ] ai/ folder committed (not gitignored)
- [ ] mvp.md as required deliverable
- [ ] Peer evaluation form submitted
- [ ] All materials pushed by April 7 at 23:59

### Presentation Requirements
- [ ] System design diagram (evolved from midterm)
- [ ] Process narrative (how we planned, built, iterated, adapted)
- [ ] In-person working demo
- [ ] Product shown throughout presentation (not just at end)
- [ ] Honest discussion of learnings
- [ ] All team members contribute and can explain their role
- [ ] Thoughtful Q&A responses

---

## Grading Weight Reminder

| Grader | Focus | Weight |
|--------|-------|--------|
| Jason | Product & System Design (5 areas x 20pts) | 45% → 90/200 pts |
| Casey | Technical Process (4 areas x 25pts) | 45% → 90/200 pts |
| Guest | Presentation Quality (4 areas x 25pts) | 10% → 20/200 pts |

**Proficient (A-) = 90-94% per area. Target this as baseline.**

---

## Midterm Slide-by-Slide Breakdown

### Main Slides

| # | Slide Title | Content |
|---|------------|---------|
| 1 | Title | "Stride — A daily planner for focused work" |
| 2 | Our Team | Parker Watts (Project Manager), Alex Fankhauser (Software Engineer), Caleb Gooch (Product Engineer) |
| 3 | The 1:00 PM Decision Gap | Scenario: finishes major task → doesn't know what's next → jumps between Asana, Calendar, Slack → spends ~15 min reorganizing. Problem statement + three pain points (constant reprioritization, decision fatigue, context switching) |
| 4 | Our Customers | Primary: Startup software engineers (finished a task, deciding what's next). Secondary: Busy students with part-time jobs (leaving work, figuring out best use of time). NOT: People with fixed routines or fully manual planners |
| 5 | There is No Standard | Slack screenshot (Feb 24, 2026) showing startup developers using a variety of tools — none help them set and adjust schedules |
| 6 | System Design Diagram (Before Stride) | Manual reprioritization loop. Components: Calendar/Meetings, Task Manager (Asana/To-Do), Notes/Docs, Mental Estimation, External Interrupts (Slack pings, ad-hoc requests). Leverage point: Human Coordination |
| 7 | Our Hypothesis | "Startup developers will use an AI-generated, auto-updating daily plan — requiring minimal manual setup — and will report more deep work hours and higher task completion rates." Falsification: hypothesis is false if planning is not a top pain point, automation is rejected, or engagement doesn't persist |
| 8 | Falsification Test — Planning Pain | Method: Interview engineers, ask them to rank top-3 productivity challenges. Threshold: <50% = false. Result: 3/4 (75%) ranked daily planning as top-3. Promising but needs larger sample |
| 9 | Our Solution | Three-step flow: (1) Add tasks (text, photos, audio), (2) Tap "Build My Day" — AI builds schedule from tasks + calendar, (3) Stay in flow — popup for progress updates, Stride dynamically rebuilds |
| 10 | System Design Diagram (With Stride) | Stride automation loop replaces manual loop. AI plans day → user works → plans change → Stride reshuffles → user approves with one button. Leverage point: Assisted Coordination |
| 11 | Differentiation / Competitors | 2x2 grid (Simple/Complex x Manual/Automatic). Stride = Simple + Automatic. Motion = Complex + Automatic. Reclaim.ai = Complex + Automatic. Traditional tools = Simple + Manual |
| 12 | Customer Interaction / Research | Baylor (audio-to-task → voice input feature), Pete (progress tracking → widget concept), Matt (fixed routines → confirmed "not our user") |
| 13 | Success Criteria | Time saved (15-30 min/day), automation adoption (<40% manual edits), AI effectiveness (2/3 report realistic schedules). Failure indicators: input time > saved time, >40% manual replanning, unrealistic schedules |
| 14 | Pivot / Success & Failure Plans | Success: expand integrations, improve AI estimation, onboard teams. Failure: shift to plugins, improve context engineering, new problem/hypothesis |
| 15 | Technical Process | Four areas: PRD-driven development, structured logging & debugging, phase-by-phase implementation, AI dev infrastructure |
| 16 | Deployed Site | https://stride-amber.vercel.app |
| 17 | User Flow | Sign-up: Create account → Select subscription → Authorize Google Calendar. Daily: Input tasks (text, audio, image) → Click "Build My Day" → Use widget to update progress (Stride auto-adjusts) |

### Appendix Slides

| # | Slide Title | Content |
|---|------------|---------|
| A | Deep Analysis of Customer | Three personas with detailed pain points: (1) **Focus-Driven Developer** — 23-minute rule for regaining deep focus, context switching costs 1-2 hrs/day, needs flow preservation / orchestration layer. (2) **Popcorn Brain Student** — intention vs action gap, 47% say time management is main challenge, needs low-friction tool for messy inputs. (3) **Overbooked Professional** — 58% of day on "work about work," strategic work deprioritized, needs autonomous rescheduling |
| B | Founding Hypothesis | Full hypothesis statement repeated for reference |
| C1 | Customer Interview Notes 1 | **Baylor (Bidi):** Google Sheets for tickets, wants audio standup → auto tasks, finds manual entry repetitive. **Pete (Bacon):** NotebookLM for planning notes, struggles with prioritization and linear tracking, likes popup assistant idea |
| C2 | Customer Interview Notes 2 | **Matt (Snare):** Whiteboard + notes, task management not a pain point, prefers lightweight/fixed routines. **Sarah (AWS):** Internal task system, loses time parsing comms when remote, decision paralysis from backlog, wants AI duration estimation. Note: Sarah works on fast-feedback AWS dev team so still appropriate despite not being at a startup |
| D1 | Falsification Test 1 — Planning Pain | Method, threshold (50%), results (75% — 3/4 developers). Passed but needs larger sample |
| D2 | Falsification Test 2 — Automation & Engagement | Automation: test if >40% of generated tasks manually edited/rejected. Engagement: test if <50% use planner 3+/week over 2 weeks. Note: NOT executed at midterm — must be executed for final |
| E | 2x2 Differentiation Grid | Visual grid: Simple/Complex x Manual/Automatic with Stride positioned |
| F1 | Systems Architecture Design 1 (Before) | Full system diagram without Stride — manual reprioritization loop |
| F2 | Systems Architecture Design 2 (With Stride) | Full system diagram with Stride — automation loop replaces manual loop |
| G | Alternative Problems Considered | Three alternatives explored: (1) **Relocation & Travel Decision** — too many cities, no way to compare personal priorities. (2) **Finding the Perfect Gift** — translating how well you know someone into the right item. (3) **Creative Content Creation** — small teams need converting ads but can't afford agencies |
| H | Pivot Plans | Success pivots: task ingestion (multi-channel), team-level planning (standups, dependencies). Failure pivots: existing integration (update tasks in Trello/Asana/Jira), lightweight browser extension (simple "plan my day" widget overlay) |
| I | How Customer Feedback Influenced Iterations | Baylor → voice-to-task feature (audio input). Pete → tracking widget concept (progress popup). Widget noted as not yet implemented |
| J | Links | GitHub: https://github.com/PWK-Innovations/stride, Deployed: https://stride-amber.vercel.app |
