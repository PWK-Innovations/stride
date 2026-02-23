# Testing & Logging Guide

## Logs

- Application logs: structured JSON in production, human-readable in development
- Logger module: `app/lib/logger.ts`
- Log level: Set `LOG_LEVEL` in environment (`.env.local` or `.testEnvVars`)
  - `error` — Only errors
  - `warn` — Errors + warnings
  - `info` — Normal operations (default in production)
  - `debug` — Everything including detailed troubleshooting (default in development)
- Clear logs: Logs go to stdout/stderr (no file persistence by default)
- Tail recent: Check terminal output or use Vercel logs dashboard in production

## Log Format

### Development
```
[2026-02-23T10:30:00.000Z] INFO [schedule/build] { action: 'buildSchedule', input: { taskCount: 5 } }
```

### Production (JSON)
```json
{"timestamp":"2026-02-23T10:30:00.000Z","level":"info","context":"schedule/build","action":"buildSchedule","input":{"taskCount":5}}
```

## What Gets Logged

- **Function entry:** `logger.info({ action: 'functionName', input: { ... } })`
- **Function exit:** `logger.info({ action: 'functionName', result: { ... } })`
- **Errors:** `logger.error({ action: 'functionName', error: err.message, stack: err.stack, input: { ... } })`

## CLI Testing

### Scripts

All scripts are in the `scripts/` directory:

| Script | Purpose |
|--------|---------|
| `scripts/build.sh` | Compile/build the app |
| `scripts/run.sh` | Run the app |
| `scripts/test.sh` | Run test suite |
| `scripts/lint.sh` | Run linting |
| `scripts/dev.sh` | Start dev server |
| `scripts/test-integration.sh` | Run integration tests against running server |

### Running Scripts

```bash
# Show help for any script
./scripts/test.sh --help

# Run all tests
./scripts/test.sh

# Run with coverage
./scripts/test.sh --coverage
```

### Exit Codes

| Code | Meaning | When |
|------|---------|------|
| 0 | Success | Everything worked |
| 1 | General failure | Default error |
| 2 | Misuse | Invalid arguments |
| 126 | Cannot execute | Permission problems |
| 127 | Not found | Missing dependency |
| 130 | Interrupted | Ctrl+C |

### Test Environment

- Test environment variables: `.testEnvVars`
- Contains only fake/test data (no production secrets)
- Set `LOG_LEVEL=debug` for verbose test output

## Security

- Secrets: Never committed to git (`.env*` in `.gitignore`)
- Production secrets: Vercel environment variables only
- `.env.example`: Committed with placeholder values for developer reference
- Dependencies: Run `npm audit` regularly
