import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:tool:createTask");

function estimateDuration(title: string): number {
  const lower = title.toLowerCase();

  const quickPatterns = ["email", "reply", "call", "check", "respond", "text", "message"];
  const meetingPatterns = ["meeting", "standup", "sync", "huddle", "catchup", "catch-up", "1:1", "one-on-one"];
  const deepPatterns = ["write", "report", "design", "build", "develop", "implement", "create", "draft", "prepare", "research", "analyze"];

  if (quickPatterns.some((p) => lower.includes(p))) return 15;
  if (meetingPatterns.some((p) => lower.includes(p))) return 30;
  if (deepPatterns.some((p) => lower.includes(p))) return 60;

  return 30;
}

export function createCreateTaskTool(supabase: SupabaseClient, userId: string) {
  return tool(
    async (input) => {
      const { title, notes } = input;
      const duration_minutes = input.duration_minutes ?? estimateDuration(title);

      if (!input.duration_minutes) {
        logger.info("Estimated duration for task", { title, estimatedMinutes: duration_minutes });
      }

      logger.info("Creating task", { userId, title, duration_minutes });

      const taskNotes = notes ?? null;

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
          .optional()
          .describe("Estimated duration in minutes. Omit to let the system estimate based on the task type."),
        notes: z
          .string()
          .optional()
          .describe("Optional notes or details about the task"),
      }),
    },
  );
}
