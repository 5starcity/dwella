// lib/posthog.js
import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:             process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview:     false, // we handle this manually
    capture_pageleave:    true,
    persistence:          "localStorage",
    autocapture:          true,
  });
}

export function identifyUser(user, role) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.identify(user.uid, {
    email: user.email,
    name:  user.displayName,
    role,
  });
}

export function resetUser() {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.reset();
}

export function trackEvent(event, properties = {}) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(event, properties);
}

export default posthog;