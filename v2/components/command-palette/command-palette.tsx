"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Store,
  Plus,
  BarChart3,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useOutletUIStore } from "@/lib/stores/outlets";
import { cn, formatCurrency } from "@/lib/utils";
import type { Order, Outlet } from "@/lib/api/types";

// ── Types ──

interface ResultItem {
  id: string;
  section: "Orders" | "Outlets" | "Actions";
  label: string;
  sublabel?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "destructive";
  icon?: React.ReactNode;
  onSelect: () => void;
}

// ── Component ──

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const selectOrder = useOrderUIStore((s) => s.selectOrder);
  const selectOutlet = useOutletUIStore((s) => s.selectOutlet);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Open via Cmd+K or custom event
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    function handleCustomEvent() {
      setOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomEvent);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // Build results
  const results = useMemo(() => {
    const items: ResultItem[] = [];
    const q = debouncedQuery.toLowerCase();

    // Orders from cache
    const cachedOrders =
      (queryClient.getQueryData<Order[]>(["orders"]) ?? []);
    const matchedOrders = cachedOrders
      .filter((o) => {
        if (!q) return true;
        return (
          o.order_id.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q)
        );
      })
      .slice(0, 5);

    for (const order of matchedOrders) {
      items.push({
        id: `order-${order.order_id}`,
        section: "Orders",
        label: `#${order.order_id} - ${order.customer_name || "Guest"}`,
        sublabel: formatCurrency(order.order_amount),
        badge: order.order_source || undefined,
        badgeVariant: "default",
        icon: <ShoppingBag className="h-4 w-4 text-slate-400" />,
        onSelect: () => {
          selectOrder(order.order_id);
          close();
        },
      });
    }

    // Outlets from cache
    const cachedOutlets =
      (queryClient.getQueryData<Outlet[]>(["outlets"]) ?? []);
    const matchedOutlets = cachedOutlets
      .filter((o) => {
        if (!q) return true;
        return o.outlet_name?.toLowerCase().includes(q);
      })
      .slice(0, 5);

    for (const outlet of matchedOutlets) {
      items.push({
        id: `outlet-${outlet.id}`,
        section: "Outlets",
        label: outlet.outlet_name,
        sublabel: `${outlet.pending_order} pending`,
        badge: outlet.is_pos_open ? "Open" : "Closed",
        badgeVariant: outlet.is_pos_open ? "success" : "destructive",
        icon: <Store className="h-4 w-4 text-slate-400" />,
        onSelect: () => {
          selectOutlet(String(outlet.id));
          close();
          router.push("/");
        },
      });
    }

    // Actions
    const actions: ResultItem[] = [
      {
        id: "action-new-order",
        section: "Actions",
        label: "New Order",
        icon: <Plus className="h-4 w-4 text-slate-400" />,
        onSelect: () => {
          close();
          router.push("/billing");
        },
      },
      {
        id: "action-reports",
        section: "Actions",
        label: "View Reports",
        icon: <BarChart3 className="h-4 w-4 text-slate-400" />,
        onSelect: () => {
          close();
          router.push("/reports");
        },
      },
    ];

    const filteredActions = actions.filter((a) =>
      !q ? true : a.label.toLowerCase().includes(q),
    );
    items.push(...filteredActions);

    return items;
  }, [debouncedQuery, queryClient, selectOrder, selectOutlet, close, router]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.onSelect();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, { items: ResultItem[]; startIndex: number }>();
    let idx = 0;
    for (const item of results) {
      if (!map.has(item.section)) {
        map.set(item.section, { items: [], startIndex: idx });
      }
      map.get(item.section)!.items.push(item);
      idx++;
    }
    return map;
  }, [results]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders, outlets, actions..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[360px] overflow-y-auto p-2"
            >
              {results.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                  No results found
                </div>
              )}

              {Array.from(sections.entries()).map(
                ([section, { items, startIndex }]) => (
                  <div key={section} className="mb-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {section}
                    </div>
                    {items.map((item, i) => {
                      const globalIndex = startIndex + i;
                      return (
                        <button
                          key={item.id}
                          data-index={globalIndex}
                          onClick={item.onSelect}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            globalIndex === activeIndex
                              ? "bg-slate-100"
                              : "hover:bg-slate-50",
                          )}
                        >
                          {item.icon}
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium text-slate-800">
                              {item.label}
                            </div>
                            {item.sublabel && (
                              <div className="truncate text-xs text-slate-500">
                                {item.sublabel}
                              </div>
                            )}
                          </div>
                          {item.badge && (
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                item.badgeVariant === "success" &&
                                  "bg-green-100 text-green-700",
                                item.badgeVariant === "destructive" &&
                                  "bg-red-100 text-red-700",
                                item.badgeVariant === "default" &&
                                  "bg-slate-100 text-slate-600",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ),
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-slate-400">
              <span>
                <kbd className="rounded border bg-slate-100 px-1 py-0.5 text-[10px]">
                  &uarr;&darr;
                </kbd>{" "}
                navigate{" "}
                <kbd className="rounded border bg-slate-100 px-1 py-0.5 text-[10px]">
                  &crarr;
                </kbd>{" "}
                select
              </span>
              <span>
                <kbd className="rounded border bg-slate-100 px-1 py-0.5 text-[10px]">
                  Cmd+K
                </kbd>{" "}
                toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
