---
name: update-changelog
description: Add a standardized entry to aiDocs/changelog.md
---

# Update Changelog

Add a new entry to `aiDocs/changelog.md` following the project's established format.

## Steps

1. Read `aiDocs/changelog.md` to understand the current format and see the latest entries.
2. Determine what changes were made:
   - If the user describes the changes, use that.
   - If not, run `git diff HEAD` and `git log --oneline -10` to infer recent changes.
3. Check if a heading for today's date already exists (format: `## YYYY-MM-DD`).
   - If yes, add the new entry under the existing date heading.
   - If no, add a new date heading at the bottom of the file (dates go oldest to newest).
4. Write entries using the established format: `- **Category:** Description`
   - Categories match what the project uses: feature name, phase name, or area (e.g., "Auth Infrastructure", "Phase 5b", "Dependencies", "Roadmaps", "Build Fixes").
   - Keep descriptions concise and factual. No fluff.
   - Use bold for the category label only. One line per logical change.
   - Group related changes into a single bullet when they form one coherent unit of work.
5. Write the updated file.
6. Show the user what was added.

## Format Reference

```
## 2026-04-03

- **Feature Name:** What was done, concisely.
- **Bug Fix:** Fixed X in Y — root cause was Z.
- **Dependencies:** Installed `package-a`, `package-b`.
- **Roadmaps:** Updated Phase N roadmap, moved to `complete/`.
```

## Rules

- Never remove or modify existing entries.
- Entries go under the correct date heading.
- Do not add empty lines between entries under the same date.
- Match the tone and level of detail of existing entries in the file.
