"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/api/types";
import { VariantPopover } from "./variant-popover";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const hasOptions =
    (product.variants && product.variants.length > 0) ||
    (product.add_ons && product.add_ons.length > 0);

  function handleClick() {
    if (hasOptions) {
      setPopoverOpen(true);
      return;
    }
    addItem({
      productId: String(product.id),
      name: product.product_name,
      price: product.price,
      quantity: 1,
      addOns: [],
      isVeg: product.is_veg,
    });
    toast.success(`${product.product_name} added`);
  }

  const card = (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="flex flex-col rounded-xl border border-slate-200 bg-white text-left transition-shadow hover:shadow-md overflow-hidden w-full"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ShoppingBag className="h-8 w-8 text-slate-300" />
        )}
        {/* Veg / Non-veg dot */}
        <span
          className={`absolute top-2 right-2 h-3 w-3 rounded-sm border-2 flex items-center justify-center ${
            product.is_veg
              ? "border-green-600"
              : "border-red-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              product.is_veg ? "bg-green-600" : "bg-red-600"
            }`}
          />
        </span>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-0.5">
        <span className="text-sm font-medium text-slate-900 line-clamp-1">
          {product.product_name}
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {formatCurrency(product.price)}
        </span>
      </div>
    </motion.button>
  );

  if (!hasOptions) return card;

  return (
    <VariantPopover
      product={product}
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      {card}
    </VariantPopover>
  );
}
