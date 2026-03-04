// MOCK MODE — replace with real API calls for production
import * as mock from "@/lib/mock/api";
import type {
  Order,
  OrderSource,
  PaymentMethod,
} from "./types";

export async function fetchAllOrders(): Promise<Order[]> {
  return mock.fetchAllOrders();
}

export async function getOrderDetails(body: Record<string, unknown>) {
  return mock.getOrderDetails(body);
}

export async function changeOrderStatus(body: Record<string, unknown>) {
  return mock.changeOrderStatus(body);
}

export async function pollNewOrders() {
  return mock.pollNewOrders();
}

export async function cancelOrder(body: { id: number; order_cancel_reason: string }) {
  return mock.cancelOrder(body);
}

export async function placeOrder(body: Record<string, unknown>) {
  return mock.placeOrder(body);
}

export async function editOrder(body: Record<string, unknown>) {
  return mock.editOrder(body);
}

export async function settleOrder(body: Record<string, unknown>) {
  return mock.settleOrder(body);
}

export async function getDiscounts(body: Record<string, unknown>) {
  return mock.getDiscounts(body);
}

export async function getCoupon(body: Record<string, unknown>) {
  return mock.getCoupon(body);
}

export async function getPaymentMethods(body: Record<string, unknown>): Promise<PaymentMethod[]> {
  return mock.getPaymentMethods(body);
}

export async function getReceiptConfig(body: Record<string, unknown>) {
  return mock.getReceiptConfig(body);
}

export async function getOrderSource(): Promise<OrderSource[]> {
  return mock.getOrderSource();
}

export async function getOrderReport(body: Record<string, unknown>) {
  return mock.getOrderReport(body);
}

export async function getOrdersCSV(params: Record<string, string>) {
  return mock.getOrdersCSV(params);
}

export async function postRiderDetails(body: Record<string, unknown>) {
  return mock.postRiderDetails(body);
}
