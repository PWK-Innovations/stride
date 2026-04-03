import { createLogger } from './logger';

const logger = createLogger('auth');

const SUPABASE_URL = 'https://jybybgzofbwafnmkzzde.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YnliZ3pvZmJ3YWZubWt6emRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODA5OTcsImV4cCI6MjA4NzM1Njk5N30.Rmgyv_XpdFCBgqCYdt70Xu6GjG9LScmgoObkH-8HylM';

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
}

interface AuthSuccessResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  user: { id: string; email: string };
}

interface AuthErrorResponse {
  error: string;
  error_description?: string;
}

type AuthResult =
  | { success: true; session: AuthSession }
  | { success: false; error: string };

export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  logger.info('Attempting sign in', { email });

  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData: AuthErrorResponse = await response.json();
      const message = errorData.error_description || errorData.error || 'Sign in failed';
      logger.error('Sign in failed', { status: response.status, error: message });
      return { success: false, error: message };
    }

    const data: AuthSuccessResponse = await response.json();
    logger.info('Sign in successful', { email });

    return {
      success: true,
      session: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        expires_at: data.expires_at,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Sign in error', { error: message });
    return { success: false, error: `Network error: ${message}` };
  }
}

export async function refreshSession(refreshToken: string): Promise<AuthResult> {
  logger.debug('Refreshing session');

  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      const errorData: AuthErrorResponse = await response.json();
      const message = errorData.error_description || errorData.error || 'Refresh failed';
      logger.error('Session refresh failed', { status: response.status, error: message });
      return { success: false, error: message };
    }

    const data: AuthSuccessResponse = await response.json();
    logger.info('Session refreshed');

    return {
      success: true,
      session: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        expires_at: data.expires_at,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Session refresh error', { error: message });
    return { success: false, error: `Network error: ${message}` };
  }
}
