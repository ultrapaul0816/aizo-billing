"use client";

import { useEffect } from "react";
import type { Order } from "@/lib/api/types";
import { useOrderUIStore } from "@/lib/stores/orders";
import type { UseMutationResult } from "@tanstack/react-query";

type ChangeStatusMutation = UseMutationResult<unknown, Error, Record<string, unknown>>;

export function useKeyboardShortcuts(
  orders: Order[] | undefined,
  changeStatus: ChangeStatusMutation
) {
  const selectedOrderId = useOrderUIStore((s) => s.selectedOrderId);
  const selectOrder = useOrderUIStore((s) => s.selectOrder);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // ⌘K / Ctrl+K — command palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
        return;
      }

      if (!orders?.length) return;

      const currentIndex = orders.findIndex((o) => o.order_id === selectedOrderId);
      const selected = currentIndex >= 0 ? orders[currentIndex] : null;

      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          const next = currentIndex <= 0 ? orders.length - 1 : currentIndex - 1;
          selectOrder(orders[next].order_id);
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          const next = currentIndex >= orders.length - 1 ? 0 : currentIndex + 1;
          selectOrder(orders[next].order_id);
          break;
        }
        case "a": {
          if (selected && String(selected.order_status) === "1") {
            changeStatus.mutate({ order_id: selected.order_id, order_status: 2 });
          }
          break;
        }
        case "p": {
          if (selected && String(selected.order_status) === "2") {
            changeStatus.mutate({ order_id: selected.order_id, order_status: 3 });
          }
          break;
        }
        case "d": {
          if (selected && String(selected.order_status) === "3") {
            changeStatus.mutate({ order_id: selected.order_id, order_status: 4 });
          }
          break;
        }
        case "s": {
          const st = String(selected?.order_status);
          if (selected && (st === "4" || st === "5")) {
            changeStatus.mutate({ order_id: selected.order_id, order_status: 6 });
          }
          break;
        }
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [orders, selectedOrderId, selectOrder, changeStatus]);
}
