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

interface WhatsAppLogItem {
  id: string;
  userId: string;
  productId?: string;
  createdAt?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

interface WaLogsPageContentProps {
  initialLogs: WhatsAppLogItem[];
  products: ProductOption[];
}

function getDateValue(date?: string) {
  return date ? new Date(date).getTime() : 0;
}

export default function WaLogsPageContent({ initialLogs, products }: WaLogsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products],
  );

  const filteredLogs = useMemo(() => {
    return initialLogs
      .filter((log) => {
        const productName = productMap[log.productId || ""] || log.productId || "";
        const query = searchQuery.toLowerCase();

        return (
          productName.toLowerCase().includes(query) || log.userId.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        return getDateValue(b.createdAt) - getDateValue(a.createdAt); // Descending (newest first)
      });
  }, [initialLogs, productMap, searchQuery]);

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Log WhatsApp</h2>
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
                placeholder="Cari log WhatsApp..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-none px-3 py-1 text-xs font-black self-start sm:self-auto">
              {filteredLogs.length} log
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu Share</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk yang Ditanyakan</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                          <AppIcon name="chat" className="text-3xl text-green-500 opacity-50" />
                        </div>
                        <p className="text-lg font-black text-text-primary">Log tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary tracking-tight">
                          {new Date(log.createdAt || "").toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <AppIcon name="chat" className="text-green-600 text-sm" />
                          </div>
                          <p className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                            {productMap[log.productId || ""] || log.productId || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-5 font-mono text-[10px] text-text-muted tracking-tighter">
                        {log.userId}
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
