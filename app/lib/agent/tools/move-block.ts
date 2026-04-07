import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { formatTimeInZone, parseTimeInZone } from "@/lib/timezone";

const logger = createLogger("agent:tool:moveBlock");

export function createMoveBlockTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async (input) => {
      const { blockId, newStartTime } = input;
      logger.info("Moving block", { userId, blockId, newStartTime });

      // 1. Fetch the existing block
      const { data: block, error: fetchError } = await supabase
        .from("scheduled_blocks")
        .select("*")
        .eq("id", blockId)
        .eq("user_id", userId)
        .single();

      if (fetchError || !block) {
        logger.error("Block not found", { blockId, error: fetchError?.message });
        return JSON.stringify({ error: "Block not found" });
      }

      // 2. Calculate new end time (preserve duration)
      const oldStart = new Date(block.start_time);
      const oldEnd = new Date(block.end_time);
      const durationMs = oldEnd.getTime() - oldStart.getTime();
      const newStart = parseTimeInZone(newStartTime, timezone);
      const newEnd = new Date(newStart.getTime() + durationMs);

      if (isNaN(newStart.getTime())) {
        return JSON.stringify({ error: "Invalid start time format" });
      }

      // 3. Update the block (with cascade to push overlapping blocks)
      const { error: updateError } = await supabase
        .from("scheduled_blocks")
        .update({
          start_time: newStart.toISOString(),
          end_time: newEnd.toISOString(),
        })
        .eq("id", blockId);

      if (updateError) {
        logger.error("Failed to move block", { error: updateError.message });
        return JSON.stringify({ error: updateError.message });
      }

      // 4. Check for and resolve overlaps by pushing other blocks forward
      const { data: overlapping } = await supabase
        .from("scheduled_blocks")
        .select("id, title, start_time, end_time")
        .eq("user_id", userId)
        .neq("id", blockId)
        .lt("start_time", newEnd.toISOString())
        .gt("end_time", newStart.toISOString())
        .order("start_time", { ascending: true });

      if (overlapping && overlapping.length > 0) {
        const BREAK_MS = 10 * 60_000;
        let cursor = newEnd.getTime() + BREAK_MS;

        for (const ob of overlapping) {
          const obStart = new Date(ob.start_time).getTime();
          const obEnd = new Date(ob.end_time).getTime();
          const obDuration = obEnd - obStart;

          if (obStart < cursor) {
            const pushStart = new Date(cursor);
            const pushEnd = new Date(cursor + obDuration);

            await supabase
              .from("scheduled_blocks")
              .update({
                start_time: pushStart.toISOString(),
                end_time: pushEnd.toISOString(),
              })
              .eq("id", ob.id);

            cursor = pushEnd.getTime() + BREAK_MS;
          } else {
            cursor = obEnd + BREAK_MS;
          }
        }

        logger.info("Cascade-pushed overlapping blocks", { count: overlapping.length });
      }

      logger.info("Block moved", {
        blockId,
        from: oldStart.toISOString(),
        to: newStart.toISOString(),
      });

      return JSON.stringify({
        success: true,
        block: {
          id: blockId,
          title: block.title,
          start_time: formatTimeInZone(newStart, timezone),
          end_time: formatTimeInZone(newEnd, timezone),
        },
      });
    },
    {
      name: "moveBlock",
      description:
        "Move an existing scheduled block to a new time. Preserves the task's duration and pushes overlapping blocks forward. Use when the user wants to move/reschedule a specific task to a different time. Does NOT delete or recreate anything.",
      schema: z.object({
        blockId: z.string().describe("The ID of the scheduled block to move (from getScheduledBlocks)"),
        newStartTime: z.string().describe("New start time in ISO 8601 format (e.g. '2026-04-07T17:00:00')"),
      }),
    },
  );
}
