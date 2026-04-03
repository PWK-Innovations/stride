import { createLogger } from "../logger";

const logger = createLogger("TaskInput");

type RefreshCallback = () => Promise<void>;

let onRefresh: RefreshCallback | null = null;

export function setRefreshCallback(callback: RefreshCallback): void {
  onRefresh = callback;
}

const DEFAULT_DURATION_MINUTES = 30;

function showFeedback(container: HTMLElement, success: boolean, message: string): void {
  const existing = container.querySelector(".feedback");
  if (existing) existing.remove();

  const feedback = document.createElement("div");
  feedback.className = `feedback ${success ? "feedback-success" : "feedback-error"}`;
  feedback.textContent = message;
  container.appendChild(feedback);

  setTimeout(() => feedback.remove(), 2_000);
}

async function handleSubmit(
  input: HTMLInputElement,
  submitBtn: HTMLButtonElement,
  container: HTMLElement
): Promise<void> {
  const title = input.value.trim();
  if (!title) return;

  submitBtn.classList.add("btn-loading");
  submitBtn.disabled = true;
  input.disabled = true;

  try {
    logger.info("Creating task", { title });
    await window.strideApi.createTask(title, DEFAULT_DURATION_MINUTES);
    input.value = "";
    showFeedback(container, true, "Task added");
    if (onRefresh) await onRefresh();
  } catch (err) {
    logger.error("Failed to create task", err);
    showFeedback(container, false, "Failed to add task");
  } finally {
    submitBtn.classList.remove("btn-loading");
    submitBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

export function renderTaskInput(container: HTMLElement): void {
  container.innerHTML = "";

  const section = document.createElement("div");
  section.className = "section";

  const label = document.createElement("div");
  label.className = "section-label";
  label.textContent = "Add task";
  section.appendChild(label);

  const wrapper = document.createElement("div");
  wrapper.className = "task-input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "task-input";
  input.placeholder = "What needs to get done?";
  input.autocomplete = "off";

  const submitBtn = document.createElement("button");
  submitBtn.className = "btn btn-primary task-input-submit";
  submitBtn.textContent = "Add";

  submitBtn.addEventListener("click", () => handleSubmit(input, submitBtn, section));

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(input, submitBtn, section);
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(submitBtn);
  section.appendChild(wrapper);
  container.appendChild(section);

  logger.debug("Rendered task input");
}
