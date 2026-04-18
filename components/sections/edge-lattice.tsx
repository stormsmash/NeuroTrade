"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  GaugeCircle,
  Orbit,
  Radar,
  ShieldCheck,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FeatureNode = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

const nodes: Record<Locale, FeatureNode[]> = {
  en: [
    {
      title: "Adaptive Market Memory",
      detail:
        "Learns regime shifts from microstructure flow without overfitting to noise.",
      icon: BrainCircuit,
    },
    {
      title: "Volatility Pulse Routing",
      detail:
        "Rebalances route priority when liquidity thins, preserving entry quality.",
      icon: Radar,
    },
    {
      title: "Latency Heatmapping",
      detail:
        "Visualizes infrastructure drag by exchange, pair, and strategy shard.",
      icon: GaugeCircle,
    },
    {
      title: "Risk Prism",
      detail:
        "Stress tests each signal against downside clusters before order fire.",
      icon: ShieldCheck,
    },
    {
      title: "Cross-Asset Sync",
      detail: "Maps momentum drift between spot, perp, and options in one surface.",
      icon: Orbit,
    },
    {
      title: "Signal Waveform",
      detail:
        "Interpretable confidence wave helps teams challenge AI decisions quickly.",
      icon: Waves,
    },
  ],
  th: [
    {
      title: "หน่วยความจำตลาดแบบปรับตัว",
      detail: "เรียนรู้การเปลี่ยนรอบตลาดจากข้อมูลจุลภาค โดยไม่หลงไปกับสัญญาณรบกวน",
      icon: BrainCircuit,
    },
    {
      title: "เส้นทางคำสั่งตามความผันผวน",
      detail: "ปรับลำดับเส้นทางคำสั่งอัตโนมัติเมื่อสภาพคล่องบางลง เพื่อคงคุณภาพการเข้าไม้",
      icon: Radar,
    },
    {
      title: "แผนที่ความหน่วงระบบ",
      detail: "เห็นคอขวดโครงสร้างพื้นฐานตามตลาด คู่เทรด และกลยุทธ์แบบละเอียด",
      icon: GaugeCircle,
    },
    {
      title: "Risk Prism",
      detail: "ทดสอบสัญญาณกับกลุ่มความเสี่ยงขาลงก่อนส่งคำสั่งจริง",
      icon: ShieldCheck,
    },
    {
      title: "ซิงก์ข้ามสินทรัพย์",
      detail: "เชื่อมโมเมนตัมระหว่าง Spot, Perp และ Options ในหน้าจอเดียว",
      icon: Orbit,
    },
    {
      title: "คลื่นความเชื่อมั่นสัญญาณ",
      detail: "แสดงระดับความมั่นใจแบบตีความได้ เพื่อให้ทีมทวนสอบการตัดสินใจ AI ได้เร็ว",
      icon: Waves,
    },
  ],
};

const copy: Record<Locale, { tag: string; heading: string; body: string }> = {
  en: {
    tag: "SIGNAL MODULES",
    heading: "Built for desks that move before consensus does.",
    body: "Each module can run solo or as part of your macro-to-micro execution pipeline.",
  },
  th: {
    tag: "โมดูลสัญญาณ",
    heading: "ออกแบบเพื่อทีมเทรดที่ขยับก่อนตลาดรู้ตัว",
    body: "ทุกโมดูลทำงานเดี่ยวได้ หรือเชื่อมเป็นสายงานเทรดจากมุมมองใหญ่สู่จุดเข้าออกจริง",
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const childReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function EdgeLattice() {
  const locale = useInterfaceStore((state) => state.locale);
  const content = copy[locale];

  return (
    <section id="modules" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-9 max-w-2xl space-y-3">
        <p className="text-xs tracking-[0.22em] text-violet-100/70">{content.tag}</p>
        <h2 className="font-heading text-3xl text-white md:text-4xl">
          {content.heading}
        </h2>
        <p className="text-zinc-300">{content.body}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {nodes[locale].map((node, index) => (
          <motion.div
            key={node.title}
            variants={childReveal}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.55 }}
            className={index % 3 === 1 ? "xl:translate-y-6" : ""}
          >
            <Card className="glass-panel h-full border-white/10 bg-black/24 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgb(130_255_227/0.25),0_24px_60px_rgb(7_16_30/0.45)]">
              <CardHeader>
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300/25 via-emerald-300/20 to-violet-300/25 text-cyan-100">
                  <node.icon className="size-5" />
                </div>
                <CardTitle className="text-white">{node.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{node.detail}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
