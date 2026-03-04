"use client";

import { Bike, Phone, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRiders, useAssignRider } from "@/lib/hooks/use-outlets";
import type { Order, Rider } from "@/lib/api/types";

interface RiderAssignmentProps {
  order: Order;
}

export function RiderAssignment({ order }: RiderAssignmentProps) {
  const status = Number(order.order_status);

  // Always call hooks unconditionally
  const { data: riders, isLoading: ridersLoading } = useRiders(
    status >= 4 ? String(order.outlet_id) : null
  );
  const assignRider = useAssignRider();

  // Don't render if status < 4
  if (status < 4) return null;

  function handleAssign(riderId: string) {
    assignRider.mutate({
      order_id: order.order_id,
      rider_id: riderId,
    });
  }

  // Rider already assigned
  if (order.rider_name) {
    return (
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center">
            <Bike className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {order.rider_name}
            </p>
            {order.rider_phone && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Phone className="h-3 w-3" />
                {order.rider_phone}
              </div>
            )}
          </div>
          <Badge variant="success">Assigned</Badge>
        </div>
      </Card>
    );
  }

  // Assign rider dropdown
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Assign Rider</p>
      {ridersLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading riders...
        </div>
      ) : (
        <Select
          onValueChange={handleAssign}
          disabled={assignRider.isPending}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                assignRider.isPending ? "Assigning..." : "Select a rider"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {(riders as Rider[] | undefined)?.length ? (
              (riders as Rider[]).map((rider) => (
                <SelectItem key={rider.id} value={String(rider.id)}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        rider.is_available ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span>{rider.name}</span>
                    <span className="text-slate-400 text-xs">
                      {rider.phone}
                    </span>
                    <span className="text-slate-400 text-xs">
                      ({rider.active_orders} active)
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="__none" disabled>
                No riders available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
