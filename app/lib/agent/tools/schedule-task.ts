import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { solveSchedule } from "@/lib/agent/solver";
import type { BusyWindow } from "@/lib/agent/solver-utils";
import { fetchAllBusyWindows } from "@/lib/calendar/fetchAllBusyWindows";
import { getDayBoundsInZone, getUtcOffsetString, ensureOffset, formatTimeInZone, parseTimeInZone } from "@/lib/timezone";

const logger = createLogger("agent:tool:scheduleTask");

const DEFAULT_WORKING_HOURS_START = 8;
const DEFAULT_WORKING_HOURS_END = 22;
const DEFAULT_BREAK_MINUTES = 10;

export function createScheduleTaskTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async (input) => {
      const { taskId, preferredTime } = input;
      logger.info("Scheduling single task", { userId, taskId, preferredTime, timezone });

      // 1. Fetch the task
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", userId)
        .single();

      if (taskError || !task) {
        logger.error("Failed to fetch task", { error: taskError?.message });
        return JSON.stringify({ error: taskError?.message ?? "Task not found" });
      }

      // 2. Fetch existing scheduled blocks for today (these stay untouched)
      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      const { data: existingBlocks } = await supabase
        .from("scheduled_blocks")
        .select("*")
        .eq("user_id", userId)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString());

      // 3. Fetch calendar busy windows
      let calendarWarning: string | undefined;
      let calWindows: Array<{ start: Date; end: Date; title?: string }> = [];
      try {
        calWindows = await fetchAllBusyWindows(supabase, userId, startOfDay, endOfDay);
      } catch (calError: unknown) {
        calendarWarning = "Could not fetch calendar events — scheduling without calendar data.";
        logger.warn("Calendar fetch failed", {
          error: calError instanceof Error ? calError.message : String(calError),
        });
      }

      // 4. Treat existing blocks + calendar events as busy windows
      const busyWindows: BusyWindow[] = [
        ...calWindows.map((w) => ({ start: w.start, end: w.end, title: w.title })),
        ...(existingBlocks || []).map((b: { start_time: string; end_time: string; title: string }) => ({
          start: new Date(b.start_time),
          end: new Date(b.end_time),
          title: b.title,
        })),
      ];

      // 5. Resolve preferred time (interpret naive timestamps in user's timezone)
      let preferredStartTime: Date | undefined;
      if (preferredTime) {
        preferredStartTime = parseTimeInZone(preferredTime, timezone);
        if (isNaN(preferredStartTime.getTime())) {
          preferredStartTime = undefined;
        }
      }

      // 6. Run solver for just this one task
      const solverResult = solveSchedule({
        tasks: [{
          id: task.id,
          title: task.title,
          durationMinutes: task.duration_minutes,
          preferredStartTime,
        }],
        busyWindows,
        workingHoursStart: DEFAULT_WORKING_HOURS_START,
        workingHoursEnd: DEFAULT_WORKING_HOURS_END,
        breakMinutes: DEFAULT_BREAK_MINUTES,
        timezone,
      });

      if (solverResult.scheduledBlocks.length === 0) {
        logger.warn("No slot found for task", { taskId });

        // Find which block conflicts with the preferred time to give a useful error
        let conflictInfo = "";
        if (preferredStartTime) {
          const prefEnd = new Date(preferredStartTime.getTime() + task.duration_minutes * 60_000);
          const conflicting = (existingBlocks || []).find((b: { start_time: string; end_time: string; title: string }) => {
            const bStart = new Date(b.start_time);
            const bEnd = new Date(b.end_time);
            return preferredStartTime! < bEnd && prefEnd > bStart;
          });
          if (conflicting) {
            conflictInfo = ` Conflict with "${conflicting.title}" (${formatTimeInZone(new Date(conflicting.start_time), timezone)} - ${formatTimeInZone(new Date(conflicting.end_time), timezone)}).`;
          }
        }

        return JSON.stringify({
          error: `No free time slot available for this task today.${conflictInfo}`,
          overflow: [taskId],
        });
      }

      // 7. Insert only the new block (existing blocks are untouched)
      const placed = solverResult.scheduledBlocks[0];
      const utcOffset = getUtcOffsetString(timezone);

      const { error: insertError } = await supabase
        .from("scheduled_blocks")
        .insert({
          user_id: userId,
          task_id: placed.taskId,
          start_time: ensureOffset(placed.startTime.toISOString(), utcOffset),
          end_time: ensureOffset(placed.endTime.toISOString(), utcOffset),
          title: placed.title,
          source: "ai" as const,
        });

      if (insertError) {
        logger.error("Failed to insert block", { error: insertError.message });
        return JSON.stringify({ error: insertError.message });
      }

      logger.info("Task scheduled", {
        taskId,
        start: placed.startTime.toISOString(),
        end: placed.endTime.toISOString(),
      });

      const result: Record<string, unknown> = {
        success: true,
        scheduled_block: {
          task_id: placed.taskId,
          title: placed.title,
          start_time: formatTimeInZone(placed.startTime, timezone),
          end_time: formatTimeInZone(placed.endTime, timezone),
        },
      };
      if (calendarWarning) {
        result.warning = calendarWarning;
      }
      return JSON.stringify(result);
    },
    {
      name: "scheduleTask",
      description:
        "Schedule a single task into a free time slot WITHOUT affecting existing scheduled blocks. Use this after createTask to place a newly created task. Finds a free slot that avoids conflicts with existing blocks and calendar events.",
      schema: z.object({
        taskId: z.string().describe("The ID of the task to schedule"),
        preferredTime: z
          .string()
          .optional()
          .describe("Preferred start time in ISO 8601 format (e.g. '2026-04-07T17:00:00'). Use when the user specifies a time."),
      }),
    },
  );
}
