"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useChangeStatus } from "@/lib/hooks/use-orders";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

const SOURCE_VARIANT: Record<string, "zomato" | "swiggy" | "direct"> = {
  zomato: "zomato",
  swiggy: "swiggy",
  direct: "direct",
};

const ACTION_CONFIG: Record<
  number,
  { label: string; variant: "success" | "warning" | "default" }
> = {
  1: { label: "Accept", variant: "success" },
  2: { label: "Prepare", variant: "warning" },
  3: { label: "Dispatch", variant: "default" },
  4: { label: "Settle", variant: "default" },
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { selectedOrderId, selectOrder } = useOrderUIStore();
  const changeStatus = useChangeStatus();
  const status = Number(order.order_status);
  const isSelected = selectedOrderId === order.order_id;
  const action = ACTION_CONFIG[status];
  const itemCount = order.items?.length ?? 0;

  function handleAction(e: React.MouseEvent) {
    e.stopPropagation();
    const nextStatus = status === 4 ? 6 : status + 1;
    changeStatus.mutate({ order_id: order.order_id, status: nextStatus });
  }

  return (
    <motion.div
      layout
      layoutId={order.order_id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      onClick={() => selectOrder(order.order_id)}
      className={cn(
        "py-3 px-4 rounded-xl border bg-white cursor-pointer transition-shadow hover:shadow-sm",
        isSelected
          ? "ring-2 ring-slate-900 border-slate-900"
          : "border-slate-200"
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-900">
          #{order.order_id}
        </span>
        <Badge
          variant={
            SOURCE_VARIANT[order.order_source?.toLowerCase()] ?? "default"
          }
        >
          {order.order_source || "Direct"}
        </Badge>
      </div>

      {/* Middle row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-600 truncate max-w-[60%]">
          {order.customer_name || "Walk-in"}
        </span>
        <span className="text-sm font-medium text-slate-900">
          {formatCurrency(order.order_amount)}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {itemCount} item{itemCount !== 1 ? "s" : ""} &middot;{" "}
          {formatRelativeTime(order.created_at)}
        </span>
        {action && (
          <Button
            size="sm"
            variant={action.variant}
            onClick={handleAction}
            disabled={changeStatus.isPending}
            className="h-7 px-3 text-xs"
          >
            {action.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
