"use client";

import { ClipboardList, Printer, Receipt, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useOrderDetail } from "@/lib/hooks/use-orders";
import { StatusTimeline } from "./status-timeline";
import { CustomerInfo } from "./customer-info";
import { OrderItemsList } from "./order-items-list";
import { ChargesBreakdown } from "./charges-breakdown";
import { RiderAssignment } from "./rider-assignment";

export function OrderDetail() {
  const selectedOrderId = useOrderUIStore((s) => s.selectedOrderId);
  const { data: order, isLoading } = useOrderDetail(selectedOrderId);

  if (!selectedOrderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <ClipboardList className="h-12 w-12 mb-3" />
        <p className="text-sm font-medium">Select an order to view details</p>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const status = Number(order.order_status);
  const isCancelled = status === 7;
  const isActive = status < 7;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Badge variant={isCancelled ? "danger" : "success"} className="text-sm px-3 py-1">
            #{order.order_id}
          </Badge>
          {order.outlet_name && (
            <span className="text-xs text-slate-400">{order.outlet_name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-3.5 w-3.5" />
            Print KOT
          </Button>
          <Button variant="outline" size="sm">
            <Receipt className="h-3.5 w-3.5" />
            Print Bill
          </Button>
          {isActive && (
            <Button variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Status Timeline */}
          <section>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Status
            </h4>
            <StatusTimeline order={order} />
          </section>

          <Separator />

          {/* Customer Info */}
          <section>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Customer
            </h4>
            <CustomerInfo order={order} />
          </section>

          <Separator />

          {/* Order Items */}
          <section>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Items ({order.items?.length ?? 0})
            </h4>
            <OrderItemsList items={order.items} />
          </section>

          <Separator />

          {/* Charges */}
          <section>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Charges
            </h4>
            <ChargesBreakdown order={order} />
          </section>

          {/* Rider Assignment */}
          {status >= 4 && (
            <>
              <Separator />
              <section>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Delivery
                </h4>
                <RiderAssignment order={order} />
              </section>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
