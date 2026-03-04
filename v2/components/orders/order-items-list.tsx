"use client";

import { formatCurrency } from "@/lib/utils";
import type { OrderItem } from "@/lib/api/types";

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  if (!items?.length) {
    return <p className="text-sm text-slate-400 py-2">No items in this order</p>;
  }

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0"
        >
          {/* Veg / Non-veg indicator */}
          <div className="mt-1 shrink-0">
            {item.is_veg ? (
              <div className="h-4 w-4 border-2 border-green-600 rounded-sm flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
              </div>
            ) : (
              <div className="h-4 w-4 border-2 border-red-600 rounded-sm flex items-center justify-center">
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderBottom: "6px solid #dc2626",
                  }}
                />
              </div>
            )}
          </div>

          {/* Name, variant, add-ons */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {item.product_name}
            </p>
            {item.variant && (
              <p className="text-xs text-slate-400">{item.variant}</p>
            )}
            {item.add_ons?.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                + {item.add_ons.map((a) => a.name).join(", ")}
              </p>
            )}
          </div>

          {/* Qty x Price */}
          <div className="text-right shrink-0">
            <p className="text-sm text-slate-700">
              {item.quantity} &times; {formatCurrency(item.price)}
            </p>
            <p className="text-xs font-medium text-slate-900">
              {formatCurrency(item.quantity * item.price)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
