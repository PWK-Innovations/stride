import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:auth:microsoft:callback');

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID!,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
          redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
          grant_type: 'authorization_code',
          scope: 'openid offline_access Calendars.Read User.Read',
        }),
      },
    );

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      logger.error('Token exchange failed', { error: tokens.error, description: tokens.error_description });
      throw new Error(tokens.error_description || tokens.error || 'Failed to exchange code');
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Upsert into calendar_tokens
    const { error: upsertError } = await supabase
      .from('calendar_tokens')
      .upsert(
        {
          user_id: user.id,
          provider: 'outlook',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt.toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );

    if (upsertError) {
      logger.error('Failed to store tokens', { userId: user.id, error: upsertError.message });
      throw upsertError;
    }

    logger.info('Outlook OAuth connected', { userId: user.id });
    return NextResponse.redirect(new URL('/app', request.url));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Microsoft OAuth callback failed', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
