import { openai } from "./client";
import { createLogger } from "@/lib/logger";

import type { ExtractedTask } from "@/types/database";

const logger = createLogger("openai:vision");

export async function extractTasksFromPhoto(
  base64Data: string,
  mimeType: string,
): Promise<ExtractedTask[]> {
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a task extraction assistant. Analyze the image and extract any tasks, to-do items, assignments, or action items visible in it. For each task, provide a concise title, an estimated duration in minutes (default 30 if unclear), and optional notes for extra context. Return valid JSON only with this structure: { "tasks": [{ "title": string, "duration_minutes": number, "notes": string | null }] }. If no tasks are found, return { "tasks": [] }.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: dataUrl, detail: "high" },
          },
          {
            type: "text",
            text: "Extract all tasks, to-do items, or action items from this image.",
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    logger.error("Empty response from OpenAI vision");
    throw new Error("No response from OpenAI");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    logger.error("Failed to parse OpenAI vision response", { content });
    throw new Error("Invalid JSON response from OpenAI");
  }

  const tasks: ExtractedTask[] = (parsed.tasks || [])
    .map((t: Record<string, unknown>) => ({
      title: String(t.title || "").trim(),
      duration_minutes: Number(t.duration_minutes) || 30,
      notes: t.notes ? String(t.notes) : null,
    }))
    .filter((t: ExtractedTask) => t.title.length > 0);

  logger.info(`Extracted ${tasks.length} tasks from photo`);
  return tasks;
}
