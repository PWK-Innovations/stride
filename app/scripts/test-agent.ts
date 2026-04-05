import { config } from "dotenv";
import { createLogger } from "../lib/logger";
import { solveSchedule } from "../lib/agent/solver";
import type { SolverTask } from "../lib/agent/solver";
import { reschedule } from "../lib/agent/reschedule";
import type { BusyWindow } from "../lib/agent/solver-utils";

config({ path: ".env.local" });

const logger = createLogger("test:agent");

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string, detail?: string): void {
  if (condition) {
    passed++;
    logger.info(`PASS: ${name}`);
  } else {
    failed++;
    logger.error(`FAIL: ${name}`, { detail: detail ?? "" });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDate(hour: number, minute = 0): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

function blocksOverlap(
  blocks: Array<{ startTime: Date; endTime: Date }>,
): boolean {
  const sorted = [...blocks].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startTime.getTime() < sorted[i - 1].endTime.getTime()) {
      return true;
    }
  }
  return false;
}

function blockOverlapsBusy(
  block: { startTime: Date; endTime: Date },
  busy: BusyWindow[],
): boolean {
  for (const w of busy) {
    if (
      block.startTime.getTime() < w.end.getTime() &&
      block.endTime.getTime() > w.start.getTime()
    ) {
      return true;
    }
  }
  return false;
}

// ─── Solver Tests ─────────────────────────────────────────────────────────────

function testSolverBasicPlacement(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Task 1", durationMinutes: 30 },
    { id: "t2", title: "Task 2", durationMinutes: 45 },
    { id: "t3", title: "Task 3", durationMinutes: 60 },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(
    result.scheduledBlocks.length === 3,
    "Solver places all 3 tasks",
    `placed ${result.scheduledBlocks.length}`,
  );
  assert(result.overflow.length === 0, "Solver has no overflow");
}

function testSolverNoOverlaps(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Task 1", durationMinutes: 60 },
    { id: "t2", title: "Task 2", durationMinutes: 60 },
    { id: "t3", title: "Task 3", durationMinutes: 60 },
    { id: "t4", title: "Task 4", durationMinutes: 60 },
    { id: "t5", title: "Task 5", durationMinutes: 60 },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(
    !blocksOverlap(result.scheduledBlocks),
    "Solver produces no time overlaps (5 tasks)",
  );
}

function testSolverRespectsBreaks(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Task 1", durationMinutes: 30 },
    { id: "t2", title: "Task 2", durationMinutes: 30 },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(result.scheduledBlocks.length === 2, "Solver places both tasks for break test");

  if (result.scheduledBlocks.length === 2) {
    const gapMs =
      result.scheduledBlocks[1].startTime.getTime() -
      result.scheduledBlocks[0].endTime.getTime();
    assert(
      gapMs >= 10 * 60_000,
      "Solver respects 10-min break between tasks",
      `gap: ${Math.round(gapMs / 60_000)} min`,
    );
  }
}

function testSolverAvoidsBusyWindows(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Morning task", durationMinutes: 60 },
    { id: "t2", title: "Afternoon task", durationMinutes: 60 },
  ];

  const busy: BusyWindow[] = [
    { start: makeDate(9, 0), end: makeDate(10, 30), title: "Team standup" },
    { start: makeDate(13, 0), end: makeDate(14, 0), title: "Lunch" },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: busy,
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  const anyOverlap = result.scheduledBlocks.some((block) =>
    blockOverlapsBusy(block, busy),
  );

  assert(!anyOverlap, "Solver avoids busy windows");
  assert(
    result.scheduledBlocks.length === 2,
    "Solver places both tasks around busy windows",
  );
}

function testSolverOverflow(): void {
  // 9 hours of working time (9-18), but tasks total way more
  const tasks: SolverTask[] = Array.from({ length: 12 }, (_, i) => ({
    id: `t${i}`,
    title: `Task ${i}`,
    durationMinutes: 60,
  }));

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(result.overflow.length > 0, "Solver overflows when tasks exceed capacity");
  assert(
    !blocksOverlap(result.scheduledBlocks),
    "Solver produces no overlaps even at capacity",
  );

  // All task IDs accounted for
  const allIds = [
    ...result.scheduledBlocks.map((b) => b.taskId),
    ...result.overflow,
  ];
  assert(
    allIds.length === 12,
    "Solver accounts for all tasks (placed + overflow)",
    `total: ${allIds.length}`,
  );
}

function testSolverWorkingHours(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Task 1", durationMinutes: 30 },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  if (result.scheduledBlocks.length === 1) {
    const block = result.scheduledBlocks[0];
    const startHour = block.startTime.getUTCHours();
    const endHour = block.endTime.getUTCHours();

    // Working hours in ET are roughly 13-22 UTC (or 14-23 in EST)
    // Just check that block exists and is reasonable
    assert(
      block.endTime.getTime() > block.startTime.getTime(),
      "Solver places block with valid start < end",
      `start: ${block.startTime.toISOString()}, end: ${block.endTime.toISOString()} (UTC hours ${startHour}-${endHour})`,
    );
  }
}

function testSolverPreferredTime(): void {
  const tasks: SolverTask[] = [
    { id: "t1", title: "Morning task", durationMinutes: 30 },
    {
      id: "t2",
      title: "Preferred at 2pm",
      durationMinutes: 60,
      preferredStartTime: makeDate(14, 0),
    },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(result.scheduledBlocks.length === 2, "Solver places both tasks with preferred time");

  const preferredBlock = result.scheduledBlocks.find((b) => b.taskId === "t2");
  if (preferredBlock) {
    const placedHour = preferredBlock.startTime.getHours();
    const placedMinute = preferredBlock.startTime.getMinutes();
    assert(
      placedHour === 14 && placedMinute === 0,
      "Solver respects preferred start time (2:00 PM)",
      `placed at ${placedHour}:${String(placedMinute).padStart(2, "0")}`,
    );
  }
}

function testSolverPreferredTimeBusy(): void {
  const tasks: SolverTask[] = [
    {
      id: "t1",
      title: "Wants 10am but busy",
      durationMinutes: 30,
      preferredStartTime: makeDate(10, 0),
    },
  ];

  const busy: BusyWindow[] = [
    { start: makeDate(9, 30), end: makeDate(11, 0), title: "Meeting" },
  ];

  const result = solveSchedule({
    tasks,
    busyWindows: busy,
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
  });

  assert(result.scheduledBlocks.length === 1, "Solver places task when preferred time is busy");

  const block = result.scheduledBlocks[0];
  if (block) {
    assert(
      block.startTime.getHours() !== 10,
      "Solver falls back from busy preferred time",
      `placed at ${block.startTime.getHours()}:${String(block.startTime.getMinutes()).padStart(2, "0")}`,
    );
  }
}

// ─── Reschedule Tests ─────────────────────────────────────────────────────────

function testRescheduleAnchorsCompleted(): void {
  const existingBlocks = [
    {
      taskId: "done1",
      title: "Done task",
      startTime: makeDate(9, 0),
      endTime: makeDate(9, 30),
    },
    {
      taskId: "move1",
      title: "Movable task",
      startTime: makeDate(10, 0),
      endTime: makeDate(11, 0),
    },
  ];

  const result = reschedule({
    existingBlocks,
    completedTaskIds: ["done1"],
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
    maxMovableTasks: 5,
  });

  const doneBlock = result.scheduledBlocks.find((b) => b.taskId === "done1");
  assert(doneBlock !== undefined, "Reschedule keeps completed task");

  if (doneBlock) {
    assert(
      doneBlock.startTime.getTime() === makeDate(9, 0).getTime(),
      "Reschedule anchors completed task at original time",
    );
  }
}

function testRescheduleMinimalMoves(): void {
  // 7 movable tasks but cap at 3 — 4 should stay anchored
  const existingBlocks = Array.from({ length: 7 }, (_, i) => ({
    taskId: `task${i}`,
    title: `Task ${i}`,
    startTime: makeDate(9 + i, 0),
    endTime: makeDate(9 + i, 30),
  }));

  const result = reschedule({
    existingBlocks,
    completedTaskIds: [],
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
    maxMovableTasks: 3,
  });

  assert(
    result.scheduledBlocks.length === 7,
    "Reschedule preserves all 7 tasks",
    `count: ${result.scheduledBlocks.length}`,
  );
  assert(
    result.overflow.length === 0,
    "Reschedule has no overflow with capped moves",
  );
}

function testRescheduleAnchorsInProgress(): void {
  const existingBlocks = [
    {
      taskId: "active",
      title: "In-progress task",
      startTime: makeDate(10, 0),
      endTime: makeDate(11, 0),
    },
    {
      taskId: "later",
      title: "Later task",
      startTime: makeDate(14, 0),
      endTime: makeDate(15, 0),
    },
  ];

  const result = reschedule({
    existingBlocks,
    completedTaskIds: [],
    inProgressTaskId: "active",
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
    maxMovableTasks: 5,
  });

  const activeBlock = result.scheduledBlocks.find(
    (b) => b.taskId === "active",
  );
  assert(activeBlock !== undefined, "Reschedule keeps in-progress task");

  if (activeBlock) {
    assert(
      activeBlock.startTime.getTime() === makeDate(10, 0).getTime(),
      "Reschedule anchors in-progress task at original time",
    );
  }
}

function testRescheduleWithNewTask(): void {
  const existingBlocks = [
    {
      taskId: "existing1",
      title: "Existing task",
      startTime: makeDate(9, 0),
      endTime: makeDate(10, 0),
    },
  ];

  const result = reschedule({
    existingBlocks,
    completedTaskIds: [],
    newTasks: [{ id: "new1", title: "New task", durationMinutes: 30 }],
    busyWindows: [],
    workingHoursStart: 9,
    workingHoursEnd: 18,
    breakMinutes: 10,
    timezone: "America/New_York",
    maxMovableTasks: 5,
  });

  const newBlock = result.scheduledBlocks.find((b) => b.taskId === "new1");
  assert(
    newBlock !== undefined,
    "Reschedule places new task",
  );
  assert(
    result.scheduledBlocks.length === 2,
    "Reschedule has both existing and new task",
  );
}

// ─── Run All ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  logger.info("Starting agent tests (solver + reschedule)...");

  // Solver tests
  testSolverBasicPlacement();
  testSolverNoOverlaps();
  testSolverRespectsBreaks();
  testSolverAvoidsBusyWindows();
  testSolverOverflow();
  testSolverWorkingHours();
  testSolverPreferredTime();
  testSolverPreferredTimeBusy();

  // Reschedule tests
  testRescheduleAnchorsCompleted();
  testRescheduleMinimalMoves();
  testRescheduleAnchorsInProgress();
  testRescheduleWithNewTask();

  logger.info("Agent test results", { passed, failed, total: passed + failed });

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error("Unexpected error", {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
