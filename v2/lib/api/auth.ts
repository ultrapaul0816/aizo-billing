// MOCK MODE — replace with real API calls for production
import * as mock from "@/lib/mock/api";
import type { Customer, LoginResponse } from "./types";

export async function login(body: { username: string; password: string }): Promise<LoginResponse> {
  return mock.login(body);
}

export async function logout(): Promise<void> {
  return mock.logout();
}

export async function searchCustomer(body: Record<string, unknown>): Promise<Customer[]> {
  return mock.searchCustomer(body);
}

export async function getCustomerDetails(body: Record<string, unknown>) {
  return mock.getCustomerDetails(body);
}
