"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", fontFamily: "system-ui, sans-serif" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ fontSize: "0.875rem", color: "#666" }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: "#6b7040", color: "white", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
