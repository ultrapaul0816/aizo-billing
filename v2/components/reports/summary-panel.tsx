"use client";

import {
  CheckCircle2,
  DollarSign,
  Receipt,
  Clock,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";
import { ReportCharts } from "@/components/reports/charts";

interface SummaryPanelProps {
  orders: Order[];
}

export function SummaryPanel({ orders }: SummaryPanelProps) {
  const settled = orders.filter(
    (o) => o.order_status.toLowerCase() === "settled"
  );
  const pending = orders.filter(
    (o) => o.order_status.toLowerCase() === "pending"
  );
  const cancelled = orders.filter(
    (o) => o.order_status.toLowerCase() === "cancelled"
  );

  const grossSale = orders.reduce((sum, o) => sum + o.order_amount, 0);
  const netSale = orders.reduce(
    (sum, o) => sum + (o.order_amount - (o.discount || 0)),
    0
  );

  const stats = [
    {
      label: "Settled Orders",
      value: settled.length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Gross Sale",
      value: formatCurrency(grossSale),
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Net Sale",
      value: formatCurrency(netSale),
      icon: Receipt,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Pending",
      value: pending.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Cancelled",
      value: cancelled.length,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="sticky top-6 flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm"
          >
            <div className={`mb-1.5 inline-flex rounded-md p-1.5 ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ReportCharts orders={orders} />
    </div>
  );
}
