# Phase 7: Final Project Setup - Implementation Plan

**Date:** 2026-04-01
**Phase:** 7 - Final Project Setup
**Status:** Not started
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-7-final-project-setup-roadmap.md`
**Previous Phase:** `2026-02-23-phase-6-code-quality-security-plan.md` (in `complete/`)
**Context:** `ai/guides/final-rubric.md` — rubric requirements driving this phase

---

## Clean Code Principles

This phase is infrastructure alignment, not feature work. Resist the urge to refactor code or add features — the goal is to verify and update existing artifacts so they meet the final rubric. Keep changes minimal and targeted.

---

## Goal

Align project infrastructure with the final rubric before building new features. Ensure CLAUDE.md has behavioral guidance, structured logging is integrated in application code, test scripts pass with proper exit codes, and living docs are current. By the end of this phase, the project foundation is rubric-ready so Phases 8+ produce grading-ready git history.

---

## Prerequisites

- Phase 6 complete (CLI testing, structured logging, security hardening)
- Access to `ai/guides/final-rubric.md` for rubric requirements
- Access to `ai/notes/midterm-feedback.md` for midterm feedback gaps

---

## 7.1 CLAUDE.md Alignment

### Why

The rubric explicitly scores CLAUDE.md as a sub-criterion under AI Development Infrastructure: "CLAUDE.md or .cursorrules with behavioral guidance is now an explicit sub-criterion." Casey's lectures emphasize behavioral guidance that shapes how AI assistants interact with the codebase.

### What to Verify and Update

- CLAUDE.md references key docs (context.md, coding-style.md, architecture.md, mvp.md)
- Behavioral guidance covers: before writing code, while writing code, when uncertain, code quality
- Commands section lists dev, build, lint, and test commands
- Plans & Roadmaps section documents the convention (date prefix, plans vs. roadmaps, completion flow)
- CLAUDE.md does not contain secrets or hardcoded values
- Both root-level and `stride/` CLAUDE.md files are consistent

### What Not to Do

- Do not turn CLAUDE.md into a general README — it is AI behavioral guidance, not project documentation
- Do not duplicate content that belongs in context.md or coding-style.md

---

## 7.2 Structured Logging Verification

### Why

The rubric requires structured logging "integrated into actual application code — not just a standalone logger file." Midterm allowed an unused logger; the final does not. The rubric also scores the test-log-fix loop — evidence that AI read logs, diagnosed issues, and fixed them.

### What to Verify

- `lib/logger.ts` exists and exports structured logging functions
- Logger is imported and used in actual application code (API routes, server-side logic, middleware)
- No raw `console.log`, `console.error`, or `console.warn` calls remain in app code (outside of logger itself)
- Log output is structured (JSON or key-value format), not unstructured strings
- Logger is used in error paths, not just happy paths

### Integration Points to Check

- API routes (`app/api/`) — all routes should log requests, errors, and key operations
- Middleware (`middleware.ts`) — should log auth decisions
- Server-side data fetching — should log Supabase and external API calls
- Error boundaries and catch blocks — should log with context (userId, route, operation)

---

## 7.3 Test Scripts & Exit Codes

### Why

The rubric scores CLI test scripts under Structured Logging & Debugging: "CLI test scripts exist and work" and "Proper exit codes (0/1/2) on scripts." The test-log-fix loop must be visible in git history.

### What to Verify

- `npm run test:all` runs from the `app/` directory and exits cleanly
- All individual test scripts pass
- Scripts exit with proper codes: 0 on success, 1 on failure, 2 on usage error
- Test output is readable and indicates what passed/failed
- Test scripts cover the core flow (task CRUD, schedule building, auth)

### Exit Code Standards

- Exit code 0: all tests passed
- Exit code 1: one or more tests failed (expected failure)
- Exit code 2: usage error, missing env vars, or script misconfiguration
- Scripts should never exit 0 when tests actually failed

### Test-Log-Fix Loop

- After verifying tests pass, ensure there is git history showing the pattern: test fails, logs are read, issue is diagnosed, fix is committed
- If no such history exists, create it organically by running tests, finding real issues, and fixing them with meaningful commits

---

## 7.4 Living Docs & Roadmap Hygiene

### Why

The rubric scores documents as "living artifacts reflecting current project state." Multiple rubric items check for current docs: "Documents are living artifacts that reflect the current project state", "Context.md uses the bookshelf pattern and is current", "Roadmaps used as checklists during implementation with tasks checked off."

### What to Verify and Update

- `aiDocs/changelog.md` reflects work since midterm (not empty or stale)
- `aiDocs/context.md` uses the bookshelf pattern (references key docs with 1-2 sentence descriptions)
- `aiDocs/context.md` Current Focus section reflects the actual current phase
- `aiDocs/coding-style.md` exists and is current
- `aiDocs/architecture.md` exists and is current
- `aiDocs/mvp.md` exists, defines the concrete scope-constrained deliverable, and reflects the current product direction (agentic AI pivot)
- `aiDocs/prd.md` exists with quantitative success metrics (Section 3)
- All completed phase roadmaps (0-6) have tasks checked off
- Completed phase docs are in `ai/roadmaps/complete/`
- `ai/` and `aiDocs/` folders are NOT gitignored — graders must see these

### Gitignore Verification

- `.env` is gitignored
- `.testEnvVars` is gitignored
- MCP configs are gitignored (may contain API keys)
- `node_modules/` is gitignored
- `ai/` and `aiDocs/` are NOT gitignored
- No secrets committed in git history

---

## 7.5 Add Helpful Skills

### Why

Skills (slash commands) streamline common AI workflows during development. Adding skills for repetitive tasks saves time and ensures consistency as Phases 8+ produce more code and documentation.

### Skills to Add

- Changelog update skill — standardized format for adding entries to `aiDocs/changelog.md`
- Roadmap check skill — scan roadmap files for unchecked tasks, report progress
- Context refresh skill — verify `aiDocs/context.md` is current and suggest updates
- Any other workflow-specific skills that reduce friction for common operations

### Principles

- Skills should be lightweight and focused on one task
- Skills should follow existing conventions (date formats, file locations, naming patterns)
- Skills should not replace human judgment — they assist, not automate

---

## Deliverable

Project infrastructure is rubric-aligned. CLAUDE.md provides behavioral guidance. Structured logging is verified in application code. Test scripts pass with proper exit codes. Living docs (changelog, context.md, coding-style, architecture, mvp, prd) are current. Roadmap hygiene is clean. Foundation is ready for Phases 8+.

---

## Acceptance Criteria

- CLAUDE.md has behavioral guidance and references key docs
- No raw `console.*` calls in application code (logger used instead)
- `npm run test:all` passes with exit code 0
- All test scripts use proper exit codes (0/1/2)
- `aiDocs/changelog.md` reflects work since midterm
- `aiDocs/context.md` uses bookshelf pattern and is current
- All completed phase roadmaps have tasks checked off
- `.gitignore` covers secrets but not `ai/` or `aiDocs/`
- No secrets in git history

---

## Next Phase

**Phase 8:** Desktop Widget (`2026-04-01-phase-8-desktop-widget-plan.md`)
