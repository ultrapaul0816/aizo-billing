"use client";

import { User, MapPin, Phone, Mail, AlertTriangle, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Order } from "@/lib/api/types";

interface CustomerInfoProps {
  order: Order;
}

export function CustomerInfo({ order }: CustomerInfoProps) {
  const rows = [
    { icon: User, value: order.customer_name },
    { icon: MapPin, value: order.customer_address },
    { icon: Phone, value: order.customer_phone },
    { icon: Mail, value: order.customer_email },
  ].filter((r) => r.value);

  return (
    <div className="space-y-3">
      <Card className="p-3 space-y-2.5">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">No customer info available</p>
        ) : (
          rows.map((row) => (
            <div key={row.value} className="flex items-start gap-2.5">
              <row.icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <span className="text-sm text-slate-700">{row.value}</span>
            </div>
          ))
        )}
      </Card>

      {order.special_instructions && (
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-700 mb-0.5">
              Special Instructions
            </p>
            <p className="text-xs text-amber-600">
              {order.special_instructions}
            </p>
          </div>
        </div>
      )}

      {order.delivery_instructions && (
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
          <Truck className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-700 mb-0.5">
              Delivery Instructions
            </p>
            <p className="text-xs text-amber-600">
              {order.delivery_instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
