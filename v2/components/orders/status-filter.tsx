"use client";

import { useOrderUIStore } from "@/lib/stores/orders";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "received", label: "Received" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "dispatched", label: "Dispatched" },
  { value: "settled", label: "Settled" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface StatusFilterProps {
  collapsed?: boolean;
  counts?: Record<string, number>;
}

export function StatusFilter({ collapsed, counts = {} }: StatusFilterProps) {
  const statusFilter = useOrderUIStore((s) => s.statusFilter);
  const setStatusFilter = useOrderUIStore((s) => s.setStatusFilter);

  if (collapsed) return null;

  return (
    <div className="px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Status
      </p>
      <ScrollArea className="w-full">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
            {STATUS_OPTIONS.map((opt) => {
              const count = opt.value === "all" ? undefined : counts[opt.value];
              return (
                <TabsTrigger
                  key={opt.value}
                  value={opt.value}
                  className="rounded-full px-2.5 py-1 text-[11px] data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none bg-transparent"
                >
                  {opt.label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-1 text-[10px] opacity-70">{count}</span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
