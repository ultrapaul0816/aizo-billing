"use client";

import { useState, useMemo } from "react";
import { Search, Store } from "lucide-react";
import { useCategories, useProducts } from "@/lib/hooks/use-outlets";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface MenuPanelProps {
  outletId: string | null;
}

export function MenuPanel({ outletId }: MenuPanelProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { data: categories, isLoading: catLoading } = useCategories(outletId);
  const { data: products, isLoading: prodLoading } = useProducts(
    outletId,
    activeCategoryId
  );

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.product_name.toLowerCase().includes(q));
  }, [products, search]);

  if (!outletId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400 gap-3">
        <Store className="h-12 w-12 stroke-1" />
        <p className="text-sm font-medium">Select an outlet to view the menu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Search */}
      <div className="p-4 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 pt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              activeCategoryId === null
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            )}
          >
            All
          </button>
          {catLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
              ))
            : categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveCategoryId(
                      activeCategoryId === String(cat.id) ? null : String(cat.id)
                    )
                  }
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    activeCategoryId === String(cat.id)
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {cat.category_name}
                </button>
              ))}
        </div>
      </div>

      {/* Product grid */}
      <ScrollArea className="flex-1 px-4 pt-2 pb-4">
        {prodLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-slate-400">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
