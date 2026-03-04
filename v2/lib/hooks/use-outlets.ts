"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listOutlets,
  toggleOutletStatus,
  listCategories,
  listProducts,
  getRiders,
  assignRider,
} from "@/lib/api/outlets";

export function useOutlets() {
  return useQuery({
    queryKey: ["outlets"],
    queryFn: listOutlets,
    staleTime: 60_000,
  });
}

export function useToggleOutlet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleOutletStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["outlets"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle outlet status");
    },
  });
}

export function useCategories(outletId: string | null) {
  return useQuery({
    queryKey: ["categories", outletId],
    queryFn: () => listCategories({ outlet_id: outletId }),
    enabled: !!outletId,
  });
}

export function useProducts(outletId: string | null, categoryId?: string | null) {
  return useQuery({
    queryKey: ["products", outletId, categoryId],
    queryFn: () =>
      listProducts({
        outlet_id: outletId,
        ...(categoryId ? { category_id: categoryId } : {}),
      }),
    enabled: !!outletId,
  });
}

export function useRiders(outletId: string | null) {
  return useQuery({
    queryKey: ["riders", outletId],
    queryFn: () => getRiders({ outlet_id: outletId }),
    enabled: !!outletId,
  });
}

export function useAssignRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignRider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["riders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to assign rider");
    },
  });
}
