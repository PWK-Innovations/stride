import posthog from "posthog-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("analytics");

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) {
    logger.warn("PostHog key not set, analytics disabled");
    return;
  }

  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
  });

  initialized = true;
  logger.info("Analytics initialized");
}

export function identifyUser(userId: string, email: string): void {
  if (!initialized) return;
  posthog.identify(userId, { email });
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(name, properties);
}
