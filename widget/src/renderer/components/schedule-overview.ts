import { createLogger } from "../logger";

const logger = createLogger("ScheduleOverview");

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

function isCurrentBlock(block: ScheduledBlock): boolean {
  const now = new Date();
  const start = new Date(block.start_time);
  const end = new Date(block.end_time);
  return now >= start && now < end;
}

function isUpcoming(block: ScheduledBlock): boolean {
  const now = new Date();
  const end = new Date(block.end_time);
  return end > now;
}

export function renderScheduleOverview(
  blocks: ScheduledBlock[],
  container: HTMLElement
): void {
  container.innerHTML = "";

  const section = document.createElement("div");
  section.className = "section";

  const label = document.createElement("div");
  label.className = "section-label";
  label.textContent = "Today";
  section.appendChild(label);

  const remaining = blocks.filter(isUpcoming);

  if (remaining.length === 0) {
    const card = document.createElement("div");
    card.className = "card";
    const empty = document.createElement("div");
    empty.className = "next-task-empty";
    empty.textContent = "No more tasks today";
    card.appendChild(empty);
    section.appendChild(card);
    container.appendChild(section);
    logger.debug("No remaining blocks to display");
    return;
  }

  const list = document.createElement("div");
  list.className = "schedule-list";

  for (const block of remaining) {
    const item = document.createElement("div");
    const isCurrent = isCurrentBlock(block);
    item.className = `schedule-item${isCurrent ? " schedule-item-current" : ""}`;

    const time = document.createElement("span");
    time.className = "schedule-item-time";
    time.textContent = timeFormatter.format(new Date(block.start_time));
    item.appendChild(time);

    const title = document.createElement("span");
    title.className = "schedule-item-title";
    title.textContent = block.title;
    title.title = block.title;
    item.appendChild(title);

    list.appendChild(item);
  }

  section.appendChild(list);
  container.appendChild(section);
  logger.debug("Rendered schedule overview", { count: remaining.length });
}
