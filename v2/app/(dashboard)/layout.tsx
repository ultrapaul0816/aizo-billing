"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { TopNav } from "@/components/layout/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auth guard: check localStorage for user token
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed.token) {
        router.push("/login");
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    // Fetch initial data — order sources, outlets
    // These would be API calls via react-query or direct fetch
    // For now, the stores are hydrated from their respective hooks/pages
  }, [router]);

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) {
    return null;
  }

  // If no token in store, show nothing while redirecting
  if (!token) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <TopNav />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
