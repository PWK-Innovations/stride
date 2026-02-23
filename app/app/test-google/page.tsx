'use client';

export default function TestGooglePage() {
  const googleAuthUrl = '/api/auth/google';

  return (
    <div className="flex min-h-screen items-center justify-center bg-olive-50 dark:bg-olive-950">
      <div className="rounded-lg border border-olive-200 bg-white p-8 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <h1 className="mb-4 text-2xl font-display text-olive-900 dark:text-olive-50">
          Google OAuth Test
        </h1>
        <p className="mb-6 text-sm text-olive-600 dark:text-olive-400">
          Click below to start the Google OAuth flow. After authorization, tokens will be stored in your profile.
        </p>
        <a
          href={googleAuthUrl}
          className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-500"
        >
          Connect Google Calendar
        </a>
      </div>
    </div>
  );
}
