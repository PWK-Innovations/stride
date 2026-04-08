# Falsification Test Results

## Founding Hypothesis

"Knowledge workers will use an AI-powered schedule that adapts throughout the day — via a desktop widget and chat agent — and will report less time planning and more time in focused work."

---

## Test 1: Planning Pain Point

**Question:** Do knowledge workers actually struggle with daily planning?

**Method:** Interview software engineers at startup companies. Ask about their current processes and how (if at all) planning struggles affect their productivity. Ask them to rank their top-3 productivity challenges.

**Threshold:** If fewer than 50% of developers rank daily planning as a top-3 productivity challenge, our hypothesis is false. A rate of 50%+ demonstrates a consistent need across our target customer group.

**Results:** Out of 4 developers interviewed, 3 ranked daily planning as a top-3 productivity challenge.

**Rate:** 75% — **PASSES** threshold (50%)

**Interpretation:** While promising and well above the threshold, concrete verification would benefit from a larger sample size. Supplementary evidence from a Slack poll of startup employees showed fragmented tool usage (Linear, GitHub Issues, Notion, physical whiteboards, Slack threads) — confirming that planning tools are scattered and no single solution dominates.

---

## Test 2: Automation Acceptance

**Question:** Will users accept AI-generated schedules without manual edits?

**Method:** Have knowledge workers test the app and review 5 different generated schedules (with either real or hypothetical daily tasks). Ask if each schedule is free of conflicts and if they would accept it without alteration.

**Threshold:** If less than 60% of generated schedules are accepted, our hypothesis is false. An acceptance rate of 60%+ demonstrates consistent AI decision quality.

**Results:** Out of 5 customers interviewed, 17 of 25 total schedules were accepted without alteration.

| Customer | Accepted (no edits) | Out of |
|----------|---------------------|--------|
| Michael (PM at Redo) | 4 | 5 |
| Hailey (Analyst at Anglepoint) | 2 | 5 |
| Pete (Developer at Bacon) | 3 | 5 |
| Sarah (Developer at AWS) | 4 | 5 |
| Baylor (Developer at Bidi) | 4 | 5 |

**Rate:** 68% — **PASSES** threshold (60%)

**Interpretation:** The acceptance rate exceeds our threshold, suggesting the AI produces schedules that are usable out of the box for most users. Hailey's lower acceptance (2/5) was traced to the default 30-minute task duration being too short for analytical work — this directly inspired the AI time estimation feature in Phase 12. The rejection patterns were informative rather than deal-breaking.

---

## Test 3: Schedule Realism (Reduced Planning Overhead)

**Question:** Will users report the AI-built schedule feels realistic and actionable?

**Method:** Have knowledge workers test the app and review 5 different generated schedules. Then ask: (1) With minor adjustments, is this a realistic schedule? (2) Could you actually follow it?

**Threshold:** If less than 67% of generated schedules are described as realistic and actionable, our hypothesis is false. A success rate of 67%+ validates consistent practical utility of the app.

**Results:** Out of 5 customers interviewed, 20 of 25 schedules were described as realistic and actionable. 3 of those 20 required up to two minor alterations (small time adjustments).

| Customer | Realistic | Out of | Notes |
|----------|-----------|--------|-------|
| Michael | 4 | 5 | — |
| Hailey | 3 | 5 | 1 after minor time change |
| Pete | 4 | 5 | 1 after adjusting 2 task lengths |
| Sarah | 4 | 5 | — |
| Baylor | 5 | 5 | 1 after quick time change |

**Rate:** 80% — **PASSES** threshold (67%)

**Interpretation:** Users consistently found the AI-generated schedules realistic enough to follow. The 80% rate is well above our threshold. Minor adjustments were typically about task duration, not task ordering or priority — validating the agent's reasoning while highlighting duration estimation as an area for improvement (addressed in Phase 12 with AI time estimation).

---

## Summary

| Test | Threshold | Result | Status |
|------|-----------|--------|--------|
| Planning Pain Point | 50% | 75% | **PASS** |
| Automation Acceptance | 60% | 68% | **PASS** |
| Schedule Realism | 67% | 80% | **PASS** |

All three falsification tests pass their thresholds. The hypothesis is supported by the evidence collected.
