---
name: refresh-context
description: Verify aiDocs/context.md is current and suggest updates
---

# Refresh Context

Check whether `aiDocs/context.md` is up to date and suggest corrections.

## Steps

1. Read `aiDocs/context.md` in full.
2. Read the active roadmap files in `ai/roadmaps/` (not `complete/`) to determine the latest phase activity.
3. Check the **Current Focus** section:
   - Does it accurately reflect which phases are complete?
   - Does it name the correct next/active phase?
   - Flag any stale references.
4. Check the **Key Files** table:
   - Verify each referenced file/directory still exists.
   - Scan `aiDocs/`, `ai/guides/`, and `ai/notes/` for important files missing from the table.
   - Flag any broken references.
5. Check the **Tech Stack** section:
   - Compare against `package.json` for accuracy.
   - Flag outdated version numbers or missing technologies.
6. Check the **App Structure** section:
   - Verify directory descriptions match actual `app/` contents.
   - Flag new directories that should be mentioned.
7. Present findings as a list of suggested changes (additions, corrections, removals).
8. Ask the user: "Would you like me to apply these updates?"
9. If confirmed, apply changes and show what was modified.

## Rules

- Do not modify `aiDocs/context.md` without user confirmation.
- Keep the bookshelf pattern: doc path, short description, "when to read" guidance.
- Keep Current Focus concise.
- Do not remove entries unless the referenced file is confirmed deleted.
- Preserve the existing structure and heading hierarchy.
