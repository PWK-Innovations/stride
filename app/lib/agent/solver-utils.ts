import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:solver-utils");

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface BusyWindow {
  start: Date;
  end: Date;
  title?: string;
}

/**
 * Return today's working hours as UTC Date objects for the given timezone.
 *
 * Uses Intl.DateTimeFormat to resolve the current calendar date in the target
 * timezone, then converts the hour boundaries back to UTC.
 */
export function getWorkingHoursBounds(
  timezone: string,
  workingHoursStart: number,
  workingHoursEnd: number,
): { start: Date; end: Date } {
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
  const month = parseInt(parts.month, 10) - 1;
  const day = parseInt(parts.day, 10);

  // Find the UTC offset by comparing a known UTC instant to its local rendering
  const noonUtc = new Date(Date.UTC(year, month, day, 12, 0, 0));
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

  const localHour = parseInt(localParts.hour, 10);
  const localMinute = parseInt(localParts.minute, 10);
  const offsetMinutes = (localHour * 60 + localMinute) - (12 * 60);

  const start = new Date(
    Date.UTC(year, month, day, workingHoursStart, 0, 0) - offsetMinutes * 60_000,
  );
  const end = new Date(
    Date.UTC(year, month, day, workingHoursEnd, 0, 0) - offsetMinutes * 60_000,
  );

  logger.debug("Working hours bounds", {
    timezone,
    localDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    workingHoursStart,
    workingHoursEnd,
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
  });

  return { start, end };
}

/**
 * Merge overlapping or adjacent busy windows into a minimal set.
 * Input does not need to be sorted.
 */
export function mergeBusyWindows(windows: BusyWindow[]): BusyWindow[] {
  if (windows.length === 0) return [];

  const sorted = [...windows].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  const merged: BusyWindow[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start.getTime() <= last.end.getTime()) {
      // Overlapping or adjacent — extend
      if (current.end.getTime() > last.end.getTime()) {
        last.end = current.end;
      }
    } else {
      merged.push({ ...current });
    }
  }

  logger.debug("Merged busy windows", {
    inputCount: windows.length,
    outputCount: merged.length,
  });

  return merged;
}

/**
 * Compute free time slots within a day boundary, subtracting busy windows.
 *
 * Busy windows should already be merged (non-overlapping, sorted by start).
 * If not merged, call `mergeBusyWindows` first.
 */
export function computeFreeSlots(
  dayStart: Date,
  dayEnd: Date,
  busyWindows: BusyWindow[],
): TimeSlot[] {
  const merged = mergeBusyWindows(busyWindows);
  const freeSlots: TimeSlot[] = [];

  let cursor = dayStart.getTime();
  const endMs = dayEnd.getTime();

  for (const window of merged) {
    const busyStart = Math.max(window.start.getTime(), dayStart.getTime());
    const busyEnd = Math.min(window.end.getTime(), endMs);

    // Skip windows entirely outside working hours
    if (busyEnd <= cursor || busyStart >= endMs) continue;

    if (busyStart > cursor) {
      freeSlots.push({
        start: new Date(cursor),
        end: new Date(busyStart),
      });
    }

    cursor = Math.max(cursor, busyEnd);
  }

  // Remaining time after last busy window
  if (cursor < endMs) {
    freeSlots.push({
      start: new Date(cursor),
      end: new Date(endMs),
    });
  }

  logger.debug("Computed free slots", {
    dayStart: dayStart.toISOString(),
    dayEnd: dayEnd.toISOString(),
    busyCount: merged.length,
    freeSlotCount: freeSlots.length,
  });

  return freeSlots;
}

/**
 * Find the first free slot that can fit a task of the given duration (ms).
 * Returns the matching slot and its index, or null if none fits.
 */
export function findFittingSlot(
  freeSlots: TimeSlot[],
  durationMs: number,
): { slot: TimeSlot; index: number } | null {
  for (let i = 0; i < freeSlots.length; i++) {
    const slot = freeSlots[i];
    const slotDuration = slot.end.getTime() - slot.start.getTime();

    if (slotDuration >= durationMs) {
      return { slot, index: i };
    }
  }

  return null;
}

/**
 * Split a free slot after placing a block into it.
 *
 * Given a slot and a block placed within it (blockStart..blockEnd), returns
 * the remaining free time: up to two slots (before and after the block).
 * A break buffer is added after the block so consecutive tasks have breathing room.
 */
export function splitSlot(
  slot: TimeSlot,
  blockStart: Date,
  blockEnd: Date,
  breakMs: number,
): TimeSlot[] {
  const remaining: TimeSlot[] = [];

  // Time before the block
  if (blockStart.getTime() > slot.start.getTime()) {
    remaining.push({
      start: slot.start,
      end: blockStart,
    });
  }

  // Time after the block (plus break buffer)
  const afterBlock = new Date(blockEnd.getTime() + breakMs);
  if (afterBlock.getTime() < slot.end.getTime()) {
    remaining.push({
      start: afterBlock,
      end: slot.end,
    });
  }

  return remaining;
}
