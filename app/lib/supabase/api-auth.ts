import { createClient as createCookieClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const logger = createLogger("api-auth");

type AuthSuccess = { user: User; supabase: SupabaseClient };
type AuthFailure = { error: string };
type AuthResult = AuthSuccess | AuthFailure;

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export async function getAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  const token = extractBearerToken(request);

  if (token) {
    logger.debug("Authenticating via Bearer token");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      logger.warn("Bearer token authentication failed", {
        error: userError?.message,
      });
      return { error: "Not authenticated" };
    }

    logger.debug("Bearer token authentication succeeded", {
      userId: user.id,
    });
    return { user, supabase };
  }

  logger.debug("Authenticating via cookie");

  const supabase = await createCookieClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    logger.warn("Cookie authentication failed", {
      error: userError?.message,
    });
    return { error: "Not authenticated" };
  }

  logger.debug("Cookie authentication succeeded", { userId: user.id });
  return { user, supabase };
}
