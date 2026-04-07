/**
 * Timezone-aware date/time utilities.
 *
 * All helpers use the built-in `Intl.DateTimeFormat` API — no external deps.
 * Every server-side code path that touches dates should use these instead of
 * `Date.prototype.getHours()`, `.toLocaleTimeString()`, etc., which silently
 * return UTC values on Vercel.
 */

/** Extract hours + minutes for a given instant in a specific timezone. */
export function getTimeInZone(
  date: Date,
  timezone: string,
): { hours: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  return {
    hours: parseInt(parts.hour, 10),
    minutes: parseInt(parts.minute, 10),
  };
}

/** Format a Date as `"1:30 PM"` in the given timezone. */
export function formatTimeInZone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/** Format a Date as e.g. `"Monday, February 23, 2026"` in the given timezone. */
export function formatDateInZone(
  date: Date,
  timezone: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(date);
}

/**
 * Return the start and end of "today" **in the user's timezone**, expressed as
 * UTC `Date` objects suitable for Supabase / Google Calendar queries.
 *
 * Uses a noon-UTC reference to avoid DST-boundary edge cases when resolving
 * "which calendar date is it right now in tz?".
 */
export function getDayBoundsInZone(
  timezone: string,
): { startOfDay: Date; endOfDay: Date } {
  // 1. Figure out the local calendar date in the target timezone.
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  const year = parseInt(parts.year, 10);
  const month = parseInt(parts.month, 10) - 1; // 0-indexed
  const day = parseInt(parts.day, 10);

  // 2. Build a noon-UTC date for that calendar day (avoids DST ambiguity).
  const noonUtc = new Date(Date.UTC(year, month, day, 12, 0, 0));

  // 3. Find the UTC offset at noon for this timezone.
  const localParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(noonUtc)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  const localHour = parseInt(localParts.hour, 10);
  const localMinute = parseInt(localParts.minute, 10);

  // offset = local - UTC  (in minutes)
  const offsetMinutes =
    (localHour * 60 + localMinute) - (12 * 60 + 0);

  // 4. Start of day in the target timezone, as a UTC Date.
  const startOfDay = new Date(
    Date.UTC(year, month, day, 0, 0, 0) - offsetMinutes * 60_000,
  );
  const endOfDay = new Date(
    Date.UTC(year, month, day, 23, 59, 59, 999) - offsetMinutes * 60_000,
  );

  return { startOfDay, endOfDay };
}

/** Return today's date as `"2026-02-23"` in the given timezone. */
export function getLocalDateString(timezone: string): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * Return a UTC offset string like `"-05:00"` or `"+05:30"` for the given
 * timezone at the current moment.
 */
export function getUtcOffsetString(timezone: string): string {
  const now = new Date();
  const noonUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0),
  );

  const localParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(noonUtc)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});

  const localH = parseInt(localParts.hour, 10);
  const localM = parseInt(localParts.minute, 10);
  const offsetMin = (localH * 60 + localM) - (12 * 60);

  const sign = offsetMin >= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  const h = String(Math.floor(absMin / 60)).padStart(2, "0");
  const m = String(absMin % 60).padStart(2, "0");

  return `${sign}${h}:${m}`;
}

/**
 * Parse an ISO datetime string, treating naive strings (no Z or offset)
 * as being in the given timezone. This prevents the server from
 * misinterpreting "17:00:00" as UTC when the user meant local time.
 */
export function parseTimeInZone(timestamp: string, timezone: string): Date {
  const offset = getUtcOffsetString(timezone);
  const withOffset = ensureOffset(timestamp, offset);
  return new Date(withOffset);
}

/**
 * If `timestamp` is a naive ISO string (no `Z` or offset), append the
 * given fallback offset so Postgres treats it correctly.
 *
 * Examples:
 *   "2026-02-23T13:00:00"         → "2026-02-23T13:00:00-05:00"
 *   "2026-02-23T13:00:00Z"        → "2026-02-23T13:00:00Z"       (unchanged)
 *   "2026-02-23T13:00:00+02:00"   → "2026-02-23T13:00:00+02:00"  (unchanged)
 */
export function ensureOffset(
  timestamp: string,
  fallbackOffset: string,
): string {
  // Already has Z or +/-HH:MM offset
  if (/[Zz]$/.test(timestamp) || /[+-]\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }
  return `${timestamp}${fallbackOffset}`;
}
