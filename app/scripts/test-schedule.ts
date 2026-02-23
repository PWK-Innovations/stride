import { config } from "dotenv";
import OpenAI from "openai";
import { createLogger } from "../lib/logger";

config({ path: ".env.local" });

const logger = createLogger("test:schedule");

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

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    logger.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  // Build a test prompt (mirrors buildSchedulePrompt logic)
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sampleTasks = [
    { id: "task-1", title: "Review Q3 report", duration_minutes: 30 },
    { id: "task-2", title: "Team standup prep", duration_minutes: 15 },
    { id: "task-3", title: "Write project proposal", duration_minutes: 60 },
  ];

  const taskList = sampleTasks
    .map(
      (task, i) => `${i + 1}. "${task.title}" (${task.duration_minutes} minutes) [id: ${task.id}]`,
    )
    .join("\n");

  const busyList = "1. 10:00 AM - 11:00 AM (Team meeting)";

  const prompt = `You are a scheduling assistant. Build a realistic daily schedule for today (${dateStr}).

**Tasks to schedule:**
${taskList}

**Busy windows (calendar events):**
${busyList}

**Working hours:** 9:00 AM - 5:00 PM

**Instructions:**
1. Place tasks in free time slots (avoid busy windows)
2. Tasks should fit within working hours
3. Don't overlap tasks or calendar events
4. If tasks don't fit, put them in the overflow list
5. Return valid JSON only

**Output format:**
{
  "scheduled_blocks": [
    {
      "task_id": "task-1",
      "start_time": "2026-02-23T10:00:00Z",
      "end_time": "2026-02-23T10:30:00Z",
      "duration_minutes": 30
    }
  ],
  "overflow": ["task_id_1"]
}`;

  logger.info("Calling OpenAI scheduling engine...");

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a scheduling assistant. Return valid JSON only. No markdown, no explanations.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    logger.error("Empty response from OpenAI");
    process.exit(1);
  }

  let parsed: ScheduleResponse;
  try {
    parsed = JSON.parse(content);
  } catch {
    logger.error("Failed to parse JSON response", { content });
    process.exit(1);
  }

  // Validate response structure
  const blocks = parsed.scheduled_blocks || [];
  const overflow = parsed.overflow || [];

  if (!Array.isArray(blocks)) {
    logger.error("scheduled_blocks is not an array", { blocks });
    process.exit(1);
  }

  if (!Array.isArray(overflow)) {
    logger.error("overflow is not an array", { overflow });
    process.exit(1);
  }

  // Validate each block has required fields
  for (const block of blocks) {
    if (!block.task_id || !block.start_time || !block.end_time || !block.duration_minutes) {
      logger.error("Block missing required fields", { block });
      process.exit(1);
    }
  }

  // Check that all task IDs reference our sample tasks
  const taskIds = new Set(sampleTasks.map((t) => t.id));
  const scheduledIds = blocks.map((b) => b.task_id);
  const allIds = [...scheduledIds, ...overflow];

  for (const id of allIds) {
    if (!taskIds.has(id)) {
      logger.warn("Unknown task ID in response", { id });
    }
  }

  logger.info("Schedule engine test PASSED", {
    scheduled: blocks.length,
    overflow: overflow.length,
    blocks: blocks.map((b) => `${b.task_id}: ${b.start_time} - ${b.end_time}`),
  });
}

main();
