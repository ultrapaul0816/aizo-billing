"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

interface ChargesBreakdownProps {
  order: Order;
}

export function ChargesBreakdown({ order }: ChargesBreakdownProps) {
  const rows: { label: string; value: number; highlight?: boolean }[] = [
    { label: "Subtotal", value: order.sub_total },
  ];

  if (order.discount > 0) {
    rows.push({ label: "Discount", value: -order.discount });
  }

  if (order.total_tax > 0) {
    rows.push({ label: "Tax", value: order.total_tax });
  }

  if (order.packing_charge > 0) {
    rows.push({ label: "Packing Charge", value: order.packing_charge });
  }

  if (order.delivery_charge > 0) {
    rows.push({ label: "Delivery Charge", value: order.delivery_charge });
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{row.label}</span>
          <span className={`text-sm ${row.value < 0 ? "text-emerald-600" : "text-slate-700"}`}>
            {row.value < 0 ? "- " : ""}
            {formatCurrency(Math.abs(row.value))}
          </span>
        </div>
      ))}

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">Grand Total</span>
        <span className="text-lg font-bold text-slate-900">
          {formatCurrency(order.order_amount)}
        </span>
      </div>

      {order.payment_mode && (
        <div className="pt-1">
          <Badge variant="default">{order.payment_mode}</Badge>
        </div>
      )}
    </div>
  );
}
