import { createLogger } from "@/lib/logger";

const logger = createLogger("google:calendar");

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export async function fetchTodaysEvents(accessToken: string, dayStart: Date, dayEnd: Date): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    logger.error("Failed to fetch calendar events", { error: error.error });
    throw new Error(error.error?.message || 'Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.items || [];
}
