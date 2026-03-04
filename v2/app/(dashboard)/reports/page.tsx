"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderReport } from "@/lib/api/orders";
import { getBrand } from "@/lib/utils";
import type { Order } from "@/lib/api/types";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable } from "@/components/reports/report-table";
import { SummaryPanel } from "@/components/reports/summary-panel";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const [outlet, setOutlet] = useState("");
  const [startDate, setStartDate] = useState(todayString());
  const [endDate, setEndDate] = useState(todayString());
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");

  // Filters applied on search click
  const [appliedFilters, setAppliedFilters] = useState({
    outlet: "",
    startDate: todayString(),
    endDate: todayString(),
    source: "",
    status: "",
  });

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["order-report", appliedFilters],
    queryFn: async () => {
      const body: Record<string, unknown> = {
        brand: getBrand(),
        start_date: appliedFilters.startDate,
        end_date: appliedFilters.endDate,
      };
      if (appliedFilters.outlet) body.outlet_id = appliedFilters.outlet;
      if (appliedFilters.source) body.order_source = appliedFilters.source;
      if (appliedFilters.status) body.order_status = appliedFilters.status;
      const res = await getOrderReport(body);
      return (res as Order[]) || [];
    },
  });

  function handleSearch() {
    setAppliedFilters({ outlet, startDate, endDate, source, status });
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 p-6 xl:grid-cols-[1fr_380px]">
      {/* Left panel */}
      <div className="flex min-h-0 flex-col gap-6">
        <ReportFilters
          outlet={outlet}
          setOutlet={setOutlet}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          source={source}
          setSource={setSource}
          status={status}
          setStatus={setStatus}
          onSearch={handleSearch}
          appliedFilters={appliedFilters}
        />
        <ReportTable orders={orders} isLoading={isLoading} />
      </div>

      {/* Right panel */}
      <SummaryPanel orders={orders} />
    </div>
  );
}
