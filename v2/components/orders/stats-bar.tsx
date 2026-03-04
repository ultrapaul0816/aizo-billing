"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, DollarSign, Receipt, Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderUIStore } from "@/lib/stores/orders";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

interface StatsBarProps {
  orders: Order[];
  isLoading?: boolean;
}

export function StatsBar({ orders, isLoading }: StatsBarProps) {
  const { statsBarCollapsed, toggleStatsBar } = useOrderUIStore();

  const stats = useMemo(() => {
    if (!orders.length)
      return { grossSales: 0, transactions: 0, avgDiscount: 0, pending: 0 };

    const grossSales = orders.reduce((sum, o) => sum + o.order_amount, 0);
    const transactions = orders.length;
    const totalDiscount = orders.reduce((sum, o) => sum + o.discount, 0);
    const avgDiscount = grossSales > 0 ? (totalDiscount / grossSales) * 100 : 0;
    const pending = orders.filter((o) => Number(o.order_status) < 6).length;

    return { grossSales, transactions, avgDiscount, pending };
  }, [orders]);

  const cards = [
    {
      label: "Gross Sales",
      value: formatCurrency(stats.grossSales),
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      label: "Transactions",
      value: String(stats.transactions),
      icon: Receipt,
      color: "text-blue-600",
    },
    {
      label: "Discount %",
      value: `${stats.avgDiscount.toFixed(1)}%`,
      icon: Percent,
      color: "text-amber-600",
    },
    {
      label: "Pending",
      value: String(stats.pending),
      icon: Clock,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {!statsBarCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-3 pb-3">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-3">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-24" />
                    </Card>
                  ))
                : cards.map((card) => (
                    <Card key={card.label} className="p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
                        {card.label}
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {card.value}
                      </p>
                    </Card>
                  ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleStatsBar}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 p-0 rounded-full bg-white border border-slate-200 shadow-sm z-10"
      >
        <motion.div
          animate={{ rotate: statsBarCollapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </motion.div>
      </Button>
    </div>
  );
}
