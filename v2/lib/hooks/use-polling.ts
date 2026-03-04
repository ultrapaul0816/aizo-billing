"use client";

import { useQuery } from "@tanstack/react-query";
import { pollNewOrders } from "@/lib/api/orders";

export function useNewOrderPoller() {
  return useQuery({
    queryKey: ["newOrders"],
    queryFn: pollNewOrders,
    refetchInterval: 5000,
  });
}
