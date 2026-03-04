"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useDiscounts } from "@/lib/hooks/use-orders";
import { useCartStore } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";

interface DiscountInputProps {
  outletId: string | null;
  onClose: () => void;
}

export function DiscountInput({ outletId, onClose }: DiscountInputProps) {
  const { data: discounts } = useDiscounts(outletId);
  const setDiscount = useCartStore((s) => s.setDiscount);
  const currentDiscount = useCartStore((s) => s.discount);

  const [manualType, setManualType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [manualValue, setManualValue] = useState("");

  function applyPreset(d: Record<string, unknown>) {
    setDiscount({
      type: d.type === "percentage" || d.type === "%" ? "percentage" : "fixed",
      value: Number(d.value || d.amount || d.discount_value),
      name: String(d.name || d.discount_name || ""),
    });
    onClose();
  }

  function applyManual() {
    const val = Number(manualValue);
    if (!val || val <= 0) return;
    setDiscount({
      type: manualType,
      value: val,
      name: manualType === "percentage" ? `${val}% off` : `${formatCurrency(val)} off`,
    });
    onClose();
  }

  function clearDiscount() {
    setDiscount(null);
    onClose();
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Apply Discount</p>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Preset discounts */}
      {Array.isArray(discounts) && discounts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {discounts.map((d: Record<string, unknown>, i: number) => {
            const isPercent =
              d.type === "percentage" || d.type === "%";
            const val = Number(d.value || d.amount || d.discount_value);
            const name = String(d.name || d.discount_name || `Discount ${i + 1}`);
            return (
              <button
                key={i}
                onClick={() => applyPreset(d)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  currentDiscount?.name === name
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {name} ({isPercent ? `${val}%` : formatCurrency(val)})
              </button>
            );
          })}
        </div>
      )}

      {/* Manual discount */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setManualType("percentage")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              manualType === "percentage"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            %
          </button>
          <button
            onClick={() => setManualType("fixed")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors border-l border-slate-200",
              manualType === "fixed"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            ₹
          </button>
        </div>
        <Input
          type="number"
          placeholder={manualType === "percentage" ? "Enter %" : "Enter amount"}
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          className="h-8 text-sm flex-1"
        />
        <Button size="sm" className="h-8 px-3 text-xs" onClick={applyManual}>
          Apply
        </Button>
      </div>

      {/* Clear */}
      {currentDiscount && (
        <button
          onClick={clearDiscount}
          className="text-xs text-rose-500 hover:text-rose-700 transition-colors"
        >
          Remove discount
        </button>
      )}
    </div>
  );
}
