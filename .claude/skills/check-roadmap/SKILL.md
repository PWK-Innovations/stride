---
name: check-roadmap
description: Scan roadmap files and report progress on checked vs unchecked tasks
---

# Check Roadmap

Scan active roadmap files in `ai/roadmaps/` and report progress.

## Steps

1. List all `.md` files in `ai/roadmaps/` (exclude the `complete/` subdirectory).
2. Identify roadmap files (filenames containing "roadmap"). Skip plan files and the high-level plan.
3. For each roadmap file:
   - Count checked tasks: lines matching `- [x]`.
   - Count unchecked tasks: lines matching `- [ ]`.
   - Calculate progress percentage: `checked / (checked + unchecked) * 100`.
   - Collect the text of each unchecked task.
4. Determine the current active phase:
   - The active phase is the earliest-numbered phase with unchecked tasks.
   - If a roadmap has some checked and some unchecked, it is in progress.
   - If a roadmap has zero checked, it has not started.
5. Present a summary report:

```
## Roadmap Progress

### Phase N: Name (Active / Not Started / Complete)
Progress: X/Y tasks (Z%)
Unchecked:
- [ ] Task description
- [ ] Task description
```

6. End with: "Current active phase: Phase N — Name. Overall: X/Y tasks complete across all active roadmaps."

## Rules

- Only scan `ai/roadmaps/` — never `ai/roadmaps/complete/`.
- Count task checkboxes only (lines with `- [ ]` or `- [x]`).
- Report phases in numerical order.
- Do not modify any files — this skill is read-only.
