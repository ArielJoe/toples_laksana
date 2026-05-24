"use client";

import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  productViews: {
    label: "Product Views",
    color: "#f59e0b",
  },
  waLogs: {
    label: "WhatsApp Logs",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  views: {
    label: "Product Views",
    color: "#f59e0b",
  },
  waLogs: {
    label: "WhatsApp Logs",
    color: "#16a34a",
  },
} satisfies ChartConfig;

interface InteractionItem {
  id: string;
  userId: string;
  productId?: string;
  interactionType: string;
  createdAt?: string;
}

interface WhatsAppLogItem {
  id: string;
  userId: string;
  productId?: string;
  createdAt?: string;
}

interface DashboardContentProps {
  stats: {
    products: number;
    interactions: number;
    productViews: number;
    waLogs: number;
  };
  topViewedProducts: { productId: string; name: string; count: number }[];
  topWaProducts: { productId: string; name: string; count: number }[];
  totalInteractionsCount: number;
  totalWaLogsCount: number;
  interactions: InteractionItem[];
  waLogs: WhatsAppLogItem[];
}

export default function DashboardContent({
  stats,
  topViewedProducts,
  topWaProducts,
  totalInteractionsCount,
  totalWaLogsCount,
  interactions,
  waLogs,
}: DashboardContentProps) {
  const [timeFilter, setTimeFilter] = useState<"1W" | "1M" | "3M" | "6M" | "1Y">("1W");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pieChartData = [
    { type: "productViews", count: stats.productViews, fill: "var(--color-productViews)" },
    { type: "waLogs", count: stats.waLogs, fill: "var(--color-waLogs)" },
  ];

  const lineChartData = useMemo(() => {
    const now = new Date();

    if (timeFilter === "1Y") {
      // Monthly trend for last 12 months
      const data: { dateStr: string; views: number; waLogs: number; key: string }[] = [];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
        const yearMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

        data.push({
          dateStr: monthLabel,
          views: 0,
          waLogs: 0,
          key: yearMonthKey,
        });
      }

      interactions.forEach((i) => {
        if (i.interactionType === "view" && i.createdAt) {
          const dateObj = new Date(i.createdAt);
          const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
          const match = data.find((d) => d.key === key);
          if (match) {
            match.views += 1;
          }
        }
      });

      waLogs.forEach((l) => {
        if (l.createdAt) {
          const dateObj = new Date(l.createdAt);
          const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
          const match = data.find((d) => d.key === key);
          if (match) {
            match.waLogs += 1;
          }
        }
      });

      return data;
    } else {
      // Daily trend for 1W, 1M, 3M, 6M
      let daysToSubtract = 6;
      if (timeFilter === "1M") daysToSubtract = 29;
      if (timeFilter === "3M") daysToSubtract = 89;
      if (timeFilter === "6M") daysToSubtract = 179;

      const start = new Date(now);
      start.setDate(now.getDate() - daysToSubtract);
      start.setHours(0, 0, 0, 0);

      const dates: Date[] = [];
      const curr = new Date(start);
      while (curr <= now) {
        dates.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }

      const formatDateKey = (d: Date) => d.toISOString().split("T")[0];

      const viewCounts: Record<string, number> = {};
      interactions.forEach((i) => {
        if (i.interactionType === "view" && i.createdAt) {
          const key = i.createdAt.split("T")[0];
          viewCounts[key] = (viewCounts[key] || 0) + 1;
        }
      });

      const waCounts: Record<string, number> = {};
      waLogs.forEach((l) => {
        if (l.createdAt) {
          const key = l.createdAt.split("T")[0];
          waCounts[key] = (waCounts[key] || 0) + 1;
        }
      });

      return dates.map((date) => {
        const key = formatDateKey(date);
        return {
          dateStr: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
          views: viewCounts[key] || 0,
          waLogs: waCounts[key] || 0,
        };
      });
    }
  }, [interactions, waLogs, timeFilter]);
  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Dashboard</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full">
        {/* Combined Stats Card - Ultra Compact */}
        <Card className="shadow-none border border-border bg-white rounded-xl overflow-hidden">
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Column 1: Tipe Barang */}
            <div className="flex flex-col justify-between pb-3 md:pb-0 md:pr-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <AppIcon name="inventory_2" className="text-base text-primary-500" />
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-text-muted">Katalog Produk</span>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tighter">{stats.products}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Tipe Barang</div>
              </div>
            </div>

            {/* Column 2: Product Views (Interaksi) */}
            <div className="flex flex-col justify-between pt-3 md:pt-0 md:px-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AppIcon name="touch_app" className="text-base text-amber-500" />
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-text-muted">Interaksi</span>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tighter">{stats.productViews}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Total Dilihat</div>
              </div>
            </div>

            {/* Column 3: WhatsApp Logs */}
            <div className="flex flex-col justify-between pt-3 md:pt-0 md:pl-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <AppIcon name="chat" className="text-base text-green-500" />
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-text-muted">WhatsApp Logs</span>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tighter">{stats.waLogs}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Pesan Terkirim</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Time Pill Filtered Line Chart Card */}
        <Card className="shadow-none border border-border bg-white rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-text-primary tracking-tight">Tren Interaksi & WhatsApp</h3>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">Grafik harian untuk product views dan klik WhatsApp.</p>
            </div>
            
            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 bg-secondary-50 p-1 rounded-lg border border-border self-end sm:self-auto">
              {(["1W", "1M", "3M", "6M", "1Y"] as const).map((filter) => {
                const isActive = timeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1.5 rounded-md text-[0.65rem] font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                      isActive
                        ? "bg-text-primary text-white font-black"
                        : "text-text-muted hover:text-text-primary hover:bg-secondary-100"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            {!mounted ? (
              <div className="h-80 w-full bg-secondary-50/50 animate-pulse rounded-lg flex items-center justify-center text-xs font-bold text-text-muted">
                Memuat data grafik...
              </div>
            ) : lineChartData.length === 0 ? (
              <div className="h-64 border border-dashed border-border rounded-lg flex items-center justify-center text-xs font-bold text-text-muted">
                Tidak ada data pada filter terpilih.
              </div>
            ) : (
              <ChartContainer config={lineChartConfig} className="w-full h-80">
                <LineChart data={lineChartData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    strokeWidth={3}
                    dot={lineChartData.length > 31 ? false : { r: 3, strokeWidth: 0, fill: "var(--color-views)" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waLogs"
                    stroke="var(--color-waLogs)"
                    strokeWidth={3}
                    dot={lineChartData.length > 31 ? false : { r: 3, strokeWidth: 0, fill: "var(--color-waLogs)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </div>
        </Card>

        {/* Analytics Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interaction Breakdown Pie Chart */}
          <Card className="shadow-none bg-white border border-border p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="text-base font-black text-text-primary tracking-tight">Metrik Interaksi</h3>
                <Badge variant="secondary" className="bg-secondary-50 text-text-primary border-none text-[0.65rem] font-black">
                  {stats.productViews + stats.waLogs} total
                </Badge>
              </div>
              <p className="text-xs font-semibold text-text-secondary mb-4">Proporsi tipe interaksi pengguna.</p>
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[180px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={60}
                    outerRadius={80}
                    strokeWidth={4}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="font-bold text-text-secondary">Product Views</span>
                </div>
                <span className="font-mono font-black text-text-primary">{stats.productViews}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                  <span className="font-bold text-text-secondary">WhatsApp Logs</span>
                </div>
                <span className="font-mono font-black text-text-primary">{stats.waLogs}</span>
              </div>
            </div>
          </Card>

          {/* Top Viewed Products */}
          <Card className="shadow-none bg-white border border-border p-5 rounded-xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-text-primary tracking-tight">Barang Paling Sering Dilihat</h3>
                <p className="text-xs font-semibold text-text-secondary mt-0.5">Berdasarkan total interaksi produk.</p>
              </div>
              <Badge variant="secondary" className="bg-primary-50 text-primary-600 border-none text-[0.65rem] font-black">
                {totalInteractionsCount} data
              </Badge>
            </div>

            {topViewedProducts.length === 0 ? (
              <div className="h-56 rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-bold text-text-muted">
                Belum ada data interaksi.
              </div>
            ) : (
              <div className="space-y-4">
                {topViewedProducts.map((product, index) => (
                  <div key={product.productId} className="grid grid-cols-[24px_1fr_48px] items-center gap-3">
                    <span className="text-xs font-black text-text-muted">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-text-primary mb-1.5">{product.name}</p>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-50">
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{ width: `${Math.max((product.count / Math.max(...topViewedProducts.map(p => p.count), 1)) * 100, 8)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-right text-xs font-black text-primary-600">{product.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top WA Products */}
          <Card className="shadow-none bg-white border border-border p-5 rounded-xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-text-primary tracking-tight">Produk Paling Sering Masuk WhatsApp</h3>
                <p className="text-xs font-semibold text-text-secondary mt-0.5">Berdasarkan klik tautan tanya kami.</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-none text-[0.65rem] font-black">
                {totalWaLogsCount} log
              </Badge>
            </div>

            {topWaProducts.length === 0 ? (
              <div className="h-56 rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-bold text-text-muted">
                Belum ada log WhatsApp.
              </div>
            ) : (
              <div className="space-y-4">
                {topWaProducts.map((product, index) => (
                  <div key={product.productId} className="grid grid-cols-[24px_1fr_48px] items-center gap-3">
                    <span className="text-xs font-black text-text-muted">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-text-primary mb-1.5">{product.name}</p>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-50">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${Math.max((product.count / Math.max(...topWaProducts.map(p => p.count), 1)) * 100, 8)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-right text-xs font-black text-green-700">{product.count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
