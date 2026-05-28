"use client";

import { useMemo, useState } from "react";

import AdminDatePickerField, {
  parseDateInputValue,
} from "@/components/admin/AdminDatePickerField";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppIcon } from "@/components/ui/app-icon";

interface WhatsAppLogDetail {
  productId: string;
  lidColorId?: string | null;
  unit?: string;
  quantity: number;
  priceAtThatTime: number;
}

interface WhatsAppLogItem {
  id: string;
  userId: string;
  totalDiscount?: number;
  grandTotal?: number;
  details?: WhatsAppLogDetail[];
  createdAt?: string;
}

interface ProductOption {
  id: string;
  name: string;
  sku?: string;
}

interface WaLogsPageContentProps {
  initialLogs: WhatsAppLogItem[];
  products: ProductOption[];
}

function getDateValue(date?: string) {
  return date ? new Date(date).getTime() : 0;
}

function parseLogDate(date?: string) {
  if (!date) return null;

  const parsed = new Date(date);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function getStartOfDateInput(value: string) {
  return new Date(`${value}T00:00:00`);
}

function getEndOfDateInput(value: string) {
  return new Date(`${value}T23:59:59.999`);
}

function getDisplayUser(userId: string) {
  const normalizedUserId = userId.trim();

  if (normalizedUserId.includes("@")) {
    return normalizedUserId;
  }

  if (normalizedUserId === "guest" || normalizedUserId === "anonymous") {
    return normalizedUserId;
  }

  if (normalizedUserId.length > 0) {
    return normalizedUserId;
  }

  return "guest";
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getLogTotal(log: WhatsAppLogItem) {
  if (typeof log.grandTotal === "number" && log.grandTotal > 0) {
    return log.grandTotal;
  }

  return (log.details || []).reduce((sum, detail) => sum + (detail.quantity * detail.priceAtThatTime || 0), 0);
}

function getProductSummary(
  log: WhatsAppLogItem,
  productMap: Record<string, ProductOption>,
) {
  const details = log.details || [];

  if (details.length === 0) {
    return "Tidak ada detail barang";
  }

  return details
    .map((detail) => productMap[detail.productId]?.name || detail.productId)
    .join(", ");
}

const WA_LOGS_PAGE_SIZE = 10;

export default function WaLogsPageContent({ initialLogs, products }: WaLogsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    [products],
  );

  const filteredLogs = useMemo(() => {
    return initialLogs
      .filter((log) => {
        const query = searchQuery.toLowerCase();
        const displayUser = getDisplayUser(log.userId);
        const productSummary = getProductSummary(log, productMap);
        const date = parseLogDate(log.createdAt);
        const isAfterStart = startDate
          ? date !== null && date >= getStartOfDateInput(startDate)
          : true;
        const isBeforeEnd = endDate
          ? date !== null && date <= getEndOfDateInput(endDate)
          : true;

        return (
          isAfterStart &&
          isBeforeEnd &&
          (productSummary.toLowerCase().includes(query) ||
            displayUser.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => getDateValue(b.createdAt) - getDateValue(a.createdAt));
  }, [endDate, initialLogs, productMap, searchQuery, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / WA_LOGS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredLogs.length === 0
    ? 0
    : (safePage - 1) * WA_LOGS_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * WA_LOGS_PAGE_SIZE, filteredLogs.length);
  const paginatedLogs = filteredLogs.slice(startIndex - 1, endIndex);

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">WhatsApp Log</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          <div className="border-b border-border bg-white px-6 pb-5 pt-0 lg:px-8">
            <div className="grid grid-cols-1 items-end gap-4 xl:grid-cols-[minmax(320px,552px)_200px_200px_112px_116px] xl:justify-between">
              <div className="relative group xl:self-end">
                <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
                <Input
                  type="text"
                  placeholder="Cari produk atau email..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setPage(1);
                  }}
                  className="h-12 w-full rounded-lg border-border bg-secondary-50/30 pl-12 pr-6 text-sm font-bold text-text-primary shadow-none transition-all focus:bg-white focus:border-primary-500"
                />
              </div>

              <AdminDatePickerField
                label="Dari"
                value={startDate}
                onChange={(value) => {
                  setStartDate(value);
                  setPage(1);
                  if (endDate && value && getStartOfDateInput(value) > getEndOfDateInput(endDate)) {
                    setEndDate("");
                  }
                }}
                maxDate={parseDateInputValue(endDate)}
              />

              <AdminDatePickerField
                label="Sampai"
                value={endDate}
                onChange={(value) => {
                  setEndDate(value);
                  setPage(1);
                }}
                minDate={parseDateInputValue(startDate)}
              />

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                  setPage(1);
                }}
                className="h-12 rounded-lg border border-border bg-white px-4 text-[0.65rem] font-black uppercase tracking-[0.12em] text-text-secondary transition-all hover:bg-secondary-50 hover:text-text-primary"
              >
                Reset
              </button>

              <Badge variant="secondary" className="h-12 justify-center rounded-lg bg-green-50 px-4 text-xs font-black text-green-700 border-none">
                {filteredLogs.length} log
              </Badge>
            </div>
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <Table className="min-w-260">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="w-1/5 px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  <TableHead className="w-1/3 px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk yang Ditanyakan</TableHead>
                  <TableHead className="w-32 px-8 py-4 text-right text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="chat" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Log tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci atau tanggal lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => {
                    const details = log.details || [];
                    const itemCount = details.reduce((sum, detail) => sum + (detail.quantity || 0), 0);

                    return (
                      <TableRow key={log.id} className="transition-all duration-200 group border-border align-top">
                        <TableCell className="px-8 py-3">
                          <p className="text-sm font-black text-text-primary tracking-tight">
                            {new Date(log.createdAt || "").toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-text-muted">
                            {details.length} produk / {itemCount} item
                          </p>
                        </TableCell>
                        <TableCell className="px-8 py-3">
                          <p className="font-mono text-xs font-bold text-text-secondary">
                            {getDisplayUser(log.userId)}
                          </p>
                        </TableCell>
                        <TableCell className="px-8 py-3">
                          <div className="space-y-3">
                            {details.length === 0 ? (
                              <p className="text-sm font-bold text-text-primary">Tidak ada detail barang</p>
                            ) : (
                              details.map((detail, index) => {
                                const product = productMap[detail.productId];

                                return (
                                  <div key={`${log.id}-${detail.productId}-${index}`} className="rounded-lg border border-border bg-secondary-50/30 p-3">
                                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                                      <div className="min-w-0">
                                        <p className="text-sm font-black text-text-primary line-clamp-1">
                                          {product?.name || detail.productId}
                                        </p>
                                        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-text-muted">
                                          {product?.sku || detail.productId}
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-right text-xs">
                                        <div>
                                          <p className="font-black text-text-primary">
                                            {detail.quantity} {detail.unit || "pcs"}
                                          </p>
                                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-muted">Jumlah</p>
                                        </div>
                                        <div>
                                          <p className="font-black text-text-primary">{formatMoney(detail.priceAtThatTime)}</p>
                                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-muted">Harga</p>
                                        </div>
                                        <div>
                                          <p className="font-black text-text-primary">{formatMoney(detail.quantity * detail.priceAtThatTime)}</p>
                                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-muted">Subtotal</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-3 text-right">
                          <p className="text-sm font-black text-text-primary">{formatMoney(getLogTotal(log))}</p>
                          {Boolean(log.totalDiscount) && (
                            <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-green-700">
                              Diskon {formatMoney(log.totalDiscount)}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View: Cards List */}
          <div className="block sm:hidden divide-y divide-border bg-white">
            {filteredLogs.length === 0 ? (
              <div className="p-16 text-center text-text-muted">
                <AppIcon name="chat" className="text-5xl opacity-10 mb-4" />
                <p className="text-base font-black text-text-primary">Log tidak ditemukan</p>
                <p className="text-xs font-medium mt-1">Coba gunakan kata kunci atau tanggal lain.</p>
              </div>
            ) : (
              paginatedLogs.map((log) => {
                const details = log.details || [];
                const itemCount = details.reduce((sum, detail) => sum + (detail.quantity || 0), 0);

                return (
                  <div key={log.id} className="p-5 flex flex-col gap-3 hover:bg-secondary-50/10 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-text-muted block">
                          {new Date(log.createdAt || "").toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-text-muted">
                          {details.length} produk / {itemCount} item
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-text-primary">{formatMoney(getLogTotal(log))}</p>
                        {Boolean(log.totalDiscount) && (
                          <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-green-700">
                            Diskon {formatMoney(log.totalDiscount)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] font-medium text-text-secondary bg-secondary-50/50 p-2 rounded-lg">
                      <span className="font-mono truncate">{getDisplayUser(log.userId)}</span>
                    </div>

                    <div className="space-y-2 mt-1">
                      {details.length === 0 ? (
                        <p className="text-xs font-bold text-text-primary">Tidak ada detail barang</p>
                      ) : (
                        details.map((detail, index) => {
                          const product = productMap[detail.productId];

                          return (
                            <div key={`${log.id}-${detail.productId}-${index}`} className="rounded-xl border border-border bg-[#F9FAFB]/40 p-3">
                              <div className="flex flex-col gap-1.5">
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-text-primary line-clamp-1">
                                    {product?.name || detail.productId}
                                  </p>
                                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">
                                    {product?.sku || detail.productId}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/40">
                                  <div>
                                    <span className="font-bold text-text-primary">
                                      {detail.quantity} {detail.unit || "pcs"}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-widest text-text-muted ml-1">x {formatMoney(detail.priceAtThatTime)}</span>
                                  </div>
                                  <span className="font-black text-text-primary">
                                    {formatMoney(detail.quantity * detail.priceAtThatTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredLogs.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredLogs.length}</span> log
              </span>
              <PaginationControls
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mx-0 w-auto"
                contentClassName="gap-1"
                linkClassName="size-9 text-[0.65rem] font-black"
                previousNextClassName="h-9"
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
