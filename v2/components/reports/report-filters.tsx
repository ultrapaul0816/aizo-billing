"use client";

import { Download, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useOutlets } from "@/lib/hooks/use-outlets";
import { useConfigStore } from "@/lib/stores/config";
import { getOrdersCSV } from "@/lib/api/orders";
import { getBrand } from "@/lib/utils";

interface ReportFiltersProps {
  outlet: string;
  setOutlet: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  source: string;
  setSource: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onSearch: () => void;
  appliedFilters: Record<string, string>;
}

export function ReportFilters({
  outlet,
  setOutlet,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  source,
  setSource,
  status,
  setStatus,
  onSearch,
  appliedFilters,
}: ReportFiltersProps) {
  const { data: outlets = [] } = useOutlets();
  const orderSources = useConfigStore((s) => s.orderSources);

  async function handleExportCSV() {
    try {
      const params: Record<string, string> = {
        brand: getBrand(),
        start_date: appliedFilters.startDate || startDate,
        end_date: appliedFilters.endDate || endDate,
      };
      if (appliedFilters.outlet) params.outlet_id = appliedFilters.outlet;
      if (appliedFilters.source) params.order_source = appliedFilters.source;
      if (appliedFilters.status) params.order_status = appliedFilters.status;

      const blob = await getOrdersCSV(params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-report-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Failed to export CSV");
    }
  }

  const selectClass =
    "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400";
  const dateClass =
    "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Outlet */}
      <select
        value={outlet}
        onChange={(e) => setOutlet(e.target.value)}
        className={selectClass}
      >
        <option value="">All Outlets</option>
        {outlets.map((o) => (
          <option key={o.id} value={String(o.id)}>
            {o.outlet_name}
          </option>
        ))}
      </select>

      {/* Date range */}
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-slate-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={dateClass}
        />
        <span className="text-xs text-slate-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={dateClass}
        />
      </div>

      {/* Source */}
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className={selectClass}
      >
        <option value="">All Sources</option>
        {orderSources.map((s) => (
          <option key={s.id} value={s.source_name}>
            {s.source_name}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={selectClass}
      >
        <option value="">All Status</option>
        <option value="Settled">Settled</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Actions */}
      <Button size="sm" onClick={onSearch}>
        Search
      </Button>
      <Button size="sm" variant="outline" onClick={handleExportCSV}>
        <Download className="mr-1.5 h-3.5 w-3.5" />
        Export CSV
      </Button>
    </div>
  );
}
