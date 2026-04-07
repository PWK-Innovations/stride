import { createLogger } from "../logger";
import { trackEvent } from "../analytics";

const logger = createLogger("QuickActions");

type RefreshCallback = () => Promise<void>;

let onRefresh: RefreshCallback | null = null;
let allBlocks: ScheduledBlock[] = [];
let timeMenuExpanded = false;
let clickOutsideHandler: ((e: MouseEvent) => void) | null = null;
let nextTaskPromptTimer: ReturnType<typeof setTimeout> | null = null;
let nextTaskPromptVisible = false;

export function setRefreshCallback(callback: RefreshCallback): void {
  onRefresh = callback;
}

export function setScheduleBlocks(blocks: ScheduledBlock[]): void {
  allBlocks = blocks;
}

export function isNextTaskPromptVisible(): boolean {
  return nextTaskPromptVisible;
}

function findNextBlock(currentBlock: ScheduledBlock): ScheduledBlock | null {
  const currentStart = new Date(currentBlock.start_time).getTime();
  const upcoming = allBlocks
    .filter((b) => new Date(b.start_time).getTime() > currentStart)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  return upcoming[0] ?? null;
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

function showNextTaskPrompt(nextBlock: ScheduledBlock, container: HTMLElement): void {
  trackEvent("widget_task_completed_next_prompt");
  logger.info("Showing next task prompt", { nextTask: nextBlock.title });

  container.innerHTML = "";

  const promptDiv = document.createElement("div");
  promptDiv.className = "next-task-prompt";

  const label = document.createElement("div");
  label.className = "next-task-prompt-label";
  label.textContent = `Start "${nextBlock.title}" now?`;

  const btnRow = document.createElement("div");
  btnRow.className = "quick-actions";

  const yesBtn = document.createElement("button");
  yesBtn.className = "btn btn-primary";
  yesBtn.textContent = "Yes";

  const noBtn = document.createElement("button");
  noBtn.className = "btn btn-secondary";
  noBtn.textContent = "No";

  yesBtn.addEventListener("click", async () => {
    trackEvent("widget_task_completed_next_accepted");
    logger.info("Next task accepted", { blockId: nextBlock.id });
    nextTaskPromptVisible = false;
    if (nextTaskPromptTimer) { clearTimeout(nextTaskPromptTimer); nextTaskPromptTimer = null; }
    setButtonLoading(yesBtn, true);

    try {
      const now = new Date();
      const originalDuration =
        new Date(nextBlock.end_time).getTime() - new Date(nextBlock.start_time).getTime();
      const newEnd = new Date(now.getTime() + originalDuration);

      const result = await window.strideApi.updateBlock(nextBlock.id, {
        start_time: now.toISOString(),
        end_time: newEnd.toISOString(),
        cascade: true,
      });

      if (result.success) {
        showFeedback(container, true, "Started now");
      } else {
        showFeedback(container, false, "Failed to start task");
      }
    } catch (err) {
      logger.error("Failed to start next task", err);
      showFeedback(container, false, "Error starting task");
    } finally {
      setButtonLoading(yesBtn, false);
      if (onRefresh) await onRefresh();
    }
  });

  noBtn.addEventListener("click", async () => {
    trackEvent("widget_task_completed_next_declined");
    logger.info("Next task declined");
    nextTaskPromptVisible = false;
    if (nextTaskPromptTimer) { clearTimeout(nextTaskPromptTimer); nextTaskPromptTimer = null; }
    if (onRefresh) await onRefresh();
  });

  btnRow.appendChild(yesBtn);
  btnRow.appendChild(noBtn);
  promptDiv.appendChild(label);
  promptDiv.appendChild(btnRow);
  container.appendChild(promptDiv);

  nextTaskPromptVisible = true;

  // Auto-dismiss after 30 seconds
  if (nextTaskPromptTimer) clearTimeout(nextTaskPromptTimer);
  nextTaskPromptTimer = setTimeout(async () => {
    nextTaskPromptTimer = null;
    nextTaskPromptVisible = false;
    if (onRefresh) await onRefresh();
  }, 30_000);
}

async function handleDone(block: ScheduledBlock, container: HTMLElement): Promise<void> {
  if (!block.task_id) {
    showFeedback(container, false, "No task to complete");
    return;
  }

  const btn = container.querySelector("[data-action='done']") as HTMLButtonElement | null;
  if (btn) setButtonLoading(btn, true);

  try {
    trackEvent("quick_action_used", { action: "done" });
    logger.info("Marking task done", { taskId: block.task_id, blockId: block.id });

    const nextBlock = findNextBlock(block);

    // Delete the scheduled block first
    if (block.id) {
      await window.strideApi.deleteBlock(block.id);
    }

    // Then delete the task
    const result = await window.strideApi.deleteTask(block.task_id);
    if (result.success) {
      showFeedback(container, true, "Task completed");

      if (nextBlock) {
        // Short delay so feedback shows before prompt replaces the UI
        setTimeout(() => showNextTaskPrompt(nextBlock, container), 800);
      } else {
        if (onRefresh) await onRefresh();
      }
    } else {
      showFeedback(container, false, "Failed to complete task");
      if (onRefresh) await onRefresh();
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
    trackEvent("quick_action_used", { action: "skip" });
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

async function handleExtendTime(
  block: ScheduledBlock,
  minutes: number,
  container: HTMLElement
): Promise<void> {
  try {
    const currentEnd = new Date(block.end_time);
    const extendedEnd = new Date(currentEnd.getTime() + minutes * 60_000);

    trackEvent("widget_time_added", { minutes });
    logger.info("Extending block time", {
      blockId: block.id,
      minutes,
      newEndTime: extendedEnd.toISOString(),
    });

    const result = await window.strideApi.updateBlock(block.id, {
      start_time: block.start_time,
      end_time: extendedEnd.toISOString(),
      cascade: true,
    });

    if (result.success) {
      showFeedback(container, true, `+${minutes} min added`);
      if (onRefresh) await onRefresh();
    } else {
      showFeedback(container, false, "Failed to extend time");
    }
  } catch (err) {
    logger.error("Failed to extend block", err);
    showFeedback(container, false, "Error extending time");
  }
}

function collapseTimeMenu(container: HTMLElement): void {
  timeMenuExpanded = false;

  if (clickOutsideHandler) {
    document.removeEventListener("click", clickOutsideHandler, true);
    clickOutsideHandler = null;
  }

  const expandedMenu = container.querySelector(".time-menu-expanded");
  if (expandedMenu) expandedMenu.remove();

  const lateBtn = container.querySelector("[data-action='late']") as HTMLElement | null;
  if (lateBtn) lateBtn.style.display = "";
}

function expandTimeMenu(block: ScheduledBlock, container: HTMLElement): void {
  if (timeMenuExpanded) {
    collapseTimeMenu(container);
    return;
  }

  timeMenuExpanded = true;

  const lateBtn = container.querySelector("[data-action='late']") as HTMLElement | null;
  if (lateBtn) lateBtn.style.display = "none";

  const actionsRow = container.querySelector(".quick-actions") as HTMLElement | null;
  if (!actionsRow) return;

  const menuDiv = document.createElement("div");
  menuDiv.className = "time-menu-expanded";

  const options = [15, 30, 60];
  for (const mins of options) {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary time-option-btn";
    btn.textContent = `+${mins} min`;
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      collapseTimeMenu(container);
      await handleExtendTime(block, mins, container);
    });
    menuDiv.appendChild(btn);
  }

  actionsRow.appendChild(menuDiv);

  // Click-outside handler to dismiss
  clickOutsideHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!menuDiv.contains(target)) {
      collapseTimeMenu(container);
    }
  };

  // Defer attaching so the current click doesn't immediately close it
  requestAnimationFrame(() => {
    if (clickOutsideHandler) {
      document.addEventListener("click", clickOutsideHandler, true);
    }
  });
}

export function renderQuickActions(
  currentBlock: ScheduledBlock | null,
  container: HTMLElement
): void {
  container.innerHTML = "";
  timeMenuExpanded = false;

  if (clickOutsideHandler) {
    document.removeEventListener("click", clickOutsideHandler, true);
    clickOutsideHandler = null;
  }

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
    lateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      expandTimeMenu(currentBlock, section);
    });
  }

  actionsRow.appendChild(doneBtn);
  actionsRow.appendChild(skipBtn);
  actionsRow.appendChild(lateBtn);
  section.appendChild(actionsRow);
  container.appendChild(section);

  logger.debug("Rendered quick actions", { hasCurrentBlock: !!currentBlock });
}
