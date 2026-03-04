"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

interface ChartsProps {
  orders: Order[];
}

const PIE_COLORS = [
  "#1e293b", // slate-800
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
];

const SOURCE_COLORS: Record<string, string> = {
  zomato: "#E23744",
  swiggy: "#FC8019",
  direct: "#7c3aed",
  pos: "#7c3aed",
};

function getSourceColor(source: string) {
  const s = source.toLowerCase();
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (s.includes(key)) return color;
  }
  return "#1e293b";
}

function CustomTooltipBar({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-slate-500">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function ReportCharts({ orders }: ChartsProps) {
  // Daily sales trend
  const dailyData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const date = o.created_at?.slice(0, 10) || "Unknown";
      map.set(date, (map.get(date) || 0) + o.order_amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        amount,
      }));
  }, [orders]);

  // Payment breakdown
  const paymentData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const mode = o.payment_mode || "Unknown";
      map.set(mode, (map.get(mode) || 0) + o.order_amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Source breakdown
  const sourceData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const src = o.order_source || "Unknown";
      map.set(src, (map.get(src) || 0) + o.order_amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (orders.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Daily Sales Trend */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Daily Sales Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltipBar />} />
            <Bar dataKey="amount" fill="#1e293b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Payment Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={paymentData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {paymentData.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => {
                const total = paymentData.reduce((s, d) => s + d.value, 0);
                const item = paymentData.find((d) => d.name === value);
                const pct = total > 0 && item ? ((item.value / total) * 100).toFixed(0) : 0;
                return (
                  <span className="text-xs text-slate-600">
                    {value} ({pct}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Source Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Source Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {sourceData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={getSourceColor(entry.name)}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => {
                const total = sourceData.reduce((s, d) => s + d.value, 0);
                const item = sourceData.find((d) => d.name === value);
                const pct = total > 0 && item ? ((item.value / total) * 100).toFixed(0) : 0;
                return (
                  <span className="text-xs text-slate-600">
                    {value} ({pct}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
