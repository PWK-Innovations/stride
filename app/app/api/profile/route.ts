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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("google_access_token, google_token_expires_at")
    .eq("id", user.id)
    .single();

  if (profileError) {
    logger.error("Failed to fetch profile", { userId: user.id, error: profileError.message });
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }

  const googleConnected = Boolean(profile?.google_access_token);

  return NextResponse.json({ googleConnected });
}
