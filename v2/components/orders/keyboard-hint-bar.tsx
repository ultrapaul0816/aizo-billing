"use client";

import { cn } from "@/lib/utils";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded bg-white/15 font-mono text-[11px] leading-none">
      {children}
    </kbd>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <Kbd>{keys}</Kbd>
      <span className="text-white/70">{label}</span>
    </span>
  );
}

export function KeyboardHintBar() {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex items-center justify-center gap-5",
        "h-8 text-xs text-white",
        "bg-slate-900/90 backdrop-blur"
      )}
    >
      <Shortcut keys="⌘K" label="Search" />
      <Shortcut keys="↑↓" label="Navigate" />
      <Shortcut keys="A" label="Accept" />
      <Shortcut keys="P" label="Prepare" />
      <Shortcut keys="D" label="Dispatch" />
      <Shortcut keys="S" label="Settle" />
    </div>
  );
}
