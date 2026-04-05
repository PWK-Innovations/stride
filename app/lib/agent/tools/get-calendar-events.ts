import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import { fetchTodaysEvents } from "@/lib/google/fetchTodaysEvents";
import { parseBusyWindows } from "@/lib/google/parseBusyWindows";
import { refreshAccessToken } from "@/lib/google/refreshAccessToken";
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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("google_access_token, google_refresh_token, google_token_expires_at")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        logger.warn("Profile not found", { error: profileError?.message });
        return JSON.stringify({ events: [], note: "Could not load profile." });
      }

      if (!profile.google_access_token || !profile.google_refresh_token) {
        logger.info("Google Calendar not connected", { userId });
        return JSON.stringify({
          events: [],
          note: "Google Calendar is not connected. No busy windows to consider.",
        });
      }

      let accessToken = profile.google_access_token as string;
      const expiresAt = new Date(profile.google_token_expires_at as string);
      const now = new Date();

      if (now >= expiresAt) {
        logger.info("Refreshing expired Google token", { userId });
        const tokens = await refreshAccessToken(profile.google_refresh_token as string);
        accessToken = tokens.access_token;

        const newExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
        await supabase
          .from("profiles")
          .update({
            google_access_token: accessToken,
            google_token_expires_at: newExpiresAt.toISOString(),
          })
          .eq("id", userId);
      }

      const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);
      const events = await fetchTodaysEvents(accessToken, startOfDay, endOfDay);
      const busyWindows = parseBusyWindows(events);

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
        "Fetch today's calendar events as busy windows. Returns JSON array with start, end (ISO strings), and optional title for each event.",
      schema: z.object({}),
    },
  );
}
