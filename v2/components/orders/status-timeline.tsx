"use client";

import { Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/api/types";

const STEPS = [
  { status: 1, label: "Received" },
  { status: 2, label: "Accepted" },
  { status: 3, label: "Preparing" },
  { status: 4, label: "Dispatched" },
  { status: 5, label: "Delivered" },
  { status: 6, label: "Settled" },
];

interface StatusTimelineProps {
  order: Order;
}

export function StatusTimeline({ order }: StatusTimelineProps) {
  const currentStatus = Number(order.order_status);
  const isCancelled = currentStatus === 7;

  if (isCancelled) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
          <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-700">
              Order Cancelled
            </p>
            {order.order_cancel_reason && (
              <p className="text-xs text-rose-600 mt-0.5">
                {order.order_cancel_reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between px-2">
      {STEPS.map((step, i) => {
        const isCompleted = currentStatus > step.status;
        const isCurrent = currentStatus === step.status;
        const isFuture = currentStatus < step.status;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                  isCompleted &&
                    "bg-emerald-500 border-emerald-500 text-white",
                  isCurrent &&
                    "border-emerald-500 bg-white text-emerald-600 ring-4 ring-emerald-100 animate-pulse",
                  isFuture && "border-slate-300 bg-white text-slate-300"
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  step.status
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 text-center leading-tight",
                  isCompleted && "text-emerald-600 font-medium",
                  isCurrent && "text-emerald-600 font-semibold",
                  isFuture && "text-slate-400"
                )}
              >
                {step.label}
              </span>
              {isCompleted && (
                <span className="text-[9px] text-slate-400 mt-0.5">
                  {new Date(order.updated_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {/* Connecting line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 mt-[-18px]",
                  currentStatus > step.status + 1
                    ? "bg-emerald-500"
                    : currentStatus > step.status
                      ? "bg-emerald-300"
                      : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
