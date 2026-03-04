import { create } from "zustand";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: { name: string; price: number };
  addOns: { name: string; price: number }[];
  isVeg: boolean;
}

interface CartState {
  items: CartItem[];
  customer: { name: string; phone: string; address: string; email: string } | null;
  orderType: "delivery" | "dinein" | "takeaway";
  discount: { type: "percentage" | "fixed"; value: number; name: string } | null;
  paymentMode: string;
  outletId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  setCustomer: (c: CartState["customer"]) => void;
  setOrderType: (t: CartState["orderType"]) => void;
  setDiscount: (d: CartState["discount"]) => void;
  setPaymentMode: (m: string) => void;
  setOutletId: (id: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: (taxRate: number) => number;
}

function itemTotal(item: CartItem): number {
  const base = item.variant ? item.variant.price : item.price;
  const addOnSum = item.addOns.reduce((sum, a) => sum + a.price, 0);
  return (base + addOnSum) * item.quantity;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  customer: null,
  orderType: "dinein",
  discount: null,
  paymentMode: "cash",
  outletId: null,

  addItem: (item) =>
    set((s) => {
      const idx = s.items.findIndex((i) => i.productId === item.productId);
      if (idx >= 0) {
        const updated = [...s.items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
        return { items: updated };
      }
      return { items: [...s.items, item] };
    }),

  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

  updateQuantity: (productId, qty) =>
    set((s) => {
      if (qty <= 0) return { items: s.items.filter((i) => i.productId !== productId) };
      return {
        items: s.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
      };
    }),

  setCustomer: (c) => set({ customer: c }),
  setOrderType: (t) => set({ orderType: t }),
  setDiscount: (d) => set({ discount: d }),
  setPaymentMode: (m) => set({ paymentMode: m }),
  setOutletId: (id) => set({ outletId: id }),

  clearCart: () =>
    set({ items: [], customer: null, discount: null, paymentMode: "cash" }),

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + itemTotal(item), 0);
  },

  getTotal: (taxRate) => {
    const subtotal = get().getSubtotal();
    const { discount } = get();
    let discounted = subtotal;
    if (discount) {
      discounted =
        discount.type === "percentage"
          ? subtotal * (1 - discount.value / 100)
          : subtotal - discount.value;
    }
    return Math.max(0, discounted * (1 + taxRate / 100));
  },
}));
