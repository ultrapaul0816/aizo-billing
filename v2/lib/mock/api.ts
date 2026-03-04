/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock API implementations — returns mock data with realistic delays
import type {
  Order,
  OrderSource,
  PaymentMethod,
  Category,
  Product,
  Rider,
  Customer,
  LoginResponse,
  Outlet,
} from "@/lib/api/types";
import {
  orders,
  outlets,
  orderSources,
  paymentMethods,
  categories,
  products,
  riders,
  customers,
  taxConfig,
  chargesConfig,
  discounts,
  receiptConfig,
  generateOrderId,
} from "./data";

// ── Helpers ──

function delay(ms?: number): Promise<void> {
  const wait = ms ?? 200 + Math.random() * 300;
  return new Promise((r) => setTimeout(r, wait));
}

// ── Auth ──

export async function login(_body: { username: string; password: string }): Promise<LoginResponse> {
  await delay();
  return {
    success: true,
    token: "mock-token-123",
    brand: "spice-kitchen",
    user_type: "admin",
    permissions: { catalog: true, take_order_button: true, order_transfer: true },
    username: _body.username,
    user_id: 1,
  };
}

export async function logout(): Promise<void> {
  await delay(200);
}

export async function searchCustomer(body: Record<string, unknown>): Promise<Customer[]> {
  await delay();
  const mobile = String(body.mobile ?? body.phone ?? "");
  if (!mobile) return customers.slice(0, 2);
  return customers.filter((c) => c.phone.includes(mobile));
}

export async function getCustomerDetails(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const id = Number(body.id ?? body.customer_id ?? 1);
  const c = customers.find((cu) => cu.id === id) ?? customers[0];
  return { ...c, order_history: orders.filter((o) => o.customer_phone === c.phone) };
}

// ── Orders ──

export async function fetchAllOrders(): Promise<Order[]> {
  await delay();
  return [...orders];
}

export async function getOrderDetails(body: Record<string, unknown>): Promise<Order> {
  await delay();
  const id = Number(body.id ?? body.order_id);
  return orders.find((o) => o.id === id || o.order_id === String(id)) ?? orders[0];
}

export async function changeOrderStatus(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const id = Number(body.id ?? body.order_id);
  const status = String(body.status ?? body.order_status);
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.order_status = status;
    order.updated_at = new Date().toISOString();
  }
  return { success: true };
}

export async function pollNewOrders(): Promise<unknown> {
  await delay(300);
  // 10% chance of a new order
  if (Math.random() < 0.1) {
    const newOrder: Order = {
      id: orders.length + 100,
      order_id: generateOrderId(),
      customer_name: "New Customer",
      customer_phone: "+91 98765 99999",
      customer_email: "new@gmail.com",
      customer_address: "Random Address, Bangalore",
      order_status: "1",
      order_amount: 450,
      sub_total: 390,
      total_tax: 19.5,
      discount: 0,
      delivery_charge: 40,
      packing_charge: 20,
      payment_mode: "UPI",
      order_source: "Zomato",
      outlet_id: 1,
      outlet_name: "Spice Kitchen — Koramangala",
      items: [{ id: 900, product_name: "Butter Chicken", price: 320, quantity: 1, variant: "Half", add_ons: [], is_veg: false }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_cancel_reason: "",
      special_instructions: "",
      delivery_instructions: "",
      rider_name: "",
      rider_phone: "",
      key_person: "",
    };
    orders.push(newOrder);
    return { success: true, new_orders: [newOrder] };
  }
  return { success: true, new_orders: [] };
}

export async function cancelOrder(body: { id: number; order_cancel_reason: string }): Promise<unknown> {
  await delay();
  const order = orders.find((o) => o.id === body.id);
  if (order) {
    order.order_status = "7";
    order.order_cancel_reason = body.order_cancel_reason;
    order.updated_at = new Date().toISOString();
  }
  return { success: true };
}

export async function placeOrder(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const newOrder: Order = {
    id: orders.length + 200,
    order_id: generateOrderId(),
    customer_name: String(body.customer_name ?? "Walk-in Customer"),
    customer_phone: String(body.customer_phone ?? ""),
    customer_email: String(body.customer_email ?? ""),
    customer_address: String(body.customer_address ?? ""),
    order_status: "1",
    order_amount: Number(body.order_amount ?? 0),
    sub_total: Number(body.sub_total ?? 0),
    total_tax: Number(body.total_tax ?? 0),
    discount: Number(body.discount ?? 0),
    delivery_charge: Number(body.delivery_charge ?? 40),
    packing_charge: Number(body.packing_charge ?? 20),
    payment_mode: String(body.payment_mode ?? "Cash"),
    order_source: String(body.order_source ?? "Walk-in"),
    outlet_id: Number(body.outlet_id ?? 1),
    outlet_name: String(body.outlet_name ?? "Spice Kitchen — Koramangala"),
    items: (body.items as Order["items"]) ?? [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order_cancel_reason: "",
    special_instructions: String(body.special_instructions ?? ""),
    delivery_instructions: String(body.delivery_instructions ?? ""),
    rider_name: "",
    rider_phone: "",
    key_person: "",
  };
  orders.push(newOrder);
  return { success: true, data: newOrder };
}

export async function editOrder(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const id = Number(body.id ?? body.order_id);
  const order = orders.find((o) => o.id === id);
  if (order) {
    Object.assign(order, body, { updated_at: new Date().toISOString() });
  }
  return { success: true };
}

export async function settleOrder(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const id = Number(body.id ?? body.order_id);
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.order_status = "6";
    order.updated_at = new Date().toISOString();
  }
  return { success: true };
}

export async function getDiscounts(_body: Record<string, unknown>): Promise<unknown> {
  await delay();
  return discounts;
}

export async function getCoupon(_body: Record<string, unknown>): Promise<unknown> {
  await delay();
  return { success: false, message: "Invalid coupon code" };
}

export async function getPaymentMethods(_body: Record<string, unknown>): Promise<PaymentMethod[]> {
  await delay();
  return [...paymentMethods];
}

export async function getReceiptConfig(_body: Record<string, unknown>): Promise<unknown> {
  await delay();
  return receiptConfig;
}

export async function getOrderSource(): Promise<OrderSource[]> {
  await delay();
  return [...orderSources];
}

export async function getOrderReport(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  let filtered = [...orders];
  if (body.outlet_id) filtered = filtered.filter((o) => o.outlet_id === Number(body.outlet_id));
  if (body.from_date) filtered = filtered.filter((o) => o.created_at >= String(body.from_date));
  if (body.to_date) filtered = filtered.filter((o) => o.created_at <= String(body.to_date));
  return filtered;
}

export async function getOrdersCSV(_params: Record<string, string>): Promise<Blob> {
  await delay();
  const header = "Order ID,Customer,Amount,Status,Source,Payment,Date\n";
  const rows = orders.map((o) => `${o.order_id},${o.customer_name},${o.order_amount},${o.order_status},${o.order_source},${o.payment_mode},${o.created_at}`).join("\n");
  return new Blob([header + rows], { type: "text/csv" });
}

export async function postRiderDetails(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const orderId = Number(body.order_id ?? body.id);
  const riderId = Number(body.rider_id);
  const order = orders.find((o) => o.id === orderId);
  const rider = riders.find((r) => r.id === riderId);
  if (order && rider) {
    order.rider_name = rider.name;
    order.rider_phone = rider.phone;
    order.updated_at = new Date().toISOString();
  }
  return { success: true };
}

// ── Outlets ──

export async function listOutlets(): Promise<Outlet[]> {
  await delay();
  return [...outlets];
}

export async function toggleOutletStatus(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const id = Number(body.id ?? body.outlet_id);
  const outlet = outlets.find((o) => o.id === id);
  if (outlet) {
    outlet.is_pos_open = !outlet.is_pos_open;
  }
  return { success: true };
}

export async function listCategories(_body: Record<string, unknown>): Promise<Category[]> {
  await delay();
  return [...categories];
}

export async function listProducts(body: Record<string, unknown>): Promise<Product[]> {
  await delay();
  const catId = Number(body.category_id ?? body.categoryId ?? 0);
  if (catId) return products.filter((p) => p.category_id === catId);
  return [...products];
}

export async function getRiders(_body: Record<string, unknown>): Promise<Rider[]> {
  await delay();
  return [...riders];
}

export async function assignRider(body: Record<string, unknown>): Promise<unknown> {
  await delay();
  const orderId = Number(body.order_id ?? body.orderId);
  const riderId = Number(body.rider_id ?? body.riderId);
  const order = orders.find((o) => o.id === orderId);
  const rider = riders.find((r) => r.id === riderId);
  if (order && rider) {
    order.rider_name = rider.name;
    order.rider_phone = rider.phone;
    order.updated_at = new Date().toISOString();
  }
  return { success: true };
}

export async function getTax(_body: Record<string, unknown>): Promise<unknown> {
  await delay();
  return taxConfig;
}

export async function getCharges(): Promise<unknown> {
  await delay();
  return chargesConfig;
}
