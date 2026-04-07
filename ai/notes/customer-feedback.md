# Customer Interview Notes

**Date:** 2026-04-06
**Context:** Beta test user interviews — 5 users tested the full product (web app + widget + agent). Each reviewed 5 AI-generated schedules and provided feedback on usability, schedule quality, and feature requests.

---

## Michael — PM at Redo

- Really liked the tool and thought the functionality was great.
- Reviewed 5 generated schedules; said he would accept 4 of them.
- Wants Stride to be able to sync the Google calendars of other employees in his team to ensure meeting schedules work for all involved.

**Key Insight:** AI-generated schedules are generally reliable. His suggestion (team calendar sync) could be a future development, but Google does this well already.

---

## Hailey — Analyst at Anglepoint

- Described the widget as easy to use.
- Accepted 2 of 5 generated plans.
- Had an issue with the tool underestimating task length when she did not explicitly state a duration.
- Wants Stride to allow for larger tasks to be split around prescheduled blocks like meetings.

**Key Insight:** Need to review the default 30-minute task length and integrate task-splitting functionalities for longer tasks.

---

## Pete — Developer at Bacon

- Loved the widget as a way to stay accountable and focused on the active task.
- Accepted 3 of 5 generated plans.
- Saw some mixed results when trying to move tasks via the chatbot.
- Wants the widget to allow for more time to be added when clicking "Need more time" than just 15 min.

**Key Insight:** Stride is better at generating the full plan than it currently is at updating that plan. Needs attention.

---

## Sarah — Developer at AWS

- Thought the app and widget were valuable to keep her on track by helping her see what task is active and what comes next.
- Accepted 4 of 5 generated plans.
- Wants the widget to suggest moving up the next task when marking one as done early.
- Wants Stride to be able to pull from her internal task system.

**Key Insight:** The app does help with decision paralysis. There are lots of possibilities for further iterations to improve.

---

## Baylor — Developer at Bidi

- Loved the ability to upload photos or record audio for automated task creation.
- Accepted 4 of 5 generated plans.
- Wants to be able to see the full daily schedule in the widget.
- Wants to be able to chat with the Stride agent using audio (like with the task creation) within the widget.

**Key Insight:** The widget can be upgraded to be even more effective. Needs consideration as maybe not all suggestions fit in this sprint.

---

## Summary

**Schedule acceptance rate:** 17/25 (68%) across 5 users.

**Common themes:**
- Widget is well-received — users find it valuable for focus and accountability
- AI schedule quality is good but not perfect (68% acceptance)
- Default 30-min task duration causes underestimation when users don't specify
- Mid-day rescheduling via chatbot has mixed results
- Widget needs more time-add options beyond 15 min (+30, +60)
- Widget should prompt "start next task?" when marking one done early
- Widget should show full daily schedule in expanded mode
- Audio chat with agent requested (reuse existing audio pipeline)

**Feature requests mapped to Phase 12:**
- Audio chat (12.1) — from Baylor
- AI time estimation (12.2) — from Hailey
- Widget: "start next task?" prompt (12.3) — from Sarah
- Widget: quick time-add options (12.3) — from Pete
- Widget: scrollable daily schedule (12.3) — from Baylor

**Deferred / out of scope:**
- Team calendar sync (Michael) — Google handles this; not in scope
- Task splitting around meetings (Hailey) — future consideration
- Internal task system integration (Sarah) — future consideration
