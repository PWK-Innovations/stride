import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:tool:updateTask");

export function createUpdateTaskTool(supabase: SupabaseClient, userId: string) {
  return tool(
    async (input) => {
      const { taskId, action, durationMinutes } = input;
      logger.info("Updating task", { userId, taskId, action });

      if (action === "done") {
        // Delete the scheduled block for this task
        const { error: blockError } = await supabase
          .from("scheduled_blocks")
          .delete()
          .eq("task_id", taskId)
          .eq("user_id", userId);

        if (blockError) {
          logger.error("Failed to delete scheduled block for done task", { error: blockError.message });
        }

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

      if (action === "update_duration") {
        if (!durationMinutes || durationMinutes <= 0) {
          return JSON.stringify({ error: "durationMinutes is required and must be positive for update_duration" });
        }

        const { error } = await supabase
          .from("tasks")
          .update({ duration_minutes: durationMinutes })
          .eq("id", taskId)
          .eq("user_id", userId);

        if (error) {
          logger.error("Failed to update task duration", { error: error.message });
          return JSON.stringify({ error: error.message });
        }

        logger.info("Task duration updated", { taskId, durationMinutes });
        return JSON.stringify({
          success: true,
          message: `Task duration updated to ${durationMinutes} minutes. Rebuild the schedule with createScheduledBlocks to apply the new duration.`,
        });
      }

      logger.warn("Unknown action", { action });
      return JSON.stringify({ error: `Unknown action: ${action}` });
    },
    {
      name: "updateTask",
      description:
        "Update a task. Use action 'done' to mark a completed task (removes it). Use action 'skip' to skip a task (removes it and its scheduled block). Use action 'update_duration' with durationMinutes to change how long a task takes.",
      schema: z.object({
        taskId: z.string().describe("The ID of the task to update"),
        action: z
          .enum(["done", "skip", "update_duration"])
          .describe("Action to perform: 'done' to mark complete, 'skip' to skip, 'update_duration' to change duration"),
        durationMinutes: z
          .number()
          .optional()
          .describe("New duration in minutes (required for update_duration action)"),
      }),
    },
  );
}
