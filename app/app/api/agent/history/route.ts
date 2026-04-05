import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:agent:history");

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    const date = req.nextUrl.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("agent_conversations")
      .select("messages")
      .eq("user_id", user.id)
      .eq("date", date)
      .maybeSingle();

    if (error) {
      logger.error("Failed to fetch history", { userId: user.id, error: error.message });
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }

    return NextResponse.json({ messages: data?.messages || [] });
  } catch (error: unknown) {
    logger.error("Unexpected error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
