"use client";

import { useRef, useMemo } from "react";
import { toast } from "sonner";
import { useNewOrderPoller } from "@/lib/hooks/use-polling";
import { useAudioAlerts } from "@/lib/hooks/use-audio-alerts";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

export function useOrderNotifications() {
  const { data: orders } = useNewOrderPoller();
  const { playAlert, speakText } = useAudioAlerts();
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const newOrderCount = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return 0;

    const currentIds = new Set(
      (orders as Order[]).map((o) => o.order_id),
    );

    // On first load, seed the seen set without alerting
    if (!initializedRef.current) {
      initializedRef.current = true;
      seenIdsRef.current = currentIds;
      return 0;
    }

    let count = 0;

    for (const order of orders as Order[]) {
      if (!seenIdsRef.current.has(order.order_id)) {
        count++;
        seenIdsRef.current.add(order.order_id);

        playAlert();
        speakText("New order received");

        toast.success(`New Order: ${order.order_id}`, {
          description: `${order.customer_name || "Guest"} - ${formatCurrency(order.order_amount)}`,
          duration: 5000,
        });
      }
    }

    return count;
  }, [orders, playAlert, speakText]);

  return { newOrderCount };
}
