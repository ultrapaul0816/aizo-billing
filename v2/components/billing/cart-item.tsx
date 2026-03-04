"use client";

import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart";
import { formatCurrency, cn } from "@/lib/utils";

interface CartItemRowProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variant?: { name: string; price: number };
    addOns: { name: string; price: number }[];
    isVeg: boolean;
  };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const unitPrice = item.variant ? item.variant.price : item.price;
  const addOnTotal = item.addOns.reduce((sum, a) => sum + a.price, 0);
  const lineTotal = (unitPrice + addOnTotal) * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
    >
      {/* Veg/Non-veg indicator */}
      <span
        className={cn(
          "mt-1.5 h-3 w-3 shrink-0 rounded-sm border-2 flex items-center justify-center",
          item.isVeg ? "border-green-600" : "border-red-600"
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            item.isVeg ? "bg-green-600" : "bg-red-600"
          )}
        />
      </span>

      {/* Name + variant + add-ons */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 leading-tight">
          {item.name}
          {item.variant && (
            <span className="text-slate-400 font-normal">
              {" "}
              ({item.variant.name})
            </span>
          )}
        </p>
        {item.addOns.length > 0 && (
          <p className="text-xs text-slate-400 mt-0.5">
            + {item.addOns.map((a) => a.name).join(", ")}
          </p>
        )}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-slate-900">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Line total */}
      <span className="text-sm font-semibold text-slate-900 w-16 text-right shrink-0">
        {formatCurrency(lineTotal)}
      </span>

      {/* Remove button (on hover) */}
      <button
        onClick={() => removeItem(item.productId)}
        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
