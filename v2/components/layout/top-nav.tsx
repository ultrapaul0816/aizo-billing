"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationCenter } from "./notification-center";
import { SettingsPopover } from "./settings-popover";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Orders", href: "/" },
  { label: "Billing", href: "/billing" },
  { label: "Reports", href: "/reports" },
] as const;

export function TopNav() {
  const pathname = usePathname();

  const handleSearchTrigger = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between flex-shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-1">
        <span className="font-display font-bold text-xl tracking-tight text-slate-900">
          Aizo
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mb-2" />
      </div>

      {/* Center: Page tabs */}
      <nav className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" || pathname === ""
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-1.5 text-sm rounded-md transition-all duration-150",
                isActive
                  ? "bg-white font-medium text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchTrigger}
          className="gap-2 text-slate-500 font-normal"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs text-slate-400 border border-slate-200 rounded px-1 py-0.5 font-mono">
            &#8984;K
          </span>
        </Button>

        {/* Notification bell */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <NotificationCenter />
          </PopoverContent>
        </Popover>

        {/* Settings gear */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none">
              <Settings className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-4">
            <SettingsPopover />
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
