"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

const PAGE_SIZE = 20;

type SortKey =
  | "order_id"
  | "created_at"
  | "order_source"
  | "outlet_name"
  | "order_status"
  | "payment_mode"
  | "sub_total"
  | "order_amount";

type SortDir = "asc" | "desc";

function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === "settled") return "success" as const;
  if (s === "pending") return "warning" as const;
  if (s === "cancelled") return "danger" as const;
  return "default" as const;
}

function sourceVariant(source: string) {
  const s = source.toLowerCase();
  if (s.includes("zomato")) return "zomato" as const;
  if (s.includes("swiggy")) return "swiggy" as const;
  if (s.includes("direct") || s.includes("pos")) return "direct" as const;
  return "default" as const;
}

interface ReportTableProps {
  orders: Order[];
  isLoading: boolean;
}

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "order_id", label: "Order ID" },
  { key: "created_at", label: "Date" },
  { key: "order_source", label: "Source" },
  { key: "outlet_name", label: "Outlet" },
  { key: "order_status", label: "Status" },
  { key: "payment_mode", label: "Payment" },
  { key: "sub_total", label: "Subtotal", align: "right" },
  { key: "order_amount", label: "Total", align: "right" },
];

export function ReportTable({ orders, isLoading }: ReportTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    const arr = [...orders];
    arr.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    return arr;
  }, [orders, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "cursor-pointer select-none whitespace-nowrap border-b border-slate-200 px-4 py-3 hover:text-slate-700",
                    col.align === "right" && "text-right"
                  )}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-slate-400"
                >
                  No orders found for this period
                </td>
              </tr>
            ) : (
              paged.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                    {order.order_id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={sourceVariant(order.order_source)}>
                      {order.order_source}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {order.outlet_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={statusVariant(order.order_status)}>
                      {order.order_status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {order.payment_mode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-slate-600">
                    {formatCurrency(order.sub_total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-800">
                    {formatCurrency(order.order_amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <span className="text-xs text-slate-500">
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length} orders
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
