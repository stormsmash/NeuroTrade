"use client";

import { Button } from "@/components/ui/button";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import { ArrowRight, CirclePlay, Radar } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const OrbitalCore = dynamic(() => import("@/components/sections/orbital-core"), {
  ssr: false,
  loading: () => (
    <div className="glass-panel h-full min-h-64 w-full animate-pulse rounded-[1.5rem] sm:min-h-72" />
  ),
});

const clamp = (value: number) => Math.min(1, Math.max(-1, value));

const heroCopy: Record<
  Locale,
  {
    badge: string;
    heading: string;
    glowLine: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    metrics: [string, string][];
    orbLabel: string;
  }
> = {
  en: {
    badge: "LOW-LATENCY ALPHA GRID",
    heading: "Trade Smarter with AI",
    glowLine: "NeuroTrade fuses live market streams with tactical machine reasoning",
    body: "so every entry, hedge, and exit lands with command-center clarity.",
    primaryCta: "Enter Command Bridge",
    secondaryCta: "Watch the Surface",
    metrics: [
      ["2.8M", "simulated executions/day"],
      ["14ms", "avg decision latency"],
      ["98.4%", "signal confidence trim"],
    ],
    orbLabel: "Live Neural Orb",
  },
  th: {
    badge: "กริดสัญญาณหน่วงต่ำ",
    heading: "เทรดฉลาดขึ้นด้วย AI",
    glowLine:
      "NeuroTrade ผสานข้อมูลตลาดแบบเรียลไทม์เข้ากับระบบวิเคราะห์เชิงกลยุทธ์",
    body: "ให้ทุกจังหวะเข้า ออก และป้องกันความเสี่ยงแม่นยำเหมือนห้องควบคุม",
    primaryCta: "เข้าสู่ Command Bridge",
    secondaryCta: "ดูภาพรวมแดชบอร์ด",
    metrics: [
      ["2.8M", "คำสั่งจำลองต่อวัน"],
      ["14ms", "ค่าเฉลี่ยเวลาตัดสินใจ"],
      ["98.4%", "ความแม่นยำของสัญญาณ"],
    ],
    orbLabel: "ออร์บสัญญาณแบบสด",
  },
};

export function SignalHeroArc() {
  const locale = useInterfaceStore((state) => state.locale);
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);
  const cursor = useInterfaceStore((state) => state.cursor);
  const setCursor = useInterfaceStore((state) => state.setCursor);

  const copy = heroCopy[locale];
  const rafId = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
    },
    []
  );

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!motionEnabled) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    // Throttle pointer updates through rAF to avoid over-rendering on fast mice.
    if (rafId.current) window.cancelAnimationFrame(rafId.current);
    rafId.current = window.requestAnimationFrame(() => {
      setCursor({ x: clamp(x), y: clamp(y) });
    });
  };

  const handlePointerLeave = () => setCursor({ x: 0, y: 0 });

  const jumpTo = (id: string, source: "hero_primary" | "hero_secondary") => {
    document.getElementById(id)?.scrollIntoView({
      behavior: motionEnabled ? "smooth" : "auto",
    });
    trackEvent("section_jump", { target: id, source });
  };

  return (
    <section
      id="mission"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-16 sm:pb-20 sm:pt-20 md:px-8 md:pb-24 md:pt-28"
    >
      <div className="hero-orb floaty left-[-90px] top-10 size-[220px] bg-cyan-300/30 sm:left-[-120px] sm:top-14 sm:size-[320px]" />
      <div className="hero-orb floaty-slow right-[-80px] top-[120px] size-[210px] bg-violet-300/26 sm:right-[-110px] sm:top-[130px] sm:size-[300px]" />
      <div className="hero-orb floaty-fast bottom-3 left-[20%] size-[170px] bg-emerald-300/20 sm:bottom-4 sm:left-[26%] sm:size-[240px]" />

      <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.9, 0.24, 1] }}
          style={motionEnabled ? { x: cursor.x * 12, y: cursor.y * 14 } : undefined}
          className="space-y-6 sm:space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-[11px] tracking-[0.12em] text-emerald-100/85 sm:text-xs sm:tracking-[0.14em]">
            <Radar className="size-3.5" />
            {copy.badge}
          </div>

          <h1 className="font-heading text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            {copy.heading}
          </h1>

          <p className="text-balance max-w-xl text-sm text-zinc-300 sm:text-base md:text-lg">
            <span className="bg-gradient-to-r from-cyan-200 via-emerald-100 to-violet-200 bg-clip-text font-medium text-transparent">
              {copy.glowLine}
            </span>{" "}
            {copy.body}
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              onClick={() => {
                trackEvent("cta_click", { cta: "hero_primary", source: "hero" });
                jumpTo("pricing", "hero_primary");
              }}
              className="h-10 w-full justify-center rounded-full border border-emerald-100/30 bg-gradient-to-r from-emerald-300/90 via-cyan-300/95 to-violet-300/90 px-6 text-sm font-semibold text-[#041022] transition-transform hover:scale-[1.03] sm:h-11 sm:w-auto"
            >
              {copy.primaryCta}
              <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                trackEvent("cta_click", { cta: "hero_secondary", source: "hero" });
                jumpTo("interface", "hero_secondary");
              }}
              className="h-10 w-full justify-center rounded-full border-white/20 bg-white/4 px-6 text-sm text-zinc-100 hover:border-cyan-200/40 hover:bg-cyan-200/8 sm:h-11 sm:w-auto"
            >
              <CirclePlay className="size-4" />
              {copy.secondaryCta}
            </Button>
          </div>

          <div className="grid max-w-lg grid-cols-1 gap-3 pt-2 text-xs text-zinc-300 sm:grid-cols-2 md:grid-cols-3">
            {copy.metrics.map(([value, label]) => (
              <div
                key={label}
                className="glass-panel rounded-2xl px-3 py-2 text-center md:text-left"
              >
                <p className="font-heading text-xl text-white">{value}</p>
                <p className="text-[11px] text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.2, 0.9, 0.24, 1] }}
          style={
            motionEnabled ? { x: cursor.x * -10, y: cursor.y * -10 } : undefined
          }
          className="relative"
        >
          <div className="glass-panel neon-border relative h-[320px] overflow-hidden rounded-[1.75rem] p-3 sm:h-[380px] md:h-[470px]">
            <div className="scan-lines pointer-events-none absolute inset-0 opacity-25" />
            <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] text-zinc-300 sm:left-5 sm:top-5 sm:px-3 sm:text-[11px]">
              {copy.orbLabel}
            </div>
            <div className="h-full w-full overflow-hidden rounded-[1.2rem] bg-gradient-to-br from-cyan-400/8 via-white/0 to-violet-400/14">
              <OrbitalCore />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
