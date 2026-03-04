"use client";

import { useState, useCallback } from "react";
import {
  User,
  Search,
  Truck,
  UtensilsCrossed,
  ShoppingBag,
  Printer,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart";
import { useTax } from "@/lib/hooks/use-config";
import { usePlaceOrder, useSettleOrder } from "@/lib/hooks/use-orders";
import { searchCustomer } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import type { Customer } from "@/lib/api/types";
import { CartItemRow } from "./cart-item";
import { DiscountInput } from "./discount-input";
import { PaymentGrid } from "./payment-grid";

interface CartPanelProps {
  outletId: string | null;
}

export function CartPanel({ outletId }: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const orderType = useCartStore((s) => s.orderType);
  const discount = useCartStore((s) => s.discount);
  const setCustomer = useCartStore((s) => s.setCustomer);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);


  const { data: taxes } = useTax(outletId);
  const placeOrder = usePlaceOrder();
  const settleOrder = useSettleOrder();

  const [showDiscount, setShowDiscount] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);

  // Calculate tax rate from taxes data
  const taxRate = Array.isArray(taxes)
    ? taxes.reduce((sum: number, t: Record<string, unknown>) => sum + (Number(t.rate || t.tax_rate || t.value) || 0), 0)
    : 0;

  const subtotal = getSubtotal();
  const discountAmount =
    discount?.type === "percentage"
      ? subtotal * (discount.value / 100)
      : discount?.value ?? 0;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * (taxRate / 100);
  const grandTotal = afterDiscount + taxAmount;

  const handleCustomerSearch = useCallback(
    async (phone: string) => {
      setCustomerSearch(phone);
      if (phone.length < 3) {
        setCustomerResults([]);
        return;
      }
      try {
        setSearching(true);
        const results = await searchCustomer({ phone });
        setCustomerResults(results ?? []);
      } catch {
        setCustomerResults([]);
      } finally {
        setSearching(false);
      }
    },
    []
  );

  const handleSettle = useCallback(async () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      const orderResult = await placeOrder.mutateAsync({
        outlet_id: outletId,
        items,
        customer,
        order_type: orderType,
        discount,
        payment_mode: useCartStore.getState().paymentMode,
      } as Record<string, unknown>);

      const result = orderResult as Record<string, unknown>;
      await settleOrder.mutateAsync({
        order_id: result?.order_id ?? result?.id,
        payment_mode: useCartStore.getState().paymentMode,
      } as Record<string, unknown>);

      toast.success("Order settled successfully");
      clearCart();
    } catch {
      // Error handled by mutation hooks
    }
  }, [items, outletId, customer, orderType, discount, placeOrder, settleOrder, clearCart]);

  const orderTypes = [
    { value: "delivery" as const, label: "Delivery", icon: Truck },
    { value: "dinein" as const, label: "Dine-in", icon: UtensilsCrossed },
    { value: "takeaway" as const, label: "Takeaway", icon: ShoppingBag },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Customer section */}
      <div className="p-4 pb-3 space-y-3">
        {customer ? (
          <div className="flex items-start justify-between rounded-lg bg-slate-50 p-3">
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {customer.name}
                </p>
                <p className="text-xs text-slate-500">{customer.phone}</p>
                {customer.address && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {customer.address}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCustomer(null)}
              className="text-xs h-7"
            >
              Change
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search customer by phone..."
              value={customerSearch}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              className="pl-9 h-9"
            />
            {/* Search results dropdown */}
            {customerResults.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                {customerResults.map((c) => (
                  <button
                    key={c.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      setCustomer({
                        name: c.name,
                        phone: c.phone,
                        address: c.address || "",
                        email: c.email || "",
                      });
                      setCustomerSearch("");
                      setCustomerResults([]);
                    }}
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500">{c.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searching && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-center text-sm text-slate-400">
                Searching...
              </div>
            )}
          </div>
        )}

        {/* Order type */}
        <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1">
          {orderTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setOrderType(t.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all duration-200",
                orderType === t.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Cart items */}
      <ScrollArea className="flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
            <ShoppingBag className="h-8 w-8 stroke-1" />
            <p className="text-sm">Cart is empty</p>
          </div>
        ) : (
          <div className="p-4 space-y-1">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer: totals, discount, payment, actions */}
      <div className="border-t border-slate-200 bg-slate-50/50">
        {/* Discount */}
        <div className="px-4 pt-3">
          {showDiscount ? (
            <DiscountInput
              outletId={outletId}
              onClose={() => setShowDiscount(false)}
            />
          ) : (
            <button
              onClick={() => setShowDiscount(true)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {discount
                ? `Discount: ${discount.name} (${
                    discount.type === "percentage"
                      ? `${discount.value}%`
                      : formatCurrency(discount.value)
                  })`
                : "+ Apply Discount"}
            </button>
          )}
        </div>

        {/* Totals */}
        <div className="px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {Array.isArray(taxes) &&
            taxes.map((t: Record<string, unknown>, i: number) => (
              <div
                key={i}
                className="flex justify-between text-sm text-slate-500"
              >
                <span>{String(t.name || t.tax_name || "Tax")} ({String(t.rate || t.tax_rate || t.value)}%)</span>
                <span>
                  {formatCurrency(
                    afterDiscount *
                      ((Number(t.rate || t.tax_rate || t.value) || 0) / 100)
                  )}
                </span>
              </div>
            ))}
          <Separator />
          <div className="flex justify-between text-base font-bold text-slate-900">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Payment grid */}
        <div className="px-4 pb-3">
          <PaymentGrid outletId={outletId} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <Button variant="outline" className="flex-1 gap-2" disabled={items.length === 0}>
            <Printer className="h-4 w-4" />
            Print KOT
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={items.length === 0}
            onClick={handleSettle}
          >
            <CreditCard className="h-4 w-4" />
            Settle & Print
          </Button>
        </div>
      </div>
    </div>
  );
}
