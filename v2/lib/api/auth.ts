import { apiClient } from "./client";
import type { ApiResponse, Customer, LoginResponse } from "./types";

export async function login(body: { username: string; password: string }): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/user/login/", body, {
    // Login must not send an Authorization header
    transformRequest: [
      (data: unknown) => JSON.stringify(data),
    ],
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function logout(): Promise<void> {
  const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const token = raw ? JSON.parse(raw).token : "";
  await apiClient.post("/user/logout/", { token });
}

export async function searchCustomer(body: Record<string, unknown>): Promise<Customer[]> {
  const res = await apiClient.post<ApiResponse<Customer[]>>("/customer/list/", body);
  return res.data.data;
}

export async function getCustomerDetails(body: Record<string, unknown>) {
  const res = await apiClient.post<ApiResponse<unknown>>("/customer/order/", body);
  return res.data.data;
}
