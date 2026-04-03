import { createLogger } from "../logger";

const logger = createLogger("NextTask");

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export function renderNextTask(
  block: ScheduledBlock | null,
  container: HTMLElement
): void {
  container.innerHTML = "";

  const section = document.createElement("div");
  section.className = "section";

  const label = document.createElement("div");
  label.className = "section-label";
  label.textContent = "Up next";
  section.appendChild(label);

  const card = document.createElement("div");
  card.className = "card";

  if (!block) {
    const empty = document.createElement("div");
    empty.className = "next-task-empty";
    empty.textContent = "Nothing scheduled next";
    card.appendChild(empty);
    section.appendChild(card);
    container.appendChild(section);
    logger.debug("No next task to display");
    return;
  }

  const title = document.createElement("div");
  title.className = "next-task-title";
  title.textContent = block.title;
  title.title = block.title;
  card.appendChild(title);

  const time = document.createElement("div");
  time.className = "next-task-time";
  time.textContent = timeFormatter.format(new Date(block.start_time));
  card.appendChild(time);

  section.appendChild(card);
  container.appendChild(section);
  logger.debug("Rendered next task", { title: block.title });
}
