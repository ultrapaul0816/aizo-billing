import { apiClient, apiV2Client, post } from "./client";
import { getBrand } from "@/lib/utils";
import type {
  ApiResponse,
  Category,
  Outlet,
  Product,
  Rider,
} from "./types";

export async function listOutlets(): Promise<Outlet[]> {
  const brand = getBrand();
  const res = await apiClient.get<ApiResponse<Outlet[]>>(`/outletmgmt/list/?brand=${brand}`);
  return res.data.data;
}

export async function toggleOutletStatus(body: Record<string, unknown>) {
  return post<unknown>("/outletmgmt/IsOpen/", body);
}

export async function listCategories(body: Record<string, unknown>): Promise<Category[]> {
  return post<Category[]>("/outletmgmt/Categorylist/", body);
}

export async function listProducts(body: Record<string, unknown>): Promise<Product[]> {
  return post<Product[]>("/outletmgmt/Productlist/", body);
}

export async function getRiders(body: Record<string, unknown>): Promise<Rider[]> {
  return post<Rider[]>("/rider/outletwiserider/", body);
}

export async function assignRider(body: Record<string, unknown>) {
  return post<unknown>("/rider/outletwiserider/assign/", body);
}

export async function getTax(body: Record<string, unknown>) {
  const res = await apiV2Client.post<ApiResponse<unknown>>("/listing/tax/", body);
  return res.data.data;
}

export async function getCharges() {
  const res = await apiClient.get<ApiResponse<unknown>>("/package/charge/");
  return res.data.data;
}
