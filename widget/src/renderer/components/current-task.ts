import { createLogger } from "../logger";

const logger = createLogger("CurrentTask");

let countdownInterval: ReturnType<typeof setInterval> | null = null;

function formatMinutesRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.ceil(diffMs / 60_000));

  if (diffMin === 0) return "Ending now";
  if (diffMin === 1) return "1 min left";
  return `${diffMin} min left`;
}

function clearCountdown(): void {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

export function renderCurrentTask(
  block: ScheduledBlock | null,
  container: HTMLElement
): void {
  clearCountdown();
  container.innerHTML = "";

  const section = document.createElement("div");
  section.className = "section";

  const label = document.createElement("div");
  label.className = "section-label";
  label.textContent = "Now";
  section.appendChild(label);

  const card = document.createElement("div");
  card.className = "card card-highlight";

  if (!block) {
    const empty = document.createElement("div");
    empty.className = "current-task-empty";
    empty.textContent = "No task right now";
    card.appendChild(empty);
    section.appendChild(card);
    container.appendChild(section);
    logger.debug("No current task to display");
    return;
  }

  const title = document.createElement("div");
  title.className = "current-task-title";
  title.textContent = block.title;
  title.title = block.title;
  card.appendChild(title);

  const countdown = document.createElement("div");
  countdown.className = "current-task-countdown";
  countdown.textContent = formatMinutesRemaining(block.end_time);
  card.appendChild(countdown);

  countdownInterval = setInterval(() => {
    countdown.textContent = formatMinutesRemaining(block.end_time);
  }, 60_000);

  section.appendChild(card);
  container.appendChild(section);
  logger.debug("Rendered current task", { title: block.title });
}
