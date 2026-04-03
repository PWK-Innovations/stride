# Phase 7: Final Project Setup - Roadmap

**Date:** 2026-04-01
**Phase:** 7 - Final Project Setup
**Status:** Not started
**Plan:** `2026-04-01-phase-7-final-project-setup-plan.md`
**Previous Phase:** `2026-02-23-phase-6-code-quality-security-roadmap.md` (in `complete/`)

---

## Tasks

### 7.1 CLAUDE.md Alignment

- [ ] Review current `CLAUDE.md` against rubric requirements (AI Development Infrastructure sub-criterion)
- [ ] Ensure behavioral guidance sections exist: Before Writing Code, While Writing Code, When Uncertain, Code Quality
- [ ] Verify CLAUDE.md references key docs: `aiDocs/context.md`, `aiDocs/coding-style.md`, `aiDocs/architecture.md`, `aiDocs/mvp.md`
- [ ] Verify Commands section lists: `npm run dev`, `npm run build`, `npm run lint`, `npm run test:all`
- [ ] Verify Plans & Roadmaps section documents conventions (date prefix, plans vs. roadmaps, completion flow)
- [ ] Ensure root-level and `stride/` CLAUDE.md files are consistent
- [ ] Confirm no secrets or hardcoded values in CLAUDE.md

### 7.2 Structured Logging Verification

- [ ] Verify `lib/logger.ts` exists and exports structured logging functions
- [ ] Audit API routes (`app/api/`) — confirm logger is imported and used for requests, errors, and key operations
- [ ] Audit middleware (`middleware.ts`) — confirm logger is used for auth decisions
- [ ] Audit error paths — confirm catch blocks log with context (userId, route, operation)
- [ ] Search codebase for raw `console.log`, `console.error`, `console.warn` calls in app code (outside logger)
- [ ] Replace any remaining raw `console.*` calls with structured logger calls
- [ ] Verify log output is structured format (JSON or key-value), not unstructured strings

### 7.3 Test Scripts & Exit Codes

- [ ] Run `npm run test:all` from `app/` directory — confirm all tests pass
- [ ] Verify test runner exits with code 0 on success
- [ ] Verify test runner exits with code 1 on test failure
- [ ] Verify test runner exits with code 2 on usage error or missing env vars
- [ ] Review individual test scripts — confirm none exit 0 when tests actually fail
- [ ] Confirm test output clearly indicates what passed and what failed
- [ ] Ensure test-log-fix loop is visible in git history (test fail, log diagnosis, fix commit)

### 7.4 Living Docs & Roadmap Hygiene

- [ ] Update `aiDocs/changelog.md` with work since midterm
- [ ] Verify `aiDocs/context.md` uses bookshelf pattern (references key docs with 1-2 sentence descriptions)
- [ ] Update `aiDocs/context.md` Current Focus to reflect Phase 7 (Final Project Setup)
- [ ] Verify `aiDocs/coding-style.md` exists and is current
- [ ] Verify `aiDocs/architecture.md` exists and is current
- [ ] Verify `aiDocs/mvp.md` exists, is current, and reflects the agentic AI direction
- [ ] Verify `aiDocs/prd.md` has quantitative success metrics in Section 3
- [ ] Check all completed phase roadmaps (0-6) have tasks checked off
- [ ] Verify completed phase docs are in `ai/roadmaps/complete/`
- [ ] Verify `.gitignore` includes: `.env`, `.testEnvVars`, MCP configs, `node_modules/`
- [ ] Verify `.gitignore` does NOT include `ai/` or `aiDocs/`
- [ ] Scan git history for committed secrets — remediate if found

### 7.5 Add Helpful Skills

- [ ] Create changelog update skill — standardized format for adding entries to `aiDocs/changelog.md`
- [ ] Create roadmap check skill — scan roadmap files for unchecked tasks and report progress
- [ ] Create context refresh skill — verify `aiDocs/context.md` is current and suggest updates
- [ ] Test each skill to confirm it works correctly
- [ ] Document skills in CLAUDE.md or context.md so future sessions know they exist

---

## Deliverable

Project infrastructure is rubric-aligned. CLAUDE.md, structured logging, test scripts, and living docs are all verified and current. Clean foundation for Phases 8+.

---

## Acceptance Criteria

- [ ] All tasks above checked off
- [ ] CLAUDE.md passes rubric check for behavioral guidance
- [ ] Zero raw `console.*` calls in application code
- [ ] `npm run test:all` exits with code 0
- [ ] All living docs (changelog, context, coding-style, architecture, mvp, prd) are current
- [ ] No secrets in repo, `.gitignore` is correct
- [ ] Skills are created and documented

---

## Next Phase

**Phase 8:** Desktop Widget (`2026-04-01-phase-8-desktop-widget-roadmap.md`)
