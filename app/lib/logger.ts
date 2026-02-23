type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

const isDev = process.env.NODE_ENV !== "production";

function formatLog(entry: LogEntry): string {
  if (isDev) {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.context}:`;
    const base = `${prefix} ${entry.message}`;
    return entry.data ? `${base} ${JSON.stringify(entry.data)}` : base;
  }
  return JSON.stringify(entry);
}

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
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
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export function createLogger(context: string) {
  return {
    info: (message: string, data?: unknown) => log("info", context, message, data),
    warn: (message: string, data?: unknown) => log("warn", context, message, data),
    error: (message: string, data?: unknown) => log("error", context, message, data),
  };
}
