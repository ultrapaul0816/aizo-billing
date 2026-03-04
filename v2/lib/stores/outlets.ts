import { create } from "zustand";

interface OutletUIState {
  selectedOutletId: string | null;
  panelCollapsed: boolean;
  selectOutlet: (id: string | null) => void;
  togglePanel: () => void;
}

export const useOutletUIStore = create<OutletUIState>()((set) => ({
  selectedOutletId: null,
  panelCollapsed: false,

  selectOutlet: (id) => set({ selectedOutletId: id }),
  togglePanel: () => set((s) => ({ panelCollapsed: !s.panelCollapsed })),
}));
