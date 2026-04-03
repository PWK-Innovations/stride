import { createLogger } from "@/lib/logger";

import { solveSchedule } from "./solver";
import type { SolverTask, ScheduledBlock, SolverResult } from "./solver";
import type { BusyWindow } from "./solver-utils";

const logger = createLogger("agent:reschedule");

export interface RescheduleInput {
  existingBlocks: ScheduledBlock[];
  completedTaskIds: string[];
  inProgressTaskId?: string;
  newTasks?: SolverTask[];
  removedTaskIds?: string[];
  busyWindows: BusyWindow[];
  workingHoursStart: number;
  workingHoursEnd: number;
  breakMinutes: number;
  timezone: string;
  maxMovableTasks: number;
}

/**
 * Stability-first rescheduling.
 *
 * Anchors completed and in-progress blocks so they never move. Caps the number
 * of tasks that can shift in a single reschedule to keep the schedule stable.
 * Any excess movable tasks are also anchored in their current positions.
 */
export function reschedule(input: RescheduleInput): SolverResult {
  const {
    existingBlocks,
    completedTaskIds,
    inProgressTaskId,
    newTasks = [],
    removedTaskIds = [],
    busyWindows,
    workingHoursStart,
    workingHoursEnd,
    breakMinutes,
    timezone,
    maxMovableTasks,
  } = input;

  const removedSet = new Set(removedTaskIds);
  const completedSet = new Set(completedTaskIds);

  logger.info("Rescheduling", {
    existingBlockCount: existingBlocks.length,
    completedCount: completedTaskIds.length,
    inProgressTaskId: inProgressTaskId ?? null,
    newTaskCount: newTasks.length,
    removedCount: removedTaskIds.length,
    maxMovableTasks,
  });

  // 1. Filter out removed tasks
  const activeBlocks = existingBlocks.filter(
    (block) => !removedSet.has(block.taskId),
  );

  // 2. Separate anchored blocks (completed + in-progress) from movable
  const anchoredBlocks: ScheduledBlock[] = [];
  const movableBlocks: ScheduledBlock[] = [];

  for (const block of activeBlocks) {
    const isCompleted = completedSet.has(block.taskId);
    const isInProgress = block.taskId === inProgressTaskId;

    if (isCompleted || isInProgress) {
      anchoredBlocks.push(block);
    } else {
      movableBlocks.push(block);
    }
  }

  logger.debug("Separated blocks", {
    anchoredCount: anchoredBlocks.length,
    movableCount: movableBlocks.length,
  });

  // 3. If movable tasks exceed the cap, anchor the later ones
  //    (keep them in their current time slots to minimize disruption)
  const excessBlocks: ScheduledBlock[] = [];

  if (movableBlocks.length > maxMovableTasks) {
    // Sort movable blocks by start time — reschedule earliest first,
    // keep the later ones anchored
    movableBlocks.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    const excess = movableBlocks.splice(maxMovableTasks);
    excessBlocks.push(...excess);

    logger.info("Capped movable tasks — anchoring excess", {
      movableCount: movableBlocks.length,
      excessAnchored: excess.length,
    });
  }

  // Excess blocks become additional anchors
  const allAnchored = [...anchoredBlocks, ...excessBlocks];

  // 4. Convert movable blocks back to solver tasks
  const movableTasks: SolverTask[] = movableBlocks.map((block) => ({
    id: block.taskId,
    title: block.title,
    durationMinutes: Math.round(
      (block.endTime.getTime() - block.startTime.getTime()) / 60_000,
    ),
  }));

  // 5. Combine movable tasks + new tasks (new tasks go after existing ones)
  const allTasks = [...movableTasks, ...newTasks];

  logger.debug("Solver input prepared", {
    tasksToPlace: allTasks.length,
    anchoredBlockCount: allAnchored.length,
    busyWindowCount: busyWindows.length,
  });

  // 6. Run the solver
  const solverResult = solveSchedule({
    tasks: allTasks,
    busyWindows,
    workingHoursStart,
    workingHoursEnd,
    breakMinutes,
    timezone,
    anchoredBlocks: allAnchored,
  });

  // 7. Combine anchored blocks with newly placed blocks
  const combinedBlocks = [...allAnchored, ...solverResult.scheduledBlocks];

  // Sort by start time for clean output
  combinedBlocks.sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );

  logger.info("Reschedule complete", {
    totalBlocks: combinedBlocks.length,
    anchoredBlocks: allAnchored.length,
    newlyPlaced: solverResult.scheduledBlocks.length,
    overflow: solverResult.overflow.length,
  });

  return {
    scheduledBlocks: combinedBlocks,
    overflow: solverResult.overflow,
  };
}
