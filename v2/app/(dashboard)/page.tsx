"use client";

import { OutletPanel } from "@/components/orders/outlet-panel";
import { OrderQueue } from "@/components/orders/order-queue";
import { OrderDetail } from "@/components/orders/order-detail";
import { StatsBar } from "@/components/orders/stats-bar";
import { KeyboardHintBar } from "@/components/orders/keyboard-hint-bar";
import { useOrders, useChangeStatus } from "@/lib/hooks/use-orders";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";

export default function OrdersPage() {
  const { data: orders = [] } = useOrders();
  const changeStatus = useChangeStatus();

  useKeyboardShortcuts(orders, changeStatus);

  return (
    <div className="h-full overflow-hidden grid grid-cols-[auto_1fr_1.2fr]">
      {/* Left — Outlet selector */}
      <OutletPanel />

      {/* Center — Stats + Order queue */}
      <div className="flex flex-col overflow-hidden border-x border-border">
        <StatsBar orders={orders} />
        <OrderQueue />
      </div>

      {/* Right — Order detail */}
      <OrderDetail />

      <KeyboardHintBar />
    </div>
  );
}
