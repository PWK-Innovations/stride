import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:auth:google');

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    logger.error('Google OAuth not configured — missing GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI');
    return NextResponse.json(
      { error: 'Google OAuth not configured' },
      { status: 500 }
    );
  }

  const scope = 'https://www.googleapis.com/auth/calendar.readonly';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    scope
  )}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
