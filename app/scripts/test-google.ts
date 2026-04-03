import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createLogger } from "../lib/logger";

config({ path: ".env.local" });

const logger = createLogger("test:google");

async function main(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!supabaseUrl || !supabaseKey) {
    logger.error("Missing Supabase env vars in .env.local");
    process.exit(2);
  }

  if (!clientId || !clientSecret) {
    logger.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local");
    process.exit(2);
  }

  // Find a profile with Google tokens
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, google_refresh_token")
    .not("google_refresh_token", "is", null)
    .limit(1);

  if (error) {
    logger.error("Failed to query profiles", { error: error.message });
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    logger.warn("No profiles with Google tokens found — skipping refresh test");
    logger.info("Google test passed (no tokens to test, env vars OK)");
    return;
  }

  // Test token refresh
  const refreshToken = profiles[0].google_refresh_token;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    logger.error("Google token refresh failed", { error: err.error });
    process.exit(1);
  }

  const tokens = await response.json();
  logger.info("Google token refresh successful", {
    expiresIn: tokens.expires_in,
  });
}

main().catch((err) => {
  logger.error("Unexpected error", { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
