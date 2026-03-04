// ── Shared Types ──

export interface AddOn {
  name: string;
  price: number;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
}

// ── Order ──

export interface OrderItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  variant: string;
  add_ons: AddOn[];
  is_veg: boolean;
}

export interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  order_status: string;
  order_amount: number;
  sub_total: number;
  total_tax: number;
  discount: number;
  delivery_charge: number;
  packing_charge: number;
  payment_mode: string;
  order_source: string;
  outlet_id: number;
  outlet_name: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  order_cancel_reason: string;
  special_instructions: string;
  delivery_instructions: string;
  rider_name: string;
  rider_phone: string;
  key_person: string;
}

// ── Outlet ──

export interface Outlet {
  id: number;
  outlet_name: string;
  is_pos_open: boolean;
  acceptance_count: number;
  preparation_count: number;
  dispatch_count: number;
  logged_in_count: number;
  pending_order: number;
  total_sale: number;
  settled_orders: number;
  opening_time: string;
  closing_time: string;
}

// ── Config / Lookup ──

export interface OrderSource {
  id: number;
  source_name: string;
  image: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  category_name: string;
}

export interface Product {
  id: number;
  product_name: string;
  price: number;
  image: string;
  is_veg: boolean;
  category_id: number;
  variants: Variant[];
  add_ons: AddOn[];
}

// ── Rider ──

export interface Rider {
  id: number;
  name: string;
  phone: string;
  is_available: boolean;
  active_orders: number;
}

// ── Customer ──

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  customer_type: string;
}

// ── Auth ──

export interface LoginResponse {
  success: boolean;
  token: string;
  brand: string;
  user_type: string;
  permissions: Record<string, boolean>;
  username: string;
  user_id: number;
}

// ── Generic API Wrapper ──

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
