"use client";

import { cn } from "@/lib/utils";
import { useOrderUIStore } from "@/lib/stores/orders";
import { useConfigStore } from "@/lib/stores/config";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SOURCE_COLORS: Record<string, string> = {
  zomato: "bg-[#E23744] text-white",
  swiggy: "bg-[#FC8019] text-white",
  phone: "bg-violet-600 text-white",
  "walk-in": "bg-emerald-600 text-white",
  dunzo: "bg-[#00D290] text-white",
  direct: "bg-purple-600 text-white",
};

function getSourceColor(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "-");
  return SOURCE_COLORS[key] || "bg-slate-700 text-white";
}

interface SourceFilterProps {
  collapsed?: boolean;
}

export function SourceFilter({ collapsed }: SourceFilterProps) {
  const sourceFilter = useOrderUIStore((s) => s.sourceFilter);
  const setSourceFilter = useOrderUIStore((s) => s.setSourceFilter);
  const orderSources = useConfigStore((s) => s.orderSources);

  if (collapsed) return null;

  return (
    <div className="px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Source
      </p>
      <ScrollArea className="w-full">
        <div className="flex gap-1.5 pb-1">
          <button
            onClick={() => setSourceFilter("all")}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              sourceFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            All
          </button>
          {orderSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSourceFilter(String(source.id))}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                sourceFilter === String(source.id)
                  ? getSourceColor(source.source_name)
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {source.source_name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
