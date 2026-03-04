"use client";

import { Bell } from "lucide-react";

export function NotificationCenter() {
  return (
    <div className="w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
        <button className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Bell className="h-8 w-8 mb-2 stroke-[1.5]" />
          <p className="text-sm font-medium">No new notifications</p>
          <p className="text-xs mt-1">Orders and alerts will appear here</p>
        </div>

        {/* Future: notification items would render here
        <div className="space-y-1">
          <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 font-medium">#ORD-1234</p>
              <p className="text-xs text-slate-500 truncate">New order from Zomato</p>
              <p className="text-xs text-slate-400 mt-0.5">2m ago</p>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
