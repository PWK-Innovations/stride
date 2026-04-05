import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { getDayBoundsInZone } from "@/lib/timezone";
import { fetchAllBusyWindows } from "@/lib/calendar/fetchAllBusyWindows";
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

    // Fetch busy windows from all connected calendar providers
    let busyWindows: Array<{ start: Date; end: Date; title?: string }> = [];
    try {
      busyWindows = await fetchAllBusyWindows(supabase, user.id, startOfDay, endOfDay);
    } catch (calError: unknown) {
      logger.warn("Failed to fetch calendar events", {
        error: calError instanceof Error ? calError.message : String(calError),
      });
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
