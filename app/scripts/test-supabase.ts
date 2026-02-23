import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createLogger } from "../lib/logger";

config({ path: ".env.local" });

const logger = createLogger("test:supabase");

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    logger.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // Test 1: Query profiles table
  const { data, error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    logger.error("Failed to query profiles table", { error: error.message });
    process.exit(1);
  }

  logger.info("Supabase connection successful", {
    profilesFound: data.length,
  });

  // Test 2: Query tasks table
  const { error: tasksError } = await supabase.from("tasks").select("id").limit(1);

  if (tasksError) {
    logger.error("Failed to query tasks table", { error: tasksError.message });
    process.exit(1);
  }

  logger.info("All Supabase tests passed");
}

main();
