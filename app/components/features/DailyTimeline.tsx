'use client';

import { useEffect, useRef } from 'react';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/dist/style.css';

interface TimelineItem {
  id: string;
  group: number;
  title: string;
  start_time: Date;
  end_time: Date;
  itemProps: {
    className: string;
    style: {
      background: string;
      color: string;
      border: string;
      borderRadius: string;
    };
  };
}

interface DailyTimelineProps {
  scheduledBlocks: Array<{
    task_id: string;
    start_time: string;
    end_time: string;
    title: string;
  }>;
  busyWindows?: Array<{
    start: Date;
    end: Date;
    title?: string;
  }>;
}

export function DailyTimeline({ scheduledBlocks, busyWindows = [] }: DailyTimelineProps) {
  const groups = [{ id: 1, title: 'Today' }];

  // Combine scheduled blocks and busy windows into timeline items
  const items: TimelineItem[] = [
    ...scheduledBlocks.map((block, i) => ({
      id: `task-${i}`,
      group: 1,
      title: block.title,
      start_time: new Date(block.start_time),
      end_time: new Date(block.end_time),
      itemProps: {
        className: 'timeline-item-task',
        style: {
          background: 'oklch(73.7% 0.021 106.9)',
          color: 'oklch(15.3% 0.006 107.1)',
          border: '1px solid oklch(58% 0.031 107.3)',
          borderRadius: '4px',
        },
      },
    })),
    ...busyWindows.map((window, i) => ({
      id: `busy-${i}`,
      group: 1,
      title: window.title || 'Calendar event',
      start_time: window.start,
      end_time: window.end,
      itemProps: {
        className: 'timeline-item-busy',
        style: {
          background: 'oklch(46.6% 0.025 107.3)',
          color: 'white',
          border: '1px solid oklch(39.4% 0.023 107.4)',
          borderRadius: '4px',
        },
      },
    })),
  ];

  // Set timeline bounds to today (midnight to midnight)
  const today = new Date();
  const startOfDay = moment(today).startOf('day');
  const endOfDay = moment(today).endOf('day');

  return (
    <div className="rounded-lg border border-olive-200 bg-white p-4 dark:border-olive-800 dark:bg-olive-900">
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={startOfDay}
        defaultTimeEnd={endOfDay}
        canMove={false}
        canResize={false}
        canChangeGroup={false}
        lineHeight={60}
        itemHeightRatio={0.75}
        minZoom={60 * 60 * 1000 * 24} // 24 hours
        maxZoom={60 * 60 * 1000 * 24}
      >
        <TimelineHeaders>
          <SidebarHeader>
            {({ getRootProps }) => (
              <div {...getRootProps()} className="text-sm font-medium text-olive-700">
                Schedule
              </div>
            )}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
    </div>
  );
}
