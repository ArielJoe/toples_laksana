"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

function getInteractionLabel(type: InteractionType) {
  switch (type) {
    case "view":
      return "Dilihat";
    case "detail_click":
      return "Klik Detail";
    case "whatsapp_share":
      return "Klik WhatsApp";
    case "promo_click":
      return "Klik Promo";
    case "page_view":
    default:
      return "Page View";
  }
}

export default function InteractionsPageContent({ initialInteractions, products }: InteractionsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products],
  );

  const filteredInteractions = useMemo(() => {
    return initialInteractions
      .filter((interaction) => {
        const productName = productMap[interaction.productId || ""] || interaction.productId || "";
        const query = searchQuery.toLowerCase();

        return (
          productName.toLowerCase().includes(query) ||
          interaction.userId.toLowerCase().includes(query) ||
          interaction.interactionType.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        return getDateValue(b.createdAt) - getDateValue(a.createdAt); // Descending (newest first)
      });
  }, [initialInteractions, productMap, searchQuery]);

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
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4 border-b border-border">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <Input
                type="text"
                placeholder="Cari interaksi..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <Badge variant="secondary" className="bg-primary-50 text-primary-600 border-none px-3 py-1 text-xs font-black self-start sm:self-auto">
              {filteredInteractions.length} data
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Tipe Interaksi</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInteractions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="touch_app" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Interaksi tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInteractions.map((interaction) => (
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
                        <Badge variant="outline" className="font-black text-[0.6rem] uppercase tracking-widest px-2 py-1 border-border bg-secondary-50/50">
                          {getInteractionLabel(interaction.interactionType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1">
                          {productMap[interaction.productId || ""] || interaction.productId || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5 font-mono text-[10px] text-text-muted tracking-tighter">
                        {interaction.userId}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
}
