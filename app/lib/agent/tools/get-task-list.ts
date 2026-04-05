import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:tool:getTaskList");

export function createGetTaskListTool(supabase: SupabaseClient, userId: string) {
  return tool(
    async () => {
      logger.info("Fetching tasks", { userId });

      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, notes, duration_minutes")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch tasks", { error: error.message });
        return JSON.stringify({ error: error.message });
      }

      logger.info("Tasks fetched", { count: data.length });
      return JSON.stringify(data);
    },
    {
      name: "getTaskList",
      description:
        "Fetch the user's tasks for today. Returns JSON array of tasks with id, title, notes, duration_minutes.",
      schema: z.object({}),
    },
  );
}
