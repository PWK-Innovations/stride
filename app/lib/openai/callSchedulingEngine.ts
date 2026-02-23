import { openai } from './client';
import { createLogger } from "@/lib/logger";

const logger = createLogger("openai:schedule");

interface ScheduledBlock {
  task_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

interface ScheduleResponse {
  scheduled_blocks: ScheduledBlock[];
  overflow: string[];
}

export async function callSchedulingEngine(
  prompt: string,
  retry = false,
): Promise<ScheduleResponse> {
  logger.info("Sending prompt to OpenAI", { retry, promptLength: prompt.length });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a scheduling assistant. You MUST strictly respect the time boundaries and rules given. Return valid JSON only. No markdown, no explanations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: retry ? 0.9 : 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    logger.error("Empty response from OpenAI");
    throw new Error('No response from OpenAI');
  }

  logger.info("OpenAI response received", { content });

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    logger.error("Failed to parse OpenAI response", { content });
    throw new Error('Invalid JSON response from OpenAI');
  }
  return {
    scheduled_blocks: parsed.scheduled_blocks || [],
    overflow: parsed.overflow || [],
  };
}
