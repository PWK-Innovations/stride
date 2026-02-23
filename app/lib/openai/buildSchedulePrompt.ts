import { Task } from '@/types/database';
import { BusyWindow } from '@/lib/google/parseBusyWindows';
import {
  formatDateInZone,
  formatTimeInZone,
  getTimeInZone,
  getLocalDateString,
} from '@/lib/timezone';

interface SchedulePromptInput {
  tasks: Task[];
  busyWindows: BusyWindow[];
  workingHours?: { start: number; end: number }; // hours in 24h format
  timezone?: string;
  currentTime?: string; // ISO string from the user's browser
  previousSchedule?: unknown;
}

function formatHour12(hour24: number): string {
  if (hour24 === 0) return "12:00 AM";
  if (hour24 === 12) return "12:00 PM";
  if (hour24 < 12) return `${hour24}:00 AM`;
  return `${hour24 - 12}:00 PM`;
}

export function buildSchedulePrompt({
  tasks,
  busyWindows,
  workingHours = { start: 9, end: 19 },
  timezone = "UTC",
  currentTime,
  previousSchedule,
}: SchedulePromptInput): string {
  // Use client time if provided, fallback to server time
  const now = currentTime ? new Date(currentTime) : new Date();
  const dateStr = formatDateInZone(now, timezone);

  // Format current time for the prompt (timezone-aware)
  const nowFormatted = formatTimeInZone(now, timezone);

  // Compute effective earliest scheduling time (timezone-aware)
  const { hours, minutes } = getTimeInZone(now, timezone);
  const currentHour = hours + minutes / 60;
  const effectiveStartHour = Math.max(workingHours.start, currentHour);
  const effectiveStartFormatted = effectiveStartHour > workingHours.start
    ? nowFormatted
    : formatHour12(workingHours.start);

  const taskList = tasks
    .map(
      (task, i) =>
        `${i + 1}. [id: ${task.id}] "${task.title}" (${task.duration_minutes} minutes)${task.notes ? ` - Notes: ${task.notes}` : ''}`,
    )
    .join('\n');

  const busyList = busyWindows
    .map((window, i) => {
      const start = formatTimeInZone(window.start, timezone);
      const end = formatTimeInZone(window.end, timezone);
      return `${i + 1}. ${start} - ${end}`;
    })
    .join('\n');

  const startFormatted = formatHour12(workingHours.start);
  const endFormatted = formatHour12(workingHours.end);

  const tzLine = `\n**Timezone:** ${timezone}`;

  const retrySection = previousSchedule
    ? `\n\n**IMPORTANT — RETRY:** The user wasn't happy with this previous schedule:\n${JSON.stringify(previousSchedule, null, 2)}\nGenerate a meaningfully different arrangement. Vary the order, shift times around, and try a fresh approach.`
    : '';

  // Build example timestamps using today's date in the user's timezone
  const exampleDate = getLocalDateString(timezone);

  return `You are a scheduling assistant. Build a realistic daily schedule for today (${dateStr}).

**Current time:** ${nowFormatted}${tzLine}

**Tasks to schedule:**
${taskList}

**Busy windows (calendar events):**
${busyList || 'None'}

**Working hours:** ${startFormatted} - ${endFormatted}

## RULES (you MUST follow ALL of these strictly):

1. **HARD TIME BOUNDARIES:** Every task MUST start at or after ${effectiveStartFormatted} and MUST end by ${endFormatted}. Do NOT schedule anything before ${effectiveStartFormatted} or after ${endFormatted}. Any task that violates this is WRONG.

2. **TIME HINTS ARE MANDATORY:** If a task's notes mention a specific time (e.g. "at 1 pm", "starts at 1pm", "1:00", "morning", "after lunch"), you MUST schedule that task at exactly that time. This overrides all other scheduling logic. "morning" = 9-10 AM, "after lunch" = 1-2 PM, "evening" = 5-6 PM.

3. **NO OVERLAPS:** Tasks must NEVER overlap each other or calendar events. Before placing a task, verify it does not collide with any already-scheduled block. If a time slot is taken, move the task to a different open slot — only overflow it if there is truly no remaining gap large enough anywhere in the working hours.

4. **BREAKS:** Leave at least 10 minutes between consecutive tasks.

5. **SPREAD TASKS OUT:** Distribute tasks across the FULL working window (${effectiveStartFormatted} - ${endFormatted}). Do NOT cluster all tasks in the morning. If a task has no time constraint, place it in the afternoon or evening when earlier slots are already occupied. Use the entire available day — a schedule that ends at 3 PM when working hours extend to ${endFormatted} is a bad schedule.

6. **OVERFLOW:** If a task cannot fit within ${effectiveStartFormatted} - ${endFormatted} without violating the above rules, put it in the overflow list. Do NOT squeeze it in by breaking the time boundaries.

7. **ONE BLOCK PER TASK:** Each task_id must appear exactly ONCE in the output. Never split a task into multiple blocks. Schedule the full duration as a single continuous block, or put the task in overflow if it doesn't fit.

8. **JSON ONLY:** Return valid JSON only, no explanation.${retrySection}

**Output format (use the exact task IDs from the list above):**
{
  "scheduled_blocks": [
    {
      "task_id": "the-exact-id-from-the-task-list",
      "start_time": "${exampleDate}T10:00:00",
      "end_time": "${exampleDate}T10:30:00",
      "duration_minutes": 30
    }
  ],
  "overflow": ["id-of-task-that-didnt-fit"]
}`;
}
