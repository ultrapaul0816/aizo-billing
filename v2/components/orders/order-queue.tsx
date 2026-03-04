"use client";

import { Search, Package } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useOrders } from "@/lib/hooks/use-orders";
import { OrderCard } from "./order-card";
import type { Order } from "@/lib/api/types";

export function OrderQueue() {
  const { searchQuery, setSearchQuery } = useOrderUIStore();
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative px-1 pb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="pl-9"
        />
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 px-1 pb-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="py-3 px-4 rounded-xl border border-slate-200 bg-white space-y-2"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            ))
          ) : !orders?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">No orders found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {orders.map((order: Order) => (
                <OrderCard key={order.order_id} order={order} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
