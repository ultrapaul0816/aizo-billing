"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOutlets } from "@/lib/hooks/use-outlets";
import { useOutletUIStore } from "@/lib/stores/outlets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OutletItem } from "./outlet-item";
import { SourceFilter } from "./source-filter";
import { StatusFilter } from "./status-filter";

interface OutletPanelProps {
  statusCounts?: Record<string, number>;
}

export function OutletPanel({ statusCounts }: OutletPanelProps) {
  const { data: outlets = [] } = useOutlets();
  const selectedOutletId = useOutletUIStore((s) => s.selectedOutletId);
  const panelCollapsed = useOutletUIStore((s) => s.panelCollapsed);
  const selectOutlet = useOutletUIStore((s) => s.selectOutlet);
  const togglePanel = useOutletUIStore((s) => s.togglePanel);

  const totalPending = useMemo(
    () => outlets.reduce((sum, o) => sum + o.pending_order, 0),
    [outlets]
  );

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        layout
        className={cn(
          "flex flex-col border-r border-slate-200 bg-white h-full shrink-0 overflow-hidden"
        )}
        animate={{ width: panelCollapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Header / Toggle */}
        <div
          className={cn(
            "flex items-center border-b border-slate-100 px-3 py-2.5",
            panelCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <AnimatePresence mode="wait">
            {!panelCollapsed && (
              <motion.span
                key="title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-semibold text-slate-900"
              >
                Outlets
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500"
            onClick={togglePanel}
          >
            {panelCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Scrollable outlet list */}
        <ScrollArea className="flex-1">
          <div className="py-1">
            {/* All Outlets option */}
            {panelCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => selectOutlet(null)}
                    className={cn(
                      "w-full flex items-center justify-center py-2.5",
                      "hover:bg-slate-50"
                    )}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          selectedOutletId === null
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-700"
                        )}
                      >
                        <Store className="h-4 w-4" />
                      </div>
                      {totalPending > 0 && (
                        <span className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                          {totalPending}
                        </span>
                      )}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">All Outlets</p>
                  <p className="text-slate-400 text-[10px]">
                    {totalPending} pending
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => selectOutlet(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
                  "hover:bg-slate-50",
                  selectedOutletId === null &&
                    "bg-slate-100 border-l-2 border-slate-900"
                )}
              >
                <Store className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="flex-1 text-sm font-medium text-slate-700">
                  All Outlets
                </span>
                {totalPending > 0 && (
                  <Badge variant="danger" className="text-[10px] px-1.5 py-0">
                    {totalPending}
                  </Badge>
                )}
              </button>
            )}

            {/* Divider */}
            <div className="mx-3 my-1 border-t border-slate-100" />

            {/* Outlet items */}
            {outlets.map((outlet) => (
              <OutletItem
                key={outlet.id}
                outlet={outlet}
                isSelected={selectedOutletId === String(outlet.id)}
                collapsed={panelCollapsed}
                onSelect={(id) => selectOutlet(String(id))}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Filters at bottom */}
        <div className="border-t border-slate-100">
          <SourceFilter collapsed={panelCollapsed} />
          <StatusFilter
            collapsed={panelCollapsed}
            counts={statusCounts}
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
