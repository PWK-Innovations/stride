# Unit 3.5: Implementation Lab

**Subtitle:** From plans to working code

## What We'll Cover Today

1. **Implementing Roadmaps with AI** -- Turning plans into code
2. **Verifying Roadmap Implementation** -- Did AI build what we planned?
3. **Creating CLI Testing Scripts** -- The full loop
4. **Testing with CLI Tools** -- Run and validate
5. **The Fix Loop** -- Autonomous bug fixing

**Format:** ~15 min instruction + hands-on lab time

## What You Should Be Able to DO by End of Today

1. Have AI implement at least one phase of your project from your roadmaps
2. Verify that the implementation matches the roadmap requirements
3. Create CLI scripts that let AI test your application
4. Run and test your application using CLI tools
5. Fix bugs found during testing using the test-fix loop

> "If you accomplish all five, you're ahead of most professional developers using AI."

## Part 1: Implementing Roadmaps with AI

### Quick Recap: Where We Are

```
PRD  -->  Plans  -->  Roadmaps  -->  ???
 (what)    (how)      (checklist)    (CODE)
```

You have the planning docs. Now we turn them into working software.

### The Implementation Prompt Pattern

```
Review @context.md. Implement the roadmap
at ai/roadmaps/[your-roadmap].md.
```

That's it. `context.md` points to architecture, coding style, and everything else AI needs.

**Note:** This only works well if you did the planning homework. Good plans = good implementation. Bad plans = AI guessing.

### What Happens Next

**AI will:**
- Read the roadmap and understand the scope
- Read architecture.md for system design
- Read coding-style.md for conventions
- Implement the code
- May ask clarifying questions -- answer them

**What you do:**
- Watch the implementation unfold
- Answer questions when asked
- Don't micromanage -- let it work

### In Practice

Live demo -- open the meme generator project. Show the roadmap file. Run the implementation prompt. Let AI implement phase 1 from the roadmap. Show code appearing, AI reading context files, making decisions. Pause and answer any questions from the AI.

## Part 2: Verifying Roadmap Implementation

### Did AI Build What We Planned?

Verification implements the **Law of Witnesses** -- a second perspective to ensure truth and correctness.

After implementation, **verify against the roadmap**.

```
Review the roadmap at ai/roadmaps/[your-roadmap].md.
Check off what was completed from phase 1.
Flag anything that was missed or implemented
differently than planned.
Don't make any code changes — just report.
```

### What Verification Looks Like

**AI will:**
- Cross-reference roadmap tasks against actual code
- Mark completed items
- Flag anything missed or changed
- Note any deviations from the plan

**You review:**
- Are the deviations reasonable?
- Was anything critical missed?
- Does the code match your expectations?

### Update Your Roadmap

After verification, update the roadmap:

```
Update the roadmap to reflect what was completed.
Add notes on any changes from the original plan.
Mark phase 1 as complete if everything checks out.
```

This keeps your roadmap a **living document** -- not just a planning artifact.

### The Complete Recipe

The prompt sequence you'll use every time you implement from a roadmap:

**Step 1 -- Review Context**

```
Review @context.md and the roadmap at ai/roadmaps/[your-roadmap].md.
```

**Step 2 -- Implement**

```
Implement phase [N] of the roadmap.
Follow the architecture in aiDocs/architecture.md
and coding style in aiDocs/coding-style.md.
Check off tasks in the roadmap as you complete them.
```

**Step 3 -- Verify with a Sub-Agent**

```
Deploy a sub-agent to verify all implementation from phase [N].
Compare what was built against the roadmap requirements.
Flag anything missed or implemented differently than planned.
Don't make code changes — just report.
```

**Step 4 -- Archive When Complete**

```
Once all phases are done and verified:
Move both the plan and roadmap to ai/roadmaps/completed/
```

**Review, implement, verify, repeat. Archive when done.**

## Part 3: Creating CLI Testing Scripts

### The Key Insight

> "When AI can test itself, you have the full loop."

```
AI implements --> AI tests --> AI reads output --> AI fixes
     ^                                                |
     └────────────────────────────────────────────────┘
```

Without CLI scripts, **you** are the bottleneck.

### The Prompt

```
Create CLI scripts in scripts/ that exercise
the features we just built.
Each script should:
- Accept inputs as command-line arguments
- Run the feature
- Output JSON results to stdout
- Use proper exit codes (0 = success, non-zero = failure)
- Send errors to stderr
```

**Note:** Exit codes from Day 4 preview: 0 = success, 1 = failure, 2 = bad usage. JSON output so AI can parse results.

### The scripts/ Folder Pattern

```
scripts/
├── build.sh      # Compile/build the project
├── test.sh       # Run all tests
├── run.sh        # Run the application
└── dev.sh        # Start dev server (optional)
```

**Minimum viable set:** `build.sh` and `test.sh`

AI can run your entire workflow from the command line.

### Example: test.sh

```bash
#!/bin/bash
echo "Building project..."
./scripts/build.sh || { echo '{"status":"fail","step":"build"}' >&2; exit 1; }
echo "Running tests..."
if npm test 2>&1; then
    echo '{"status": "pass", "message": "All tests passed"}'
    exit 0
else
    echo '{"status": "fail", "message": "Tests failed"}' >&2
    exit 1
fi
```

### Cross-Platform Note

Shell scripts don't work on all machines. For Windows/Mac compatibility, consider Node.js scripts:

```javascript
// scripts/test.js
const { execSync } = require('child_process');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log(JSON.stringify({ status: 'pass' }));
  process.exit(0);
} catch (err) {
  console.error(JSON.stringify({ status: 'fail', error: err.message }));
  process.exit(1);
}
```

**Run with:** `node scripts/test.js`

### In Practice

Live demo -- create CLI scripts for the meme generator. Show `scripts/build.sh` and `scripts/test.sh`. Run them and show JSON output. Show exit codes. Demonstrate AI reading the output.

## Part 4: Testing with CLI Tools

### Run the Scripts

```bash
# Build first
./scripts/build.sh

# Then test
./scripts/test.sh
```

**AI reads the output and knows:**
- Did it work? (exit code 0)
- What failed? (JSON error output)
- What to fix? (error details in stderr)

### The Autonomous Loop

```
1. AI runs: ./scripts/test.sh
2. AI reads output
3. If exit code 0: Done! Tests pass.
4. If exit code != 0: AI reads error output
5. AI diagnoses the issue
6. AI fixes the code
7. Go to step 1
```

This can run **without you touching anything**.

### What Success Looks Like

```
$ ./scripts/test.sh
{"status": "pass", "tests": 12, "failures": 0}
$ echo $?
0
```

Exit code 0 + JSON output = AI knows everything worked.

## Part 5: The Fix Loop

### When Tests Fail

```
Run ./scripts/test.sh.
If any tests fail, analyze the output,
fix the issues, and run again.
Continue until all tests pass.
```

Then step back and let AI work.

**Note:** This is the magic moment. When students see AI autonomously fixing bugs, they get it. Your job is to set this up, not to babysit it.

### When to Intervene

Let AI work. Step back. **Only intervene if:**
- Same error repeating 3+ times
- AI trying increasingly complex "solutions"
- Fix is making things worse
- AI is clearly confused about the root cause

**Intervention prompt:**

```
Stop. Let's step back.
What have we tried so far?
What's the actual root cause?
Is there a different approach entirely?
```

### The Full Picture

```
PLAN         -->  IMPLEMENT  -->  TEST    -->  FIX     -->  VERIFY
(roadmap)         (AI codes)      (CLI)       (loop)       (check roadmap)
                                    ^            |
                                    └────────────┘
```

You planned well. Now let AI execute.

## Key Takeaways

1. **Roadmaps become code** -- AI implements what you planned
2. **Verify implementation against the roadmap** -- Trust but verify
3. **CLI scripts are how AI tests itself** -- The full loop
4. **The test-fix cycle can run autonomously** -- Step back and let it work
5. **Your job: plan well, verify results, intervene when stuck** -- The human role in agentic development

## Lab Time

Now it's your turn. Work through these steps on YOUR project:

1. Have AI implement phase 1 from your roadmap
2. Verify the implementation against the roadmap
3. Create `scripts/build.sh` and `scripts/test.sh`
4. Run the test-fix loop until tests pass
5. Commit your working code and updated roadmap

## Before Next Time

1. **Implement at least one full phase** of your project from your roadmaps
2. **Verify** the implementation matches the roadmap
3. **Create at least 2 CLI scripts** (`build.sh` and `test.sh` minimum)
4. **Run the test-fix loop** until tests pass
5. **Commit** your working code and updated roadmaps

## Resources

- **Commander.js (CLI framework)** -- github.com/tj/commander.js
- **Bash Exit Codes** -- tldp.org/LDP/abs/html/exitcodes.html
- **Node.js child_process** -- nodejs.org/api/child_process.html
- **JSON Output Best Practices** -- jsonapi.org

## Next: Advanced Testing & Deployment
