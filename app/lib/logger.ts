type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDev = process.env.NODE_ENV !== "production";

function getConfiguredLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL || process.env.NEXT_PUBLIC_LOG_LEVEL)?.toLowerCase();
  if (env && env in LOG_LEVEL_PRIORITY) return env as LogLevel;
  return isDev ? "debug" : "info";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[getConfiguredLevel()];
}

function formatLog(entry: LogEntry): string {
  if (isDev) {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.context}:`;
    const base = `${prefix} ${entry.message}`;
    return entry.data ? `${base} ${JSON.stringify(entry.data)}` : base;
  }
  return JSON.stringify(entry);
}

function reportToSentry(error: unknown, context: string, message: string): void {
  import("@sentry/nextjs")
    .then((Sentry) => {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: { context },
          extra: { message },
        });
      } else {
        Sentry.captureMessage(`${context}: ${message}`, {
          level: "error",
          tags: { context },
          extra: { data: error },
        });
      }
    })
    .catch(() => {
      // Sentry not available — silently ignore
    });
}

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...(data !== undefined && { data }),
  };

  const output = formatLog(entry);

  if (level === "error") {
    console.error(output);
    reportToSentry(data, context, message);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export function createLogger(context: string) {
  return {
    debug: (message: string, data?: unknown) => log("debug", context, message, data),
    info: (message: string, data?: unknown) => log("info", context, message, data),
    warn: (message: string, data?: unknown) => log("warn", context, message, data),
    error: (message: string, data?: unknown) => log("error", context, message, data),
  };
}
