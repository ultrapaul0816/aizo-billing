import { create } from "zustand";

interface OrderUIState {
  selectedOrderId: string | null;
  statusFilter: string;
  sourceFilter: string;
  searchQuery: string;
  statsBarCollapsed: boolean;
  selectOrder: (id: string | null) => void;
  setStatusFilter: (f: string) => void;
  setSourceFilter: (f: string) => void;
  setSearchQuery: (q: string) => void;
  toggleStatsBar: () => void;
}

export const useOrderUIStore = create<OrderUIState>()((set) => ({
  selectedOrderId: null,
  statusFilter: "all",
  sourceFilter: "all",
  searchQuery: "",
  statsBarCollapsed: false,

  selectOrder: (id) => set({ selectedOrderId: id }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setSourceFilter: (f) => set({ sourceFilter: f }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleStatsBar: () => set((s) => ({ statsBarCollapsed: !s.statsBarCollapsed })),
}));
