"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Outlet } from "@/lib/api/types";

interface OutletItemProps {
  outlet: Outlet;
  isSelected: boolean;
  collapsed: boolean;
  onSelect: (id: number) => void;
}

export function OutletItem({
  outlet,
  isSelected,
  collapsed,
  onSelect,
}: OutletItemProps) {
  const initials = outlet.outlet_name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const content = (
    <button
      onClick={() => onSelect(outlet.id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors",
        "hover:bg-slate-50",
        isSelected && "bg-slate-100 border-l-2 border-slate-900",
        collapsed && "justify-center px-0"
      )}
    >
      {collapsed ? (
        <div className="relative">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold",
              isSelected
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700"
            )}
          >
            {initials}
          </div>
          {/* Status dot */}
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
              outlet.is_pos_open ? "bg-emerald-500" : "bg-rose-500"
            )}
          />
          {/* Pending badge */}
          {outlet.pending_order > 0 && (
            <span className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
              {outlet.pending_order}
            </span>
          )}
        </div>
      ) : (
        <>
          <span
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              outlet.is_pos_open ? "bg-emerald-500" : "bg-rose-500"
            )}
          />
          <span className="flex-1 text-sm font-medium text-slate-700 truncate">
            {outlet.outlet_name}
          </span>
          {outlet.pending_order > 0 && (
            <Badge variant="danger" className="text-[10px] px-1.5 py-0">
              {outlet.pending_order}
            </Badge>
          )}
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p className="font-medium">{outlet.outlet_name}</p>
          <p className="text-slate-400 text-[10px]">
            {outlet.is_pos_open ? "Open" : "Closed"} · {outlet.pending_order}{" "}
            pending
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
