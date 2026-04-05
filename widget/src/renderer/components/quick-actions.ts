import { createLogger } from "../logger";

const logger = createLogger("QuickActions");

type RefreshCallback = () => Promise<void>;

let onRefresh: RefreshCallback | null = null;

export function setRefreshCallback(callback: RefreshCallback): void {
  onRefresh = callback;
}

function showFeedback(container: HTMLElement, success: boolean, message: string): void {
  const existing = container.querySelector(".feedback");
  if (existing) existing.remove();

  const feedback = document.createElement("div");
  feedback.className = `feedback ${success ? "feedback-success" : "feedback-error"}`;
  feedback.textContent = message;
  container.appendChild(feedback);

  setTimeout(() => feedback.remove(), 2_000);
}

function setButtonLoading(button: HTMLButtonElement, loading: boolean): void {
  if (loading) {
    button.classList.add("btn-loading");
    button.disabled = true;
  } else {
    button.classList.remove("btn-loading");
    button.disabled = false;
  }
}

async function handleDone(block: ScheduledBlock, container: HTMLElement): Promise<void> {
  if (!block.task_id) {
    showFeedback(container, false, "No task to complete");
    return;
  }

  const btn = container.querySelector("[data-action='done']") as HTMLButtonElement | null;
  if (btn) setButtonLoading(btn, true);

  try {
    logger.info("Marking task done", { taskId: block.task_id, blockId: block.id });

    // Delete the scheduled block first
    if (block.id) {
      await window.strideApi.deleteBlock(block.id);
    }

    // Then delete the task
    const result = await window.strideApi.deleteTask(block.task_id);
    if (result.success) {
      showFeedback(container, true, "Task completed");
      if (onRefresh) await onRefresh();
    } else {
      showFeedback(container, false, "Failed to complete task");
    }
  } catch (err) {
    logger.error("Failed to mark task done", err);
    showFeedback(container, false, "Error completing task");
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

async function handleSkip(block: ScheduledBlock, container: HTMLElement): Promise<void> {
  if (!block.task_id) {
    showFeedback(container, false, "No task to skip");
    return;
  }

  const btn = container.querySelector("[data-action='skip']") as HTMLButtonElement | null;
  if (btn) setButtonLoading(btn, true);

  try {
    logger.info("Skipping task", { taskId: block.task_id, blockId: block.id });

    // Delete the scheduled block first
    if (block.id) {
      await window.strideApi.deleteBlock(block.id);
    }

    // Then delete the task
    const result = await window.strideApi.deleteTask(block.task_id);
    if (result.success) {
      showFeedback(container, true, "Task skipped");
      if (onRefresh) await onRefresh();
    } else {
      showFeedback(container, false, "Failed to skip task");
    }
  } catch (err) {
    logger.error("Failed to skip task", err);
    showFeedback(container, false, "Error skipping task");
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

async function handleRunningLate(
  block: ScheduledBlock,
  container: HTMLElement
): Promise<void> {
  const btn = container.querySelector(
    "[data-action='late']"
  ) as HTMLButtonElement | null;
  if (btn) setButtonLoading(btn, true);

  try {
    const currentEnd = new Date(block.end_time);
    const extendedEnd = new Date(currentEnd.getTime() + 15 * 60_000);

    logger.info("Extending block by 15 min", {
      blockId: block.id,
      newEndTime: extendedEnd.toISOString(),
    });

    const result = await window.strideApi.updateBlock(block.id, {
      start_time: block.start_time,
      end_time: extendedEnd.toISOString(),
    });

    if (result.success) {
      showFeedback(container, true, "+15 min added");
      if (onRefresh) await onRefresh();
    } else {
      showFeedback(container, false, "Failed to extend time");
    }
  } catch (err) {
    logger.error("Failed to extend block", err);
    showFeedback(container, false, "Error extending time");
  } finally {
    if (btn) setButtonLoading(btn, false);
  }
}

export function renderQuickActions(
  currentBlock: ScheduledBlock | null,
  container: HTMLElement
): void {
  container.innerHTML = "";

  // Don't render buttons when there's no active Stride task
  if (!currentBlock) return;

  const section = document.createElement("div");
  section.className = "section";

  const actionsRow = document.createElement("div");
  actionsRow.className = "quick-actions";

  const doneBtn = document.createElement("button");
  doneBtn.className = "btn btn-primary";
  doneBtn.textContent = "Done";
  doneBtn.dataset.action = "done";
  doneBtn.disabled = !currentBlock;

  const skipBtn = document.createElement("button");
  skipBtn.className = "btn btn-secondary";
  skipBtn.textContent = "Skip";
  skipBtn.dataset.action = "skip";
  skipBtn.disabled = !currentBlock;

  const lateBtn = document.createElement("button");
  lateBtn.className = "btn btn-secondary";
  lateBtn.textContent = "Need more time";
  lateBtn.dataset.action = "late";
  lateBtn.disabled = !currentBlock;

  if (currentBlock) {
    doneBtn.addEventListener("click", () => handleDone(currentBlock, section));
    skipBtn.addEventListener("click", () => handleSkip(currentBlock, section));
    lateBtn.addEventListener("click", () => handleRunningLate(currentBlock, section));
  }

  actionsRow.appendChild(doneBtn);
  actionsRow.appendChild(skipBtn);
  actionsRow.appendChild(lateBtn);
  section.appendChild(actionsRow);
  container.appendChild(section);

  logger.debug("Rendered quick actions", { hasCurrentBlock: !!currentBlock });
}
