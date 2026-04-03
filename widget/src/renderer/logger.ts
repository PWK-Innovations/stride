type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_PREFIX = "[Stride Widget]";

function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  const prefix = `${LOG_PREFIX} [${level.toUpperCase()}] ${context}:`;
  const base = `${prefix} ${message}`;
  const output = data ? `${base} ${JSON.stringify(data)}` : base;

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
    debug: (message: string, data?: unknown) => log("debug", context, message, data),
    info: (message: string, data?: unknown) => log("info", context, message, data),
    warn: (message: string, data?: unknown) => log("warn", context, message, data),
    error: (message: string, data?: unknown) => log("error", context, message, data),
  };
}
