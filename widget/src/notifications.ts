import { createLogger } from "./logger";
import type { ScheduledBlock } from "./types";

const logger = createLogger("notifications");

let pendingTimeouts: NodeJS.Timeout[] = [];

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function showNotification(title: string, body: string): void {
  if (typeof Notification === "undefined") {
    logger.warn("Notification API not available");
    return;
  }

  if (Notification.permission !== "granted") {
    logger.debug("Notification permission not granted, skipping", { title });
    return;
  }

  try {
    new Notification(title, { body });
    logger.debug("Notification shown", { title, body });
  } catch (error) {
    logger.error("Failed to show notification", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function notifyTaskStarting(block: ScheduledBlock): void {
  const time = formatTime(block.start_time);
  showNotification("Time for: " + block.title, "Starting at " + time);
}

export function notifyScheduleChanged(): void {
  showNotification("Schedule Updated", "Your schedule was updated");
}

export function notifyTaskCompleted(title: string): void {
  showNotification(title + " complete", title + " marked complete");
}

export async function requestPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") {
    logger.warn("Notification API not available");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    logger.info("Notification permission previously denied");
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    logger.info("Notification permission result", { result });
    return result === "granted";
  } catch (error) {
    logger.error("Failed to request notification permission", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export function clearScheduledNotifications(): void {
  for (const timeout of pendingTimeouts) {
    clearTimeout(timeout);
  }
  pendingTimeouts = [];
  logger.debug("Cleared scheduled notifications", {
    count: pendingTimeouts.length,
  });
}

export function scheduleNotifications(blocks: ScheduledBlock[]): void {
  clearScheduledNotifications();

  const now = Date.now();
  let scheduled = 0;

  for (const block of blocks) {
    const startMs = new Date(block.start_time).getTime();
    const delayMs = startMs - now;

    if (delayMs <= 0) continue;

    const timeout = setTimeout(() => {
      notifyTaskStarting(block);
    }, delayMs);

    pendingTimeouts.push(timeout);
    scheduled++;
  }

  logger.info("Scheduled notifications for upcoming blocks", { scheduled });
}
