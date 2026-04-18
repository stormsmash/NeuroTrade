"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  tagline: string;
  perks: string[];
  highlighted?: boolean;
};

const plans: Record<Locale, Plan[]> = {
  en: [
    {
      name: "Scout",
      price: "$39",
      tagline: "For solo traders who want clean AI bias checks.",
      perks: [
        "3 strategy playbooks",
        "Realtime dashboard",
        "Daily signal digest",
        "Basic risk alerts",
      ],
    },
    {
      name: "Vector",
      price: "$99",
      tagline: "For high-frequency thinkers running multi-pair stacks.",
      perks: [
        "Unlimited playbooks",
        "Live confidence waveform",
        "Cross-asset sync + hedging cues",
        "Priority execution routing",
      ],
      highlighted: true,
    },
    {
      name: "Apex Desk",
      price: "$249",
      tagline: "For teams that run blended discretionary + systematic flow.",
      perks: [
        "Team workspaces",
        "API + webhook automation",
        "Custom risk constraints",
        "White-glove migration support",
      ],
    },
  ],
  th: [
    {
      name: "Scout",
      price: "$39",
      tagline: "สำหรับเทรดเดอร์เดี่ยวที่ต้องการ AI คัดสัญญาณอย่างชัดเจน",
      perks: [
        "เพลย์บุ๊กกลยุทธ์ 3 แบบ",
        "แดชบอร์ดเรียลไทม์",
        "สรุปสัญญาณรายวัน",
        "แจ้งเตือนความเสี่ยงพื้นฐาน",
      ],
    },
    {
      name: "Vector",
      price: "$99",
      tagline: "สำหรับสายความเร็วสูงที่เทรดหลายคู่พร้อมกัน",
      perks: [
        "เพลย์บุ๊กไม่จำกัด",
        "คลื่นความมั่นใจแบบสด",
        "ซิงก์ข้ามสินทรัพย์ + คำแนะนำเฮดจ์",
        "เส้นทางส่งคำสั่งแบบลำดับความสำคัญ",
      ],
      highlighted: true,
    },
    {
      name: "Apex Desk",
      price: "$249",
      tagline: "สำหรับทีมเทรดที่ผสานแนวทางคนและระบบอัตโนมัติ",
      perks: [
        "พื้นที่ทำงานสำหรับทีม",
        "API + ระบบเว็บฮุค",
        "ตั้งข้อจำกัดความเสี่ยงแบบกำหนดเอง",
        "ช่วยย้ายระบบแบบใกล้ชิด",
      ],
    },
  ],
};

const copy: Record<
  Locale,
  {
    tag: string;
    heading: string;
    body: string;
    highlightBadge: string;
    choose: string;
    month: string;
  }
> = {
  en: {
    tag: "PRICING ARCHITECTURE",
    heading: "Pricing that scales with your trading ambition.",
    body: "Start lean, graduate fast, and keep every signal path transparent.",
    highlightBadge: "Most Chosen",
    choose: "Choose",
    month: "/mo",
  },
  th: {
    tag: "โครงสร้างราคา",
    heading: "แพ็กเกจที่เติบโตไปพร้อมกับเป้าหมายการเทรดของคุณ",
    body: "เริ่มแบบกระชับ ขยายได้เร็ว และเห็นเส้นทางของทุกสัญญาณอย่างโปร่งใส",
    highlightBadge: "ยอดนิยมที่สุด",
    choose: "เลือกแพ็กเกจ",
    month: "/เดือน",
  },
};

export function TriadSignalPricing() {
  const locale = useInterfaceStore((state) => state.locale);
  const content = copy[locale];

  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-xs tracking-[0.22em] text-emerald-100/70">{content.tag}</p>
        <h2 className="font-heading text-3xl text-white md:text-4xl">
          {content.heading}
        </h2>
        <p className="mx-auto max-w-2xl text-zinc-300">{content.body}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans[locale].map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08, duration: 0.55, ease: "easeOut" }}
            whileHover={{ y: -8 }}
          >
            <Card
              className={`glass-panel relative h-full border-white/10 bg-black/26 transition-all duration-300 ${
                plan.highlighted
                  ? "neon-border border-cyan-200/20 bg-gradient-to-b from-cyan-300/10 via-black/26 to-violet-300/10"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute right-4 top-4 rounded-full border border-cyan-200/30 bg-cyan-200/15 px-3 py-1 text-xs text-cyan-100">
                  {content.highlightBadge}
                </Badge>
              )}

              <CardHeader className="border-b border-white/10 pb-5">
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription className="text-zinc-300">
                  {plan.tagline}
                </CardDescription>
                <p className="font-heading text-4xl text-white">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-zinc-400">
                    {content.month}
                  </span>
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-5">
                {plan.perks.map((perk) => (
                  <p key={perk} className="flex items-start gap-2 text-sm text-zinc-200">
                    <Check className="mt-0.5 size-4 text-emerald-200" />
                    <span>{perk}</span>
                  </p>
                ))}
              </CardContent>

              <CardFooter className="mt-auto border-t border-white/10 bg-transparent pt-4">
                <Button
                  className={`h-10 w-full rounded-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-emerald-300/95 via-cyan-300/95 to-violet-300/95 text-[#031024]"
                      : "border border-white/20 bg-white/6 text-zinc-100 hover:bg-white/10"
                  }`}
                >
                  {content.choose} {plan.name}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
