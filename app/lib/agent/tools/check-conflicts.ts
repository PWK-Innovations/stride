import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { getDayBoundsInZone } from "@/lib/timezone";

const logger = createLogger("agent:tool:checkForConflicts");

interface Conflict {
  type: "calendar" | "scheduled_block";
  title: string;
  start: string;
  end: string;
}

export function createCheckConflictsTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async (input) => {
      const { startTime, endTime } = input;
      logger.info("Checking for conflicts", { userId, startTime, endTime });

      const proposedStart = new Date(startTime);
      const proposedEnd = new Date(endTime);
      const conflicts: Conflict[] = [];

      // Check against existing scheduled blocks for today
      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      const { data: blocks, error: blocksError } = await supabase
        .from("scheduled_blocks")
        .select("title, start_time, end_time")
        .eq("user_id", userId)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString());

      if (blocksError) {
        logger.error("Failed to fetch scheduled blocks", { error: blocksError.message });
        return JSON.stringify({ error: blocksError.message });
      }

      if (blocks) {
        for (const block of blocks) {
          const blockStart = new Date(block.start_time);
          const blockEnd = new Date(block.end_time);

          // Overlap: proposed starts before block ends AND proposed ends after block starts
          if (proposedStart < blockEnd && proposedEnd > blockStart) {
            conflicts.push({
              type: "scheduled_block",
              title: block.title,
              start: block.start_time,
              end: block.end_time,
            });
          }
        }
      }

      if (conflicts.length === 0) {
        logger.info("No conflicts found", { startTime, endTime });
        return JSON.stringify({ conflicts: [], message: "No conflicts found." });
      }

      logger.info("Conflicts detected", { count: conflicts.length });
      return JSON.stringify({ conflicts });
    },
    {
      name: "checkForConflicts",
      description:
        "Check if a proposed time slot conflicts with existing scheduled blocks. Input: startTime and endTime as ISO strings. Returns list of conflicts or a message indicating no conflicts.",
      schema: z.object({
        startTime: z
          .string()
          .describe("Proposed start time as ISO 8601 string"),
        endTime: z
          .string()
          .describe("Proposed end time as ISO 8601 string"),
      }),
    },
  );
}
