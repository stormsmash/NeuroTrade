"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { ArrowUpRight, CandlestickChart, Shield, Zap } from "lucide-react";
import { SignalCounter } from "./signal-counter";

type MetricCard = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend: string;
  tone: string;
};

type InsightCard = {
  title: string;
  text: string;
  icon: typeof Zap;
};

const localizedContent: Record<
  Locale,
  {
    tag: string;
    badge: string;
    heading: string;
    body: string;
    chartTitle: string;
    chartDescription: string;
    chartAria: string;
    trendSuffix: string;
    metrics: MetricCard[];
    insights: InsightCard[];
  }
> = {
  en: {
    tag: "STRATEGY SURFACE",
    badge: "Real-time simulation feed",
    heading: "The dashboard your quant team wished existed last year.",
    body: "Tilt the panel, inspect risk, and watch the model explain each trade pulse in plain language before execution.",
    chartTitle: "Momentum Exposure Graph",
    chartDescription: "In-session momentum with volatility breakpoints.",
    chartAria: "Mock trading chart",
    trendSuffix: "in last 24h",
    metrics: [
      {
        label: "Net P&L",
        value: 28450,
        prefix: "+$",
        trend: "+18.4%",
        tone: "text-emerald-200",
      },
      {
        label: "Win Rate",
        value: 78.6,
        suffix: "%",
        decimals: 1,
        trend: "+2.1%",
        tone: "text-cyan-200",
      },
      {
        label: "Risk Drift",
        value: 0.32,
        decimals: 2,
        trend: "-0.07",
        tone: "text-violet-200",
      },
    ],
    insights: [
      {
        icon: Zap,
        title: "Execution Window",
        text: "Orders staged in 2.1 ms average route commit.",
      },
      {
        icon: Shield,
        title: "Dynamic Guardrails",
        text: "Position caps update live with volatility bursts.",
      },
      {
        icon: ArrowUpRight,
        title: "Signal Explainability",
        text: "Every suggestion carries confidence and rationale.",
      },
    ],
  },
  th: {
    tag: "พื้นผิวกลยุทธ์",
    badge: "ฟีดจำลองตลาดแบบเรียลไทม์",
    heading: "แดชบอร์ดที่ทีมเทรดเชิงระบบอยากได้มาตั้งแต่ปีที่แล้ว",
    body: "ขยับมุมมองเพื่อตรวจความเสี่ยง แล้วดู AI อธิบายเหตุผลของทุกสัญญาณก่อนส่งคำสั่งจริง",
    chartTitle: "กราฟโมเมนตัมการเปิดสถานะ",
    chartDescription: "พฤติกรรมราคาในเซสชัน พร้อมจุดเปลี่ยนความผันผวน",
    chartAria: "กราฟจำลองการเทรด",
    trendSuffix: "ในช่วง 24 ชั่วโมงล่าสุด",
    metrics: [
      {
        label: "กำไรสุทธิ",
        value: 28450,
        prefix: "+$",
        trend: "+18.4%",
        tone: "text-emerald-200",
      },
      {
        label: "อัตราชนะ",
        value: 78.6,
        suffix: "%",
        decimals: 1,
        trend: "+2.1%",
        tone: "text-cyan-200",
      },
      {
        label: "ค่าเบี่ยงเบนความเสี่ยง",
        value: 0.32,
        decimals: 2,
        trend: "-0.07",
        tone: "text-violet-200",
      },
    ],
    insights: [
      {
        icon: Zap,
        title: "ช่วงเวลาส่งคำสั่ง",
        text: "เตรียมคำสั่งพร้อมส่งภายในเฉลี่ย 2.1 มิลลิวินาที",
      },
      {
        icon: Shield,
        title: "รั้วความเสี่ยงอัตโนมัติ",
        text: "ปรับเพดานขนาดสถานะแบบสดตามความผันผวนของตลาด",
      },
      {
        icon: ArrowUpRight,
        title: "เหตุผลของสัญญาณ",
        text: "ทุกคำแนะนำมีค่าความมั่นใจและเหตุผลรองรับชัดเจน",
      },
    ],
  },
};

const pathLine =
  "M 18 190 C 78 172, 116 90, 178 112 C 228 129, 252 211, 308 170 C 356 136, 398 58, 442 78 C 488 101, 521 167, 582 124";
const pathArea = `${pathLine} L 582 230 L 18 230 Z`;

export function QuantumDeskPanel() {
  const locale = useInterfaceStore((state) => state.locale);
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);
  const content = localizedContent[locale];

  return (
    <section
      id="interface"
      className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs tracking-[0.22em] text-cyan-100/70">{content.tag}</p>
          <h2 className="font-heading text-3xl text-white md:text-4xl">
            {content.heading}
          </h2>
          <p className="text-zinc-300">{content.body}</p>
        </div>

        <Badge className="w-fit rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-xs text-cyan-100">
          {content.badge}
        </Badge>
      </div>

      <motion.div
        whileHover={motionEnabled ? { y: -4 } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="glass-panel neon-border relative overflow-hidden rounded-[1.9rem] p-4 md:p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/8 via-transparent to-violet-300/8" />
        <div className="absolute -top-24 right-[-80px] size-56 rounded-full bg-violet-300/18 blur-[70px]" />
        <div className="absolute -bottom-24 left-[-60px] size-52 rounded-full bg-emerald-300/15 blur-[75px]" />

        <div className="relative grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="glass-panel border-white/10 bg-black/20">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <CandlestickChart className="size-4 text-cyan-200" />
                {content.chartTitle}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {content.chartDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <svg
                viewBox="0 0 600 240"
                className="h-60 w-full rounded-xl bg-gradient-to-b from-slate-900/35 to-black/35 p-2"
                aria-label={content.chartAria}
              >
                {[0, 1, 2, 3, 4].map((line) => (
                  <line
                    key={line}
                    x1="0"
                    y1={line * 48}
                    x2="600"
                    y2={line * 48}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 8"
                  />
                ))}
                <motion.path
                  d={pathArea}
                  fill="url(#fillGlow)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9 }}
                />
                <motion.path
                  d={pathLine}
                  fill="none"
                  stroke="url(#lineGlow)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="lineGlow" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#5bf5d0" />
                    <stop offset="50%" stopColor="#7ad8ff" />
                    <stop offset="100%" stopColor="#c08cff" />
                  </linearGradient>
                  <linearGradient id="fillGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(90,245,210,0.26)" />
                    <stop offset="100%" stopColor="rgba(90,245,210,0)" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {content.metrics.map((metric) => (
              <Card
                key={metric.label}
                className="glass-panel border-white/10 bg-black/28 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-sm text-zinc-200">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`font-heading text-3xl ${metric.tone}`}>
                    <SignalCounter
                      value={metric.value}
                      decimals={metric.decimals}
                      prefix={
                        locale === "th" && metric.prefix === "+$"
                          ? "+฿"
                          : metric.prefix
                      }
                      suffix={metric.suffix}
                    />
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-300">
                    <ArrowUpRight className="size-3.5 text-emerald-200" />
                    {metric.trend} {content.trendSuffix}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative mt-4 grid gap-3 md:grid-cols-3">
          {content.insights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
            >
              <item.icon className="mb-2 size-4 text-cyan-200" />
              <p className="text-sm font-medium text-zinc-100">{item.title}</p>
              <p className="mt-1 text-xs text-zinc-400">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
