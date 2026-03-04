// Mock data for Spice Kitchen — Indian restaurant chain
import type {
  Order,
  OrderItem,
  Outlet,
  OrderSource,
  PaymentMethod,
  Category,
  Product,
  Rider,
  Customer,
} from "@/lib/api/types";

// ── Helpers ──

const today = new Date();
function todayAt(h: number, m: number): string {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

let nextOrderId = 1001;
export function generateOrderId(): string {
  return `SK-${nextOrderId++}`;
}

// ── Order Sources ──

export const orderSources: OrderSource[] = [
  { id: 1, source_name: "Zomato", image: "/images/zomato.png" },
  { id: 2, source_name: "Swiggy", image: "/images/swiggy.png" },
  { id: 3, source_name: "Phone Order", image: "" },
  { id: 4, source_name: "Website Order", image: "" },
  { id: 5, source_name: "Walk-in", image: "" },
];

// ── Payment Methods ──

export const paymentMethods: PaymentMethod[] = [
  { id: 1, name: "Cash", is_active: true },
  { id: 2, name: "Card", is_active: true },
  { id: 3, name: "UPI", is_active: true },
  { id: 4, name: "PayTM", is_active: true },
  { id: 5, name: "Razorpay", is_active: true },
  { id: 6, name: "Zomato Cash", is_active: true },
];

// ── Categories ──

export const categories: Category[] = [
  { id: 1, category_name: "Starters" },
  { id: 2, category_name: "Main Course" },
  { id: 3, category_name: "Breads" },
  { id: 4, category_name: "Rice & Biryani" },
  { id: 5, category_name: "Desserts" },
  { id: 6, category_name: "Beverages" },
];

// ── Products ──

export const products: Product[] = [
  // Starters
  { id: 101, product_name: "Paneer Tikka", price: 220, image: "", is_veg: true, category_id: 1, variants: [{ id: 1, name: "Half", price: 220 }, { id: 2, name: "Full", price: 400 }], add_ons: [{ name: "Extra cheese", price: 30 }] },
  { id: 102, product_name: "Chicken 65", price: 250, image: "", is_veg: false, category_id: 1, variants: [], add_ons: [{ name: "Extra spicy sauce", price: 20 }] },
  { id: 103, product_name: "Veg Spring Rolls", price: 180, image: "", is_veg: true, category_id: 1, variants: [], add_ons: [] },
  { id: 104, product_name: "Mutton Seekh Kebab", price: 320, image: "", is_veg: false, category_id: 1, variants: [], add_ons: [] },
  { id: 105, product_name: "Hara Bhara Kebab", price: 190, image: "", is_veg: true, category_id: 1, variants: [], add_ons: [] },
  // Main Course
  { id: 201, product_name: "Butter Chicken", price: 320, image: "", is_veg: false, category_id: 2, variants: [{ id: 3, name: "Half", price: 320 }, { id: 4, name: "Full", price: 580 }], add_ons: [{ name: "Extra gravy", price: 20 }] },
  { id: 202, product_name: "Dal Makhani", price: 220, image: "", is_veg: true, category_id: 2, variants: [], add_ons: [{ name: "Extra butter", price: 15 }] },
  { id: 203, product_name: "Palak Paneer", price: 240, image: "", is_veg: true, category_id: 2, variants: [], add_ons: [] },
  { id: 204, product_name: "Chicken Tikka Masala", price: 300, image: "", is_veg: false, category_id: 2, variants: [{ id: 5, name: "Half", price: 300 }, { id: 6, name: "Full", price: 540 }], add_ons: [] },
  { id: 205, product_name: "Kadai Paneer", price: 250, image: "", is_veg: true, category_id: 2, variants: [], add_ons: [] },
  { id: 206, product_name: "Mutton Rogan Josh", price: 380, image: "", is_veg: false, category_id: 2, variants: [], add_ons: [{ name: "Extra gravy", price: 20 }] },
  { id: 207, product_name: "Chole Bhature", price: 180, image: "", is_veg: true, category_id: 2, variants: [], add_ons: [] },
  { id: 208, product_name: "Egg Curry", price: 200, image: "", is_veg: false, category_id: 2, variants: [], add_ons: [] },
  // Breads
  { id: 301, product_name: "Garlic Naan", price: 60, image: "", is_veg: true, category_id: 3, variants: [], add_ons: [{ name: "Extra cheese", price: 30 }] },
  { id: 302, product_name: "Butter Roti", price: 40, image: "", is_veg: true, category_id: 3, variants: [], add_ons: [] },
  { id: 303, product_name: "Laccha Paratha", price: 70, image: "", is_veg: true, category_id: 3, variants: [], add_ons: [] },
  { id: 304, product_name: "Tandoori Roti", price: 35, image: "", is_veg: true, category_id: 3, variants: [], add_ons: [] },
  // Rice & Biryani
  { id: 401, product_name: "Chicken Biryani", price: 280, image: "", is_veg: false, category_id: 4, variants: [{ id: 7, name: "Regular", price: 280 }, { id: 8, name: "Large", price: 480 }], add_ons: [{ name: "Extra raita", price: 30 }] },
  { id: 402, product_name: "Veg Biryani", price: 220, image: "", is_veg: true, category_id: 4, variants: [{ id: 9, name: "Regular", price: 220 }, { id: 10, name: "Large", price: 380 }], add_ons: [] },
  { id: 403, product_name: "Mutton Biryani", price: 350, image: "", is_veg: false, category_id: 4, variants: [], add_ons: [{ name: "Extra raita", price: 30 }] },
  { id: 404, product_name: "Jeera Rice", price: 140, image: "", is_veg: true, category_id: 4, variants: [], add_ons: [] },
  { id: 405, product_name: "Steamed Rice", price: 100, image: "", is_veg: true, category_id: 4, variants: [], add_ons: [] },
  // Desserts
  { id: 501, product_name: "Gulab Jamun", price: 80, image: "", is_veg: true, category_id: 5, variants: [{ id: 11, name: "2 pc", price: 80 }, { id: 12, name: "4 pc", price: 140 }], add_ons: [] },
  { id: 502, product_name: "Rasmalai", price: 100, image: "", is_veg: true, category_id: 5, variants: [], add_ons: [] },
  { id: 503, product_name: "Kulfi", price: 90, image: "", is_veg: true, category_id: 5, variants: [], add_ons: [] },
  // Beverages
  { id: 601, product_name: "Masala Chai", price: 40, image: "", is_veg: true, category_id: 6, variants: [], add_ons: [] },
  { id: 602, product_name: "Cold Coffee", price: 120, image: "", is_veg: true, category_id: 6, variants: [], add_ons: [] },
  { id: 603, product_name: "Fresh Lime Soda", price: 80, image: "", is_veg: true, category_id: 6, variants: [], add_ons: [] },
  { id: 604, product_name: "Mango Lassi", price: 100, image: "", is_veg: true, category_id: 6, variants: [], add_ons: [] },
  { id: 605, product_name: "Buttermilk", price: 50, image: "", is_veg: true, category_id: 6, variants: [], add_ons: [] },
];

// ── Riders ──

export const riders: Rider[] = [
  { id: 1, name: "Suresh Kumar", phone: "+91 98765 11001", is_available: true, active_orders: 1 },
  { id: 2, name: "Ramesh Yadav", phone: "+91 98765 11002", is_available: true, active_orders: 0 },
  { id: 3, name: "Venkatesh R", phone: "+91 98765 11003", is_available: false, active_orders: 2 },
  { id: 4, name: "Manoj Singh", phone: "+91 98765 11004", is_available: true, active_orders: 1 },
];

// ── Outlets ──

export const outlets: Outlet[] = [
  { id: 1, outlet_name: "Spice Kitchen — Koramangala", is_pos_open: true, acceptance_count: 3, preparation_count: 2, dispatch_count: 1, logged_in_count: 4, pending_order: 5, total_sale: 28500, settled_orders: 12, opening_time: "10:00", closing_time: "23:00" },
  { id: 2, outlet_name: "Spice Kitchen — Indiranagar", is_pos_open: true, acceptance_count: 2, preparation_count: 1, dispatch_count: 2, logged_in_count: 3, pending_order: 3, total_sale: 22300, settled_orders: 9, opening_time: "10:30", closing_time: "23:30" },
  { id: 3, outlet_name: "Spice Kitchen — JP Nagar", is_pos_open: true, acceptance_count: 1, preparation_count: 2, dispatch_count: 0, logged_in_count: 2, pending_order: 4, total_sale: 18700, settled_orders: 7, opening_time: "11:00", closing_time: "22:30" },
  { id: 4, outlet_name: "Spice Kitchen — Anna Nagar", is_pos_open: false, acceptance_count: 0, preparation_count: 0, dispatch_count: 0, logged_in_count: 0, pending_order: 0, total_sale: 15200, settled_orders: 6, opening_time: "10:00", closing_time: "22:00" },
  { id: 5, outlet_name: "Spice Kitchen — Whitefield", is_pos_open: true, acceptance_count: 2, preparation_count: 1, dispatch_count: 1, logged_in_count: 3, pending_order: 2, total_sale: 19800, settled_orders: 8, opening_time: "10:00", closing_time: "23:00" },
];

// ── Customers ──

export const customers: Customer[] = [
  { id: 1, name: "Raj Kumar", phone: "+91 98765 43210", email: "raj.kumar@gmail.com", address: "42, 1st Cross, Koramangala 5th Block, Bangalore 560095", customer_type: "regular" },
  { id: 2, name: "Priya Sharma", phone: "+91 98765 43211", email: "priya.sharma@gmail.com", address: "15, 80 Feet Rd, Indiranagar, Bangalore 560038", customer_type: "regular" },
  { id: 3, name: "Amit Patel", phone: "+91 98765 43212", email: "amit.patel@gmail.com", address: "78, 15th Cross, JP Nagar 2nd Phase, Bangalore 560078", customer_type: "new" },
  { id: 4, name: "Sneha Reddy", phone: "+91 98765 43213", email: "sneha.reddy@gmail.com", address: "23, CMH Road, Indiranagar, Bangalore 560038", customer_type: "vip" },
  { id: 5, name: "Vikram Joshi", phone: "+91 98765 43214", email: "vikram.joshi@gmail.com", address: "56, 3rd Main, Whitefield, Bangalore 560066", customer_type: "regular" },
];

// ── Tax & Charges ──

export const taxConfig = [
  { id: 1, tax_name: "CGST", percentage: 2.5 },
  { id: 2, tax_name: "SGST", percentage: 2.5 },
];

export const chargesConfig = [
  { id: 1, charge_name: "Delivery Charge", amount: 40 },
  { id: 2, charge_name: "Packing Charge", amount: 20 },
];

// ── Discounts ──

export const discounts = [
  { id: 1, name: "Happy Hour 10%", type: "percentage", value: 10 },
  { id: 2, name: "New Customer 15%", type: "percentage", value: 15 },
  { id: 3, name: "Festival Special ₹100 off", type: "flat", value: 100 },
];

// ── Receipt Config ──

export const receiptConfig = {
  brand_name: "Spice Kitchen",
  address: "42, 1st Cross, Koramangala 5th Block, Bangalore 560095",
  phone: "+91 80 4567 8900",
  gstin: "29AABCT1332L1ZP",
  fssai: "11219999000123",
  footer_text: "Thank you for dining with us! Visit again.",
  show_logo: true,
  logo_url: "/images/logo.png",
};

// ── Orders (mutable) ──

function makeItem(id: number, name: string, price: number, qty: number, veg: boolean, variant = "", addOns: { name: string; price: number }[] = []): OrderItem {
  return { id, product_name: name, price, quantity: qty, variant, add_ons: addOns, is_veg: veg };
}

// Order statuses: 1=Received, 2=Accepted, 3=Preparing, 4=Dispatched, 6=Settled, 7=Cancelled
export const orders: Order[] = [
  // Received (status 1)
  {
    id: 1, order_id: "SK-1001", customer_name: "Raj Kumar", customer_phone: "+91 98765 43210", customer_email: "raj.kumar@gmail.com",
    customer_address: "42, 1st Cross, Koramangala 5th Block, Bangalore 560095",
    order_status: "1", order_amount: 680, sub_total: 620, total_tax: 31, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "UPI", order_source: "Zomato", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(1, "Butter Chicken", 320, 1, false, "Half"), makeItem(2, "Garlic Naan", 60, 2, true), makeItem(3, "Jeera Rice", 140, 1, true)],
    created_at: todayAt(11, 15), updated_at: todayAt(11, 15),
    order_cancel_reason: "", special_instructions: "Extra spicy butter chicken", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 2, order_id: "SK-1002", customer_name: "Priya Sharma", customer_phone: "+91 98765 43211", customer_email: "priya.sharma@gmail.com",
    customer_address: "15, 80 Feet Rd, Indiranagar, Bangalore 560038",
    order_status: "1", order_amount: 520, sub_total: 460, total_tax: 23, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Cash", order_source: "Swiggy", outlet_id: 2, outlet_name: "Spice Kitchen — Indiranagar",
    items: [makeItem(4, "Paneer Tikka", 220, 1, true, "Half"), makeItem(5, "Palak Paneer", 240, 1, true)],
    created_at: todayAt(11, 30), updated_at: todayAt(11, 30),
    order_cancel_reason: "", special_instructions: "No onion no garlic", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 3, order_id: "SK-1003", customer_name: "Deepak Mehta", customer_phone: "+91 98765 43220", customer_email: "deepak.m@gmail.com",
    customer_address: "88, Sarjapur Road, Koramangala, Bangalore 560034",
    order_status: "1", order_amount: 890, sub_total: 830, total_tax: 41.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Card", order_source: "Phone Order", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(6, "Chicken Biryani", 280, 2, false, "Regular"), makeItem(7, "Chicken 65", 250, 1, false)],
    created_at: todayAt(11, 45), updated_at: todayAt(11, 45),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "Call before delivery", rider_name: "", rider_phone: "", key_person: "",
  },
  // Accepted (status 2)
  {
    id: 4, order_id: "SK-1004", customer_name: "Amit Patel", customer_phone: "+91 98765 43212", customer_email: "amit.patel@gmail.com",
    customer_address: "78, 15th Cross, JP Nagar 2nd Phase, Bangalore 560078",
    order_status: "2", order_amount: 740, sub_total: 680, total_tax: 34, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "PayTM", order_source: "Zomato", outlet_id: 3, outlet_name: "Spice Kitchen — JP Nagar",
    items: [makeItem(8, "Mutton Rogan Josh", 380, 1, false), makeItem(9, "Laccha Paratha", 70, 2, true), makeItem(10, "Mango Lassi", 100, 2, true)],
    created_at: todayAt(10, 45), updated_at: todayAt(11, 0),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 5, order_id: "SK-1005", customer_name: "Sneha Reddy", customer_phone: "+91 98765 43213", customer_email: "sneha.reddy@gmail.com",
    customer_address: "23, CMH Road, Indiranagar, Bangalore 560038",
    order_status: "2", order_amount: 450, sub_total: 390, total_tax: 19.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "UPI", order_source: "Website Order", outlet_id: 2, outlet_name: "Spice Kitchen — Indiranagar",
    items: [makeItem(11, "Dal Makhani", 220, 1, true), makeItem(12, "Butter Roti", 40, 3, true), makeItem(13, "Masala Chai", 40, 2, true)],
    created_at: todayAt(10, 30), updated_at: todayAt(10, 50),
    order_cancel_reason: "", special_instructions: "Less salt in dal", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 6, order_id: "SK-1006", customer_name: "Karthik Nair", customer_phone: "+91 98765 43225", customer_email: "karthik.n@gmail.com",
    customer_address: "34, Residency Road, Bangalore 560025",
    order_status: "2", order_amount: 1280, sub_total: 1220, total_tax: 61, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Razorpay", order_source: "Swiggy", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(14, "Mutton Biryani", 350, 2, false), makeItem(15, "Mutton Seekh Kebab", 320, 1, false), makeItem(16, "Cold Coffee", 120, 2, true)],
    created_at: todayAt(10, 15), updated_at: todayAt(10, 30),
    order_cancel_reason: "", special_instructions: "Extra raita on the side", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  // Preparing (status 3)
  {
    id: 7, order_id: "SK-1007", customer_name: "Vikram Joshi", customer_phone: "+91 98765 43214", customer_email: "vikram.joshi@gmail.com",
    customer_address: "56, 3rd Main, Whitefield, Bangalore 560066",
    order_status: "3", order_amount: 560, sub_total: 500, total_tax: 25, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Cash", order_source: "Walk-in", outlet_id: 5, outlet_name: "Spice Kitchen — Whitefield",
    items: [makeItem(17, "Kadai Paneer", 250, 1, true), makeItem(18, "Veg Biryani", 220, 1, true, "Regular")],
    created_at: todayAt(10, 0), updated_at: todayAt(10, 20),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "Suresh Kumar", rider_phone: "+91 98765 11001", key_person: "",
  },
  {
    id: 8, order_id: "SK-1008", customer_name: "Ananya Iyer", customer_phone: "+91 98765 43230", customer_email: "ananya.i@gmail.com",
    customer_address: "12, Brigade Road, Bangalore 560001",
    order_status: "3", order_amount: 420, sub_total: 360, total_tax: 18, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "UPI", order_source: "Zomato", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(19, "Chole Bhature", 180, 1, true), makeItem(20, "Hara Bhara Kebab", 190, 1, true)],
    created_at: todayAt(9, 45), updated_at: todayAt(10, 10),
    order_cancel_reason: "", special_instructions: "Pack bhature separately", delivery_instructions: "", rider_name: "Manoj Singh", rider_phone: "+91 98765 11004", key_person: "",
  },
  {
    id: 9, order_id: "SK-1009", customer_name: "Rohit Verma", customer_phone: "+91 98765 43235", customer_email: "rohit.v@gmail.com",
    customer_address: "9, Cunningham Road, Bangalore 560052",
    order_status: "3", order_amount: 950, sub_total: 890, total_tax: 44.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Card", order_source: "Swiggy", outlet_id: 3, outlet_name: "Spice Kitchen — JP Nagar",
    items: [makeItem(21, "Chicken Tikka Masala", 300, 1, false, "Half"), makeItem(22, "Chicken Biryani", 280, 1, false, "Large"), makeItem(23, "Gulab Jamun", 80, 2, true, "2 pc"), makeItem(24, "Fresh Lime Soda", 80, 1, true)],
    created_at: todayAt(9, 30), updated_at: todayAt(9, 55),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "Venkatesh R", rider_phone: "+91 98765 11003", key_person: "",
  },
  // Dispatched (status 4)
  {
    id: 10, order_id: "SK-1010", customer_name: "Meera Krishnan", customer_phone: "+91 98765 43240", customer_email: "meera.k@gmail.com",
    customer_address: "67, MG Road, Bangalore 560001",
    order_status: "4", order_amount: 380, sub_total: 320, total_tax: 16, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Zomato Cash", order_source: "Zomato", outlet_id: 2, outlet_name: "Spice Kitchen — Indiranagar",
    items: [makeItem(25, "Egg Curry", 200, 1, false), makeItem(26, "Steamed Rice", 100, 1, true)],
    created_at: todayAt(9, 0), updated_at: todayAt(9, 40),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "Leave at door", rider_name: "Ramesh Yadav", rider_phone: "+91 98765 11002", key_person: "",
  },
  {
    id: 11, order_id: "SK-1011", customer_name: "Arjun Desai", customer_phone: "+91 98765 43245", customer_email: "arjun.d@gmail.com",
    customer_address: "101, HAL 2nd Stage, Indiranagar, Bangalore 560038",
    order_status: "4", order_amount: 720, sub_total: 660, total_tax: 33, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "PayTM", order_source: "Phone Order", outlet_id: 5, outlet_name: "Spice Kitchen — Whitefield",
    items: [makeItem(27, "Butter Chicken", 320, 1, false, "Half"), makeItem(28, "Garlic Naan", 60, 3, true), makeItem(29, "Rasmalai", 100, 2, true)],
    created_at: todayAt(8, 45), updated_at: todayAt(9, 30),
    order_cancel_reason: "", special_instructions: "Extra naan well done", delivery_instructions: "", rider_name: "Suresh Kumar", rider_phone: "+91 98765 11001", key_person: "",
  },
  // Settled (status 6)
  {
    id: 12, order_id: "SK-1012", customer_name: "Lakshmi Menon", customer_phone: "+91 98765 43250", customer_email: "lakshmi.m@gmail.com",
    customer_address: "44, Jayanagar 4th Block, Bangalore 560041",
    order_status: "6", order_amount: 540, sub_total: 480, total_tax: 24, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Cash", order_source: "Walk-in", outlet_id: 3, outlet_name: "Spice Kitchen — JP Nagar",
    items: [makeItem(30, "Veg Spring Rolls", 180, 1, true), makeItem(31, "Palak Paneer", 240, 1, true), makeItem(32, "Tandoori Roti", 35, 2, true)],
    created_at: todayAt(8, 0), updated_at: todayAt(8, 50),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 13, order_id: "SK-1013", customer_name: "Sanjay Gupta", customer_phone: "+91 98765 43255", customer_email: "sanjay.g@gmail.com",
    customer_address: "29, Koramangala 3rd Block, Bangalore 560034",
    order_status: "6", order_amount: 1050, sub_total: 990, total_tax: 49.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Card", order_source: "Website Order", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(33, "Mutton Biryani", 350, 1, false), makeItem(34, "Butter Chicken", 320, 1, false, "Half"), makeItem(35, "Kulfi", 90, 2, true), makeItem(36, "Buttermilk", 50, 2, true)],
    created_at: todayAt(7, 30), updated_at: todayAt(8, 30),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "Ramesh Yadav", rider_phone: "+91 98765 11002", key_person: "",
  },
  {
    id: 14, order_id: "SK-1014", customer_name: "Nisha Agarwal", customer_phone: "+91 98765 43260", customer_email: "nisha.a@gmail.com",
    customer_address: "77, Marathahalli, Bangalore 560037",
    order_status: "6", order_amount: 310, sub_total: 250, total_tax: 12.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "UPI", order_source: "Swiggy", outlet_id: 5, outlet_name: "Spice Kitchen — Whitefield",
    items: [makeItem(37, "Dal Makhani", 220, 1, true), makeItem(38, "Butter Roti", 40, 1, true)],
    created_at: todayAt(7, 0), updated_at: todayAt(7, 50),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "Manoj Singh", rider_phone: "+91 98765 11004", key_person: "",
  },
  {
    id: 15, order_id: "SK-1015", customer_name: "Pooja Bhat", customer_phone: "+91 98765 43265", customer_email: "pooja.b@gmail.com",
    customer_address: "8, Lavelle Road, Bangalore 560001",
    order_status: "6", order_amount: 860, sub_total: 800, total_tax: 40, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Razorpay", order_source: "Zomato", outlet_id: 2, outlet_name: "Spice Kitchen — Indiranagar",
    items: [makeItem(39, "Paneer Tikka", 220, 1, true, "Full"), makeItem(40, "Chicken Tikka Masala", 300, 1, false, "Half"), makeItem(41, "Garlic Naan", 60, 2, true), makeItem(42, "Cold Coffee", 120, 1, true)],
    created_at: todayAt(6, 30), updated_at: todayAt(7, 30),
    order_cancel_reason: "", special_instructions: "", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  // Cancelled (status 7)
  {
    id: 16, order_id: "SK-1016", customer_name: "Rahul Bose", customer_phone: "+91 98765 43270", customer_email: "rahul.b@gmail.com",
    customer_address: "55, Richmond Road, Bangalore 560025",
    order_status: "7", order_amount: 480, sub_total: 420, total_tax: 21, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "Cash", order_source: "Phone Order", outlet_id: 1, outlet_name: "Spice Kitchen — Koramangala",
    items: [makeItem(43, "Chicken 65", 250, 1, false), makeItem(44, "Veg Spring Rolls", 180, 1, true)],
    created_at: todayAt(9, 15), updated_at: todayAt(9, 25),
    order_cancel_reason: "Customer changed mind", special_instructions: "", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
  {
    id: 17, order_id: "SK-1017", customer_name: "Divya Kapoor", customer_phone: "+91 98765 43275", customer_email: "divya.k@gmail.com",
    customer_address: "19, Church Street, Bangalore 560001",
    order_status: "7", order_amount: 350, sub_total: 290, total_tax: 14.5, discount: 0, delivery_charge: 40, packing_charge: 20,
    payment_mode: "UPI", order_source: "Zomato", outlet_id: 2, outlet_name: "Spice Kitchen — Indiranagar",
    items: [makeItem(45, "Chole Bhature", 180, 1, true), makeItem(46, "Masala Chai", 40, 2, true), makeItem(47, "Kulfi", 90, 1, true)],
    created_at: todayAt(10, 10), updated_at: todayAt(10, 20),
    order_cancel_reason: "Duplicate order", special_instructions: "", delivery_instructions: "", rider_name: "", rider_phone: "", key_person: "",
  },
];
