// components/layout/PostHogProvider.jsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { initPostHog, identifyUser, resetUser, trackEvent } from "@/lib/posthog";

export default function PostHogProvider() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const { user, userRole } = useAuth();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    trackEvent("$pageview", { path: pathname });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (user) {
      identifyUser(user, userRole);
    } else {
      resetUser();
    }
  }, [user, userRole]);

  return null;
}