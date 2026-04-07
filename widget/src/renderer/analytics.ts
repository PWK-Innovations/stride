import posthog from "posthog-js";
import { createLogger } from "./logger";

const logger = createLogger("Analytics");

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;

  const key = window.strideConfig?.posthogKey;
  if (!key) {
    logger.warn("PostHog key not set, analytics disabled");
    return;
  }

  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    persistence: "localStorage",
  });

  initialized = true;
  logger.info("Analytics initialized");
}

export function identifyUser(userId: string, email: string): void {
  if (!initialized) return;
  posthog.identify(userId, { email, platform: "widget" });
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(name, { ...properties, platform: "widget" });
}
