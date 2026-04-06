import { createLogger } from "@/lib/logger";

import {
  getWorkingHoursBounds,
  computeFreeSlots,
  findFittingSlot,
  splitSlot,
} from "./solver-utils";
import type { BusyWindow, TimeSlot } from "./solver-utils";

const logger = createLogger("agent:solver");

export interface SolverTask {
  id: string;
  title: string;
  durationMinutes: number;
  preferredStartTime?: Date;
}

export interface ScheduledBlock {
  taskId: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface SolverInput {
  tasks: SolverTask[];
  busyWindows: BusyWindow[];
  workingHoursStart: number;
  workingHoursEnd: number;
  breakMinutes: number;
  timezone: string;
  anchoredBlocks?: ScheduledBlock[];
  /** Override "now" for testing. When omitted, uses real current time. */
  nowOverride?: Date;
}

export interface SolverResult {
  scheduledBlocks: ScheduledBlock[];
  overflow: string[];
}

/**
 * Deterministic greedy scheduler.
 *
 * Places tasks into free time slots in the order given (agent decides priority).
 * Never overlaps with busy windows or anchored blocks. Respects working hours
 * and adds break buffers between consecutive tasks.
 */
export function solveSchedule(input: SolverInput): SolverResult {
  const {
    tasks,
    busyWindows,
    workingHoursStart,
    workingHoursEnd,
    breakMinutes,
    timezone,
    anchoredBlocks = [],
    nowOverride,
  } = input;

  logger.info("Solving schedule", {
    taskCount: tasks.length,
    busyWindowCount: busyWindows.length,
    anchoredBlockCount: anchoredBlocks.length,
    workingHours: `${workingHoursStart}-${workingHoursEnd}`,
    breakMinutes,
    timezone,
  });

  // 1. Get today's working hours in UTC, clamped to current time
  const { start: rawDayStart, end: dayEnd } = getWorkingHoursBounds(
    timezone,
    workingHoursStart,
    workingHoursEnd,
  );

  const now = nowOverride ?? new Date();
  const dayStart = now > rawDayStart ? now : rawDayStart;

  if (now > rawDayStart) {
    logger.debug("Clamped day start to current time", {
      originalStart: rawDayStart.toISOString(),
      clampedStart: now.toISOString(),
    });
  }

  // 2. Build combined busy windows from calendar events + anchored blocks
  const allBusyWindows: BusyWindow[] = [
    ...busyWindows,
    ...anchoredBlocks.map((block) => ({
      start: block.startTime,
      end: block.endTime,
      title: block.title,
    })),
  ];

  // 3. Compute free slots within working hours
  let freeSlots: TimeSlot[] = computeFreeSlots(dayStart, dayEnd, allBusyWindows);

  const breakMs = breakMinutes * 60_000;
  const scheduledBlocks: ScheduledBlock[] = [];
  const overflow: string[] = [];

  // 4. Place each task greedily (with optional preferred time)
  for (const task of tasks) {
    const durationMs = task.durationMinutes * 60_000;

    let result: { slot: TimeSlot; index: number } | null = null;
    let blockStart: Date;

    // Try preferred time first
    if (task.preferredStartTime) {
      const preferredMs = task.preferredStartTime.getTime();
      const preferredEnd = preferredMs + durationMs;

      for (let i = 0; i < freeSlots.length; i++) {
        const slot = freeSlots[i];
        if (
          preferredMs >= slot.start.getTime() &&
          preferredEnd <= slot.end.getTime()
        ) {
          result = { slot, index: i };
          break;
        }
      }

      if (result) {
        logger.debug("Using preferred time", {
          taskId: task.id,
          preferredTime: task.preferredStartTime.toISOString(),
        });
      } else {
        logger.debug("Preferred time unavailable, falling back to first-fit", {
          taskId: task.id,
          preferredTime: task.preferredStartTime.toISOString(),
        });
      }
    }

    // Fall back to first-fit if no preferred time or preferred slot unavailable
    if (!result) {
      result = findFittingSlot(freeSlots, durationMs);
    }

    if (!result) {
      logger.warn("Task overflowed — no fitting slot", {
        taskId: task.id,
        title: task.title,
        durationMinutes: task.durationMinutes,
      });
      overflow.push(task.id);
      continue;
    }

    const { slot, index } = result;

    // Place at preferred time if within slot, otherwise at slot start
    if (task.preferredStartTime) {
      const preferredMs = task.preferredStartTime.getTime();
      if (
        preferredMs >= slot.start.getTime() &&
        preferredMs + durationMs <= slot.end.getTime()
      ) {
        blockStart = task.preferredStartTime;
      } else {
        blockStart = slot.start;
      }
    } else {
      blockStart = slot.start;
    }

    const blockEnd = new Date(blockStart.getTime() + durationMs);

    const block: ScheduledBlock = {
      taskId: task.id,
      title: task.title,
      startTime: blockStart,
      endTime: blockEnd,
    };

    scheduledBlocks.push(block);

    logger.debug("Placed task", {
      taskId: task.id,
      title: task.title,
      start: blockStart.toISOString(),
      end: blockEnd.toISOString(),
    });

    // 5. Split the used slot and update free slots
    const remainingSlots = splitSlot(slot, blockStart, blockEnd, breakMs);
    freeSlots = [
      ...freeSlots.slice(0, index),
      ...remainingSlots,
      ...freeSlots.slice(index + 1),
    ];
  }

  logger.info("Schedule solved", {
    placedCount: scheduledBlocks.length,
    overflowCount: overflow.length,
  });

  return { scheduledBlocks, overflow };
}
