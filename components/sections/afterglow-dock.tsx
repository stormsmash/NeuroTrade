"use client";

import { useInterfaceStore, type Locale } from "@/hooks/useStore";

const copy: Record<
  Locale,
  { body: string; docs: string; changelog: string; security: string }
> = {
  en: {
    body: "NeuroTrade Labs. Built for focused traders.",
    docs: "Docs",
    changelog: "Changelog",
    security: "Security",
  },
  th: {
    body: "NeuroTrade Labs. สร้างมาเพื่อเทรดเดอร์ที่ต้องการความแม่นยำ",
    docs: "เอกสาร",
    changelog: "อัปเดตล่าสุด",
    security: "ความปลอดภัย",
  },
};

export function AfterglowDock() {
  const locale = useInterfaceStore((state) => state.locale);
  const content = copy[locale];

  return (
    <footer className="mx-auto mt-6 w-full max-w-7xl border-t border-white/10 px-4 pb-8 pt-6 md:px-8">
      <div className="flex flex-col gap-4 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl leading-relaxed">
          © {new Date().getFullYear()} {content.body}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="#" className="transition-colors hover:text-zinc-100">
            {content.docs}
          </a>
          <a href="#" className="transition-colors hover:text-zinc-100">
            {content.changelog}
          </a>
          <a href="#" className="transition-colors hover:text-zinc-100">
            {content.security}
          </a>
        </div>
      </div>
    </footer>
  );
}
