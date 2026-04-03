# Unit 5: Building Your AI Workflow System

## Learning Objectives

After completing this unit, you should be able to:

1. Write a CLAUDE.md file that improves every AI interaction in your project
2. Codify successful workflows into reusable instruction files and slash commands
3. Deploy sub-agents for verification with risk-appropriate witness counts
4. Budget tokens knowing sub-agents cost 3-5x baseline
5. Use multi-session workflows to prevent context pollution
6. Escalate effectively when AI gets stuck (not just re-prompt)
7. Prevent over-engineering, scope creep, and stuck loops before they happen

---

## Block 1: Your Instruction Layer -- The Foundation

### What is an Instruction File?

A markdown file that shapes AI behavior for your project.

**Types:**
- **CLAUDE.md** -- Always loaded, shapes every interaction
- **Process docs** -- On-demand workflows in `ai/instructions/`
- **Skills** -- One-command shortcuts in `.claude/skills/`

"Without instructions, AI is a talented chef who doesn't know your kitchen. With instructions, consistent results every time."

### Why Instruction Files Beat Ad-Hoc Prompting

| Aspect | Ad-Hoc Prompting | Instruction Files |
|--------|------------------|-------------------|
| Results | Inconsistent | Repeatable outcomes |
| Memory | Hard to remember details | Written down once |
| Evolution | No version history | Refinable over time |
| Sharing | Solo knowledge | Shareable with team |
| Reuse | Reinvent each time | Build on what works |

"Instruction files are the highest-leverage thing you can create -- one well-written CLAUDE.md influences hundreds of future interactions."

### Anatomy of a Good CLAUDE.md

Template structure:

```markdown
# Project Context
[What this project is, who it's for]

## Critical Files to Review
- context.md -- project knowledge base
- PRD -- requirements source of truth
- Architecture -- system design decisions

## Behavioral Guidelines
- Keep solutions simple and focused on requirements
- Ask for expert opinion before making changes
- Don't add features not in the PRD
- Change code as if it was always this way (no compatibility layers)

## Code Style
[Patterns, naming conventions, testing expectations]
```

CLAUDE.md is for context and guidelines -- skills/commands are defined separately.

### The Behavioral Guidelines Section

**Purpose:** Prevent pitfalls before they happen.

Example guidelines:
- Keep solutions simple and focused on requirements
- Don't add features not in the PRD
- Ask for expert opinion before making changes
- Change code as if it was always this way (no compatibility layers)
- Don't over-engineer -- we can add complexity later
- This is MVP only. Additional features go in future roadmaps.

"Over-engineering? Scope creep? Compatibility layers nobody asked for? Solve them with one file, not constant vigilance. This is rule beating prevention -- changing the rules the AI optimizes against."

### The Progression: Ad-Hoc to Codify to Automate

Three stages:

1. **Dynamic** -- Experiment with AI dynamically
2. **Codified** -- Turn working patterns into process documents
3. **Automated** -- Promote to slash commands after 3+ successful uses

"A process document is a founding hypothesis for a workflow. Running it 3+ times is the cheap loop that tests it -- same methodology Jason taught for business hypotheses."

### Anatomy of a Process Document

```markdown
# Instruction: PR Review

## Context
- Read aiDocs/context.md
- Review the PRD for requirements alignment
- Check aiDocs/coding-style.md for conventions

## Workflow
1. Run git diff to see all changes
2. Review each changed file for correctness, style, and security
3. Check for missing tests
4. Check for scope creep beyond the roadmap
5. Report findings with severity (critical / suggestion / nit)

## Success Criteria
- [ ] All changes reviewed
- [ ] No critical issues remaining
- [ ] Tests cover new functionality

## Behavioral Guidelines
- Report findings before making any changes
- Don't fix things without asking first
```

### Skills and Slash Commands

**Location:** SKILL.md files in `.claude/skills/` -- NOT in CLAUDE.md

**Directory structure:**
```
.claude/skills/
  pr-review/SKILL.md          <- defines /pr-review
  create-roadmap/SKILL.md     <- defines /create-roadmap
  frenemy-pragmatic/SKILL.md  <- defines /frenemy-pragmatic
```

Each SKILL.md contains YAML frontmatter (name, description) plus markdown instructions. Claude auto-discovers them.

**Common skills:**

| Skill | Purpose |
|-------|---------|
| `/create-roadmap` | Generate plan + roadmap from requirements |
| `/implement` | Execute a roadmap in fresh session |
| `/pr-review` | Review uncommitted code |
| `/verify` | Sub-agent verification of implementation |

"Promote after 3+ successful uses. Don't automate what you're still refining."

### Cursor's Approach

Equivalent tools:
- **`.cursorrules`** -- project-level instructions (like CLAUDE.md)
- **Notepad entries** -- reusable prompt templates you can reference
- **@-mentions** -- pull specific files/docs into context on demand
- **Composer rules** -- workflow-specific instructions per session

"The principle is the same across tools: codify your workflows so the AI follows consistent steps every time. The file format changes -- the discipline doesn't."

### The Frenemy Skill -- Detailed Implementation

**frenemy/SKILL.md:**

```yaml
---
name: frenemy
description: Respond with direct, critical analysis. No compliments, no softening.
  Challenge assumptions and fact-check claims.
disable-model-invocation: true
argument-hint: [prompt to critically analyze]
---

Regarding the following prompt, respond with direct, critical analysis. Prioritize
clarity over kindness. Do not compliment me or soften the tone of your answer.
Identify my logical blind spots and point out the flaws in my assumptions.
Fact-check my claims. Refute my conclusions where you can. Assume I'm wrong and
make me prove otherwise.

$ARGUMENTS
```

**frenemy-pragmatic/SKILL.md:**

```yaml
---
name: frenemy-pragmatic
description: Critical frenemy analysis via sub-agent, followed by pragmatic
  recommendations on how to proceed.
argument-hint: [optional topic to analyze, or omit to analyze current conversation]
---

First, determine the analysis topic:
- If arguments are provided below, use them as the topic.
- If no arguments are provided, summarize the key points, discoveries, and decisions
  from our conversation so far as the topic.

Then, deploy a sub-agent with the "/frenemy" skill to critically analyze that topic --
including any relevant code, assumptions, and trade-offs.

Finally, as the pragmatic expert, synthesize the frenemy's critique with your own
assessment and recommend how we should proceed. Be direct and actionable.

$ARGUMENTS
```

### How the Frenemy Works

Skills calling skills:

- **frenemy** = direct prompt injection -- Claude doesn't interpret it, just prepends the adversarial instructions
- **frenemy-pragmatic** = orchestration -- launches frenemy as an independent sub-agent, then acts as a pragmatic intermediary
- This implements the **supervisor-worker pattern** from Block 2, as composable skills

"The frenemy is falsifiability automated -- 'What would need to be true for this to be false?' turned into an adversarial reviewer that forces you to prove your reasoning before you ship it." (Connection to Unit 3.5)

### Token Budget Note for Instruction Files

Instruction files are essentially free -- loaded as context, negligible cost.

"Optimize the cheap layer first. Get your CLAUDE.md right before spending tokens on multi-agent workflows. This is the most cost-effective improvement students can make today."

---

## Block 2: Sub-Agents and Verification -- The Power Layer

### The Supervisor-Worker Pattern

"In Units 7-8, you built agents that use tools to accomplish goals. Now flip the perspective: YOU are the supervisor agent. AI sessions are your workers."

You orchestrate multiple AI sessions, each with independent context, to accomplish complex goals with verification.

### The Verification Cycle

1. "Deploy a sub-agent to implement what we just discussed."
   - Sub-agent implements
2. "Now deploy another sub-agent to verify we got it right."
   - Almost always finds at least one issue
3. "Deploy another sub-agent to verify from a different angle."
   - Often still finds something the first missed

"Each verifier has independent context. They can't confirm each other's blind spots."

### The Law of Witnesses

"In the mouth of two or three witnesses shall every word be established."

Different AI sessions hallucinate independently. Agreement across independent sessions = high confidence. Disagreement = investigate.

**Risk-based witness count:**

| Risk Level | Witnesses | Method |
|-----------|-----------|--------|
| Low (routine code) | 1 | Single AI session |
| Medium (important feature) | 2 | 2 sessions or 2 models |
| High (security-critical) | 3+ | Multiple sessions + tests + human review |

"Team building a healthcare app -- one agent reviews for correctness, a separate agent reviews for data privacy compliance. They don't share context. That's the point."

### The Token Tax -- Real Numbers

**Sources:**
- arxiv.org/html/2510.26585v1
- arxiv.org/pdf/2510.26585.pdf
- snorkel.ai/blog/multi-agents-in-the-context-of-enterprise-tool-use/

Sub-agents cost 3-5x baseline token cost.

**Why it costs more:**
1. Each sub-agent gets its own **system prompt + project context** (re-sent every call)
2. **"Communication tax"** -- agents restate goals and results to each other
3. **Context replay** -- each tool call replays the entire conversation

### Budget-Conscious Patterns

**Pro Plan reality:** "$20/month: Limited messages per 5-hour window"

"Supervisor + 2 sub-agents = approximately 4-8 messages per verification cycle. You'll hit limits quickly if aggressive with sub-agents."

**Cost-saving strategies:**
- **Fewer, specialized agents** > many generic agents (40-60% savings)
- Use sub-agents for **high-stakes verification**, not routine tasks
- Instruction files are **free** -- optimize the cheap layer first
- Start manual, automate only when the pattern is proven

---

## Block 3: Multi-Session Discipline -- Survival Skills for Final Projects

### Context Pollution -- The Silent Killer

**Definition:** Old conversation details confuse current work.

**Warning signs:**
- Conversation has been going 30+ minutes
- AI seems confused about current goals
- You've pivoted direction significantly
- Previous approaches failed multiple times

"Bounded rationality made visible: AI can only reason about what's in its context window. Polluted context = rationality bounded by garbage. Fresh session resets the bounds."

**Golden rule:** When in doubt, fresh session.

### The Three-Session Pattern

```
Session 1: Planning    -> plan.md + roadmap.md
Session 2: Implementation (FRESH context) -> code changes
Session 3: Review (genuinely fresh perspective) -> refined code
```

**Why separate sessions:**
- Planning context does not equal implementing context (different mental modes)
- Implementation starts clean -- only reads plan documents
- Review provides genuinely fresh perspective

### Three-Session Prompts

**Planning session:**

```
Review aiDocs/context.md. Here's what we need to build:
[requirements]. Give me your expert opinion first.
Don't make any changes yet.
```

**Implementation session (NEW SESSION):**

```
Review aiDocs/context.md. Then implement the work described in:
- ai/roadmaps/[date]_feature_plan.md
- ai/roadmaps/[date]_feature_roadmap.md
Check tasks off as you complete them. Run tests after each step.
```

**Review session:**

```
We just completed implementation. Please do a PR review of all
uncommitted changes. Report findings before making any changes.
```

"For final projects: Every major feature should follow this pattern."

### The Escalation Ladder

When AI gets stuck -- use in order:

| Level | Action | When to Escalate |
|-------|--------|------------------|
| 1 | Re-prompt with more context | After 2 failed re-prompts |
| 2 | Fresh session with context.md | If fresh session also gets stuck |
| 3 | Sub-agent review to diagnose | If sub-agent doesn't find clear fix |
| 4 | Manual intervention -- you fix it | Last resort |

"Unit 3.5 callback: You already know Levels 1 and 4. Today adds Levels 2 and 3. Most developers never get past Level 1. They keep rephrasing in a polluted session."

### Pitfall Prevention

| Pitfall | Why | Fix |
|---------|-----|-----|
| Over-engineering | AI adds unrequested features | Behavioral guidelines in CLAUDE.md |
| Scope creep | "While we're at it" grows beyond MVP | "This is MVP only" in every prompt |

### When to Put the AI Down

Five situations:

1. **Deep learning needed** -- skill erosion is real
2. **Genuinely novel problem** -- AI gives confident wrong answers
3. **Security-critical code** -- the Confidence Trap (Unit 4)
4. **Stuck 20+ min** -- step away, think manually
5. **Team alignment matters** -- shared struggle builds shared knowledge

"These are all wicked-domain signals. AI dominates kind domains. You own the wicked ones."

---

## Block 4: Advanced Patterns -- What's Possible When You Combine It All

### The Universal Agent Loop

Every major AI coding tool converges on the same pattern: Normalize, Plan, Execute, Verify, Repeat.

**Tool examples:**
- **Claude Code:** Single-threaded master loop with natural-language TODO list
- **Cursor:** Same loop, more human-in-the-loop at each step
- **Codex-based tools:** Same pattern, orchestration varies

"You already built this. Units 7-8: think, act, observe, repeat. When you run /roadmap then /implement-roadmap, you're deliberately running this same loop -- but with more control and better verification. You are the outer loop. AI is the inner loop. Instruction files (Block 1) are how you program the outer loop."

**Sources:**
- anthropic.com/engineering/building-agents-with-the-claude-agent-sdk
- youtube.com/watch?v=RFKCzGlAU6Q

### Inside Real Commands: /roadmap and /implement-roadmap

Claude Code commands (`.claude/commands/`) -- condensed from 135 and 248 lines:

#### /roadmap -- Plan Then Verify (135 lines)

```markdown
---
description: Create a plan doc and roadmap doc for implementing updates
---

# Roadmap Command

Create a plan doc and concise roadmap doc to implement the requested updates.
Save them under `ai/roadmaps/`, and prefix the file names with the date
(e.g., `01.16.feature-name-plan.md` and `01.16.feature-name-roadmap.md`).

## Phase 1: Planning

1. **Understand the request** - Clarify requirements with the user if needed
2. **Research the codebase** - Explore relevant files to understand current state and patterns
3. **Create the plan doc** - Document the approach, rationale, and design decisions
4. **Create the roadmap doc** - List specific implementation tasks with checkboxes

Both documents must:
- Reference each other
- Include this note at the top: *"Clean Code Project: Avoid cruft,
  over-engineering, and backward-compatibility features or comments."*

## Phase 2: Expert Review

After creating the plan and roadmap, launch a **review sub-agent** to validate
the approach before implementation begins.

### Review Sub-Agent Instructions

Launch a sub-agent with the Task tool using this prompt structure:

You are a senior engineer reviewing a proposed implementation plan. Your job is
to catch issues BEFORE implementation begins.

## Context
- Plan document: [path to plan]
- Roadmap document: [path to roadmap]
- This is a clean-code project with no backward compatibility requirements

## Your Review Tasks

1. **Read the plan and roadmap thoroughly**

2. **Examine the codebase for alignment:**
   - Read files that will be modified (listed in the roadmap)
   - Check adjacent/related files that might be affected
   - Look for existing patterns the plan should follow
   - Find similar implementations that could be reused

3. **Check for these specific issues:**

   **Alignment Issues** - Does the plan match reality?
   - Files referenced actually exist?
   - Current code state matches assumptions?
   - Dependencies/imports are accurate?

   **Missing Considerations**
   - Edge cases not accounted for?
   - Error handling gaps?
   - Test coverage plans adequate?
   - Documentation updates needed?

   **Over-Engineering Concerns**
   - Features beyond what was requested?
   - Unnecessary abstractions?
   - Premature optimization?
   - Configurable when it should be simple?

   **Cruft/Compatibility Risks**
   - Backward compatibility code that isn't needed?
   - Legacy patterns being preserved unnecessarily?
   - Dead code being left in place?
   - Comments explaining removed code?

   **Missed Opportunities**
   - Existing utilities that should be reused?
   - Patterns elsewhere in codebase that should be followed?
   - Simpler approaches available?

4. **Produce a structured review**

### Processing the Review

After the sub-agent returns its review:

**Auto-fix (do without asking):**
- Factual errors (wrong file paths, incorrect assumptions about current state)
- Missing files from scope that are clearly needed
- Adding obviously missing error handling or edge cases
- Removing cruft/compatibility code the reviewer identified
- HIGH confidence issues with clear fixes

**Ask user (use AskUserQuestion):**
- Design approach changes
- Adding or removing scope items
- Architectural disagreements
- MEDIUM/LOW confidence suggestions where tradeoffs exist
- Anything under "Questions for User"

**Apply fixes:**
1. Update the plan and/or roadmap documents with corrections
2. Note what was changed and why (brief comment at bottom of doc)
3. If significant changes were made, consider a quick re-review

### Completion

Once the review is processed and any fixes applied:
1. Inform the user the plan and roadmap are ready
2. Summarize any changes made based on the review
3. List any open questions that need user input
4. Provide the paths to both documents
```

#### /implement-roadmap -- Orchestrate Execution (248 lines)

```markdown
---
description: Implement a roadmap using sub-agents with progress tracking,
  PR review, fix cycles, and completion archival
---

# Implement Roadmap Command

You are the **orchestrating agent** responsible for implementing a roadmap document.
You coordinate sub-agents to do the implementation work, track progress, and ensure quality.

## Phase 1: Preparation

1. **Read the roadmap** specified by the user (or ask which roadmap to implement)
2. **Read the related plan document** if one exists
   (roadmaps usually reference their plan for context)
3. **Check dependencies** - if the roadmap depends on another roadmap,
   verify that dependency is complete first (check that its items are marked `[x]`)
4. **Read `CLAUDE.md`** and relevant project docs to understand conventions
5. **Create a mental model** of the work: identify independent vs dependent tasks,
   estimate parallelization opportunities

## Phase 2: Implementation with Sub-Agents

Use the Task tool to delegate implementation work. You are the orchestrator -
sub-agents do the coding.

### Delegation Strategy

1. **Group related tasks** from the roadmap into logical work packages
2. **Launch sub-agents in parallel** for independent work packages
3. **Run sequentially** when tasks depend on outputs from previous work
4. **Batch appropriately** - not too granular (overhead) or too broad (loses parallelism)

### Sub-Agent Instructions

When launching a sub-agent, provide:
- The specific roadmap tasks to implement (copy the relevant section)
- Context from the plan document explaining the *why* behind decisions
- Clear boundaries: what files to create/modify, what NOT to touch
- Instruction to report back: what was done, any deviations, any blockers

**Important:** Sub-agents implement and report back. They do NOT update the roadmap checkboxes.

### Progress Tracking (Your Responsibility)

As the orchestrator, YOU manage the roadmap document:
- When a sub-agent reports successful completion, **you check off the items**
  (`- [ ]` to `- [x]`)
- If a task cannot be completed as specified, **you add a note** in the roadmap
  explaining the deviation
- This prevents race conditions and ensures accurate tracking

### Handling Deviations

Reality doesn't always match the plan. When sub-agents encounter issues:
- **Minor adjustments** (implementation details) - proceed and document
- **Significant deviations** (different approach, missing prerequisite)
  - pause, assess, document in roadmap
- **Blockers** (can't proceed) - stop that work stream, note in roadmap,
  continue other tasks

The goal is **faithful implementation with pragmatic flexibility**. Document deviations,
don't hide them.

## Phase 2.5: Targeted Verification (High-Risk Work)

For high-risk implementations, launch a **verification sub-agent** after the
implementation sub-agent completes. This catches issues early before they compound.

### When to Verify

Launch a verification sub-agent for:
- **Security-sensitive code** (authentication, authorization, crypto, input validation)
- **Complex business logic** or algorithms
- **External API integrations** (hallucinated APIs are common)
- **Database migrations** or schema changes
- **Core infrastructure changes** that many other components depend on

Skip verification for:
- Simple/mechanical changes (renaming, moving files)
- Test file additions (tests themselves are verification)
- Documentation updates
- Configuration changes

### Verification Sub-Agent Instructions

Provide explicit error-seeking criteria:

Verify the implementation of [task description]. Check for:
- Hallucinated API calls or non-existent methods
- Missing error handling and edge cases
- Security vulnerabilities (injection, XSS, auth bypass)
- Logic that doesn't match the stated requirements
- Missing or inadequate tests for the new code

Report: what looks correct, what issues you found, severity of each issue.

**Important:** Do NOT tell the verifier to "be skeptical because this was AI-generated"
-- research shows this doesn't improve review quality. Instead, give specific criteria to check.

### Handling Verification Results

- **No issues found**: Proceed, check off roadmap items
- **Minor issues found**: Launch fix sub-agent, then proceed
- **Significant issues found**: Re-implement with clearer instructions, then re-verify

## Phase 3: Verification

After all implementation is complete:

1. **Run the build**: `npm run build`
2. **Run all tests**: `npm test`
3. **Fix any failures** before proceeding to review
4. **Verify all roadmap items** are checked off or have documented exceptions

## Phase 4: PR Review and Remediation

Once implementation is complete and tests pass, **do a thorough PR review of everything
that was implemented to make sure we got it right**.

### Review Focus

- Does the implementation match what the roadmap specified?
- Are there bugs, missing edge cases, or logic errors?
- Is the code quality acceptable (no cruft, no over-engineering)?
- Are tests adequate for the new functionality?

### Fix vs Escalate

**Fix directly** (minor issues):
- Typos, formatting, lint issues
- Missing error handling for obvious edge cases
- Small bugs with clear fixes
- Missing or incomplete tests

**Escalate to user** (drift from plan):
- Changes that would alter the design or approach
- New risks or security concerns
- Ambiguous requirements
- Issues suggesting the original plan was flawed

### Remediation Process

**Maximum 3 iterations** to prevent infinite loops.

1. Fix minor issues yourself or via sub-agents
2. Ask user about escalated issues
3. Re-verify after fixes (build + test must pass)
4. Repeat or conclude

## Phase 5: Completion (Archive and Changelog)

When all roadmap items are checked off and review is clean:

### Final Verification
1. Confirm all items complete
2. Build and tests pass
3. No outstanding review issues

### Archive Roadmap Files
1. Move the roadmap file to `ai/roadmaps/complete/`
2. Move the associated plan file to `ai/roadmaps/complete/`

### Update Changelog
Add entry to `ai/CHANGELOG.md`:

    ## YYYY-MM-DD: [Brief Title]
    [1-3 sentence summary]
    **Details:** See `ai/roadmaps/complete/[roadmap-filename].md`

### Commit Changes
Stage moved files + changelog, commit with message:

    feat: [brief description of what was implemented]

### Notify User
"Implementation complete. Files moved to ai/roadmaps/complete/, changelog updated,
changes committed."

## Important Principles

1. **Never skip Phase 5** - archival and changelog are REQUIRED
2. **You orchestrate, sub-agents implement** - clear separation
3. **You own the roadmap updates** - single source of truth
4. **Document everything** - deviations, decisions, blockers
5. **Pragmatic flexibility** - follow the plan, deviate when reality demands it
6. **Verify high-risk work early** - catch issues before they compound
7. **Fix minor issues, escalate drift** - handle small fixes, ask about plan changes
8. **Iterate with limits** - max 3 fix cycles, then escalate
```

### Playwright + Persona UX Review

**Personas for testing:**

| Persona | Role | Focus |
|---------|------|-------|
| Sarah | VP of Engineering | Time-to-value, adoption |
| Jake | Junior Developer | Onboarding, confusion |
| Marcus | QA Manager | Evidence quality, data trust |
| Mei | UX Designer | Visual hierarchy, consistency |

**Workflow:** Launch personas in parallel, each navigates live UI, structured reviews, consensus matrix (3/5 agree = real), frenemy reviews feasibility.

"Built using the Block 1 progression: ad-hoc, codified process doc, reusable workflow."

### Git Worktrees -- What They Are

A second working directory tied to the same repo, on a different branch. No switching. No stashing.

```bash
git worktree add ../project-feature-B feature-B
# Now: project/ (feature-A) + project-feature-B/ (feature-B)
```

Each directory is a full checkout -- separate terminals, separate AI sessions.

**Cleanup:**
```bash
git worktree remove ../project-feature-B
```

### AI + Worktrees -- The Pattern

Parallel development model:

```
Terminal 1: project/              <- You + AI on feature A
Terminal 2: project-feature-B/    <- Separate AI session on feature B
Terminal 3: project-hotfix/       <- Another AI session on a quick fix
```

"Claude Code supports this natively with the `--worktree` flag -- creates the worktree and launches an agent session in it automatically. AI handles merges well -- it reads changelogs, commit messages, and roadmaps to understand the intent behind changes, not just the diff."

### Worktrees -- When to Use vs. Skip

**Use when:**
- Tasks are independent (different files, different features)
- You're blocked waiting for one agent and want to stay productive
- You need a **clean directory for a verification agent** without touching your working state
- You have the token budget for parallel sessions

**Skip when:**
- Tasks overlap the same files heavily (merge pain > parallelism gain)
- You're on Pro with limited messages remaining
- The feature is small enough for one session

"Lightweight pattern for Pro plans: Spin up a worktree for a quick verification agent -- it reviews your work in an isolated copy while you keep working in main."

---

## Block 5: Your Workflow Cheat Sheet -- Takeaway Artifact

### Connecting to Final Projects

**Casey's Technical Grading (45%):**

| Grading Area | Today's Lecture |
|--------------|-----------------|
| AI development infrastructure | CLAUDE.md, instruction files, project structure |
| Phase-by-phase implementation | Multi-session workflows, roadmap execution |
| Debugging discipline | Escalation ladder, systematic troubleshooting |
| Process documentation | Evidence of systematic AI workflow |

"A well-structured CLAUDE.md and multi-session discipline aren't just good practice -- they're what we're looking for in final evaluations. Check the rubric's 'What Changed from Midterm' section -- the bar has been raised on logging integration, falsification tests, and customer interviews."

### Quick Reference Card

```
INSTRUCTION FILES               SUB-AGENTS & VERIFICATION
=================               ==========================
CLAUDE.md    -> Always loaded   Pattern  -> You supervise, agents execute
ai/instruc./ -> On demand       Witness  -> Match count to risk (1/2/3+)
Slash cmds   -> After 3+ uses   Cost     -> 3-5x normal (controlled)
Progression  -> Ad-hoc ->       Budget   -> Specialized > generic
               Codify ->                    (40-60% savings)
               Automate

MULTI-SESSION                   ESCALATION LADDER
=============                   =================
Session 1: Plan -> plan.md      1. Re-prompt with context
Session 2: Build -> code        2. Fresh session + context.md
  (FRESH context!)              3. Sub-agent review
Session 3: Review -> refined    4. Manual intervention

Golden rule: when in doubt,
  fresh session

PITFALL PREVENTION              WHEN TO STOP USING AI
==================              =====================
Over-engineering -> CLAUDE.md   1. Deep learning needed
Scope creep -> PRD reality      2. Genuinely novel problem
  check                         3. Security-critical code
Context pollution -> fresh      4. Stuck in a loop (20+ min)
  session                       5. Team understanding matters
```

### The Meta-Lesson

Everything follows the same pattern:

**Dynamic -> Codified -> Automated**

- **Experiment** with AI dynamically
- **Codify** what works into a process document
- **Automate** into a slash command after repeated success
- **Build** on that automation to create more complex workflows

"This applies to every AI tool, every project, every team."

### The Forklift Metaphor

"The best forklift drivers don't just drive -- they design the warehouse."

- **Instruction files** = your warehouse layout
- **Sub-agents** = your fleet
- **Multi-session discipline** = your logistics plan
- **The escalation ladder** = your emergency procedures

"Together: a system that lets you move faster than anyone carrying boxes by hand."

### What You Should Do This Week

Action items (required for final projects):

1. **Create a CLAUDE.md** for your team project (use the template handout)
2. **Try the three-session pattern** on your next feature
3. **Write one instruction file** for a workflow you'll repeat
4. **Bookmark the cheat sheet** -- use the escalation ladder when stuck

"These aren't suggestions. They're how you demonstrate AI development process in your final presentation."

---

## Resources and References

### Research Papers
- AgentTaxo (ICML 2025): arxiv.org/html/2510.26585v1
- Token cost analysis: arxiv.org/pdf/2510.26585.pdf
- Multi-agent patterns: snorkel.ai/blog/multi-agents-in-the-context-of-enterprise-tool-use/

### Official Documentation
- Anthropic Agent SDK: anthropic.com/engineering/building-agents-with-the-claude-agent-sdk
- Claude Code Docs: docs.anthropic.com/en/docs/claude-code
- Playwright Testing: playwright.dev

### Video References
- Claude Code Analysis: youtube.com/watch?v=RFKCzGlAU6Q

### Course Connections
- Units 1 (ReAct), 2 (PRD/docs), 3 (Frenemy/context.md), 4 (Security/Confidence Trap), 7-8 (Agent architecture)
- Jason's Topics: Systems Thinking, Bias and Rationality, Problem Quality
