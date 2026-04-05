import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:tool:createTask");

export function createCreateTaskTool(supabase: SupabaseClient, userId: string) {
  return tool(
    async (input) => {
      const { title, duration_minutes, notes, preferred_time } = input;
      logger.info("Creating task", { userId, title, duration_minutes, preferred_time });

      // Embed preferred time in notes so the scheduler picks it up automatically
      let taskNotes = notes ?? null;
      if (preferred_time) {
        const prefix = `[preferred:${preferred_time}]`;
        taskNotes = taskNotes ? `${prefix} ${taskNotes}` : prefix;
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title,
          duration_minutes,
          notes: taskNotes,
        })
        .select("id, title, duration_minutes, notes")
        .single();

      if (error) {
        logger.error("Failed to create task", { error: error.message });
        return JSON.stringify({ error: error.message });
      }

      logger.info("Task created", { taskId: data.id, title });
      return JSON.stringify({
        success: true,
        task: data,
        message: `Task "${title}" created (${duration_minutes} min).`,
      });
    },
    {
      name: "createTask",
      description:
        "Create a new task for the user. Use when the user asks to add a task. Returns the created task with its ID so it can be scheduled.",
      schema: z.object({
        title: z.string().describe("The task title"),
        duration_minutes: z
          .number()
          .describe("Estimated duration in minutes. Default to 30 if the user doesn't specify."),
        notes: z
          .string()
          .optional()
          .describe("Optional notes or details about the task"),
        preferred_time: z
          .string()
          .optional()
          .describe("Preferred start time in ISO 8601 format (e.g. '2026-04-03T18:00:00'). Use when the user specifies a time like 'at 6 pm'."),
      }),
    },
  );
}
