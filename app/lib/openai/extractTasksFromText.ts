import { openai } from "./client";
import { createLogger } from "@/lib/logger";
import { sanitizeText } from "./sanitizeInput";

import type { ExtractedTask } from "@/types/database";

const logger = createLogger("openai:text-extract");

export async function extractTasksFromText(
  text: string,
): Promise<ExtractedTask[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a task extraction assistant. Analyze the transcribed voice memo text and extract any tasks, to-do items, assignments, or action items mentioned. For each task, provide a concise title, an estimated duration in minutes (default 30 if unclear), and optional notes for extra context. Return valid JSON only with this structure: { "tasks": [{ "title": string, "duration_minutes": number, "notes": string | null }] }. If no tasks are found, return { "tasks": [] }.`,
      },
      {
        role: "user",
        content: `Extract all tasks, to-do items, or action items from this voice memo transcription:\n\n${sanitizeText(text)}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    logger.error("Empty response from OpenAI text extraction");
    throw new Error("No response from OpenAI");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    logger.error("Failed to parse OpenAI text extraction response", { content });
    throw new Error("Invalid JSON response from OpenAI");
  }

  const tasks: ExtractedTask[] = (parsed.tasks || [])
    .map((t: Record<string, unknown>) => ({
      title: String(t.title || "").trim(),
      duration_minutes: Number(t.duration_minutes) || 30,
      notes: t.notes ? String(t.notes) : null,
    }))
    .filter((t: ExtractedTask) => t.title.length > 0);

  logger.info(`Extracted ${tasks.length} tasks from text`);
  return tasks;
}
