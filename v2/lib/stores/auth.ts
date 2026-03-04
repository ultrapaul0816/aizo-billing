import { create } from "zustand";
import type { LoginResponse } from "@/lib/api/types";

interface AuthState {
  token: string | null;
  user: { username: string; user_id: string; user_type: string } | null;
  brand: string | null;
  permissions: Record<string, boolean>;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

function getStoredAuth(): Pick<AuthState, "token" | "user" | "brand" | "permissions"> {
  if (typeof window === "undefined") {
    return { token: null, user: null, brand: null, permissions: {} };
  }
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { token: null, user: null, brand: null, permissions: {} };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
      brand: parsed.brand ?? null,
      permissions: parsed.permissions ?? {},
    };
  } catch {
    return { token: null, user: null, brand: null, permissions: {} };
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  ...getStoredAuth(),

  login: (data) => {
    const state = {
      token: data.token,
      user: {
        username: data.username,
        user_id: String(data.user_id),
        user_type: data.user_type,
      },
      brand: data.brand,
      permissions: data.permissions,
    };
    localStorage.setItem("user", JSON.stringify(state));
    set(state);
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ token: null, user: null, brand: null, permissions: {} });
  },

  isAuthenticated: () => get().token !== null,
}));
