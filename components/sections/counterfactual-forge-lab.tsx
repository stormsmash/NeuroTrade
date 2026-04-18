"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import {
  BASELINE_PARAMS,
  buildCounterfactualReport,
  type OrderStyle,
  type RiskMode,
} from "@/lib/counterfactual-engine";
import { motion } from "framer-motion";
import { FlaskConical, Radar, Scaling, Timer } from "lucide-react";
import { useMemo, useState } from "react";

type CopyPack = {
  tag: string;
  heading: string;
  body: string;
  controlTitle: string;
  delayLabel: string;
  spreadLabel: string;
  orderLabel: string;
  riskLabel: string;
  baselineLabel: string;
  scenarioLabel: string;
  pnlDelta: string;
  winDelta: string;
  drawdownDelta: string;
  regretDelta: string;
  eventTitle: string;
  eventCol: string;
  eventBase: string;
  eventScenario: string;
  eventDelta: string;
  matrixTitle: string;
  matrixBody: string;
  matrixDelay: string;
  flippedLoss: string;
  flippedWin: string;
  unchanged: string;
  orderMap: Record<OrderStyle, string>;
  riskMap: Record<RiskMode, string>;
};

const copy: Record<Locale, CopyPack> = {
  en: {
    tag: "COUNTERFACTUAL FORGE LAB",
    heading: "Replay every trade in alternate execution timelines.",
    body: "Test impossible what-if branches: delay drift, order style shifts, and spread shock before they touch real capital.",
    controlTitle: "Scenario Controls",
    delayLabel: "Execution delay",
    spreadLabel: "Spread stress",
    orderLabel: "Order style",
    riskLabel: "Risk profile",
    baselineLabel: "Baseline",
    scenarioLabel: "Scenario",
    pnlDelta: "P&L delta",
    winDelta: "Win-rate delta",
    drawdownDelta: "Drawdown delta",
    regretDelta: "Execution regret delta",
    eventTitle: "Event Flip Radar",
    eventCol: "Market event",
    eventBase: "Baseline",
    eventScenario: "Scenario",
    eventDelta: "Delta",
    matrixTitle: "Latency x Order-Style Sensitivity",
    matrixBody:
      "Cells show projected P&L delta versus baseline. Green means better than baseline, violet means riskier.",
    matrixDelay: "Delay",
    flippedLoss: "Flipped to loss",
    flippedWin: "Flipped to win",
    unchanged: "Unchanged",
    orderMap: {
      market: "Market Sweep",
      smart_limit: "Smart Limit",
      passive_iceberg: "Passive Iceberg",
    },
    riskMap: {
      defensive: "Defensive",
      balanced: "Balanced",
      aggressive: "Aggressive",
    },
  },
  th: {
    tag: "COUNTERFACTUAL FORGE LAB",
    heading: "จำลองดีลเดิมในไทม์ไลน์การส่งคำสั่งแบบอื่นได้ทันที",
    body: "ทดสอบ what-if ที่ทำจริงยาก เช่น ความหน่วงที่เปลี่ยนไป รูปแบบคำสั่งต่างกัน และแรงกดจากสเปรด ก่อนเอาทุนจริงลงสนาม",
    controlTitle: "ตัวควบคุมสถานการณ์",
    delayLabel: "ความหน่วงการส่งคำสั่ง",
    spreadLabel: "แรงกดสเปรด",
    orderLabel: "รูปแบบคำสั่ง",
    riskLabel: "โหมดความเสี่ยง",
    baselineLabel: "ค่าฐาน",
    scenarioLabel: "สถานการณ์ใหม่",
    pnlDelta: "ส่วนต่างกำไรขาดทุน",
    winDelta: "ส่วนต่างอัตราชนะ",
    drawdownDelta: "ส่วนต่างดรอดาวน์",
    regretDelta: "ส่วนต่าง Execution Regret",
    eventTitle: "เรดาร์พลิกผลลัพธ์รายเหตุการณ์",
    eventCol: "เหตุการณ์ตลาด",
    eventBase: "ค่าฐาน",
    eventScenario: "สถานการณ์ใหม่",
    eventDelta: "ส่วนต่าง",
    matrixTitle: "เมทริกซ์ความไว: หน่วงเวลา x รูปแบบคำสั่ง",
    matrixBody:
      "แต่ละช่องคือส่วนต่าง P&L เทียบค่าฐาน สีเขียวคือดีกว่าเดิม สีม่วงคือเสี่ยงขึ้น",
    matrixDelay: "หน่วงเวลา",
    flippedLoss: "จากกำไรเป็นขาดทุน",
    flippedWin: "จากขาดทุนเป็นกำไร",
    unchanged: "ผลลัพธ์เดิม",
    orderMap: {
      market: "Market Sweep",
      smart_limit: "Smart Limit",
      passive_iceberg: "Passive Iceberg",
    },
    riskMap: {
      defensive: "ป้องกัน",
      balanced: "สมดุล",
      aggressive: "เชิงรุก",
    },
  },
};

const orderStyles: OrderStyle[] = ["market", "smart_limit", "passive_iceberg"];
const riskModes: RiskMode[] = ["defensive", "balanced", "aggressive"];

const formatCurrency = (value: number, locale: Locale) => {
  const sign = value < 0 ? "-" : "+";
  const currency = locale === "th" ? "฿" : "$";
  const magnitude = Math.abs(value).toLocaleString(locale === "th" ? "th-TH" : "en-US", {
    maximumFractionDigits: 0,
  });
  return `${sign}${currency}${magnitude}`;
};

const formatPercent = (value: number) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;

const badgeForFlip = (flipState: "unchanged" | "flipped_to_loss" | "flipped_to_win") => {
  if (flipState === "flipped_to_loss") return "bg-violet-300/15 text-violet-100";
  if (flipState === "flipped_to_win") return "bg-emerald-300/15 text-emerald-100";
  return "bg-white/10 text-zinc-200";
};

export function CounterfactualForgeLab() {
  const locale = useInterfaceStore((state) => state.locale);
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);
  const content = copy[locale];

  const [delayMs, setDelayMs] = useState(220);
  const [spreadMultiplier, setSpreadMultiplier] = useState(1.35);
  const [orderStyle, setOrderStyle] = useState<OrderStyle>("smart_limit");
  const [riskMode, setRiskMode] = useState<RiskMode>("balanced");

  const report = useMemo(
    () =>
      buildCounterfactualReport({
        delayMs,
        spreadMultiplier,
        orderStyle,
        riskMode,
      }),
    [delayMs, orderStyle, riskMode, spreadMultiplier]
  );

  return (
    <section id="counterfactual-lab" className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-xs tracking-[0.22em] text-cyan-100/70">{content.tag}</p>
        <h2 className="max-w-3xl font-heading text-3xl text-white md:text-4xl">
          {content.heading}
        </h2>
        <p className="max-w-3xl text-zinc-300">{content.body}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="glass-panel border-white/10 bg-black/28">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FlaskConical className="size-4 text-cyan-200" />
              {content.controlTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-200">
                <span className="inline-flex items-center gap-2">
                  <Timer className="size-4 text-cyan-200" />
                  {content.delayLabel}
                </span>
                <span>{delayMs} ms</span>
              </div>
              <input
                type="range"
                min={20}
                max={900}
                step={10}
                value={delayMs}
                onChange={(event) => setDelayMs(Number(event.target.value))}
                className="h-2 w-full accent-cyan-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-200">
                <span className="inline-flex items-center gap-2">
                  <Scaling className="size-4 text-violet-200" />
                  {content.spreadLabel}
                </span>
                <span>{spreadMultiplier.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.7}
                max={2.2}
                step={0.05}
                value={spreadMultiplier}
                onChange={(event) =>
                  setSpreadMultiplier(Number.parseFloat(event.target.value))
                }
                className="h-2 w-full accent-violet-300"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-200">{content.orderLabel}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {orderStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setOrderStyle(style)}
                    className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                      orderStyle === style
                        ? "border-cyan-200/40 bg-cyan-200/12 text-cyan-100"
                        : "border-white/15 bg-black/20 text-zinc-300 hover:border-white/30 hover:text-zinc-100"
                    }`}
                  >
                    {content.orderMap[style]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-zinc-200">{content.riskLabel}</p>
              <div className="grid grid-cols-3 gap-2">
                {riskModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setRiskMode(mode)}
                    className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                      riskMode === mode
                        ? "border-emerald-200/40 bg-emerald-200/12 text-emerald-100"
                        : "border-white/15 bg-black/20 text-zinc-300 hover:border-white/30 hover:text-zinc-100"
                    }`}
                  >
                    {content.riskMap[mode]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 rounded-2xl border border-white/12 bg-black/20 p-3 text-xs text-zinc-300 sm:grid-cols-2">
              <p>
                {content.baselineLabel}: {BASELINE_PARAMS.delayMs}ms /{" "}
                {content.orderMap[BASELINE_PARAMS.orderStyle]}
              </p>
              <p>
                {content.scenarioLabel}: {delayMs}ms / {content.orderMap[orderStyle]}
              </p>
            </div>
          </CardContent>
        </Card>

        <motion.div
          whileHover={motionEnabled ? { y: -4 } : undefined}
          transition={{ duration: 0.28 }}
          className="glass-panel neon-border rounded-[1.3rem] border border-white/10 bg-black/28 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              title={content.pnlDelta}
              value={formatCurrency(report.delta.pnl, locale)}
              tone={report.delta.pnl >= 0 ? "emerald" : "violet"}
            />
            <StatCard
              title={content.winDelta}
              value={formatPercent(report.delta.winRate)}
              tone={report.delta.winRate >= 0 ? "emerald" : "violet"}
            />
            <StatCard
              title={content.drawdownDelta}
              value={formatCurrency(report.delta.maxDrawdown, locale)}
              tone={report.delta.maxDrawdown <= 0 ? "emerald" : "violet"}
            />
            <StatCard
              title={content.regretDelta}
              value={`${report.delta.executionRegret >= 0 ? "+" : ""}${report.delta.executionRegret.toFixed(1)} bps`}
              tone={report.delta.executionRegret <= 0 ? "emerald" : "violet"}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/12 bg-black/24 p-3">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Radar className="size-4 text-cyan-200" />
              {content.eventTitle}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-xs">
                <thead className="text-zinc-400">
                  <tr>
                    <th className="pb-2 font-medium">{content.eventCol}</th>
                    <th className="pb-2 font-medium">{content.eventBase}</th>
                    <th className="pb-2 font-medium">{content.eventScenario}</th>
                    <th className="pb-2 font-medium">{content.eventDelta}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={row.id} className="border-t border-white/8 text-zinc-200">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span>{row.name}</span>
                          <Badge className={`text-[10px] ${badgeForFlip(row.flipState)}`}>
                            {row.flipState === "flipped_to_loss"
                              ? content.flippedLoss
                              : row.flipState === "flipped_to_win"
                                ? content.flippedWin
                                : content.unchanged}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-2">{formatCurrency(row.baselinePnl, locale)}</td>
                      <td className="py-2">{formatCurrency(row.scenarioPnl, locale)}</td>
                      <td className="py-2">{formatCurrency(row.deltaPnl, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass-panel mt-4 rounded-[1.3rem] border border-white/10 bg-black/26 p-4">
        <h3 className="font-heading text-lg text-white">{content.matrixTitle}</h3>
        <p className="mt-1 text-sm text-zinc-300">{content.matrixBody}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr>
                <th className="pb-2 pr-3 text-left font-medium text-zinc-400">
                  {content.matrixDelay}
                </th>
                {orderStyles.map((style) => (
                  <th key={style} className="pb-2 px-2 text-left font-medium text-zinc-300">
                    {content.orderMap[style]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[50, 140, 280, 500].map((delay) => (
                <tr key={delay} className="border-t border-white/8">
                  <td className="py-2 pr-3 text-zinc-300">{delay} ms</td>
                  {orderStyles.map((style) => {
                    const cell = report.sensitivity.find(
                      (point) => point.delayMs === delay && point.orderStyle === style
                    );
                    const value = cell?.deltaPnl ?? 0;
                    const colorClass =
                      value >= 0
                        ? "bg-emerald-300/12 text-emerald-100"
                        : "bg-violet-300/12 text-violet-100";
                    return (
                      <td key={`${delay}-${style}`} className="px-2 py-2">
                        <span className={`inline-block rounded-md px-2 py-1 ${colorClass}`}>
                          {formatCurrency(value, locale)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "emerald" | "violet";
}) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/24 px-3 py-3">
      <p className="text-[11px] text-zinc-400">{title}</p>
      <p className={`mt-1 font-heading text-2xl ${tone === "emerald" ? "text-emerald-100" : "text-violet-100"}`}>
        {value}
      </p>
    </div>
  );
}
