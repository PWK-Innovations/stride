import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:profile");

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const { data: tokens, error: tokensError } = await supabase
    .from("calendar_tokens")
    .select("provider")
    .eq("user_id", user.id);

  if (tokensError) {
    logger.error("Failed to fetch calendar tokens", { userId: user.id, error: tokensError.message });
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }

  const providers = (tokens || []).map((t) => t.provider);

  return NextResponse.json({
    googleConnected: providers.includes("google"),
    outlookConnected: providers.includes("outlook"),
  });
}
