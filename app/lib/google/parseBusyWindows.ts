interface CalendarEvent {
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export interface BusyWindow {
  start: Date;
  end: Date;
}

export function parseBusyWindows(events: CalendarEvent[]): BusyWindow[] {
  const busyWindows: BusyWindow[] = [];

  for (const event of events) {
    // Skip all-day events (they use 'date' instead of 'dateTime')
    if (!event.start.dateTime || !event.end.dateTime) {
      continue;
    }

    busyWindows.push({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    });
  }

  return busyWindows;
}
