import { createLogger } from "@/lib/logger";

const logger = createLogger("outlook:calendar");

interface OutlookEvent {
  id: string;
  subject: string;
  isAllDay: boolean;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

export interface BusyWindow {
  start: Date;
  end: Date;
  title?: string;
}

export async function fetchOutlookEvents(
  accessToken: string,
  dayStart: Date,
  dayEnd: Date,
): Promise<BusyWindow[]> {
  const startDateTime = dayStart.toISOString();
  const endDateTime = dayEnd.toISOString();

  const url = `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${encodeURIComponent(startDateTime)}&endDateTime=${encodeURIComponent(endDateTime)}&$select=id,subject,start,end,isAllDay&$orderby=start/dateTime`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.json();
    logger.error("Failed to fetch Outlook events", { error: error.error });
    throw new Error(error.error?.message || "Failed to fetch Outlook events");
  }

  const data = await response.json();
  const events: OutlookEvent[] = data.value || [];

  const busyWindows: BusyWindow[] = [];
  for (const event of events) {
    if (event.isAllDay) continue;

    busyWindows.push({
      start: new Date(event.start.dateTime + "Z"),
      end: new Date(event.end.dateTime + "Z"),
      title: event.subject,
    });
  }

  logger.info("Outlook events fetched", { count: busyWindows.length });
  return busyWindows;
}
