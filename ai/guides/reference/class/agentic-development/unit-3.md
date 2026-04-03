# Unit 3: Development Setup & Tools

## Opening

> "Everyone's going to become a forklift driver. No one's going to be carrying boxes anymore."

"This isn't the only way to achieve agentic development -- but it's an evolved workflow I've had high personal success with."

---

## Part 1: Claude Code vs Cursor

### Overview

Choosing between two state-of-the-art AI development platforms.

Key tools in the space: Cursor, Claude Code, GitHub Copilot, Codex, Augment, Cody, Windsurf.

### Claude Code Strengths

- Terminal-first approach
- Script automation capabilities
- Extensive MCP support
- Claude-only model access
- Excellent CLI scripts

### Cursor Strengths

- IDE-first (VS Code fork)
- Visual editing integration
- Automatic file awareness
- Multi-model support (Claude, GPT, others)
- Good CLI script support

### Configuration Equivalence

Claude Code uses `claude.md`:

```
Read aiDocs/context.md for project context.
Follow coding style in aiDocs/coding-style.md
Ask for opinion before complex work.
```

Cursor uses `.cursorrules`:

```
Read aiDocs/context.md for project context.
Follow coding style in aiDocs/coding-style.md
Ask for opinion before complex work.
```

### Feature Comparison

| Feature | Claude Code | Cursor |
|---------|------------|--------|
| Auto-read file | claude.md | .cursorrules |
| MCP support | Native, extensive | Limited/developing |
| Environment | Terminal-based | IDE (VS Code fork) |
| Multi-model | Claude only | Claude, GPT, others |
| Code context | Manual file reading | Automatic awareness |
| CLI scripts | Excellent | Good |

### Practice Activity

Open meme-generator in either tool and verify AI reads context.md automatically.

---

## Part 2: GitHub Setup

### Repository Creation

```bash
# Via GitHub CLI
gh repo create meme-generator --public

# Or initialize locally
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/you/repo
git push -u origin main
```

### Essential .gitignore Patterns

```
# AI working space (local process artifacts)
ai/

# Tool-specific config (personal workflow)
claude.md
.cursorrules

# Test environment (may contain secrets)
.testEnvVars

# Dependencies
node_modules/
venv/
__pycache__/

# Environment
.env
.env.local
```

### Tracked vs Gitignored

| Tracked | Gitignored |
|---------|-----------|
| aiDocs/ (permanent knowledge) | ai/ (temporary workspace) |
| Source code | claude.md / .cursorrules |
| .gitignore | .testEnvVars |

**Key Principle:** "aiDocs/ is shared. ai/ is personal."

### Branching Workflow

```bash
# Create feature branch
git checkout -b feature/add-caption-generator

# Make changes, commit
git add .
git commit -m "Add caption generation script"

# Push to remote
git push -u origin feature/add-caption-generator

# Create PR
gh pr create
```

### When to Commit

- Feature complete and tested
- Before risky changes ("checkpoint")
- Before switching contexts
- End of work session

### AI Assistance for Commits

- "Review my changes and suggest a commit message"
- "What should be in this commit vs the next one?"

### Practice Activity

Create meme-generator repo with proper .gitignore, make initial commit, and push to GitHub.

---

## Part 3: The Two-Folder Pattern

### Core Concept

| Folder | Tracked? | Purpose | Contents |
|--------|----------|---------|----------|
| aiDocs/ | Yes | Permanent project knowledge | context.md, PRD, MVP, architecture, coding style, changelog |
| ai/ | No | Temporary working space | Roadmaps, plans, research, brainstorming |

**Decision Rule:** "Would a new engineer need this to understand the project? -> aiDocs/. Is it a process artifact? -> ai/."

### Project Structure

```
project-root/
├── aiDocs/                # <- TRACKED in git
│   ├── context.md         # THE most important file
│   ├── prd.md             # Product requirements (immutable)
│   ├── mvp.md             # MVP definition
│   ├── architecture.md    # System architecture
│   ├── coding-style.md    # Code style guide
│   └── changelog.md       # Concise change history
├── ai/                    # <- GITIGNORED
│   ├── guides/            # Library docs, research output
│   ├── roadmaps/          # Task checklists, plans
│   └── notes/             # Brainstorming
├── claude.md              # <- GITIGNORED (personal config)
├── .cursorrules           # <- GITIGNORED (personal config)
└── scripts/               # CLI scripts
```

### Why claude.md is Gitignored

- Personal tool configuration, not project knowledge
- Different team members may use different tools
- Different MCP setups per person
- Project knowledge belongs in aiDocs/

### context.md Example

```markdown
# Project Context

## Critical Files to Review
- PRD: aiDocs/prd.md
- Architecture: aiDocs/architecture.md
- Style Guide: aiDocs/coding-style.md

## Tech Stack
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Image Analysis: OpenAI GPT-5 Vision

## Important Notes
- All scripts return JSON to stdout
- Use structured logging to files
- Never commit .testEnvVars

## Current Focus
Building caption generation CLI script
```

### Key Principles for context.md

- Keep it concise (bullet points, not essays)
- List references with 1-2 sentence descriptions
- Update regularly, especially "Current Focus"
- AI reads on demand -- picks only what's relevant

**The Bookshelf Analogy:** "You don't read every book on a shelf -- you scan titles and pick the relevant ones. AI does the same with context.md: scans descriptions, reads only what's needed."

### Concise Changelog Example

```markdown
# Changelog

## 2026-02-01
- Added caption generation CLI (JPG/PNG input, JSON output)
- Switched from OpenAI to Anthropic Vision API for cost

## 2026-01-28
- Initial project setup: React frontend, Express backend
- Created PRD and MVP definition
```

**Changelog Rules:** "What changed and why (not how). 1-2 lines each. AI tends verbose -- trim it."

### claude.md / .cursorrules File

```markdown
# Project Instructions

## Context
Read the context file: aiDocs/context.md

## Required Tools
- Web Research: Use Firecrawl MCP
- Library Docs: Use Context7 MCP

## Behavioral Guidelines
- Ask for opinion before complex work
- Don't make changes during review phase
- Avoid over-engineering
- Match style in aiDocs/coding-style.md
```

### Plans vs Roadmaps

| Aspect | Plan | Roadmap |
|--------|------|---------|
| Focus | WHAT and HOW | Checklist |
| Format | Detailed approach | Task list by phases |
| Content | Technical decisions | Progress tracking |

Both go in `ai/roadmaps/` (gitignored).

### Creating Plans & Roadmaps Prompt

```
"Create a plan doc and then a concise roadmap doc
in ai/roadmaps for what we just discussed.
Prefix the filenames with the current date.
Make sure they reference each other.
Include a note in each file to avoid over-engineering,
cruft, and legacy-compatibility features or comments
in this clean-code project."
```

### For Sub-Agents

```
"Deploy a sub-agent to thoroughly examine the plans
and the files they would change to verify that we're
not missing anything and that the plans are in
alignment with the codebase."
```

### Practice Activity

Create aiDocs/ and ai/ folders, write context.md with PRD reference and tech stack, create claude.md (verify it's gitignored), show AI automatically reading these files.

---

## Part 4: MCP Overview

### Definition

"Model Context Protocol -- Standard for extending AI capabilities beyond text. Gives AI access to tools (like browser extensions for AI). Tools run locally, results fed back to AI."

**Mental Model:** "AI can REQUEST actions -> Tools EXECUTE -> AI sees results"

### MCP Architecture

```
┌─────────────────┐
│   Your Prompt   │
└────────┬────────┘
         ▼
┌─────────────────┐
│   AI (Claude)   │ → "I need React docs..."
└────────┬────────┘
         ▼
┌─────────────────┐
│   MCP Router    │
└────────┬────────┘
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌───────┐ ┌────────┐ ┌───────────┐
│Context│ │Perplex │ │Playwright │
│   7   │ │  ity   │ │           │
└───────┘ └────────┘ └───────────┘
```

### Context7: Library Documentation

**What it does:**
- Searches and retrieves latest library docs
- More current than AI training data
- Stores docs locally for future reference

**When to use:**
- Learning a new library
- Checking current API syntax
- Finding library-specific best practices

**Context7 Example Prompt:**

```
Use Context7 to research the best React
state management libraries for our use case.

Pull the documentation for the top recommendation
and store it in ai/guides/ with suffix _context7.md
```

**AI will:**
1. Search Context7 for React state management options
2. Retrieve documentation for the best fit
3. Save to `ai/guides/zustand_context7.md` (example)
4. Use documentation to answer your question

### Perplexity: Deep Research (Optional)

**What it does:**
- Web-connected search with citations
- Synthesizes multiple sources
- Great for best practices

**Cost Note:** Perplexity MCP requires paid API. For most research, cheaper to search yourself and paste results into Claude.

**When to use:** General research (not library-specific), best practices, OAuth2 approaches.

### Web Scraper MCPs: Firecrawl & Bright Data

**What they do:**
- Search the web and fetch pages
- Parse web pages into markdown
- Free tiers available

**Recommendation:** Use Firecrawl as primary web research tool.

### MCP Tool Comparison

| Tool | Type | Best For | Cost |
|------|------|----------|------|
| Context7 | Library docs | Specific package API docs | Free |
| Firecrawl | Web research | Search + scrape, Claude synthesizes | Free tier |
| Bright Data | Web research | Similar to Firecrawl | Free tier |
| Perplexity | Deep research | Pre-synthesized answers (optional) | Paid |

All store results in `ai/guides/` (gitignored working reference).

### Adding MCP Server

Config location: `~/.config/claude/mcp.json` (Claude Code)

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp"]
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity/mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "your-key-here"
      }
    }
  }
}
```

For Cursor: Check Cursor documentation for MCP configuration.

### Having AI Add MCP

```
"Please add the MCP server for 'chrome-devtools'
following the guide under
ai/guides/external/chromeDevToolsMcp_perplexity.md"
```

---

## Part 5: Cross-Platform & Retrofitting

### Windows vs Mac/Linux Gotchas

| Issue | Mac/Linux | Windows |
|-------|-----------|---------|
| Shell scripts | ./script.sh works | May need WSL or Git Bash |
| Path separators | / | \ (but / often works) |
| Line endings | LF | CRLF (configure git) |
| Environment vars | export VAR=value | set VAR=value or PowerShell |
| Shebangs | #!/bin/bash works | Ignored (use explicit bash) |

**Best Practice:** Use Node.js scripts when possible (cross-platform).

### Retrofitting AI into Existing Projects

1. Add aiDocs/ folder -- Start with context.md
2. Add ai/ folder -- Even if empty initially
3. Create context.md -- Document what you discover
4. Add .gitignore -- Protect ai/, claude.md, .cursorrules, .testEnvVars
5. Ask AI to analyze -- "Review this codebase and create a context.md"

AI can help reverse-engineer: architecture patterns, tech stack details, testing approaches.

### Mermaid Diagrams for Codebase Understanding

Ask AI to generate diagrams and store in `aiDocs/diagrams/`:

| Diagram Type | What It Shows |
|--------------|---------------|
| Class Diagram | Classes, inheritance, relationships |
| Sequence Diagram | Process flow between components |
| ER Diagram | Database tables and relationships |
| Flowchart | Logic and decision paths |

**Prompt Example:**

```
"Analyze this codebase and create Mermaid diagrams
for the class structure and main request flow.
Save them in aiDocs/diagrams/"
```

**Benefits:** Visual review aids understanding -- and AI benefits when diagrams are referenced in context.md.

---

## Part 6: Collaborative Prompting & Bias Toward Truth

### Collaborative Prompting: Tentative Approach

Don't do this:

```
"Add JWT authentication to the API"
```

Do this instead:

```
"We need to add authentication.
I'm thinking JWT tokens but I'm not sure
if that's the best approach here.
What do you think?"
```

**Why this works:**
- Invites AI to provide expert opinion
- AI can identify better approaches you hadn't considered
- Reduces risk of implementing wrong solution

### Pattern: Context-First

```
Review the context file.
Then review how [feature] currently works.
Understand it thoroughly.

Now here's what we need to change:
[requirements]

What's your opinion on the best approach?
Don't make any code changes yet.
```

### Positivity Matters

Don't:

```
"This code is terrible. Fix it."
```

Do:

```
"This code has some issues we need to address.
Can you help identify what needs improvement?"
```

**Why:**
- Research shows negativity causes erratic AI behavior
- Positivity produces more neutral, focused results
- Clear and positive = best combination

**Note:** "You don't need to flatter AI, just stay positive, unaccusing, and clear (same as with people!)."

### Hallucinations

"Why AI generates plausible but wrong answers:
- LLMs predict 'likely next tokens' -- plausible does not equal true
- Gaps in training data filled with confident guesses
- No built-in fact-checking mechanism"

**Your Job:** Create prompting habits that bias AI toward truth.

### 5 Strategies You Can Use Today

| Strategy | How |
|----------|-----|
| Chain-of-Thought | "Show your reasoning step by step" |
| Structured Output | Request JSON -- reduces creative drift |
| Explicit Uncertainty | "Say 'I don't know' rather than guessing" |
| Context Clarification | Give AI the files and facts it needs |
| Multi-Step Verification | Generate -> Verify -> Refine -> Present |

### Bias Toward Truth: In Practice

```
Before implementing, please:
1. Show your reasoning step by step
2. Flag anything you're uncertain about
3. If you don't know something, say so
   rather than guessing
4. Before you answer, verify against
   the project context
```

"Add this pattern to your claude.md or .cursorrules."

### The Frenemy Prompt: Adversarial Review

```
Regarding the following prompt, respond with direct,
critical analysis. Prioritize clarity over kindness.
Do not compliment me or soften the tone of your answer.
Identify my logical blind spots and point out the flaws
in my assumptions. Fact-check my claims. Refute my
conclusions where you can. Assume I'm wrong and make
me prove otherwise.
```

### Two-Step Frenemy Workflow

**Step 1: Frenemy Session (adversarial)**

```
[Frenemy prompt]

Here is my PRD for the meme generator project:
[paste PRD]
```

AI will ruthlessly identify cracks, contradictions, missing pieces, and weak assumptions.

**Step 2: Fresh Collaborative Session (synthesis)**

```
I ran an adversarial review of my PRD.
Here are the criticisms it raised:
[paste frenemy output]

Review these against my actual PRD.
Which are truly valid and actionable?
Which are noise? What should I change?
```

**Combination Power:** "Frenemy finds the cracks. Collaboration decides which ones matter."

### When to Use the Frenemy

| Use Case | What You're Stress-Testing |
|----------|---------------------------|
| PRDs & Plans | Missing requirements, scope gaps, contradictions |
| Architecture | Scalability issues, wrong tool choices, over-engineering |
| Code Reviews | Edge cases, security holes, maintainability concerns |
| Assumptions | "Is this actually true, or do I just believe it?" |

**When NOT to use it:**
- During initial brainstorming (too early -- kills ideas before formation)
- When you need encouragement (use collaborative mode)
- On trivial decisions (overkill)

**Rule of Thumb:** "Build collaboratively first. Frenemy it before you commit."

---

## Part 7: Setup Verification

### Hands-On Activity (15 minutes)

**Goal:** Verify your AI development environment is ready.

**Steps:**
1. Create a GitHub repository for your project
2. Add .gitignore with ai/, claude.md, .cursorrules, .testEnvVars
3. Create aiDocs/ with context.md (reference PRD, list tech stack)
4. Create ai/ folder structure (guides/, roadmaps/, notes/)
5. Create claude.md or .cursorrules pointing to aiDocs/context.md
6. Ask AI to read context.md and summarize your project
7. Verify AI can see your project context

**Success Criteria:** AI can describe your project from aiDocs/context.md.

---

## Key Takeaways

1. **Claude Code vs Cursor** -- Both excellent, choose based on workflow preference
2. **Two-folder pattern** -- aiDocs/ (tracked) vs ai/ (gitignored)
3. **context.md is your AI brain** -- Lives in aiDocs/, shared with team
4. **claude.md is personal config** -- Gitignored, points to aiDocs/context.md
5. **MCP extends AI** -- Context7 for docs, Firecrawl for web research
6. **Bias toward truth** -- Prompt habits that reduce hallucinations
7. **Collaborate, don't command** -- "What do you think?" gets better results
8. **Frenemy for stress-testing** -- Adversarial review before committing to a plan

---

## Quick Reference

```
PROJECT STRUCTURE
aiDocs/               <- TRACKED (permanent knowledge)
├── context.md        <- Main AI context
├── prd.md            <- Product requirements
├── coding-style.md   <- Code style guide
└── changelog.md      <- Concise change history

ai/                   <- GITIGNORED (working space)
├── guides/           <- Library docs, research
├── roadmaps/         <- Plans, task checklists
└── notes/            <- Brainstorming

claude.md             <- GITIGNORED (personal config)

MCP TOOLS
Context7  -> Library docs -> ai/guides/
Firecrawl -> Web research -> ai/guides/
```

---

## Homework

**Do this individually** (even if in a project group):

1. **Complete workspace setup** -- repo, aiDocs/, ai/, .gitignore, claude.md

2. **Have AI generate your planning docs** (then review & refine collaboratively):
   - aiDocs/prd.md -- product requirements
   - aiDocs/mvp.md -- MVP scope definition
   - aiDocs/architecture.md -- system design
   - aiDocs/coding-style.md -- code style guide

3. **Create context.md** -- reference all docs with 1-2 sentence descriptions

4. **Plan implementation phases with AI:**

```
"Review my PRD and MVP. Break down the MVP into logical phases.
How many phases? Should each have its own plan/roadmap,
or group some together?"
```

**For Groups:** Later, use AI to compare/contrast and merge your individual ideas together.

---

## Resources

- Claude Code: docs.anthropic.com/claude-code
- Cursor: cursor.sh
- MCP Protocol: modelcontextprotocol.io
- Context7: context7.io
- GitHub CLI: cli.github.com
- Mermaid Diagrams: mermaid.js.org

**Next:** Implementation & Iteration
