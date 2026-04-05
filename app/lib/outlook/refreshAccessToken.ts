import { createLogger } from "@/lib/logger";

const logger = createLogger("outlook:refresh");

export async function refreshOutlookToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const response = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        grant_type: "refresh_token",
        scope: "openid offline_access Calendars.Read User.Read",
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    logger.error("Outlook token refresh failed", { error: error.error });
    throw new Error(error.error_description || error.error || "Failed to refresh token");
  }

  return response.json();
}
