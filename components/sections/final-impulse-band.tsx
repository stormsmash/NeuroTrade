"use client";

import { Button } from "@/components/ui/button";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const copy: Record<
  Locale,
  {
    tag: string;
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  en: {
    tag: "NEXT MOVE STARTS HERE",
    heading:
      "Let your next trade be guided by signal intelligence, not market panic.",
    body: "Plug your exchange, calibrate risk posture, and start simulating strategies in under five minutes.",
    primaryCta: "Activate Free Trial",
    secondaryCta: "Book a Live Walkthrough",
  },
  th: {
    tag: "เริ่มจังหวะถัดไปของคุณที่นี่",
    heading: "ให้การเทรดครั้งถัดไปขับเคลื่อนด้วยสัญญาณอัจฉริยะ ไม่ใช่อารมณ์ตลาด",
    body: "เชื่อมบัญชีเทรด ปรับความเสี่ยงให้เหมาะ แล้วเริ่มจำลองกลยุทธ์ได้ภายในไม่กี่นาที",
    primaryCta: "เปิดใช้ฟรีทันที",
    secondaryCta: "จองเดโมแบบสด",
  },
};

export function FinalImpulseBand() {
  const locale = useInterfaceStore((state) => state.locale);
  const content = copy[locale];

  return (
    <section id="ignite" className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel neon-border relative overflow-hidden rounded-[2rem] px-6 py-14 text-center md:px-10"
      >
        <div className="hero-orb left-[-90px] top-[-80px] size-[260px] bg-cyan-300/28" />
        <div className="hero-orb bottom-[-100px] right-[-70px] size-[260px] bg-violet-300/26" />

        <p className="text-xs tracking-[0.2em] text-emerald-100/80">{content.tag}</p>
        <h3 className="mx-auto mt-4 max-w-3xl text-balance font-heading text-3xl text-white md:text-5xl">
          {content.heading}
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-zinc-300">{content.body}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="h-11 rounded-full border border-emerald-200/30 bg-gradient-to-r from-emerald-300/95 via-cyan-300/95 to-violet-300/95 px-6 font-semibold text-[#031024]">
            {content.primaryCta}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full border-white/20 bg-white/5 px-6 text-zinc-100 hover:bg-white/10"
          >
            {content.secondaryCta}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
