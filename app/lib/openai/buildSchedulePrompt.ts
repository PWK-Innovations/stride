import { Task } from '@/types/database';
import { BusyWindow } from '@/lib/google/parseBusyWindows';

interface SchedulePromptInput {
  tasks: Task[];
  busyWindows: BusyWindow[];
  workingHours?: { start: number; end: number }; // hours in 24h format
}

export function buildSchedulePrompt({
  tasks,
  busyWindows,
  workingHours = { start: 9, end: 17 },
}: SchedulePromptInput): string {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const taskList = tasks
    .map(
      (task, i) =>
        `${i + 1}. [id: ${task.id}] "${task.title}" (${task.duration_minutes} minutes)${task.notes ? ` - Notes: ${task.notes}` : ''}`
    )
    .join('\n');

  const busyList = busyWindows
    .map((window, i) => {
      const start = window.start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const end = window.end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${i + 1}. ${start} - ${end}`;
    })
    .join('\n');

  return `You are a scheduling assistant. Build a realistic daily schedule for today (${dateStr}).

**Tasks to schedule:**
${taskList}

**Busy windows (calendar events):**
${busyList || 'None'}

**Working hours:** ${workingHours.start}:00 AM - ${workingHours.end}:00 PM

**Instructions:**
1. Place tasks in free time slots (avoid busy windows)
2. Tasks should fit within working hours
3. Don't overlap tasks or calendar events
4. If tasks don't fit, put them in the overflow list
5. Return valid JSON only

**Output format (use the exact task IDs from the list above):**
{
  "scheduled_blocks": [
    {
      "task_id": "the-exact-id-from-the-task-list",
      "start_time": "2026-02-09T10:00:00Z",
      "end_time": "2026-02-09T10:30:00Z",
      "duration_minutes": 30
    }
  ],
  "overflow": ["id-of-task-that-didnt-fit"]
}`;
}
