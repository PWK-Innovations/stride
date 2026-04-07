"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
        Something went wrong
      </h2>
      <p className="text-sm text-olive-600 dark:text-olive-400">
        An unexpected error occurred. Our team has been notified.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
