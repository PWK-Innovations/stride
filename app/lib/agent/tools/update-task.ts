import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:tool:updateTask");

export function createUpdateTaskTool(supabase: SupabaseClient, userId: string) {
  return tool(
    async (input) => {
      const { taskId, action } = input;
      logger.info("Updating task", { userId, taskId, action });

      if (action === "done") {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)
          .eq("user_id", userId);

        if (error) {
          logger.error("Failed to mark task done", { error: error.message });
          return JSON.stringify({ error: error.message });
        }

        logger.info("Task marked done", { taskId });
        return JSON.stringify({ success: true, message: "Task marked as done and removed." });
      }

      if (action === "skip") {
        // Delete the task and its scheduled block
        const { error: blockError } = await supabase
          .from("scheduled_blocks")
          .delete()
          .eq("task_id", taskId)
          .eq("user_id", userId);

        if (blockError) {
          logger.error("Failed to delete scheduled block", { error: blockError.message });
          return JSON.stringify({ error: blockError.message });
        }

        const { error: taskError } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)
          .eq("user_id", userId);

        if (taskError) {
          logger.error("Failed to skip task", { error: taskError.message });
          return JSON.stringify({ error: taskError.message });
        }

        logger.info("Task skipped", { taskId });
        return JSON.stringify({
          success: true,
          message: "Task skipped and removed along with its scheduled block.",
        });
      }

      logger.warn("Unknown action", { action });
      return JSON.stringify({ error: `Unknown action: ${action}` });
    },
    {
      name: "updateTask",
      description:
        "Update a task's status. Use action 'done' to mark a completed task (removes it). Use action 'skip' to skip a task (removes it and its scheduled block).",
      schema: z.object({
        taskId: z.string().describe("The ID of the task to update"),
        action: z
          .enum(["done", "skip"])
          .describe("Action to perform: 'done' to mark complete, 'skip' to skip"),
      }),
    },
  );
}
