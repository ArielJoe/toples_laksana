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

type InteractionType = "page_view" | "view" | "detail_click" | "whatsapp_share" | "promo_click";

interface InteractionItem {
  id: string;
  userId: string;
  productId?: string;
  pagePath?: string;
  interactionType: InteractionType;
  createdAt?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

interface InteractionsPageContentProps {
  initialInteractions: InteractionItem[];
  products: ProductOption[];
}

function getDateValue(date?: string) {
  return date ? new Date(date).getTime() : 0;
}

function parseInteractionDate(date?: string) {
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

  return "guest";
}

const INTERACTIONS_PAGE_SIZE = 10;

export default function InteractionsPageContent({ initialInteractions, products }: InteractionsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products],
  );

  const filteredInteractions = useMemo(() => {
    return initialInteractions
      .filter((interaction) => {
        const productName = productMap[interaction.productId || ""] || interaction.productId || "";
        const displayUser = getDisplayUser(interaction.userId);
        const query = searchQuery.toLowerCase();
        const date = parseInteractionDate(interaction.createdAt);
        const isAfterStart = startDate
          ? date !== null && date >= getStartOfDateInput(startDate)
          : true;
        const isBeforeEnd = endDate
          ? date !== null && date <= getEndOfDateInput(endDate)
          : true;

        return (
          isAfterStart &&
          isBeforeEnd &&
          (productName.toLowerCase().includes(query) ||
            displayUser.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        return getDateValue(b.createdAt) - getDateValue(a.createdAt); // Descending (newest first)
      });
  }, [endDate, initialInteractions, productMap, searchQuery, startDate]);

  const totalPages = Math.max(1, Math.ceil(filteredInteractions.length / INTERACTIONS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredInteractions.length === 0
    ? 0
    : (safePage - 1) * INTERACTIONS_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * INTERACTIONS_PAGE_SIZE, filteredInteractions.length);
  const paginatedInteractions = filteredInteractions.slice(startIndex - 1, endIndex);

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Interaksi</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        {/* Table Card */}
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

              <Badge variant="secondary" className="h-12 justify-center rounded-lg bg-primary-50 px-4 text-xs font-black text-primary-600 border-none">
                {filteredInteractions.length} data
              </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-190">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInteractions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="touch_app" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Interaksi tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInteractions.map((interaction) => (
                    <TableRow key={interaction.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary tracking-tight">
                          {new Date(interaction.createdAt || "").toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1">
                          {productMap[interaction.productId || ""] || interaction.productId || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="font-mono text-xs font-bold text-text-secondary">
                          {getDisplayUser(interaction.userId)}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredInteractions.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredInteractions.length}</span> data
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
