"use client";

import { Volume2, VolumeX, BellRing, BellOff } from "lucide-react";
import { useConfigStore } from "@/lib/stores/config";
import { useState } from "react";

export function SettingsPopover() {
  const { soundEnabled, toggleSound } = useConfigStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="w-64">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Settings</h3>

      <div className="space-y-3">
        {/* Sound toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-slate-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
            <span className="text-sm text-slate-700">Sound Alerts</span>
          </div>
          <button
            onClick={toggleSound}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              soundEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                soundEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {notificationsEnabled ? (
              <BellRing className="h-4 w-4 text-slate-500" />
            ) : (
              <BellOff className="h-4 w-4 text-slate-400" />
            )}
            <span className="text-sm text-slate-700">Notifications</span>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              notificationsEnabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                notificationsEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
