# Final To-Do List

**Deadline:** April 7 at 23:59 — everything pushed.
**Presentation:** 20 min, in-person demo. Schedule: April 8, 13, or 15.
**Midterm:** 93.40% (A) — Casey 100, Jason 92, Presentation 70.

---

## Product Design

- [ ] **Quantify PRD metrics** — Update `aiDocs/prd.md` Section 3 with hard numbers (15-30 min/day saved, <40% manual edits, 2/3 report realistic schedule, 50%+ use 3x/week, retention target)
- [ ] **Report where you stand against metrics** — Don't just define metrics; report actual status against each success/failure indicator. Where do you actually stand? (Rubric 4: Success & Failure Planning)
- [ ] **Update mvp.md and PRD to reflect pivot** — Both docs must reflect the current agentic AI direction. mvp.md is a required deliverable — it defines the concrete, scope-constrained version of what you are actually building. The PRD can include broader vision and future features, but mvp.md is the anchor for what you are delivering now. Pivot plans should have decision criteria tied to metrics/thresholds and real evidence.
- [ ] **Execute & document falsification tests 1-3** — Run all three tests, expand sample sizes where possible. Document method, threshold, results, and interpretation for each in `ai/notes/falsification-results.md`
- [ ] **New customer interviews** — 3-5 people outside your circle (strangers, target users, domain contacts via Reddit/Discord/LinkedIn). Document in `ai/notes/customer-interviews-final.md`
- [ ] **Show feedback loop** — Identify specific features or decisions that changed because of new feedback (engage → learn → change → re-engage)
- [ ] **Commit versioned system diagram** — Midterm diagram was slides-only (Jason flagged this). Commit an actual diagram file (e.g. PNG/SVG + source) as a versioned artifact that shows evolution from midterm.
- [ ] **Sharpen problem statement** — Should be more precise and grounded than at midterm. Refine based on evidence from building and falsification tests. Distinct from PRD metrics — this is about the core problem definition itself. (Rubric 2: Problem Identification)
- [ ] **Update competitive analysis** — Revisit competitive landscape based on what you learned while building. Solution positioning should reflect validated understanding, not initial assumptions. (Rubric 3: Customer Focus)
- [ ] **Build final slide deck** — Start from where midterm left off, not a re-presentation. Show product throughout. Include: evolved system diagram, falsification results, customer feedback loop, technical process narrative.

---

## Technical

- [ ] **Final phases implementation** — Make meaningful progress on Phase 7 (Desktop Widget), Phase 8 (Agentic AI), and Phase 9 (Integrations & Web Chatbot). Currently all unchecked. Git history only shows doc updates since midterm.
- [ ] **Commit incrementally** — Not one big burst. Check off phase roadmap tasks as completed.
- [ ] **Update CLAUDE.md** — Align with Casey's slides (behavioral guidance is an explicit sub-criterion in AI Development Infrastructure).
- [ ] **Prepare live demo** — Test core flow (sign up → add tasks → build schedule → view timeline) on presentation machine
- [ ] **Record backup demo video**
- [ ] **Rehearse** — Full dry run under 20 min. Presentation was **70/100 at midterm — biggest area for improvement.** Specific prep:
  - Each member can clearly explain their individual contributions (rubric required element)
  - Include honest "what we'd do differently" discussion (rubric: Storytelling & Journey)
  - Q&A prep on trade-offs, limitations, and technical decisions (rubric emphasizes thoughtful responses)

---

## Final Checks (Before Submitting)

- [ ] **ai/, aiDocs/, and planning folders are NOT gitignored** — Graders must see roadmaps, plans, changelogs, and context.md. These are graded artifacts. Only gitignore secrets and library folders (.env, .testEnvVars, MCP configs, node_modules/, venv/).
- [ ] **mvp.md exists and is current** — Required deliverable. Defines the concrete, scope-constrained version of what you are actually building. PRD can include broader vision; mvp.md anchors what you are delivering now.
- [ ] **CLAUDE.md has behavioral guidance** — Explicit sub-criterion in AI Development Infrastructure.
- [ ] **Changelog reflects work since midterm** — Not empty or stale.
- [ ] **No secrets committed in repo** — Scan git history. .env, API keys, tokens must not be in any commit. (Rubric: AI Development Infrastructure)
- [ ] **context.md uses bookshelf pattern and is current** — References key docs with 1-2 sentence descriptions so a new AI session can orient immediately. (Rubric: AI Development Infrastructure)
- [ ] **.testEnvVars in .gitignore** — Verify it's listed. Rubric explicitly mentions this.
- [ ] **Structured logging integrated in app code** — Not just a standalone logger file. Must be used in actual application code. (Rubric: Structured Logging & Debugging)
- [ ] **Test scripts pass** — `npm run test:all` exits cleanly. Ensure test-log-fix loop is visible in git history (test fail → log diagnosis → fix commits). (Rubric: Structured Logging & Debugging)
- [ ] **Living docs updated** — `aiDocs/changelog.md` reflects work since midterm, `aiDocs/context.md` is current.
- [ ] **Roadmap tasks checked off** — All completed phase tasks marked done before submission. (Rubric: Phase-by-Phase Implementation)
- [ ] **Architecture docs + coding-style docs exist and are current** — `aiDocs/coding-style.md` and architecture docs present and up to date. (Rubric: AI Development Infrastructure)
- [ ] **Proper exit codes (0/1/2) on test scripts** — CLI scripts should exit 0 on success, 1 on failure, 2 on usage error. (Rubric: Structured Logging & Debugging)

---

## Artifacts to Submit (April 7 at 23:59)

- [ ] **Link to team GitHub repo** submitted on Canvas
- [ ] All code pushed and working
- [ ] Updated docs pushed (PRD with quantitative metrics, changelog, context.md, mvp.md)
- [ ] **Deep customer analysis** — dedicated artifact showing who your customer is (format up to you). Include at least 2 real customer conversation docs.
- [ ] **Founding hypothesis** — the hypothesis your current approach is based on, documented and included in presentation
- [ ] New customer interview notes (`ai/notes/customer-interviews-final.md`)
- [ ] Falsification test results documented (`ai/notes/falsification-results.md`)
- [ ] **2x2 differentiation grid** — competitive positioning artifact included in presentation materials
- [ ] **Systems architecture diagram** — must identify leverage points, the problem, and where in the system your solution targets. Committed as versioned artifact (not slides-only — Jason flagged this at midterm)
- [ ] Presentation slides committed or linked in repo
- [ ] Backup demo recording
- [ ] Peer evaluation form submitted (each team member, separate deliverable)
