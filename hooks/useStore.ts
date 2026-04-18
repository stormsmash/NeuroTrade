import { create } from "zustand";

type CursorPoint = {
  x: number;
  y: number;
};

export type Locale = "en" | "th";

type InterfaceState = {
  locale: Locale;
  motionEnabled: boolean;
  neonBoost: boolean;
  glowLevel: number;
  cursor: CursorPoint;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setMotionEnabled: (enabled: boolean) => void;
  toggleNeonBoost: () => void;
  setGlowLevel: (value: number) => void;
  setCursor: (point: CursorPoint) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useInterfaceStore = create<InterfaceState>((set) => ({
  locale: "en",
  motionEnabled: true,
  neonBoost: true,
  glowLevel: 0.8,
  cursor: { x: 0, y: 0 },
  setLocale: (locale) => set({ locale }),
  toggleLocale: () =>
    set((state) => ({ locale: state.locale === "en" ? "th" : "en" })),
  setMotionEnabled: (enabled) => set({ motionEnabled: enabled }),
  toggleNeonBoost: () => set((state) => ({ neonBoost: !state.neonBoost })),
  setGlowLevel: (value) => set({ glowLevel: clamp(value, 0.35, 1.25) }),
  setCursor: (point) =>
    set({
      // Keep cursor data normalized so motion math stays predictable everywhere.
      cursor: {
        x: clamp(point.x, -1, 1),
        y: clamp(point.y, -1, 1),
      },
    }),
}));
