"use client";

import { useEffect, useState } from "react";

interface ScheduledBlockItem {
  task_id: string;
  start_time: string;
  end_time: string;
  title: string;
}

interface BusyWindowItem {
  start: string | Date;
  end: string | Date;
  title?: string;
}

interface DailyTimelineProps {
  scheduledBlocks: ScheduledBlockItem[];
  busyWindows?: BusyWindowItem[];
}

const HOUR_HEIGHT = 80;
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 18;
const MIN_BLOCK_HEIGHT = 24;

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

function getHourLabel(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export function DailyTimeline({ scheduledBlocks, busyWindows = [] }: DailyTimelineProps): React.ReactElement {
  const [now, setNow] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Compute the visible hour range
  const allTimes: Date[] = [];
  for (const block of scheduledBlocks) {
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
    // If there are minutes past the hour on the end time, round up
    if (h >= endHour || (h === endHour - 1 && m > 0)) {
      endHour = m > 0 ? h + 1 : h;
      if (endHour <= h) endHour = h + 1;
    }
  }

  // Ensure end > start and add a buffer hour
  if (endHour <= startHour) endHour = startHour + 1;
  endHour = Math.min(endHour + 1, 24);

  const totalHours = endHour - startHour;
  const totalHeight = totalHours * HOUR_HEIGHT;

  // Convert a Date to a pixel offset
  const dateToY = (date: Date): number => {
    const hours = date.getHours() + date.getMinutes() / 60;
    return (hours - startHour) * HOUR_HEIGHT;
  };

  // Now indicator position
  const nowY = dateToY(now);
  const showNow = now.getHours() >= startHour && now.getHours() < endHour;

  // Generate hour lines
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  return (
    <div className="rounded-lg border border-olive-200 bg-white dark:border-olive-800 dark:bg-olive-900">
      {/* Header */}
      <div className="border-b border-olive-200 px-4 py-3 dark:border-olive-800">
        <h3 className="text-sm font-medium text-olive-500 dark:text-olive-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
      </div>

      {/* Timeline body */}
      <div className="relative flex overflow-hidden">
        {/* Time gutter */}
        <div className="w-16 flex-shrink-0 border-r border-olive-100 dark:border-olive-800">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative"
              style={{ height: hour < endHour ? HOUR_HEIGHT : 0 }}
            >
              <span className="absolute -top-2.5 right-3 text-xs text-olive-400 dark:text-olive-500">
                {getHourLabel(hour)}
              </span>
            </div>
          ))}
        </div>

        {/* Events area */}
        <div className="relative min-w-0 flex-1" style={{ height: totalHeight }}>
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-olive-100 dark:border-olive-800"
              style={{ top: (hour - startHour) * HOUR_HEIGHT }}
            />
          ))}

          {/* Busy windows */}
          {busyWindows.map((bw, i) => {
            const bwStart = new Date(bw.start);
            const bwEnd = new Date(bw.end);
            const top = dateToY(bwStart);
            const height = Math.max(dateToY(bwEnd) - top, MIN_BLOCK_HEIGHT);

            return (
              <div
                key={`busy-${i}`}
                className="absolute right-2 left-2 overflow-hidden rounded-md border-l-2 border-dashed border-olive-400 bg-olive-100/60 px-3 py-1.5 dark:border-olive-600 dark:bg-olive-800/40"
                style={{ top, height }}
              >
                <p className="truncate text-xs font-medium text-olive-500 dark:text-olive-400">
                  {bw.title || "Calendar event"}
                </p>
                <p className="text-xs text-olive-400 dark:text-olive-500">
                  {formatTime(bwStart)} – {formatTime(bwEnd)}
                </p>
              </div>
            );
          })}

          {/* Scheduled task blocks */}
          {scheduledBlocks.map((block, i) => {
            const blockStart = new Date(block.start_time);
            const blockEnd = new Date(block.end_time);
            const top = dateToY(blockStart);
            const height = Math.max(dateToY(blockEnd) - top, MIN_BLOCK_HEIGHT);

            return (
              <div
                key={`task-${i}`}
                className="absolute right-2 left-2 overflow-hidden rounded-md border-l-2 border-solid border-olive-500 bg-olive-50 px-3 py-2 dark:border-olive-400 dark:bg-olive-800"
                style={{ top, height }}
              >
                <p className="truncate text-sm font-medium text-olive-900 dark:text-olive-50">
                  {block.title}
                </p>
                <p className="text-xs text-olive-500 dark:text-olive-400">
                  {formatTime(blockStart)} · {formatDuration(blockStart, blockEnd)}
                </p>
              </div>
            );
          })}

          {/* Now indicator */}
          {showNow && (
            <div
              className="absolute right-0 left-0 z-10 flex items-center"
              style={{ top: nowY }}
            >
              <div className="h-2.5 w-2.5 -translate-x-[5px] rounded-full bg-red-500" />
              <div className="h-px flex-1 bg-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
