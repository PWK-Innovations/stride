import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { getDayBoundsInZone } from "@/lib/timezone";
import { fetchTodaysEvents } from "@/lib/google/fetchTodaysEvents";
import { parseBusyWindows } from "@/lib/google/parseBusyWindows";
import { refreshAccessToken } from "@/lib/google/refreshAccessToken";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:schedule:get");

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    const timezone =
      request.nextUrl.searchParams.get("timezone") || "UTC";
    const { startOfDay, endOfDay } = getDayBoundsInZone(timezone);

    const { data: blocks, error } = await supabase
      .from("scheduled_blocks")
      .select("*")
      .eq("user_id", user.id)
      .gte("start_time", startOfDay.toISOString())
      .lte("start_time", endOfDay.toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      logger.error("Failed to fetch schedule", { userId: user.id, error: error.message });
      return NextResponse.json(
        { error: "Failed to fetch schedule" },
        { status: 500 },
      );
    }

    // Fetch busy windows from Google Calendar if connected
    let busyWindows: Array<{ start: Date; end: Date; title?: string }> = [];

    const { data: profile } = await supabase
      .from("profiles")
      .select("google_access_token, google_refresh_token, google_token_expires_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.google_access_token && profile?.google_refresh_token) {
      try {
        let accessToken = profile.google_access_token as string;
        const expiresAt = new Date(profile.google_token_expires_at as string);
        const now = new Date();

        if (now >= expiresAt) {
          const tokens = await refreshAccessToken(profile.google_refresh_token as string);
          accessToken = tokens.access_token;
          const newExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
          await supabase
            .from("profiles")
            .update({
              google_access_token: accessToken,
              google_token_expires_at: newExpiresAt.toISOString(),
            })
            .eq("id", user.id);
        }

        const events = await fetchTodaysEvents(accessToken, startOfDay, endOfDay);
        busyWindows = parseBusyWindows(events);
      } catch (calError: unknown) {
        logger.warn("Failed to fetch calendar events", {
          error: calError instanceof Error ? calError.message : String(calError),
        });
      }
    }

    return NextResponse.json({
      scheduled_blocks: blocks || [],
      busy_windows: busyWindows.map((w) => ({
        start: w.start.toISOString(),
        end: w.end.toISOString(),
        title: w.title,
      })),
    });
  } catch (error: unknown) {
    logger.error("Unexpected error fetching schedule", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 },
    );
  }
}
