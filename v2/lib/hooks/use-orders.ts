"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAllOrders,
  getOrderDetails,
  changeOrderStatus,
  cancelOrder,
  placeOrder,
  editOrder,
  settleOrder,
  getDiscounts,
  getPaymentMethods,
} from "@/lib/api/orders";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useOutletUIStore } from "@/lib/stores/outlets";
import type { Order } from "@/lib/api/types";

// ── helpers ──

const STATUS_SETTLED = 7;

function matchesSearch(order: Order, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    order.order_id.toLowerCase().includes(q) ||
    order.customer_name.toLowerCase().includes(q) ||
    order.customer_phone.includes(q)
  );
}

// ── queries ──

export function useOrders() {
  const { statusFilter, sourceFilter, searchQuery } = useOrderUIStore();
  const selectedOutletId = useOutletUIStore((s) => s.selectedOutletId);

  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
    refetchInterval: 5000,
    select(data: Order[]) {
      return data.filter((o) => {
        if (selectedOutletId && String(o.outlet_id) !== selectedOutletId)
          return false;
        if (statusFilter !== "all" && o.order_status !== statusFilter)
          return false;
        if (sourceFilter !== "all" && o.order_source !== sourceFilter)
          return false;
        if (!matchesSearch(o, searchQuery)) return false;
        return true;
      });
    },
  });
}

export function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderDetails({ order_id: id }),
    enabled: !!id,
    refetchInterval(query) {
      const order = query.state.data as Order | undefined;
      if (order && Number(order.order_status) >= STATUS_SETTLED) return false;
      return 4000;
    },
  });
}

export function useDiscounts(outletId: string | null) {
  return useQuery({
    queryKey: ["discounts", outletId],
    queryFn: () => getDiscounts({ outlet_id: outletId }),
    enabled: !!outletId,
  });
}

export function usePaymentMethods(outletId: string | null) {
  return useQuery({
    queryKey: ["paymentMethods", outletId],
    queryFn: () => getPaymentMethods({ outlet_id: outletId }),
    enabled: !!outletId,
  });
}

// ── mutations ──

export function useChangeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: changeOrderStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to change order status");
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel order");
    },
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to place order");
    },
  });
}

export function useEditOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: editOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to edit order");
    },
  });
}

export function useSettleOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settleOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to settle order");
    },
  });
}
