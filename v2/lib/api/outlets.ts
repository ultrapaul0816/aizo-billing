// MOCK MODE — replace with real API calls for production
import * as mock from "@/lib/mock/api";
import type {
  Category,
  Outlet,
  Product,
  Rider,
} from "./types";

export async function listOutlets(): Promise<Outlet[]> {
  return mock.listOutlets();
}

export async function toggleOutletStatus(body: Record<string, unknown>) {
  return mock.toggleOutletStatus(body);
}

export async function listCategories(body: Record<string, unknown>): Promise<Category[]> {
  return mock.listCategories(body);
}

export async function listProducts(body: Record<string, unknown>): Promise<Product[]> {
  return mock.listProducts(body);
}

export async function getRiders(body: Record<string, unknown>): Promise<Rider[]> {
  return mock.getRiders(body);
}

export async function assignRider(body: Record<string, unknown>) {
  return mock.assignRider(body);
}

export async function getTax(body: Record<string, unknown>) {
  return mock.getTax(body);
}

export async function getCharges() {
  return mock.getCharges();
}
