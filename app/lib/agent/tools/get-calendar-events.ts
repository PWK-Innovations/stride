import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { fetchAllBusyWindows } from "@/lib/calendar/fetchAllBusyWindows";
import { getDayBoundsInZone, formatTimeInZone } from "@/lib/timezone";

const logger = createLogger("agent:tool:getCalendarEvents");

interface SerializedBusyWindow {
  start: string;
  end: string;
  title?: string;
}

export function createGetCalendarEventsTool(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  return tool(
    async () => {
      logger.info("Fetching calendar events", { userId, timezone });

      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      const busyWindows = await fetchAllBusyWindows(supabase, userId, startOfDay, endOfDay);

      const serialized: SerializedBusyWindow[] = busyWindows.map((w) => ({
        start: formatTimeInZone(w.start, timezone),
        end: formatTimeInZone(w.end, timezone),
        title: w.title,
      }));

      logger.info("Calendar events fetched", { count: serialized.length });
      return JSON.stringify(serialized);
    },
    {
      name: "getCalendarEvents",
      description:
        "Fetch today's calendar events from all connected providers (Google, Outlook) as busy windows. Returns JSON array with start, end times and optional title.",
      schema: z.object({}),
    },
  );
}
