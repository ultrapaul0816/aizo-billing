"use client";

import {
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  CircleDollarSign,
} from "lucide-react";
import { usePaymentMethods } from "@/lib/hooks/use-orders";
import { useCartStore } from "@/lib/stores/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PaymentGridProps {
  outletId: string | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  cash: Banknote,
  card: CreditCard,
  upi: QrCode,
  paytm: Smartphone,
  razorpay: CircleDollarSign,
  wallet: Wallet,
};

function getIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return Icon;
  }
  return Wallet;
}

export function PaymentGrid({ outletId }: PaymentGridProps) {
  const { data: methods, isLoading } = usePaymentMethods(outletId);
  const paymentMode = useCartStore((s) => s.paymentMode);
  const setPaymentMode = useCartStore((s) => s.setPaymentMode);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    );
  }

  const activeMethods = Array.isArray(methods)
    ? methods.filter((m) => m.is_active !== false)
    : [];

  if (activeMethods.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        Payment Mode
      </p>
      <div className="grid grid-cols-3 gap-2">
        {activeMethods.map((m) => {
          const Icon = getIcon(m.name);
          const isActive =
            paymentMode === m.name ||
            paymentMode === String(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setPaymentMode(m.name)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border py-2 px-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "ring-2 ring-slate-900 bg-slate-50 border-slate-900 text-slate-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{m.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
