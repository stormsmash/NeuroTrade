"use client";

import { cn } from "@/lib/utils";
import { useInterfaceStore } from "@/hooks/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AfterglowDock } from "./afterglow-dock";
import { CounterfactualForgeLab } from "./counterfactual-forge-lab";
import { EdgeLattice } from "./edge-lattice";
import { EngagementTelemetry } from "./engagement-telemetry";
import { FinalImpulseBand } from "./final-impulse-band";
import { FluxPulseNav } from "./flux-pulse-nav";
import { QuantumDeskPanel } from "./quantum-desk-panel";
import { SignalHeroArc } from "./signal-hero-arc";
import { StellarLoader } from "./stellar-loader";
import { TriadSignalPricing } from "./triad-signal-pricing";

export function NeonCitadelLanding() {
  const [booting, setBooting] = useState(true);
  const neonBoost = useInterfaceStore((state) => state.neonBoost);
  const glowLevel = useInterfaceStore((state) => state.glowLevel);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={cn("relative overflow-x-clip", neonBoost && "neon-boost")}>
      <EngagementTelemetry />
      <AnimatePresence>{booting ? <StellarLoader /> : null}</AnimatePresence>

      <div className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="hero-orb left-[-220px] top-[14%] size-[520px] bg-cyan-300/20"
          style={{ opacity: 0.22 + glowLevel * 0.22 }}
        />
        <div
          className="hero-orb right-[-240px] top-[24%] size-[560px] bg-violet-300/24"
          style={{ opacity: 0.2 + glowLevel * 0.2 }}
        />
      </div>

      <FluxPulseNav />

      <motion.main
        animate={{
          opacity: booting ? 0 : 1,
          filter: booting ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <SignalHeroArc />
        <QuantumDeskPanel />
        <CounterfactualForgeLab />
        <EdgeLattice />
        <TriadSignalPricing />
        <FinalImpulseBand />
      </motion.main>

      <AfterglowDock />
    </div>
  );
}
