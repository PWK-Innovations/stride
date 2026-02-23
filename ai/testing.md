# Testing & Logging Guide

## Logger Overview

The logger lives at `app/lib/logger.ts`. It is a custom, lightweight module with no
external dependencies. It exposes a single factory function:

```ts
import { createLogger } from "@/lib/logger";

const logger = createLogger("my-context");
logger.info("something happened", { detail: 42 });
```

Each logger instance provides four methods: `debug`, `info`, `warn`, `error`.
Every method has the same signature: `(message: string, data?: unknown)`.

---

## Where Logs Go

| Environment | Destination | How to view |
|-------------|-------------|-------------|
| Development | stdout/stderr of the terminal running `npm run dev` | Watch the terminal |
| Production (Vercel) | Vercel function logs | Vercel dashboard > project > Logs tab |

Logs are not written to files. In development they appear inline in the dev server
output. In production, Vercel captures stdout/stderr from serverless functions and
surfaces them in the Logs dashboard.

---

## Viewing and Clearing Logs

**Dev -- tail logs:**
Just watch the terminal where `npm run dev` is running. All log output is interleaved
with Next.js request logs.

**Dev -- clear logs:**
Restart the dev server (`Ctrl+C` then `npm run dev`). There is no log file to delete.

**Production -- view logs:**
Open the Vercel dashboard, select the Stride project, and go to the Logs tab. You can
filter by level and time range.

**Production -- clear logs:**
Vercel logs auto-rotate. There is no manual clear action.

---

## Setting the Log Level

The logger reads the log level from environment variables at call time:

1. `LOG_LEVEL` -- checked first. Use this for server-side code.
2. `NEXT_PUBLIC_LOG_LEVEL` -- checked second. Use this for client components (the
   `NEXT_PUBLIC_` prefix makes it available in the browser bundle).

If neither is set, the default is:
- `debug` in development (`NODE_ENV !== "production"`)
- `info` in production

Set the variable in `.env.local` for local development or in `.testEnvVars` for test
runs:

```bash
# .env.local
LOG_LEVEL=debug
```

For Vercel production/preview, set the variable in the Vercel dashboard under
Environment Variables.

---

## Log Level Hierarchy

Levels from most verbose to least verbose:

```
debug (0) < info (1) < warn (2) < error (3)
```

Setting a level enables that level and everything above it.

| LOG_LEVEL | debug | info | warn | error |
|-----------|-------|------|------|-------|
| `debug`   | yes   | yes  | yes  | yes   |
| `info`    | --    | yes  | yes  | yes   |
| `warn`    | --    | --   | yes  | yes   |
| `error`   | --    | --   | --   | yes   |

### Examples

With `LOG_LEVEL=info`, these calls produce output:

```ts
logger.info("user signed in", { userId: "abc" });  // printed
logger.warn("token near expiry", { minutes: 3 });   // printed
logger.error("google refresh failed", err.message); // printed
```

And this call is suppressed:

```ts
logger.debug("raw calendar response", response);    // suppressed
```

---

## Log Output Format

### Development (human-readable)

```
[INFO] schedule/build: building schedule for user {"taskCount":5}
[ERROR] google/calendar: token refresh failed "invalid_grant"
[DEBUG] lib/tasks: fetched tasks {"count":12}
```

Pattern: `[LEVEL] context: message {data}`

`data` is JSON-stringified and appended only when provided.

### Production (structured JSON)

```json
{"timestamp":"2026-02-23T10:30:00.000Z","level":"info","context":"schedule/build","message":"building schedule for user","data":{"taskCount":5}}
```

Each log entry is a single JSON line with fields: `timestamp`, `level`, `context`,
`message`, and optionally `data`.

---

## Console Method Routing

The logger routes output to the appropriate console method:

| Level | Console method |
|-------|---------------|
| debug | `console.log` |
| info  | `console.log` |
| warn  | `console.warn` |
| error | `console.error` |

This means `warn` and `error` logs will appear in stderr in Node.js and in the
corresponding browser console sections.

---

## Adding Logging to New Code

1. Import the factory at the top of the file:

```ts
import { createLogger } from "@/lib/logger";
```

2. Create a logger instance with a descriptive context string. Use the file path or
   feature name (e.g., `"api/tasks"`, `"google/calendar"`, `"components/timeline"`):

```ts
const logger = createLogger("api/tasks");
```

3. Use the appropriate level:

```ts
// Detailed troubleshooting info (only visible at debug level)
logger.debug("incoming request body", body);

// Normal operational events
logger.info("task created", { taskId: task.id, userId });

// Recoverable problems or degraded behavior
logger.warn("retrying Google API call", { attempt: 2, reason: "timeout" });

// Failures that need attention
logger.error("failed to save task", { error: err.message, taskId });
```

4. Pass structured data as the second argument, not embedded in the message string.
   This keeps JSON output parseable:

```ts
// Good
logger.info("schedule built", { taskCount: 5, duration: 230 });

// Avoid
logger.info(`schedule built with 5 tasks in 230ms`);
```

---

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

---

## Security

- Secrets: Never committed to git (`.env*` in `.gitignore`)
- Production secrets: Vercel environment variables only
- `.env.example`: Committed with placeholder values for developer reference
- Dependencies: Run `npm audit` regularly
