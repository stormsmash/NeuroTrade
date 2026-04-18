"use client";

import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef } from "react";

const DEPTH_MARKS = [25, 50, 75, 100] as const;

export function EngagementTelemetry() {
  const firedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackEvent("page_view", { page: "landing" });

    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const depth = Math.round((window.scrollY / maxScroll) * 100);

      DEPTH_MARKS.forEach((mark) => {
        if (depth >= mark && !firedDepths.current.has(mark)) {
          firedDepths.current.add(mark);
          trackEvent("scroll_depth", {
            page: "landing",
            depth_percent: mark,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
