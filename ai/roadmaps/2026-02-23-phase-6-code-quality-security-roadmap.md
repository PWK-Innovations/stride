# Phase 6: Code Quality & Security - Roadmap

**Date:** 2026-02-23
**Phase:** 6 - Code Quality & Security
**Status:** In progress
**Plan:** `2026-02-23-phase-6-code-quality-security-plan.md`
**Previous Phase:** `2026-02-09-phase-5-polish-validation-roadmap.md`

---

## Tasks

### 6.1 CLI Testing Infrastructure

- [x] Create `scripts/` directory at app root
- [x] Create `scripts/build.sh` — compile/build the app (set -e, --help flag, exit codes)
- [x] Create `scripts/run.sh` — run the app (set -e, --help flag, exit codes)
- [x] Create `scripts/test.sh` — run test suite with JSON output (set -e, --help flag, source .testEnvVars, exit codes)
- [x] Create `scripts/lint.sh` — run linting (set -e, --help flag, exit codes)
- [x] Create `scripts/dev.sh` — start dev server (set -e, --help flag, exit codes)
- [x] Ensure all scripts are executable (`chmod +x`)
- [x] Verify JSON output from test scripts is parseable
- [x] Verify data goes to stdout, errors/diagnostics to stderr
- [x] Verify all exit codes are correct (0, 1, 2, 126, 127, 130)
- [x] **Explore phase:** Run dev server, have AI explore all endpoints with valid/invalid inputs, edge cases, missing auth, and log inspection
- [x] **Codify phase:** Based on exploration findings, create `scripts/test-integration.sh` with repeatable tests (happy path, edge cases, failure modes, JSON output, exit codes)
- [x] Verify test-integration.sh runs unattended and produces parseable results

### 6.2 Structured Logging

- [ ] Add `debug` level to `app/lib/logger.ts`
- [ ] Add `LOG_LEVEL` env var support (default: `info` in production, `debug` in development)
- [ ] Implement log level filtering (only emit logs at or above the configured level)
- [ ] Replace 9 `console.error()` calls in `app/app/page.tsx` with structured logger
- [ ] Replace `console.log` in `lib/notifications/scheduleNotifications.ts` with logger
- [ ] Audit for any other direct `console.*` calls and replace them
- [ ] Verify all API route handlers log entry, exit, and errors with full context
- [ ] Verify all OpenAI integration functions log entry, exit, and errors
- [ ] Verify all Google Calendar integration functions log entry, exit, and errors
- [ ] Add `LOG_LEVEL=debug` to `.testEnvVars`
- [ ] Create `ai/testing.md` with logging documentation (log location, clearing, tailing, log level config)
- [ ] Test: set LOG_LEVEL=debug, verify debug logs appear; set LOG_LEVEL=error, verify only errors appear

### 6.3 Security Hardening

- [ ] Verify `.env`, `.env.local`, `.env.production` are in `.gitignore`
- [ ] Scan codebase for hardcoded credentials (API keys, passwords, tokens, connection strings)
- [ ] Verify `.testEnvVars` contains only fake/test data (no production values)
- [ ] Run `npm audit` and fix any high/critical vulnerabilities
- [ ] Review user input sanitization before OpenAI API calls (task text, photo descriptions)
- [ ] Document API key rotation schedule
- [ ] Verify production secrets are in Vercel environment variables only
- [ ] Create or verify `.env.example` with placeholder values (no actual secrets)
- [ ] Verify `.env.example` is committed to the repo

---

## Deliverable

Codebase is AI-testable (CLI scripts with JSON output), has structured logging everywhere (zero console.* calls), and passes the full security checklist.

---

## Acceptance Criteria

- [ ] All 6.1 tasks checked off — scripts/ folder with all scripts, explore → codify done
- [ ] All 6.2 tasks checked off — structured logging with DEBUG level, zero console.* calls, ai/testing.md created
- [ ] All 6.3 tasks checked off — security checklist passes, npm audit clean, .env.example committed
- [ ] All scripts support `--help` flag
- [ ] Test output is JSON and parseable
- [ ] LOG_LEVEL env var controls log verbosity

---

## Next Phase

**Phase 7:** Beta Launch (`2026-02-09-phase-7-beta-launch-roadmap.md`)
