import { createLogger } from "../logger";

const logger = createLogger("TaskBar");

function formatMinutesRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.ceil(diffMs / 60_000));

  if (diffMin === 0) return "Ending now";
  if (diffMin === 1) return "1 min left";
  return `${diffMin} min left`;
}

interface TaskBarData {
  title: string;
  endTime: string;
}

export function buildTaskBar(task: TaskBarData | null): string {
  logger.debug("Built task bar", { hasTask: !!task });

  if (!task) {
    return `
      <div class="task-bar">
        <span class="task-bar-title task-bar-empty">No active task</span>
      </div>
    `;
  }

  return `
    <div class="task-bar">
      <span class="task-bar-title" title="${task.title}">${task.title}</span>
      <span class="task-bar-countdown">${formatMinutesRemaining(task.endTime)}</span>
    </div>
  `;
}
