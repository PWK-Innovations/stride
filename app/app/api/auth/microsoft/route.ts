import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:auth:microsoft');

export async function GET() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    logger.error('Microsoft OAuth not configured — missing MICROSOFT_CLIENT_ID or MICROSOFT_REDIRECT_URI');
    return NextResponse.json(
      { error: 'Microsoft OAuth not configured' },
      { status: 500 },
    );
  }

  const scope = 'openid offline_access Calendars.Read User.Read';
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&response_mode=query`;

  return NextResponse.redirect(authUrl);
}
