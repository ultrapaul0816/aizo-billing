import { apiClient, apiV2Client, post } from "./client";
import { getBrand } from "@/lib/utils";
import type {
  ApiResponse,
  Order,
  OrderSource,
  PaymentMethod,
} from "./types";

export async function fetchAllOrders(): Promise<Order[]> {
  const brand = getBrand();
  const res = await apiClient.get<ApiResponse<Order[]>>(`/ordermgnt/Order/?brand=${brand}`);
  return res.data.data;
}

export async function getOrderDetails(body: Record<string, unknown>) {
  return post<Order>("/ordermgnt/Retrieval/", body);
}

export async function changeOrderStatus(body: Record<string, unknown>) {
  return post<unknown>("/ordermgnt/ChangeStatus/", body);
}

export async function pollNewOrders() {
  const brand = getBrand();
  return post<unknown>("/ordernotification/seen/", { brand });
}

export async function cancelOrder(body: { id: number; order_cancel_reason: string }) {
  return post<unknown>("/ordernotification/accepted/", {
    ...body,
    is_accepted: "false",
  });
}

export async function placeOrder(body: Record<string, unknown>) {
  return post<unknown>("/ordermgnt/Orderprocess/", body);
}

export async function editOrder(body: Record<string, unknown>) {
  return post<unknown>("/ordermgnt/editorder/", body);
}

export async function settleOrder(body: Record<string, unknown>) {
  return post<unknown>("/order/billsettle/", body);
}

export async function getDiscounts(body: Record<string, unknown>) {
  return post<unknown>("/alldiscount/", body);
}

export async function getCoupon(body: Record<string, unknown>) {
  return post<unknown>("/couponcode/", body);
}

export async function getPaymentMethods(body: Record<string, unknown>): Promise<PaymentMethod[]> {
  return post<PaymentMethod[]>("/payment/list/", body);
}

export async function getReceiptConfig(body: Record<string, unknown>) {
  return post<unknown>("/outletmgmt/receipt/", body);
}

export async function getOrderSource(): Promise<OrderSource[]> {
  const res = await apiV2Client.get<ApiResponse<OrderSource[]>>("/listing/source/");
  return res.data.data;
}

export async function getOrderReport(body: Record<string, unknown>) {
  return post<unknown>("/ordermgnt/Order/", body);
}

export async function getOrdersCSV(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const res = await apiClient.get<Blob>(`/order/csv/?${query}`, {
    responseType: "blob",
  });
  return res.data;
}

export async function postRiderDetails(body: Record<string, unknown>) {
  return post<unknown>("/rider/orderdetail/", body);
}
