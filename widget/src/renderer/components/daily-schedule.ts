import { createLogger } from "../logger";
import { trackEvent } from "../analytics";

const logger = createLogger("DailySchedule");

const HOUR_HEIGHT = 60;
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 18;
const MIN_BLOCK_HEIGHT = 20;

let currentTimeTimer: ReturnType<typeof setInterval> | null = null;
let onBlockMoveCallback: ((blockId: string, newStart: string, newEnd: string) => void) | null = null;

export function setBlockMoveCallback(
  callback: (blockId: string, newStart: string, newEnd: string) => void
): void {
  onBlockMoveCallback = callback;
}

function snapTo5Min(date: Date): Date {
  const d = new Date(date.getTime());
  const mins = d.getMinutes();
  d.setMinutes(Math.round(mins / 5) * 5, 0, 0);
  return d;
}

function getHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatDuration(startDate: Date, endDate: Date): string {
  const mins = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function computeHourRange(
  blocks: ScheduledBlock[],
  busyWindows: BusyWindow[]
): { startHour: number; endHour: number } {
  const allTimes: Date[] = [];

  for (const block of blocks) {
    allTimes.push(new Date(block.start_time), new Date(block.end_time));
  }
  for (const bw of busyWindows) {
    allTimes.push(new Date(bw.start), new Date(bw.end));
  }

  let startHour = DEFAULT_START_HOUR;
  let endHour = DEFAULT_END_HOUR;

  for (const t of allTimes) {
    const h = t.getHours();
    const m = t.getMinutes();
    if (h < startHour) startHour = h;
    if (h >= endHour || (h === endHour - 1 && m > 0)) {
      endHour = m > 0 ? h + 1 : h;
      if (endHour <= h) endHour = h + 1;
    }
  }

  if (endHour <= startHour) endHour = startHour + 1;
  endHour = Math.min(endHour + 1, 24);

  return { startHour, endHour };
}

function dateToY(date: Date, startHour: number): number {
  const hours = date.getHours() + date.getMinutes() / 60;
  return (hours - startHour) * HOUR_HEIGHT;
}

export function buildDailySchedule(
  blocks: ScheduledBlock[],
  busyWindows: BusyWindow[]
): string {
  trackEvent("widget_schedule_viewed");

  const { startHour, endHour } = computeHourRange(blocks, busyWindows);
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * HOUR_HEIGHT;
  const now = new Date();

  // Hour labels
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);
  const hourLabelsHtml = hours.map((hour) => {
    const height = hour < endHour ? HOUR_HEIGHT : 0;
    return `
      <div class="schedule-gutter-hour" style="height: ${height}px;">
        <span class="schedule-gutter-label">${getHourLabel(hour)}</span>
      </div>
    `;
  }).join("");

  // Grid lines
  const gridLinesHtml = hours.map((hour) => {
    const top = (hour - startHour) * HOUR_HEIGHT;
    return `<div class="schedule-grid-line" style="top: ${top}px;"></div>`;
  }).join("");

  // Busy windows
  const busyHtml = busyWindows.map((bw, i) => {
    const bwStart = new Date(bw.start);
    const bwEnd = new Date(bw.end);
    const top = dateToY(bwStart, startHour);
    const height = Math.max(dateToY(bwEnd, startHour) - top, MIN_BLOCK_HEIGHT);
    const title = escapeHtml(bw.title || "Calendar event");

    return `
      <div class="schedule-busy-block" style="top: ${top}px; height: ${height}px;" data-block-index="${i}">
        <span class="schedule-block-title">${title}</span>
        <span class="schedule-block-time">${formatTime(bwStart)} - ${formatTime(bwEnd)}</span>
      </div>
    `;
  }).join("");

  // Scheduled task blocks
  const blocksHtml = blocks.map((block, i) => {
    const blockStart = new Date(block.start_time);
    const blockEnd = new Date(block.end_time);
    const top = dateToY(blockStart, startHour);
    const height = Math.max(dateToY(blockEnd, startHour) - top, MIN_BLOCK_HEIGHT);
    const isCurrent = now >= blockStart && now < blockEnd;
    const currentClass = isCurrent ? " schedule-task-block-current" : "";
    const title = escapeHtml(block.title);

    const draggable = block.id ? " schedule-draggable" : "";

    return `
      <div class="schedule-task-block${currentClass}${draggable}" style="top: ${top}px; height: ${height}px;" data-task-index="${i}" data-block-id="${block.id || ""}" data-start-time="${block.start_time}" data-duration-ms="${blockEnd.getTime() - blockStart.getTime()}" title="${title}">
        <span class="schedule-block-title">${title}</span>
        <span class="schedule-block-time">${formatTime(blockStart)} · ${formatDuration(blockStart, blockEnd)}</span>
      </div>
    `;
  }).join("");

  // Current time indicator
  const nowY = dateToY(now, startHour);
  const showNow = now.getHours() >= startHour && now.getHours() < endHour;
  const nowHtml = showNow
    ? `<div class="schedule-now-indicator" id="schedule-now-line" style="top: ${nowY}px;">
        <div class="schedule-now-dot"></div>
        <div class="schedule-now-line"></div>
      </div>`
    : "";

  logger.debug("Built daily schedule", {
    blocks: blocks.length,
    busyWindows: busyWindows.length,
    startHour,
    endHour,
  });

  return `
    <div class="daily-schedule" id="daily-schedule">
      <div class="schedule-timeline">
        <div class="schedule-gutter">
          ${hourLabelsHtml}
        </div>
        <div class="schedule-events-area" style="height: ${totalHeight}px;" data-start-hour="${startHour}">
          ${gridLinesHtml}
          ${busyHtml}
          ${blocksHtml}
          ${nowHtml}
        </div>
      </div>
    </div>
  `;
}

export function scrollScheduleToNow(): void {
  const scheduleEl = document.getElementById("daily-schedule");
  const nowLine = document.getElementById("schedule-now-line");
  if (!scheduleEl || !nowLine) return;

  const nowTop = parseInt(nowLine.style.top, 10);
  const scrollTarget = Math.max(0, nowTop - scheduleEl.clientHeight / 3);
  scheduleEl.scrollTop = scrollTarget;

  logger.debug("Scrolled schedule to current time", { scrollTarget });
}

export function startScheduleTimeUpdater(): void {
  stopScheduleTimeUpdater();

  currentTimeTimer = setInterval(() => {
    const nowLine = document.getElementById("schedule-now-line");
    const eventsArea = document.querySelector("[data-start-hour]") as HTMLElement | null;
    if (!nowLine || !eventsArea) return;

    const startHour = parseInt(eventsArea.dataset.startHour || "8", 10);
    const now = new Date();
    const newY = dateToY(now, startHour);
    nowLine.style.top = `${newY}px`;
  }, 60_000);
}

export function stopScheduleTimeUpdater(): void {
  if (currentTimeTimer) {
    clearInterval(currentTimeTimer);
    currentTimeTimer = null;
  }
}

export function wireScheduleDragHandlers(): void {
  const eventsArea = document.querySelector(".schedule-events-area") as HTMLElement | null;
  if (!eventsArea) return;

  const startHour = parseInt(eventsArea.dataset.startHour || "8", 10);
  const blocks = Array.from(eventsArea.querySelectorAll<HTMLElement>(".schedule-draggable"));

  for (const blockEl of blocks) {
    const blockId = blockEl.dataset.blockId;
    if (!blockId) continue;

    let dragging = false;
    let initialY = 0;
    let initialTop = 0;
    let durationMs = 0;

    blockEl.style.cursor = "grab";
    blockEl.style.touchAction = "none";

    blockEl.addEventListener("pointerdown", (e: PointerEvent) => {
      if (!onBlockMoveCallback) return;
      e.preventDefault();
      blockEl.setPointerCapture(e.pointerId);

      dragging = true;
      initialY = e.clientY;
      initialTop = parseFloat(blockEl.style.top);
      durationMs = parseInt(blockEl.dataset.durationMs || "0", 10);

      blockEl.style.cursor = "grabbing";
      blockEl.classList.add("schedule-block-dragging");
    });

    blockEl.addEventListener("pointermove", (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const deltaY = e.clientY - initialY;
      blockEl.style.top = `${initialTop + deltaY}px`;
    });

    blockEl.addEventListener("pointerup", (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      dragging = false;

      blockEl.style.cursor = "grab";
      blockEl.classList.remove("schedule-block-dragging");

      const deltaY = e.clientY - initialY;
      const deltaHours = deltaY / HOUR_HEIGHT;
      const deltaMs = deltaHours * 60 * 60 * 1000;
      const originalStart = new Date(blockEl.dataset.startTime || "");
      const newStart = snapTo5Min(new Date(originalStart.getTime() + deltaMs));
      const newEnd = new Date(newStart.getTime() + durationMs);

      if (newStart.getTime() === originalStart.getTime()) {
        blockEl.style.top = `${initialTop}px`;
        return;
      }

      logger.info("Block dragged", { blockId, newStart: newStart.toISOString() });
      if (onBlockMoveCallback) {
        onBlockMoveCallback(blockId, newStart.toISOString(), newEnd.toISOString());
      }
    });

    blockEl.addEventListener("pointercancel", () => {
      if (!dragging) return;
      dragging = false;
      blockEl.style.cursor = "grab";
      blockEl.classList.remove("schedule-block-dragging");
      blockEl.style.top = `${initialTop}px`;
    });
  }

  logger.debug("Drag handlers wired", { draggableBlocks: blocks.length });
}
