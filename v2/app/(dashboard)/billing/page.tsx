"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOutlets } from "@/lib/hooks/use-outlets";
import { useCartStore } from "@/lib/stores/cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuPanel } from "@/components/billing/menu-panel";
import { CartPanel } from "@/components/billing/cart-panel";

export default function BillingPage() {
  const { data: outlets, isLoading: outletsLoading } = useOutlets();
  const outletId = useCartStore((s) => s.outletId);
  const setOutletId = useCartStore((s) => s.setOutletId);

  // Auto-select first outlet if none selected
  useEffect(() => {
    if (!outletId && outlets?.length) {
      setOutletId(String(outlets[0].id));
    }
  }, [outletId, outlets, setOutletId]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="h-5 w-px bg-slate-200" />

        <h1 className="text-lg font-semibold text-slate-900">Billing</h1>

        <div className="ml-auto w-56">
          <Select
            value={outletId ?? ""}
            onValueChange={(val) => setOutletId(val)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              {outletsLoading ? (
                <SelectItem value="_loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                outlets?.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    {o.outlet_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 grid grid-cols-[1.2fr_1fr] overflow-hidden">
        <MenuPanel outletId={outletId} />
        <CartPanel outletId={outletId} />
      </div>
    </div>
  );
}
