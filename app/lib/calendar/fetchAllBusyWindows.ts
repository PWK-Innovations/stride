import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchTodaysEvents } from "@/lib/google/fetchTodaysEvents";
import { parseBusyWindows } from "@/lib/google/parseBusyWindows";
import { refreshAccessToken } from "@/lib/google/refreshAccessToken";
import { fetchOutlookEvents } from "@/lib/outlook/fetchTodaysEvents";
import { refreshOutlookToken } from "@/lib/outlook/refreshAccessToken";
import { createLogger } from "@/lib/logger";

const logger = createLogger("calendar:unified");

export interface BusyWindow {
  start: Date;
  end: Date;
  title?: string;
}

interface CalendarToken {
  provider: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
}

async function refreshIfExpired(
  supabase: SupabaseClient,
  userId: string,
  token: CalendarToken,
): Promise<string> {
  const expiresAt = new Date(token.token_expires_at);
  const now = new Date();

  if (now < expiresAt) return token.access_token;

  logger.info("Refreshing expired token", { userId, provider: token.provider });

  if (token.provider === "google") {
    const refreshed = await refreshAccessToken(token.refresh_token);
    const newExpiresAt = new Date(now.getTime() + refreshed.expires_in * 1000);
    await supabase
      .from("calendar_tokens")
      .update({
        access_token: refreshed.access_token,
        token_expires_at: newExpiresAt.toISOString(),
      })
      .eq("user_id", userId)
      .eq("provider", "google");
    return refreshed.access_token;
  }

  if (token.provider === "outlook") {
    const refreshed = await refreshOutlookToken(token.refresh_token);
    const newExpiresAt = new Date(now.getTime() + refreshed.expires_in * 1000);
    await supabase
      .from("calendar_tokens")
      .update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        token_expires_at: newExpiresAt.toISOString(),
      })
      .eq("user_id", userId)
      .eq("provider", "outlook");
    return refreshed.access_token;
  }

  return token.access_token;
}

/**
 * Fetch busy windows from all connected calendar providers and merge into a single list.
 */
export async function fetchAllBusyWindows(
  supabase: SupabaseClient,
  userId: string,
  dayStart: Date,
  dayEnd: Date,
): Promise<BusyWindow[]> {
  const { data: tokens, error } = await supabase
    .from("calendar_tokens")
    .select("provider, access_token, refresh_token, token_expires_at")
    .eq("user_id", userId);

  if (error || !tokens || tokens.length === 0) {
    logger.info("No calendar providers connected", { userId });
    return [];
  }

  const allWindows: BusyWindow[] = [];

  for (const token of tokens) {
    try {
      const accessToken = await refreshIfExpired(supabase, userId, token);

      if (token.provider === "google") {
        const events = await fetchTodaysEvents(accessToken, dayStart, dayEnd);
        const windows = parseBusyWindows(events);
        allWindows.push(...windows);
        logger.info("Google events fetched", { userId, count: windows.length });
      } else if (token.provider === "outlook") {
        const windows = await fetchOutlookEvents(accessToken, dayStart, dayEnd);
        allWindows.push(...windows);
        logger.info("Outlook events fetched", { userId, count: windows.length });
      }
    } catch (providerError: unknown) {
      const msg = providerError instanceof Error ? providerError.message : String(providerError);
      logger.warn("Failed to fetch from provider", { userId, provider: token.provider, error: msg });
    }
  }

  // Sort by start time
  allWindows.sort((a, b) => a.start.getTime() - b.start.getTime());

  logger.info("All busy windows merged", { userId, total: allWindows.length });
  return allWindows;
}
