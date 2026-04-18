"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useInterfaceStore, type Locale } from "@/hooks/useStore";
import { trackEvent } from "@/lib/analytics";
import { Sparkles } from "lucide-react";

const navLabels: Record<Locale, { label: string; id: string }[]> = {
  en: [
    { label: "Pulse Deck", id: "mission" },
    { label: "Live Surface", id: "interface" },
    { label: "Forge Lab", id: "counterfactual-lab" },
    { label: "Modules", id: "modules" },
    { label: "Plans", id: "pricing" },
  ],
  th: [
    { label: "หน้าหลัก", id: "mission" },
    { label: "แดชบอร์ด", id: "interface" },
    { label: "แล็บจำลอง", id: "counterfactual-lab" },
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
    ctaShort: string;
  }
> = {
  en: {
    motion: "Motion",
    glowTurbo: "Glow Turbo",
    glowCalm: "Glow Calm",
    intensityLow: "Intensity 55%",
    intensityHigh: "Intensity 112%",
    cta: "Start Free Trial",
    ctaShort: "Start",
  },
  th: {
    motion: "แอนิเมชัน",
    glowTurbo: "แสงโหมดแรง",
    glowCalm: "แสงโหมดนิ่ง",
    intensityLow: "ความเข้ม 55%",
    intensityHigh: "ความเข้ม 112%",
    cta: "เริ่มทดลองใช้ฟรี",
    ctaShort: "เริ่ม",
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

  const jumpTo = (id: string, source: "desktop_nav" | "mobile_nav" | "brand" | "top_cta") => {
    const target = document.getElementById(id);
    if (!target) return;
    trackEvent("section_jump", { target: id, source });
    target.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto" });
  };

  const handleLocaleChange = (lang: Locale) => {
    setLocale(lang);
    trackEvent("language_switch", { locale: lang, source: "navbar" });
  };

  const labels = labelPack[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#090d1a]/66 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-8">
        <div className="flex items-center justify-between gap-3 md:grid md:grid-cols-[auto_1fr_auto] md:items-center">
          <button
            type="button"
            onClick={() => jumpTo("mission", "brand")}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-300/80 via-emerald-300/80 to-violet-300/80 text-[#07101f] shadow-[0_0_26px_rgb(108_237_255/0.4)]">
              <Sparkles className="size-4" />
            </div>
            <span className="truncate font-heading text-xs tracking-[0.22em] text-zinc-100/95 sm:text-sm sm:tracking-[0.25em]">
              NEUROTRADE
            </span>
            <span className="hidden rounded-full border border-emerald-200/20 bg-emerald-200/10 px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-100/85 sm:inline-flex">
              BETA
            </span>
          </button>

          <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
            {navLabels[locale].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => jumpTo(link.id, "desktop_nav")}
                className="group relative text-sm text-zinc-300 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-emerald-300 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 md:justify-self-end">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              {(["th", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLocaleChange(lang)}
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold transition-colors sm:px-2.5 sm:text-xs ${
                    locale === lang
                      ? "bg-cyan-200/20 text-cyan-100"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 xl:flex">
              {labels.motion}
              <Switch
                checked={motionEnabled}
                onCheckedChange={(checked) => setMotionEnabled(Boolean(checked))}
              />
            </label>

            <button
              type="button"
              onClick={toggleNeonBoost}
              className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-cyan-200/40 hover:text-cyan-100 lg:block"
            >
              {neonBoost ? labels.glowTurbo : labels.glowCalm}
            </button>

            <button
              type="button"
              onClick={() => setGlowLevel(glowLevel > 0.9 ? 0.55 : 1.12)}
              className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-emerald-200/40 hover:text-emerald-100 2xl:block"
            >
              {glowLevel > 0.9 ? labels.intensityLow : labels.intensityHigh}
            </button>

            <Button
              onClick={() => {
                trackEvent("cta_click", { cta: "top_nav_trial", source: "navbar" });
                jumpTo("ignite", "top_cta");
              }}
              className="pulse-glow h-8 rounded-full border border-emerald-200/30 bg-gradient-to-r from-emerald-300/90 via-cyan-300/90 to-violet-300/90 px-3 text-xs font-medium text-[#031021] transition-transform hover:scale-[1.03] sm:h-9 sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">{labels.ctaShort}</span>
              <span className="hidden sm:inline">{labels.cta}</span>
            </Button>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navLabels[locale].map((link) => (
            <button
              key={`${link.id}-mobile`}
              type="button"
              onClick={() => jumpTo(link.id, "mobile_nav")}
              className="shrink-0 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:border-cyan-200/40 hover:text-cyan-100"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
