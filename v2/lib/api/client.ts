import axios, { type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://zapio-admin.com/api/pos";

// ── Primary client (v1 — /api/pos) ──

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── V2 client ──

export const apiV2Client = axios.create({
  baseURL: "https://zapio-admin.com/api/v2",
  headers: { "Content-Type": "application/json" },
});

// ── Auth interceptors ──

function attachToken(config: AxiosRequestConfig) {
  if (typeof window === "undefined") return config;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)["Authorization"] = `Token ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
}

apiClient.interceptors.request.use(attachToken as never);
apiV2Client.interceptors.request.use(attachToken as never);

function handle401(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
}

apiClient.interceptors.response.use((r) => r, handle401);
apiV2Client.interceptors.response.use((r) => r, handle401);

// ── Typed helpers ──

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, config);
  return res.data.data;
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<ApiResponse<T>>(url, body, config);
  return res.data.data;
}

export async function patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<ApiResponse<T>>(url, body, config);
  return res.data.data;
}
