/**
 * Maps internal error messages and status codes to user-friendly strings.
 */

const PATTERN_MAP: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /rate limit/i, message: "Too many requests — please wait a moment and try again." },
  { pattern: /timeout|timed out|ETIMEDOUT/i, message: "The request took too long. Please try again." },
  { pattern: /quota|billing/i, message: "Our AI service is temporarily at capacity. Please try again later." },
  { pattern: /invalid.*api.*key/i, message: "Service configuration error. Please contact support." },
  { pattern: /google.*calendar|calendar.*error/i, message: "Couldn't reach Google Calendar. Please reconnect and try again." },
  { pattern: /token.*expired|token.*revoked|invalid_grant/i, message: "Your Google Calendar session has expired. Please reconnect." },
  { pattern: /not authenticated/i, message: "You need to sign in to continue." },
  { pattern: /no tasks/i, message: "Add some tasks first, then build your day." },
];

const STATUS_MAP: Record<number, string> = {
  400: "Something was wrong with your request. Please check and try again.",
  401: "You need to sign in to continue.",
  403: "You don't have permission to do that.",
  404: "The requested resource wasn't found.",
  408: "The request took too long. Please try again.",
  429: "Too many requests — please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again.",
  502: "Our server is temporarily unreachable. Please try again.",
  503: "The service is temporarily unavailable. Please try again later.",
};

export function friendlyMessage(error: unknown, statusCode?: number): string {
  const raw = error instanceof Error ? error.message : String(error);

  // Check error message patterns first (more specific)
  for (const { pattern, message } of PATTERN_MAP) {
    if (pattern.test(raw)) {
      return message;
    }
  }

  // Fall back to status code mapping
  if (statusCode && STATUS_MAP[statusCode]) {
    return STATUS_MAP[statusCode];
  }

  return "Something went wrong. Please try again.";
}
