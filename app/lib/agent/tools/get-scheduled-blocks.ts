import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { getDayBoundsInZone, formatTimeInZone } from "@/lib/timezone";

const logger = createLogger("agent:tool:getScheduledBlocks");

export function createGetScheduledBlocksTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async () => {
      logger.info("Fetching scheduled blocks", { userId });

      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      const { data: blocks, error } = await supabase
        .from("scheduled_blocks")
        .select("task_id, title, start_time, end_time, source")
        .eq("user_id", userId)
        .lt("start_time", endOfDay.toISOString())
        .gt("end_time", startOfDay.toISOString())
        .order("start_time", { ascending: true });

      if (error) {
        logger.error("Failed to fetch scheduled blocks", { error: error.message });
        return JSON.stringify({ error: error.message });
      }

      if (!blocks || blocks.length === 0) {
        logger.info("No scheduled blocks found", { userId });
        return JSON.stringify({ blocks: [], message: "No tasks are scheduled for today yet." });
      }

      const formatted = blocks.map((block) => ({
        taskId: block.task_id,
        title: block.title,
        startTime: formatTimeInZone(new Date(block.start_time), timezone),
        endTime: formatTimeInZone(new Date(block.end_time), timezone),
        source: block.source,
      }));

      logger.info("Scheduled blocks fetched", { count: formatted.length });
      return JSON.stringify({ blocks: formatted });
    },
    {
      name: "getScheduledBlocks",
      description:
        "Fetch today's existing scheduled blocks (the current schedule). Returns each block with title, start time, and end time in the user's timezone. Use this to answer questions about the user's current schedule.",
      schema: z.object({}),
    },
  );
}
