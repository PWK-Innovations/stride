# Midterm Project Presentation Rubric

**Course:** BYU IS/IT Capstone -- AI-Augmented Software Development
**Total Points:** 100 (weighted across three grading domains)
**Philosophy:** We grade your PROCESS, not your product. A team with a simpler app and a strong, documented process will outscore a team with a polished product and no evidence of how they built it.

---

## Grading Philosophy: Process Adherence as a Lens

Process adherence is not a separate grading area -- it is the lens through which ALL areas are evaluated. Students are expected to demonstrate that they followed the processes taught in class: document-driven development, AI-augmented workflows, systematic iteration, and structured debugging. This is assessed within each technical and product area, not scored as its own category. Course material is required process, not optional suggestions.

---

## Who Grades What

| Grader | Focus | Weight | Areas | Scoring |
|---|---|---|---|---|
| Casey | Technical process | 45% | 4 areas, each scored out of 25 points (100 total) | Weighted to 45% of final grade |
| Jason | Product & system design | 45% | 5 areas, each scored out of 20 points (100 total) | Weighted to 45% of final grade |
| Guest Grader | Presentation quality | 10% | Holistic evaluation -- no formal rubric | Subjective assessment |

---

## Casey's Technical Process (45% of Final Grade)

Each area is scored out of 25 points. Total: 100 points, weighted to 45% of the final grade.

| # | Area | Points | What "Good" Looks Like |
|---|---|---|---|
| 1 | PRD & Document-Driven Development | 25 | PRD is clear enough to build from. Documents drive the coding process -- PRD serves as immutable source of truth. Development follows the PRD -> plan -> roadmap -> implementation pipeline. Documents are living artifacts updated as the project evolves. Evidence of AI-assisted iteration, not one-shot generation. |
| 2 | AI Development Infrastructure | 25 | AI folder pattern properly implemented (context.md, project docs). Project structure supports AI-augmented workflow. MCP configured and working. Git workflow shows branching, meaningful commits, and PRs. Cross-platform considerations addressed where applicable. |
| 3 | Phase-by-Phase Implementation | 25 | Code was built incrementally following roadmap phases -- not one-shot prompted. Roadmaps used as checklists during implementation with tasks checked off. Evidence of multi-session workflow (plan/implement/review). Git history shows iterative, incremental progress across sessions. |
| 4 | Structured Logging & Debugging | 25 | Structured logging implemented and used for debugging. CLI test scripts exist and work. Test-log-fix loop followed -- evidence that AI read logs, diagnosed issues, and fixed them. Debugging process is documented or evidenced in git history. |

---

## Jason's Product & System Design (45% of Final Grade)

Each area is scored out of 20 points. Total: 100 points, weighted to 45% of the final grade.

| # | Area | Points | What "Good" Looks Like |
|---|---|---|---|
| 1 | System Understanding | 20 | System diagram showing the ecosystem they operate in. Elements and their relationships clearly mapped. Goal of the larger system identified. Leverage points in the system identified and understood. |
| 2 | Problem Identification | 20 | Clear problem statement with strong justification for why it is the right problem to address. Alternative problems were considered (evidence of divergent thinking). Due diligence performed to try to prove themselves wrong. Falsifiability check performed on their problem statement. |
| 3 | Customer Focus | 20 | Target customer clearly identified. Solution positioned as the best alternative the customer has. Differentiation from competition and alternatives shown. Multiple lenses of analysis applied to explain why this will succeed where others are lacking. |
| 4 | Success & Failure Planning | 20 | What success looks like is defined with measurable indicators. What failure looks like is defined. How they will know which state they are in. Pivot plans for both success and failure scenarios. Overall plan for making it successful. |
| 5 | Customer Interaction | 20 | Evidence of engaging with real customers or users (sessions, feedback, interviews). How they engaged and what feedback they received. How feedback influenced their iteration and approach. Awareness of whether they are driving the customer or being driven by the customer. |

---

## Guest Grader (10% of Final Grade)

The guest grader provides a subjective, holistic assessment. There is no formal rubric for this portion. Evaluation is based on:

- Communication quality -- Is the presentation clear and well-delivered?
- Storytelling ability -- Does the team tell a compelling story about their project and journey?
- Visual design -- Do slides and visual materials support the narrative effectively?
- Overall presentation impact -- Does the presentation leave a positive impression?

---

## Scoring Scale

For each area, we use a four-level scale recalibrated so that solid work earns an A-minus:

| Level | What It Means | Score Range |
|---|---|---|
| Exemplary | Exceptional work that goes beyond expectations. Could be shown to future students as an example. | 95-100% of area points |
| Proficient | Solid work, process clearly followed. Meets all expectations. | 90-94% of area points |
| Developing | Partial implementation, some gaps in process or understanding. | 80-89% of area points |
| Insufficient | Major gaps, process not followed, or work not submitted. | Below 80% of area points |

## Grade Scale

| Grade | Minimum Percentage |
|---|---|
| A | 93% |
| A- | 90% |
| B+ | 87% |
| B | 83% |
| B- | 80% |
| C+ | 77% |
| C | 73% |

---

## Presentation Format

### Midterm Presentations

- **Duration:** 15 minutes per team (expect presentations to take ~20 minutes in practice)
- **Teams:** 9 teams of 3 students
- **Schedule:** Presentations span 3 lecture periods (~3 teams per period)
- **Content split:** Half the time on product/system design, half on technical demonstration
- All team members must contribute to the presentation
- System design diagram required
- **Expectation:** Teams should compellingly demonstrate each rubric criterion as applied to their project
- **Framing:** You are pitching to Casey and Jason as if pitching to C-suite executives. The outcome is green-lighting, helping you pivot, or shutting down the project.

### Final Presentations

- Same format with a working demo expected
- 20-minute team presentations
- Process narrative: how you planned, built, iterated, and adapted
- Working demo (live or recorded)
- Every team member speaks and can explain their contribution
- Honest discussion of what you learned, what surprised you, and what you would do differently

---

## What We're NOT Grading

- A finished, polished product. A working prototype is great; a production-ready app is not expected.
- Paying customers or revenue. We don't require paying customers or revenue, but we DO expect evidence of customer research and engagement -- interviews, feedback sessions, prototype testing with real people. Customers can be anyone: a friend, a family member, someone at a company, a stranger at a bus stop. They do not need to be formal or paying.
- Which AI tool you used. Claude Code, Cursor, ChatGPT -- we care about the process, not the brand.
- Complexity of the idea. A simple idea executed with strong process beats an ambitious idea with no evidence of how it was built.
- Perfect code. We want to see the journey: plans, attempts, failures, fixes, iteration.
- Unlimited AI access. If you're on a free tier, efficient use of limited resources is itself a positive signal.

---

## Quick Evidence Checklist

### Casey's Technical Domain

**PRD & Document-Driven Development:**
- [ ] PRD exists and is comprehensive enough to build from
- [ ] Development driven by documents (PRD -> plan -> roadmap -> implementation)
- [ ] Documents updated as project evolved

**AI Development Infrastructure:**
- [ ] AI folder structure with context.md, project docs
- [ ] MCP configured and working
- [ ] Git workflow with branching, meaningful commits
- [ ] .gitignore covers sensitive files (ai/, .env, .testEnvVars, secrets)
- [ ] No committed secrets in the repository

**Phase-by-Phase Implementation:**
- [ ] Roadmaps with tasks checked off showing progression
- [ ] Git history showing iterative, incremental development (not one big commit)
- [ ] Evidence of multi-session workflow (plan/implement/review)

**Structured Logging & Debugging:**
- [ ] Structured logging implemented (not just console.log("here"))
- [ ] CLI test scripts exist and work
- [ ] Evidence of test-log-fix loop in git history

### Jason's Product & System Design Domain

- [ ] System design diagram showing ecosystem, elements, relationships, goals, leverage points
- [ ] Problem statement with clear justification for why it is the right problem
- [ ] Alternative problems considered (divergent thinking evidence)
- [ ] Falsifiability check and due diligence performed
- [ ] Target customer clearly identified
- [ ] Differentiation from competition/alternatives analyzed
- [ ] Success criteria defined with measurable indicators
- [ ] Failure indicators defined with measurement plan
- [ ] Pivot plan documented for both success and failure scenarios
- [ ] Customer research evidence (interview notes, feedback sessions, prototype testing)
- [ ] How customer feedback influenced iteration

### Presentation

- [ ] All team members contribute and can explain their role
- [ ] System design diagram included
- [ ] Process narrative included (not just product demo)
- [ ] Working demo (live or recorded) -- for final presentations

---

## A Note on Iteration, Pivoting, and Failure

This course values learning through doing. If your team pivoted your project idea, encountered a major setback, or realized your original plan was wrong -- that is not a problem. It is evidence of good process. Show us the pivot. Explain what you learned. That story is often more compelling than a smooth path from start to finish.

---

## Accommodations

- **Existing projects welcome.** If you're using a pre-existing project, show the AI retrofit process as evidence. Same expectations apply.
- **Solo projects.** Same rubric; adjust presentation expectations for one person.
