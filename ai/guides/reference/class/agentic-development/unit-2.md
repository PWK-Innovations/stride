# Unit 2: Ideation & Planning with AI

Using AI to plan before you build.

---

## News & Reading Recap

**News Reference:**
"Top engineers at Anthropic, OpenAI say AI now writes 100% of their code" -- Fortune, January 29, 2026

### Key Reading Recap: "Management as AI Superpower"

- Core insight: As AI handles execution, human roles shift from doing to delegating
- The equation: Human Baseline Time vs. AI Process Time x Probability of Success
- Management skills become AI skills -- scoping, defining deliverables, evaluating output
- Subject matter expertise matters for better instructions and error detection
- "Soft" skills are critical: knowing what good looks like and explaining it clearly

> "The people who thrive will be the ones who know what good looks like -- and can explain it clearly enough that even an AI can deliver it."

---

## What We'll Cover Today

1. **Ideation with AI** -- Brainstorming techniques
2. **Market Research** -- Using Perplexity
3. **Project Documentation** -- PRD, plan docs, roadmap docs, MVP
4. **Git Workflow Concepts** -- Branching, commits, PRs with AI
5. **Iterative Refinement** -- Making docs better

---

## Part 1: Ideation with AI

### Why Ideate with AI?

- Broad knowledge across domains
- Generates ideas you wouldn't think of alone
- Fast iteration on concepts
- No judgment -- explore "bad" ideas safely
- Combines concepts from different fields

### Technique: Quantity Generation

```
I want to build something that helps college students
manage their time.

Give me 15 different product ideas, ranging from simple
apps to ambitious platforms.

Include at least 3 ideas that seem "weird" or unusual.
```

### Technique: Constraint-Based Ideation

```
I need a solution for [problem] that:
- Can be built by 3 students in 8 weeks
- Requires no budget for infrastructure
- Works offline
- Doesn't require user accounts

Generate 10 ideas that fit ALL these constraints.
```

### Technique: Combination Ideation

```
Combine these two concepts:
- Concept A: Habit tracking apps
- Concept B: Social accountability

What would a product look like that merges these
approaches?

Generate 5 product ideas.
```

### Expanding Ideas: Deep Dive

```
I'm considering building [idea].

Help me explore:
1. 5 different ways this could work
2. 3 different user personas it might serve
3. The simplest possible version
4. The most ambitious version
5. Similar products and how this differs
```

### Challenging Ideas: Devil's Advocate

```
Here's my product idea: [description]

Play devil's advocate. Tell me:
- Why this might fail
- What assumptions might be wrong
- Who wouldn't want to use this
- What's the hardest part I'm underestimating
```

### Assumption Testing

```
My product assumes that [assumption].

Is this assumption valid?

What evidence supports or contradicts it?

What would happen if this assumption is wrong?
```

---

## Part 2: Market Research with Perplexity

### Why Perplexity?

| Feature | Benefit |
|---------|---------|
| Web-connected | Current information |
| Citations | Verify sources |
| Synthesis | Multiple sources combined |
| Structured | Good for analysis |

Note: Claude and Gemini also work in web search mode.

### Finding Competitors

```
What companies and products currently solve [problem]?

For each, tell me:
- Company name and product
- Pricing model
- Target audience
- Key features
- What users complain about (from reviews)

Also identify:
- Substitute solutions (workarounds instead of a product)
- The "do nothing" option (tolerating the problem)
- The "800-pound gorilla" (strongest alternative)
```

### Competitive Positioning

```
I'm building [product description].

Compare to [Competitor A], [B], and [C].

Create a comparison table:
- Features
- Pricing
- Target user
- Strengths
- Weaknesses

Where is the gap in the market?
```

### Market Size (TAM/SAM/SOM)

```
Help me estimate market size for [category]:

TAM (Total Addressable Market):
  Everyone who could possibly use this

SAM (Serviceable Addressable Market):
  The segment we can reach

SOM (Serviceable Obtainable Market):
  Realistic first-year target

Provide numbers with sources.
```

### User Personas

```
I'm building [product] for [general audience].

Develop 3 detailed user personas:
- Name and demographics
- Job/role and daily challenges
- Goals and motivations
- Pain points my product addresses
- How they currently solve this
- What would make them switch
- Potential objections
```

### Trend Analysis

```
What are the trends in [industry/category] over
the past 3 years?

Is this market growing, shrinking, or stable?

What's driving the changes?

What do analysts predict for the next 2-3 years?
```

### Founding Hypothesis

**Template:**

```
For [target customer], who has [problem],
our [approach] will solve it better than [competition]
because [differentiation].
```

**Scoring Criteria:**

- Is the customer specific enough?
- Is the problem verified, not assumed?
- Will people choose this over alternatives AND doing nothing?
- Is the differentiation radical or incremental?

Note: If you can't write a compelling hypothesis, you don't understand your market yet.

---

## Part 3: Project Documentation

### Document Hierarchy

```
+-----------------------------------+
| Project Description               |  <- 1-2 paragraphs
+-----------------------------------+
| PRD (Product Requirements Doc)    |  <- What & Why
+-----------------------------------+
| Plan Doc                          |  <- What & How
+-----------------------------------+
| Roadmap Doc                       |  <- Checklist
+-----------------------------------+
| MVP Definition                    |  <- Minimum viable
+-----------------------------------+
| Architecture Doc                  |  <- How it's built
+-----------------------------------+
```

### Project Description (Elevator Pitch)

```
Help me write a project description for:
[explain your idea in casual terms]

Create 2 paragraphs including:
- What problem it solves
- Who it's for
- How it works (high level)
- Why it's different/better

Make it compelling in 30 seconds.
```

### PRD Structure

1. Problem Statement
2. Target Users
3. Goals and Success Metrics
4. Key Features (P0, P1, P2)
5. User Stories
6. Out of Scope
7. Risks and Mitigations
8. Timeline and Milestones

### PRD Creation Prompt

```
Based on this project idea: [description]

Create a PRD with:
- Problem statement
- Target users (primary, secondary, NOT for)
- Success metrics
- Features by priority (P0/P1/P2)
- 5+ user stories
- What's explicitly out of scope
- Key risks
```

### PRD as Immutable Source of Truth

- Captures original requirements and intent
- Other docs change; PRD should not
- Maintains "long-term memory" of what was agreed
- If requirements change: new PRD version or addendum

### Plan Documents: The WHAT and HOW

**Purpose:** Detailed work breakdown and implementation approach.

```
Create a detailed plan doc for this work.
Store it in ai/roadmaps/ with date prefix (YYYY-MM-DD).

The plan should include:
- Work breakdown (what needs to be done)
- Implementation approach (how it will be done)
- Technical considerations
- Dependencies and prerequisites
```

**File naming:** `ai/roadmaps/2025-12-05_feature-name_plan.md`

### Roadmap Documents: The Checklist

**Purpose:** Task checklist organized by phases to keep on track.

```
Create a concise roadmap doc for this work.
Store it in ai/roadmaps/ with date prefix (YYYY-MM-DD).

The roadmap should include:
- Checklist of tasks organized by phases
- Clear completion criteria for each task
- Dependencies between tasks
```

**File naming:** `ai/roadmaps/2025-12-05_feature-name_roadmap.md`

### Plan vs Roadmap Comparison

| Aspect | Plan | Roadmap |
|--------|------|---------|
| **Focus** | The WHAT and HOW | The checklist |
| **Content** | Detailed work breakdown | Task list by phases |
| **Detail** | Implementation approach | Clear completion criteria |
| **Purpose** | Technical considerations | Progress tracking |
| **Audience** | For understanding | For execution |

**Why both?** Keeps AI organized and ensures nothing is missed.

### The Research Phase

**Purpose:** Document before you plan.

```
Review ai/context.md.
Then research how [feature/area] currently works.

Document what you find. DO NOT suggest changes.
Save to ai/roadmaps/YYYY-MM-DD_topic_research.md
```

**When to use:** Complex changes, unfamiliar code, third-party libraries.

**Skip for:** Simple changes, greenfield projects.

### PRD -> Research -> Plan -> Roadmap Pipeline

1. **PRD** -- Defines requirements (immutable)
2. **Research** -- Documents current state (facts only, no opinions)
3. **Plan** -- Describes implementation strategy
4. **Roadmap** -- Provides execution checklist
5. **AI Implementation** -- Follows the roadmap

### MVP Definition

```
Here's my PRD: [reference]

Define the MVP:
1. What's the ONE core problem to solve?
2. Minimum feature set?
3. What can we cut that feels important but isn't?
4. Simplest technical approach?
5. How will we validate with users?

We have [X weeks] and [Y team members].
```

### MVP Reality Check

```
Here's my MVP feature list:
[list features]

I have [X weeks] with [Y developers].

Is this realistic?
- What should I cut?
- What am I underestimating?
- What's the TRUE minimum?
```

### Mermaid Diagrams (Optional)

**Why Mermaid?**

- Text-based diagrams in markdown
- AI can create, read, and modify them
- Version controllable (just text)
- De facto standard for documentation

```
Create a Mermaid diagram showing the system
architecture for [project].
```

### Business Model Canvas (Optional)

```
Create a Business Model Canvas for [project]:

1. Value Proposition
2. Customer Segments
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partners
9. Cost Structure
```

---

## Part 4: Git Workflow Concepts

### Why Git Matters for AI Development

AI needs to understand version control:

- Reads git history to understand changes
- Can commit code with meaningful messages
- Can create branches for features
- Can review uncommitted changes
- Works with PR workflows

Note: Not just a backup system -- it's collaboration infrastructure.

### Branching Mental Model

```
main ─────●───────●───────●────────>
           \             /
            \           /
  feature  ●─────●───●
          [AI develops here]
```

- `main` = production-ready code
- Feature branches = isolated work
- AI can work on branches without breaking main
- Merge when ready

### Commit Patterns with AI

**Prompt:**

```
Please commit the changes we just made with a clear
commit message explaining what was done.
```

**AI Example Output:**

```
git commit -m "Add user authentication with JWT

- Implement login/logout endpoints
- Add token validation middleware
- Update user model with password hashing"
```

### Git as Your Review Tool

When AI modifies your codebase, `git diff` is how you understand what it actually did.

### Reviewing AI's Work

```bash
git status          # What files were changed?
git diff            # What exactly changed?
git diff --stat     # Summary: files and lines changed
git log --oneline   # What has AI committed so far?
```

Note: This is your most important job as the human in the loop.

### Git as Your Safety Net

**Process:**

1. Commit your current working state (checkpoint)
2. Let AI attempt something risky or complex
3. Review the result with `git diff`
4. If it works -> `git commit`
5. If it breaks -> `git checkout -- .` (revert to checkpoint)

**Rule of thumb:** Commit before every major AI task -- treat commits as save points.

---

## Part 5: Iterative Refinement

### The Refinement Cycle

Draft -> Review -> Feedback -> Refine -> (repeat)

### Gap Analysis

```
Review this PRD: [paste]

What's missing?

What questions would a developer have that
aren't answered here?

What assumptions need to be stated explicitly?
```

### Clarity Check

```
Read this spec as if you're a developer who needs
to implement it.

What's unclear?
What could be interpreted multiple ways?

Rewrite any ambiguous sections to be crystal clear.
```

### Scope Creep Detection

```
Compare this MVP definition to the original
problem statement.

Are we solving the original problem, or have
we drifted?

What features don't directly serve the core problem?
```

### Stakeholder Perspectives

```
Review this PRD from these perspectives:

1. As the CEO: Is the business case strong?
2. As lead developer: Is this buildable?
3. As a user: Would I actually use this?
4. As an investor: Is this worth funding?

What concerns would each raise?
```

### Differentiation Check

```
Look at our product positioning:
1. Two most important dimensions customers use to
   evaluate solutions in this space?
2. Plot our product and 3 competitors on a 2x2
3. Are we in a quadrant alone, or clustered?
4. If clustered: differentiation isn't radical enough.
   How could we reframe to stand alone?
```

---

## Key Takeaways

1. **AI excels at ideation** -- Generate quantity, filter for quality
2. **Perplexity = research assistant** -- Web-connected, with citations
3. **Document pipeline matters** -- PRD -> Research -> Plan -> Roadmap
4. **Plans describe WHAT and HOW** -- Detailed implementation strategy
5. **Roadmaps are checklists** -- Keep AI organized during execution
6. **Be ruthless about MVP scope** -- You can always add later
7. **Git is your review tool and safety net** -- Use git diff to review AI work, commits as checkpoints

---

## Homework

- Meet with your team for 1 hour -- Use AI to brainstorm ideas, do market research, assess customer fit, and sketch MVPs using today's process
- Narrow down to 2-3 top ideas -- Come to next session with strongest candidates ready to discuss
- Prepare for hands-on setup -- Dev Unit 3 we'll configure tools and repos

**Next Session:** Development Setup & Tools -- We'll configure your environment.

---

## Resources

- **Perplexity AI** -- perplexity.ai
- **Business Model Canvas** -- strategyzer.com
- **PRD Best Practices** -- svpg.com
- **Git Documentation** -- git-scm.com
- **Mermaid Diagrams** -- mermaid.js.org
