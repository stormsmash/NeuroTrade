"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { Sparkles } from "lucide-react";

const navLabels: Record<Locale, { label: string; id: string }[]> = {
  en: [
    { label: "Pulse Deck", id: "mission" },
    { label: "Live Surface", id: "interface" },
    { label: "Modules", id: "modules" },
    { label: "Plans", id: "pricing" },
  ],
  th: [
    { label: "หน้าหลัก", id: "mission" },
    { label: "แดชบอร์ด", id: "interface" },
    { label: "ฟีเจอร์", id: "modules" },
    { label: "แพ็กเกจ", id: "pricing" },
  ],
};

const labelPack: Record<
  Locale,
  {
    motion: string;
    glowTurbo: string;
    glowCalm: string;
    intensityLow: string;
    intensityHigh: string;
    cta: string;
  }
> = {
  en: {
    motion: "Motion",
    glowTurbo: "Glow Turbo",
    glowCalm: "Glow Calm",
    intensityLow: "Intensity 55%",
    intensityHigh: "Intensity 112%",
    cta: "Start Free Trial",
  },
  th: {
    motion: "แอนิเมชัน",
    glowTurbo: "แสงโหมดแรง",
    glowCalm: "แสงโหมดนิ่ง",
    intensityLow: "ความเข้ม 55%",
    intensityHigh: "ความเข้ม 112%",
    cta: "เริ่มทดลองใช้ฟรี",
  },
};

export function FluxPulseNav() {
  const locale = useInterfaceStore((state) => state.locale);
  const setLocale = useInterfaceStore((state) => state.setLocale);
  const motionEnabled = useInterfaceStore((state) => state.motionEnabled);
  const setMotionEnabled = useInterfaceStore((state) => state.setMotionEnabled);
  const neonBoost = useInterfaceStore((state) => state.neonBoost);
  const toggleNeonBoost = useInterfaceStore((state) => state.toggleNeonBoost);
  const glowLevel = useInterfaceStore((state) => state.glowLevel);
  const setGlowLevel = useInterfaceStore((state) => state.setGlowLevel);

  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto" });
  };

  const labels = labelPack[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#090d1a]/66 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => jumpTo("mission")}
          className="group flex items-center gap-3"
        >
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-300/80 via-emerald-300/80 to-violet-300/80 text-[#07101f] shadow-[0_0_26px_rgb(108_237_255/0.4)]">
            <Sparkles className="size-4" />
          </div>
          <span className="font-heading text-sm tracking-[0.25em] text-zinc-100/95">
            NEUROTRADE
          </span>
          <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-100/85">
            BETA
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {navLabels[locale].map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => jumpTo(link.id)}
              className="group relative text-sm text-zinc-300 transition-colors duration-300 hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-emerald-300 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            {(["th", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  locale === lang
                    ? "bg-cyan-200/20 text-cyan-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 lg:flex">
            {labels.motion}
            <Switch
              checked={motionEnabled}
              onCheckedChange={(checked) => setMotionEnabled(Boolean(checked))}
            />
          </label>

          <button
            type="button"
            onClick={toggleNeonBoost}
            className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-cyan-200/40 hover:text-cyan-100 md:block"
          >
            {neonBoost ? labels.glowTurbo : labels.glowCalm}
          </button>

          <button
            type="button"
            onClick={() => setGlowLevel(glowLevel > 0.9 ? 0.55 : 1.12)}
            className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-emerald-200/40 hover:text-emerald-100 xl:block"
          >
            {glowLevel > 0.9 ? labels.intensityLow : labels.intensityHigh}
          </button>

          <Button
            onClick={() => jumpTo("ignite")}
            className="pulse-glow h-9 rounded-full border border-emerald-200/30 bg-gradient-to-r from-emerald-300/90 via-cyan-300/90 to-violet-300/90 px-4 font-medium text-[#031021] transition-transform hover:scale-[1.03]"
          >
            {labels.cta}
          </Button>
        </div>
      </div>
    </header>
  );
}
