import { createLogger } from "../logger";

const logger = createLogger("CompressedView");

function truncateTitle(title: string, maxLength = 25): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength - 1).trimEnd() + "\u2026";
}

function formatMinutesRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.ceil(diffMs / 60_000));

  if (diffMin === 0) return "0m";
  return `${diffMin}m`;
}

interface CompressedTaskData {
  title: string;
  endTime: string;
}

export function buildCompressedLayout(task: CompressedTaskData | null): string {
  const taskContent = task
    ? `<span class="compressed-task" title="${task.title}">${truncateTitle(task.title)}</span>
       <span class="compressed-countdown">${formatMinutesRemaining(task.endTime)}</span>`
    : `<span class="compressed-task compressed-task-empty">No task right now</span>`;

  logger.debug("Built compressed layout", { hasTask: !!task });

  return `
    <div class="compressed-container">
      ${taskContent}
      <button class="compressed-expand" id="expand-btn" title="Expand">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;
}
