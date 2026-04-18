"use client";

import { Button } from "@/components/ui/button";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const copy: Record<
  Locale,
  {
    tag: string;
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    intentLabel: string;
    intentTrial: string;
    intentDemo: string;
    submitLabel: string;
    successMessage: string;
    errorRequired: string;
    errorEmail: string;
    disclaimer: string;
  }
> = {
  en: {
    tag: "NEXT MOVE STARTS HERE",
    heading:
      "Let your next trade be guided by signal intelligence, not market panic.",
    body: "Plug your exchange, calibrate risk posture, and start simulating strategies in under five minutes.",
    primaryCta: "Activate Free Trial",
    secondaryCta: "Book a Live Walkthrough",
    formTitle: "Get Priority Access",
    nameLabel: "Name",
    namePlaceholder: "Alex Morgan",
    emailLabel: "Work email",
    emailPlaceholder: "alex@fund.io",
    intentLabel: "I want to",
    intentTrial: "Start free trial",
    intentDemo: "Book live demo",
    submitLabel: "Request Access",
    successMessage:
      "Request received. Our team will send your access link shortly.",
    errorRequired: "Please fill in your name and email.",
    errorEmail: "Please enter a valid email address.",
    disclaimer:
      "By submitting, you agree to product updates. Educational simulation platform, not financial advice.",
  },
  th: {
    tag: "เริ่มจังหวะถัดไปของคุณที่นี่",
    heading: "ให้การเทรดครั้งถัดไปขับเคลื่อนด้วยสัญญาณอัจฉริยะ ไม่ใช่อารมณ์ตลาด",
    body: "เชื่อมบัญชีเทรด ปรับความเสี่ยงให้เหมาะ แล้วเริ่มจำลองกลยุทธ์ได้ภายในไม่กี่นาที",
    primaryCta: "เปิดใช้ฟรีทันที",
    secondaryCta: "จองเดโมแบบสด",
    formTitle: "ขอสิทธิ์ใช้งานก่อนใคร",
    nameLabel: "ชื่อ",
    namePlaceholder: "กานต์ ภัทร",
    emailLabel: "อีเมลสำหรับติดต่อ",
    emailPlaceholder: "kant@fund.io",
    intentLabel: "ต้องการ",
    intentTrial: "เริ่มทดลองใช้ฟรี",
    intentDemo: "จองเดโมแบบสด",
    submitLabel: "ส่งคำขอ",
    successMessage: "รับคำขอเรียบร้อยแล้ว ทีมงานจะส่งลิงก์เข้าใช้งานให้เร็วที่สุด",
    errorRequired: "กรุณากรอกชื่อและอีเมลให้ครบ",
    errorEmail: "กรุณากรอกอีเมลให้ถูกต้อง",
    disclaimer:
      "เมื่อส่งคำขอ คุณยอมรับการรับอัปเดตจากผลิตภัณฑ์ แพลตฟอร์มนี้ใช้เพื่อการจำลองเชิงการศึกษา ไม่ใช่คำแนะนำการลงทุน",
  },
};

export function FinalImpulseBand() {
  const locale = useInterfaceStore((state) => state.locale);
  const content = copy[locale];
  const [leadIntent, setLeadIntent] = useState<"trial" | "demo">("trial");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const handleLeadIntentClick = (intent: "trial" | "demo") => {
    setLeadIntent(intent);
    setStatus("idle");
    setErrorMessage("");
    trackEvent("cta_click", { cta: intent === "trial" ? "final_trial" : "final_demo", source: "final_band" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus("error");
      setErrorMessage(content.errorRequired);
      trackEvent("lead_submit_error", {
        source: "final_band",
        reason: "required_fields",
      });
      return;
    }

    if (!isEmailValid) {
      setStatus("error");
      setErrorMessage(content.errorEmail);
      trackEvent("lead_submit_error", {
        source: "final_band",
        reason: "invalid_email",
      });
      return;
    }

    const emailDomain = email.trim().split("@")[1] ?? "unknown";
    trackEvent("lead_submit", {
      source: "final_band",
      intent: leadIntent,
      locale,
      email_domain: emailDomain,
    });
    setStatus("success");
    setErrorMessage("");
  };

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

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => handleLeadIntentClick("trial")}
            className={`h-11 rounded-full border px-6 font-semibold text-[#031024] ${
              leadIntent === "trial"
                ? "border-emerald-200/40 bg-gradient-to-r from-emerald-300/95 via-cyan-300/95 to-violet-300/95"
                : "border-white/20 bg-white/10 text-zinc-100"
            }`}
          >
            {content.primaryCta}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            type="button"
            onClick={() => handleLeadIntentClick("demo")}
            variant="outline"
            className={`h-11 rounded-full border px-6 text-zinc-100 hover:bg-white/10 ${
              leadIntent === "demo"
                ? "border-cyan-200/45 bg-cyan-200/12"
                : "border-white/20 bg-white/5"
            }`}
          >
            {content.secondaryCta}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 grid max-w-3xl gap-3 rounded-2xl border border-white/12 bg-black/25 p-4 text-left sm:grid-cols-2 sm:p-5"
          noValidate
        >
          <p className="sm:col-span-2 text-sm font-medium text-zinc-100">
            {content.formTitle}
          </p>

          <div className="space-y-1">
            <label htmlFor="lead-name" className="text-xs text-zinc-300">
              {content.nameLabel}
            </label>
            <input
              id="lead-name"
              name="lead-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              autoComplete="name"
              placeholder={content.namePlaceholder}
              className="h-10 w-full rounded-xl border border-white/16 bg-white/5 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/25"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="lead-email" className="text-xs text-zinc-300">
              {content.emailLabel}
            </label>
            <input
              id="lead-email"
              name="lead-email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              autoComplete="email"
              placeholder={content.emailPlaceholder}
              className="h-10 w-full rounded-xl border border-white/16 bg-white/5 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/25"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="lead-intent" className="text-xs text-zinc-300">
              {content.intentLabel}
            </label>
            <select
              id="lead-intent"
              name="lead-intent"
              value={leadIntent}
              onChange={(event) => {
                const nextIntent = event.target.value as "trial" | "demo";
                setLeadIntent(nextIntent);
                if (status !== "idle") setStatus("idle");
              }}
              className="h-10 w-full rounded-xl border border-white/16 bg-[#111827] px-3 text-sm text-zinc-100 focus-visible:border-cyan-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/25"
            >
              <option value="trial">{content.intentTrial}</option>
              <option value="demo">{content.intentDemo}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="h-11 w-full rounded-full border border-emerald-200/35 bg-gradient-to-r from-emerald-300/95 via-cyan-300/95 to-violet-300/95 px-6 font-semibold text-[#031024]"
            >
              {content.submitLabel}
            </Button>
          </div>

          <div className="sm:col-span-2" aria-live="polite">
            {status === "success" ? (
              <p className="text-sm text-emerald-200">{content.successMessage}</p>
            ) : null}
            {status === "error" ? (
              <p className="text-sm text-rose-200">{errorMessage}</p>
            ) : null}
            {status === "idle" ? (
              <p className="text-xs text-zinc-400">{content.disclaimer}</p>
            ) : null}
          </div>
        </form>
      </motion.div>
    </section>
  );
}
