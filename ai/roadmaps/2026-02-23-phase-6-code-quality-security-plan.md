# Phase 6: Code Quality & Security - Implementation Plan

**Date:** 2026-02-23
**Phase:** 6 - Code Quality & Security
**Status:** Not started
**Parent Plan:** `2026-02-08-stride-high-level-plan.md`
**Roadmap:** `2026-02-23-phase-6-code-quality-security-roadmap.md`
**Previous Phase:** `2026-02-09-phase-5-polish-validation-plan.md`

---

## Clean Code Principles

This is a clean codebase — no legacy, no cruft. This phase makes the code AI-friendly and production-ready. Avoid over-engineering: build just enough infrastructure for AI agents to test, debug, and validate the app autonomously. No unnecessary abstractions.

---

## Goal

Make the codebase AI-testable, well-logged, and secure before beta launch. Three pillars:
1. **CLI Testing** — AI can run the entire workflow from the command line
2. **Structured Logging** — Machine-parseable logs with full context
3. **Security Hardening** — No secrets in code, dependencies audited, inputs sanitized

---

## Prerequisites

- Phase 5 complete (polished MVP, error handling, UX improvements)

---

## 6.1 CLI Testing Infrastructure

### Scripts Folder Pattern

Create a `scripts/` folder at the app root with standard entry points:

```
scripts/
├── build.sh      # Compile/build the app
├── run.sh        # Run the app
├── test.sh       # Run test suite
├── lint.sh       # Run linting
└── dev.sh        # Start dev server
```

**Purpose:** AI agents (Claude Code subagents) can run the entire workflow from the command line.

### Script Requirements

Every script must follow these conventions:

- **`set -e`** — exit on error
- **`--help` / `-h` flag** — self-documenting scripts that print usage, commands, and options; reduces AI confusion
- **Source `.testEnvVars`** — load test environment variables
- **JSON output** — test results output as JSON to stdout so AI can parse and validate
- **Structured errors to stderr** — diagnostics and error messages go to stderr so AI can handle errors separately from data
- **Standard exit codes:**
  - `0` — Success (everything worked as expected)
  - `1` — General failure (default error condition)
  - `2` — Misuse (invalid arguments or usage)
  - `126` — Command cannot execute (permission problems)
  - `127` — Command not found (missing dependency)
  - `130` — Terminated by Ctrl+C (user interruption)

### Example: test.sh

```bash
#!/bin/bash
set -e  # Exit on error

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    cat << EOF
Usage: $0 [options]

Commands:
  (default)     Run all tests
  unit          Run unit tests only
  integration   Run integration tests only

Options:
  --coverage    Run with coverage report
  --verbose     Enable verbose output
  --quiet       Suppress output
  --help, -h    Show this help message
EOF
    exit 0
fi

# Source environment variables
source .testEnvVars

echo "Running tests..."
npm test -- --coverage

echo "Running integration tests..."
npm run test:integration

echo "All tests passed"
```

### Make the App CLI-Exercisable

Key endpoints and operations should be testable from the command line with JSON input and JSON output. This means:
- API routes should accept JSON bodies and return JSON responses
- Test scripts can use `curl` to hit endpoints and `jq` to parse responses
- AI can call scripts, parse the output, and validate the result

### Explore → Codify Testing Workflow

System-level testing creation follows a two-phase approach. Use agents and subagents to complete the following phases before writing system-level tests:

**Phase 1: Explore** — AI dynamically exercises the system (no scripts yet)
- Prompt the AI: "The app is running on localhost:3000. Explore it."
- AI hits each endpoint with valid and invalid inputs
- AI tries edge cases (empty strings, huge payloads, special characters)
- AI checks what happens with missing auth tokens
- AI looks at the logs after each request
- AI reports what it finds — especially anything surprising

**Phase 2: Codify** — Turn discoveries into repeatable tests
- Based on exploration, create `scripts/test-integration.sh` that:
  - Tests each endpoint with valid inputs (happy path)
  - Tests the edge cases discovered during exploration
  - Tests the failure modes found during exploration
  - Uses proper exit codes and JSON output
  - Can run unattended in the test-fix loop
- The ad-hoc exploration commands become formal, repeatable tests

---

## 6.2 Structured Logging

### Current State

The app has an existing custom logger at `app/lib/logger.ts` with:
- `createLogger(context)` factory function
- `info`, `warn`, `error` methods
- Human-readable format in development, JSON in production
- Used in ~13 files (API routes, OpenAI/Google integration libraries)

Remaining gaps:
- No `debug` level
- ~13 direct `console.error()` calls in `app/app/page.tsx` (client-side error handling)
- 1 `console.log` in notification utility
- No environment-controlled log level

### Enhance the Logger

Keep the existing logger (no need to migrate to Pino — the custom logger is lightweight and well-designed). Enhance it with:

- **Add DEBUG level** — for detailed troubleshooting (e.g., "Query: SELECT * FROM users")
- **Environment-controlled log level** — set via `LOG_LEVEL` env var (default: `info` in production, `debug` in development)
- **Log levels hierarchy:**
  - `ERROR` — Something failed that shouldn't have (e.g., database connection failed)
  - `WARN` — Concerning but recoverable (e.g., retry attempt 3 of 5)
  - `INFO` — Normal operations (e.g., user logged in)
  - `DEBUG` — Detailed troubleshooting (e.g., query details, request payloads)

### What to Log

Log function entry, exit, and errors with full context:

```typescript
// Function entry with inputs
logger.info({ action: 'createUser', input: { email, name } });

// Function exit with results
logger.info({ action: 'createUser', result: { userId, success: true } });

// Errors with full context
logger.error({
  action: 'createUser',
  error: err.message,
  stack: err.stack,
  input: { email, name }
});
```

### Replace All console.* Calls

- Replace 9 `console.error()` calls in `app/app/page.tsx` with the structured logger
- Replace 1 `console.log` in `lib/notifications/scheduleNotifications.ts` with logger
- Ensure no direct `console.*` calls remain in the codebase (except inside the logger itself)

### Create Logging Documentation

Create `ai/testing.md` with:
- Where logs are located
- How to clear logs
- How to tail recent logs
- How to set log level via environment

---

## 6.3 Security Hardening

Run through the security checklist and fix any issues found:

- **Secrets in .gitignore** — Verify `.env`, `.env.local`, `.env.production` are all in `.gitignore` before any commit
- **No hardcoded credentials** — Scan the entire codebase for hardcoded API keys, passwords, tokens, or connection strings
- **`.testEnvVars` contains only test data** — Ensure test env file uses fake/test values, not production credentials
- **Dependencies audited** — Run `npm audit` and fix any high/critical vulnerabilities
- **User input sanitized before AI processing** — Verify that user-provided task text, photo descriptions, and other inputs are sanitized before being sent to OpenAI API (prevent prompt injection)
- **API keys rotated regularly** — Document rotation schedule and verify current keys are not compromised
- **Production secrets in secret management** — Verify production env vars are in Vercel environment variables (not in code or committed files)
- **`.env.example` committed** — Create or verify `.env.example` with placeholder values (no actual secrets) so new developers know what env vars are needed

---

## Deliverable

Codebase is AI-testable with CLI scripts, has structured logging throughout, and passes the full security checklist. The app is ready for a confident beta launch.

---

## Acceptance Criteria

- `scripts/` folder exists with build.sh, run.sh, test.sh, lint.sh, dev.sh — all with `--help` support
- All test scripts output JSON results and use standard exit codes
- Explore → Codify testing workflow has been executed at least once
- Logger has DEBUG level and LOG_LEVEL env var support
- Zero direct `console.*` calls in the codebase (except inside logger.ts)
- All key functions log entry, exit, and errors with full context
- `ai/testing.md` documents logging setup
- All security checklist items pass
- `npm audit` shows no high/critical vulnerabilities
- `.env.example` is committed with placeholder values

---

## Next Phase

**Phase 7:** Beta Launch (`2026-02-09-phase-7-beta-launch-plan.md`)
