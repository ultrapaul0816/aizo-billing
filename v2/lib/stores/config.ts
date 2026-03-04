import { create } from "zustand";
import type { OrderSource } from "@/lib/api/types";

interface ConfigState {
  orderSources: OrderSource[];
  charges: unknown[];
  taxes: unknown[];
  brandInfo: Record<string, unknown>;
  soundEnabled: boolean;
  setOrderSources: (s: OrderSource[]) => void;
  setCharges: (c: unknown[]) => void;
  setTaxes: (t: unknown[]) => void;
  setBrandInfo: (b: Record<string, unknown>) => void;
  toggleSound: () => void;
}

function getStoredSoundPref(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem("soundEnabled");
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export const useConfigStore = create<ConfigState>()((set) => ({
  orderSources: [],
  charges: [],
  taxes: [],
  brandInfo: {},
  soundEnabled: getStoredSoundPref(),

  setOrderSources: (s) => set({ orderSources: s }),
  setCharges: (c) => set({ charges: c }),
  setTaxes: (t) => set({ taxes: t }),
  setBrandInfo: (b) => set({ brandInfo: b }),
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      localStorage.setItem("soundEnabled", String(next));
      return { soundEnabled: next };
    }),
}));
