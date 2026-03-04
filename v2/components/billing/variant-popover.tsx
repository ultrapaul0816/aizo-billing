"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/stores/cart";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/lib/api/types";

interface VariantPopoverProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function VariantPopover({
  product,
  open,
  onOpenChange,
  children,
}: VariantPopoverProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] ?? null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    Record<string, boolean>
  >({});
  const [qty, setQty] = useState(1);

  function resetState() {
    setSelectedVariant(product.variants?.[0] ?? null);
    setSelectedAddOns({});
    setQty(1);
  }

  function toggleAddOn(name: string) {
    setSelectedAddOns((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function handleAdd() {
    const addOns = product.add_ons
      ?.filter((a) => selectedAddOns[a.name])
      .map((a) => ({ name: a.name, price: a.price })) ?? [];

    addItem({
      productId: String(product.id) +
        (selectedVariant ? `-${selectedVariant.id}` : "") +
        (addOns.length ? `-${addOns.map((a) => a.name).join(",")}` : ""),
      name: product.product_name,
      price: selectedVariant ? selectedVariant.price : product.price,
      quantity: qty,
      variant: selectedVariant
        ? { name: selectedVariant.name, price: selectedVariant.price }
        : undefined,
      addOns,
      isVeg: product.is_veg,
    });

    toast.success(`${product.product_name} added`);
    onOpenChange(false);
    resetState();
  }

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetState();
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
        <div className="p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {product.product_name}
          </p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Variant
              </p>
              <div className="space-y-1">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                      selectedVariant?.id === v.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span>{v.name}</span>
                    <span className="font-medium">{formatCurrency(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {product.add_ons?.length > 0 && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Add-ons
                </p>
                <div className="space-y-1">
                  {product.add_ons.map((a) => (
                    <button
                      key={a.name}
                      onClick={() => toggleAddOn(a.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                        selectedAddOns[a.name]
                          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-4 w-4 rounded border-2 flex items-center justify-center text-[10px] transition-colors",
                            selectedAddOns[a.name]
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300"
                          )}
                        >
                          {selectedAddOns[a.name] && "✓"}
                        </span>
                        {a.name}
                      </span>
                      <span className="font-medium">
                        +{formatCurrency(a.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <Button onClick={handleAdd} className="w-full" size="sm">
            Add to Cart
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
