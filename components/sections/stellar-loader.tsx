"use client";

import { useInterfaceStore } from "@/hooks/useStore";
import { motion } from "framer-motion";

export function StellarLoader() {
  const locale = useInterfaceStore((state) => state.locale);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
      className="fixed inset-0 z-[80] grid place-items-center bg-[#040812]"
    >
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity }}
          className="relative size-28 rounded-full border border-cyan-300/35"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            className="absolute inset-2 rounded-full border border-emerald-300/45"
          />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{ duration: 3.8, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-300/60 via-emerald-300/55 to-violet-300/60 blur-sm"
          />
        </motion.div>

        <div className="space-y-2 text-center">
          <p className="font-heading text-xs tracking-[0.38em] text-cyan-100/80">
            NEUROTRADE CORE
          </p>
          <p className="text-sm text-zinc-300/80">
            {locale === "th"
              ? "กำลังซิงก์โครงข่ายสัญญาณอัจฉริยะ..."
              : "Synchronizing predictive signal mesh..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
