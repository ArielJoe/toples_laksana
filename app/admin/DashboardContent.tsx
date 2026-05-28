"use client";

import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  productViews: {
    label: "Klik Produk",
    color: "#f59e0b",
  },
  waLogs: {
    label: "Klik WhatsApp",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  views: {
    label: "Klik Produk",
    color: "#f59e0b",
  },
  waLogs: {
    label: "Klik WhatsApp",
    color: "#16a34a",
  },
} satisfies ChartConfig;

type TimeFilter = "1W" | "1M" | "3M" | "6M" | "1Y";

interface InteractionItem {
  id: string;
  userId: string;
  productId: string;
  createdAt?: string;
}

interface WhatsAppLogItem {
  id: string;
  userId: string;
  details?: { productId?: string }[];
  createdAt?: string;
}

interface DashboardContentProps {
  stats: {
    products: number;
    interactions: number;
    productViews: number;
    waLogs: number;
  };
  products: { id: string; name: string }[];
  interactions: InteractionItem[];
  waLogs: WhatsAppLogItem[];
  generatedAt: string;
}

const timeFilterOptions: { value: TimeFilter; label: string; description: string }[] = [
  { value: "1W", label: "7H", description: "7 hari terakhir" },
  { value: "1M", label: "30H", description: "30 hari terakhir" },
  { value: "3M", label: "3B", description: "3 bulan terakhir" },
  { value: "6M", label: "6B", description: "6 bulan terakhir" },
  { value: "1Y", label: "1T", description: "12 bulan terakhir" },
];

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function getPeriodStart(now: Date, filter: TimeFilter) {
  const start = startOfDay(now);

  if (filter === "1W") start.setDate(start.getDate() - 6);
  if (filter === "1M") start.setDate(start.getDate() - 29);
  if (filter === "3M") start.setDate(start.getDate() - 89);
  if (filter === "6M") start.setDate(start.getDate() - 179);
  if (filter === "1Y") start.setMonth(start.getMonth() - 11, 1);

  return start;
}

function parseDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function isWithinPeriod(value: string | undefined, start: Date, end: Date) {
  const date = parseDate(value);
  return date ? date >= start && date <= end : false;
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTopProducts(items: { productId?: string }[]) {
  const counts = new Map<string, { productId: string; name: string; count: number }>();

  items.forEach((item) => {
    if (!item.productId) return;

    const current = counts.get(item.productId);
    counts.set(item.productId, {
      productId: item.productId,
      name: item.productId,
      count: (current?.count || 0) + 1,
    });
  });

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getTopProductsFromWhatsAppLogs(items: WhatsAppLogItem[]) {
  return getTopProducts(
    items.flatMap((item) => item.details?.map((detail) => ({ productId: detail.productId })) || []),
  );
}

export default function DashboardContent({
  stats,
  products,
  interactions,
  waLogs,
  generatedAt,
}: DashboardContentProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1M");

  const period = useMemo(() => {
    const end = new Date(generatedAt);
    return {
      end,
      start: getPeriodStart(end, timeFilter),
      label: timeFilterOptions.find((option) => option.value === timeFilter)?.description || "",
    };
  }, [generatedAt, timeFilter]);

  const filteredViews = useMemo(
    () =>
      interactions.filter((interaction) =>
        isWithinPeriod(interaction.createdAt, period.start, period.end)
      ),
    [interactions, period.end, period.start],
  );

  const filteredWaLogs = useMemo(
    () => waLogs.filter((log) => isWithinPeriod(log.createdAt, period.start, period.end)),
    [period.end, period.start, waLogs],
  );

  const productNameById = useMemo(() => {
    const entries = products.map((product) => [product.id, product.name]);
    return Object.fromEntries(entries);
  }, [products]);

  const periodTopViewedProducts = useMemo(
    () =>
      getTopProducts(filteredViews).map((product) => ({
        ...product,
        name: productNameById[product.productId] || product.productId,
      })),
    [filteredViews, productNameById],
  );

  const periodTopWaProducts = useMemo(
    () =>
      getTopProductsFromWhatsAppLogs(filteredWaLogs).map((product) => ({
        ...product,
        name: productNameById[product.productId] || product.productId,
      })),
    [filteredWaLogs, productNameById],
  );

  const pieChartData = useMemo(
    () => [
      { type: "productViews", count: filteredViews.length, fill: "var(--color-productViews)" },
      { type: "waLogs", count: filteredWaLogs.length, fill: "var(--color-waLogs)" },
    ],
    [filteredViews.length, filteredWaLogs.length],
  );

  const lineChartData = useMemo(() => {
    if (timeFilter === "1Y") {
      const data: { dateStr: string; views: number; waLogs: number; key: string }[] = [];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(period.end.getFullYear(), period.end.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
        const yearMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

        data.push({
          dateStr: monthLabel,
          views: 0,
          waLogs: 0,
          key: yearMonthKey,
        });
      }

      filteredViews.forEach((interaction) => {
        const dateObj = parseDate(interaction.createdAt);
        if (dateObj) {
          const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
          const match = data.find((item) => item.key === key);
          if (match) match.views += 1;
        }
      });

      filteredWaLogs.forEach((log) => {
        const dateObj = parseDate(log.createdAt);
        if (dateObj) {
          const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
          const match = data.find((item) => item.key === key);
          if (match) match.waLogs += 1;
        }
      });

      return data;
    }

    const dates: Date[] = [];
    const curr = new Date(period.start);
    while (curr <= period.end) {
      dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const viewCounts: Record<string, number> = {};
    filteredViews.forEach((interaction) => {
      const date = parseDate(interaction.createdAt);
      if (!date) return;
      const key = formatDateKey(date);
      viewCounts[key] = (viewCounts[key] || 0) + 1;
    });

    const waCounts: Record<string, number> = {};
    filteredWaLogs.forEach((log) => {
      const date = parseDate(log.createdAt);
      if (!date) return;
      const key = formatDateKey(date);
      waCounts[key] = (waCounts[key] || 0) + 1;
    });

    return dates.map((date) => {
      const key = formatDateKey(date);
      return {
        dateStr: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        views: viewCounts[key] || 0,
        waLogs: waCounts[key] || 0,
      };
    });
  }, [filteredViews, filteredWaLogs, period.end, period.start, timeFilter]);

  const periodLabel = `${formatShortDate(period.start)} - ${formatShortDate(period.end)}`;
  const periodTotal = filteredViews.length + filteredWaLogs.length;

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Dashboard</h2>
          <p className="text-xs font-bold text-text-muted mt-1">
            Periode data: {periodLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-text-muted">
            Terakhir diperbarui
          </p>
          <p className="text-xs font-black text-text-primary mt-1">{formatUpdatedAt(generatedAt)}</p>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-none lg:hidden">
          <div>
            <h2 className="text-xl font-black text-text-primary tracking-tight">Dashboard</h2>
            <p className="text-xs font-bold text-text-muted mt-1">
              Periode data: {periodLabel}
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-text-muted">
              Terakhir diperbarui
            </p>
            <p className="text-xs font-black text-text-primary mt-1">{formatUpdatedAt(generatedAt)}</p>
          </div>
        </div>

        <Card className="shadow-none border border-border bg-white rounded-xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-black text-text-primary tracking-tight">Filter Periode</h3>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                Semua metrik interaksi dan WhatsApp di halaman ini mengikuti periode ini.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {timeFilterOptions.map((option) => {
                const isActive = timeFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTimeFilter(option.value)}
                    className={`h-9 rounded-lg px-3 text-[0.68rem] font-black uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      isActive
                        ? "bg-text-primary text-white"
                        : "border border-border bg-white text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
                    }`}
                    title={option.description}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

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
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Total aktif saat ini</div>
              </div>
            </div>

            {/* Column 2: Product Clicks */}
            <div className="flex flex-col justify-between pt-3 md:pt-0 md:px-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AppIcon name="touch_app" className="text-base text-amber-500" />
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-text-muted">Interaksi</span>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tighter">{filteredViews.length}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Produk ditekan dalam periode</div>
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
                <div className="text-2xl font-black text-text-primary tracking-tighter">{filteredWaLogs.length}</div>
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-wider">Klik WhatsApp dalam periode</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Time Pill Filtered Line Chart Card */}
        <Card className="shadow-none border border-border bg-white rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-text-primary tracking-tight">Tren Interaksi & WhatsApp</h3>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                Grafik {timeFilter === "1Y" ? "bulanan" : "harian"} untuk {period.label} ({periodLabel}).
              </p>
            </div>
            <Badge variant="secondary" className="bg-secondary-50 text-text-primary border-none text-[0.65rem] font-black self-start sm:self-auto">
              {periodTotal} aktivitas
            </Badge>
          </div>

          <div className="pt-2">
            {lineChartData.length === 0 ? (
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
                  {periodTotal} total
                </Badge>
              </div>
              <p className="text-xs font-semibold text-text-secondary mb-4">
                Proporsi klik produk dan klik WhatsApp pada {period.label}.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-45">
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
                  <span className="font-bold text-text-secondary">Klik Produk</span>
                </div>
                <span className="font-mono font-black text-text-primary">{filteredViews.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                  <span className="font-bold text-text-secondary">Klik WhatsApp</span>
                </div>
                <span className="font-mono font-black text-text-primary">{filteredWaLogs.length}</span>
              </div>
            </div>
          </Card>

          {/* Top Clicked Products */}
          <Card className="shadow-none bg-white border border-border p-5 rounded-xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-text-primary tracking-tight">Produk Paling Sering Ditekan</h3>
                <p className="text-xs font-semibold text-text-secondary mt-0.5">
                  Berdasarkan klik produk pada {period.label}.
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary-50 text-primary-600 border-none text-[0.65rem] font-black">
                {filteredViews.length} data
              </Badge>
            </div>

            {periodTopViewedProducts.length === 0 ? (
              <div className="h-56 rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-bold text-text-muted">
                Belum ada klik produk pada periode ini.
              </div>
            ) : (
              <div className="space-y-4">
                {periodTopViewedProducts.map((product, index) => (
                  <div key={product.productId} className="grid grid-cols-[24px_1fr_48px] items-center gap-3">
                    <span className="text-xs font-black text-text-muted">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-text-primary mb-1.5">{product.name}</p>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-50">
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{ width: `${Math.max((product.count / Math.max(...periodTopViewedProducts.map(p => p.count), 1)) * 100, 8)}%` }}
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
                <p className="text-xs font-semibold text-text-secondary mt-0.5">
                  Berdasarkan klik WhatsApp pada {period.label}.
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-none text-[0.65rem] font-black">
                {filteredWaLogs.length} log
              </Badge>
            </div>

            {periodTopWaProducts.length === 0 ? (
              <div className="h-56 rounded-lg border border-dashed border-border flex items-center justify-center text-xs font-bold text-text-muted">
                Belum ada klik WhatsApp pada periode ini.
              </div>
            ) : (
              <div className="space-y-4">
                {periodTopWaProducts.map((product, index) => (
                  <div key={product.productId} className="grid grid-cols-[24px_1fr_48px] items-center gap-3">
                    <span className="text-xs font-black text-text-muted">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-text-primary mb-1.5">{product.name}</p>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-50">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${Math.max((product.count / Math.max(...periodTopWaProducts.map(p => p.count), 1)) * 100, 8)}%` }}
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
