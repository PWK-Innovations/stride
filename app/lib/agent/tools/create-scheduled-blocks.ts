import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { solveSchedule } from "@/lib/agent/solver";
import type { SolverTask } from "@/lib/agent/solver";
import type { BusyWindow } from "@/lib/agent/solver-utils";
import { fetchAllBusyWindows } from "@/lib/calendar/fetchAllBusyWindows";
import { getDayBoundsInZone, getUtcOffsetString, ensureOffset, formatTimeInZone, parseTimeInZone } from "@/lib/timezone";
import type { Task } from "@/types/database";

const logger = createLogger("agent:tool:createScheduledBlocks");

/** Default working hours (8 AM to 10 PM) and break time (10 minutes). */
const DEFAULT_WORKING_HOURS_START = 8;
const DEFAULT_WORKING_HOURS_END = 22;
const DEFAULT_BREAK_MINUTES = 10;

export function createScheduledBlocksTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async (input) => {
      const { taskIds, preferredTimes } = input;
      logger.info("Creating scheduled blocks", { userId, taskIds, timezone, preferredTimes });

      // 1. Fetch task details for the given IDs
      const { data: tasks, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .in("id", taskIds);

      if (taskError || !tasks) {
        logger.error("Failed to fetch tasks", { error: taskError?.message });
        return JSON.stringify({ error: taskError?.message ?? "Failed to fetch tasks" });
      }

      if (tasks.length === 0) {
        logger.warn("No matching tasks found", { taskIds });
        return JSON.stringify({ error: "No matching tasks found for the given IDs" });
      }

      // Preserve the requested order
      const orderedTasks: Task[] = [];
      for (const id of taskIds) {
        const found = tasks.find((t) => t.id === id);
        if (found) {
          orderedTasks.push(found as Task);
        }
      }

      // 2. Fetch busy windows from all connected calendars
      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      let calendarWarning: string | undefined;
      let allWindows: Array<{ start: Date; end: Date; title?: string }> = [];
      try {
        allWindows = await fetchAllBusyWindows(supabase, userId, startOfDay, endOfDay);
      } catch (calError: unknown) {
        calendarWarning = "Could not fetch calendar events — scheduling without calendar data.";
        logger.warn("Calendar fetch failed, proceeding without busy windows", {
          error: calError instanceof Error ? calError.message : String(calError),
        });
      }
      const busyWindows: BusyWindow[] = allWindows.map((w) => ({
        start: w.start,
        end: w.end,
        title: w.title,
      }));

      // 3. Convert tasks to solver format (order preserved from agent)
      const solverTasks: SolverTask[] = orderedTasks.map((task) => {
        let preferredStartTime: Date | undefined;

        // Use explicit preferredTimes parameter only (not stale notes)
        if (preferredTimes?.[task.id]) {
          preferredStartTime = parseTimeInZone(preferredTimes[task.id], timezone);
          if (isNaN(preferredStartTime.getTime())) {
            preferredStartTime = undefined;
          }
        }

        return {
          id: task.id,
          title: task.title,
          durationMinutes: task.duration_minutes,
          preferredStartTime,
        };
      });

      // 4. Run deterministic solver
      const solverResult = solveSchedule({
        tasks: solverTasks,
        busyWindows,
        workingHoursStart: DEFAULT_WORKING_HOURS_START,
        workingHoursEnd: DEFAULT_WORKING_HOURS_END,
        breakMinutes: DEFAULT_BREAK_MINUTES,
        timezone,
      });

      const utcOffset = getUtcOffsetString(timezone);

      // 5. Delete existing scheduled blocks for today
      await supabase
        .from("scheduled_blocks")
        .delete()
        .eq("user_id", userId)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString());

      // 6. Insert new scheduled blocks
      if (solverResult.scheduledBlocks.length > 0) {
        const blocksToInsert = solverResult.scheduledBlocks.map((block) => ({
          user_id: userId,
          task_id: block.taskId,
          start_time: ensureOffset(block.startTime.toISOString(), utcOffset),
          end_time: ensureOffset(block.endTime.toISOString(), utcOffset),
          title: block.title,
          source: "ai" as const,
        }));

        const { error: insertError } = await supabase
          .from("scheduled_blocks")
          .insert(blocksToInsert);

        if (insertError) {
          logger.error("Failed to insert blocks", { error: insertError.message });
          return JSON.stringify({ error: insertError.message });
        }
      }

      // 7. Build response with human-readable local times for the agent
      const resultBlocks = solverResult.scheduledBlocks.map((block) => ({
        task_id: block.taskId,
        title: block.title,
        start_time: formatTimeInZone(block.startTime, timezone),
        end_time: formatTimeInZone(block.endTime, timezone),
      }));

      logger.info("Scheduled blocks created", {
        count: resultBlocks.length,
        overflow: solverResult.overflow.length,
      });

      const result: Record<string, unknown> = {
        scheduled_blocks: resultBlocks,
        overflow: solverResult.overflow,
      };
      if (calendarWarning) {
        result.warning = calendarWarning;
      }
      return JSON.stringify(result);
    },
    {
      name: "createScheduledBlocks",
      description:
        "Build a FULL schedule from scratch. DELETES ALL existing scheduled blocks first, then places the given tasks. Only use for 'plan my day' or full reschedules. DO NOT use when adding a single task — use scheduleTask instead, which preserves existing blocks.",
      schema: z.object({
        taskIds: z
          .array(z.string())
          .describe("Ordered list of task IDs to schedule"),
        preferredTimes: z
          .record(z.string(), z.string())
          .optional()
          .describe("Optional map of task ID to preferred start time in ISO 8601 format (e.g. {\"task-id\": \"2026-04-03T18:00:00\"})"),
      }),
    },
  );
}
