import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDayBoundsInZone } from "@/lib/timezone";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:schedule:get");

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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

    return NextResponse.json({ scheduled_blocks: blocks || [] });
  } catch (error: unknown) {
    logger.error("Unexpected error fetching schedule", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 },
    );
  }
}
