import { openai } from './client';

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
  prompt: string
): Promise<ScheduleResponse> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a scheduling assistant. Return valid JSON only. No markdown, no explanations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);
  return {
    scheduled_blocks: parsed.scheduled_blocks || [],
    overflow: parsed.overflow || [],
  };
}
