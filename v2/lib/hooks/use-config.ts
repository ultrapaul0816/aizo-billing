"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderSource } from "@/lib/api/orders";
import { getCharges, getTax } from "@/lib/api/outlets";
import { useConfigStore } from "@/lib/stores/config";

export function useOrderSources() {
  const setOrderSources = useConfigStore((s) => s.setOrderSources);

  const query = useQuery({
    queryKey: ["orderSources"],
    queryFn: getOrderSource,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) setOrderSources(query.data);
  }, [query.data, setOrderSources]);

  return query;
}

export function useCharges() {
  const setCharges = useConfigStore((s) => s.setCharges);

  const query = useQuery({
    queryKey: ["charges"],
    queryFn: getCharges,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) setCharges(query.data as unknown[]);
  }, [query.data, setCharges]);

  return query;
}

export function useTax(outletId: string | null) {
  const setTaxes = useConfigStore((s) => s.setTaxes);

  const query = useQuery({
    queryKey: ["tax", outletId],
    queryFn: () => getTax({ outlet_id: outletId }),
    enabled: !!outletId,
  });

  useEffect(() => {
    if (query.data) setTaxes(query.data as unknown[]);
  }, [query.data, setTaxes]);

  return query;
}
