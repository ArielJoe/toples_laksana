"use client";

import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DashboardContentProps {
  stats: {
    products: number;
    interactions: number;
    pageViews: number;
    productViews: number;
    waLogs: number;
  };
}

export default function DashboardContent({ stats }: DashboardContentProps) {
  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Dashboard</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-8 flex-1 w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-primary-500 rounded-2xl p-8 text-white relative overflow-hidden group border border-primary-600">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <AppIcon name="inventory_2" className="text-2xl text-white" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/80">Katalog Produk</span>
            </div>
            <div className="text-5xl font-black text-white tracking-tighter mb-1">{stats.products}</div>
            <div className="text-[0.65rem] font-bold text-white/60 uppercase tracking-widest">Unit Tersedia</div>
          </div>

          <Card className="p-8 border-border relative overflow-hidden group bg-white shadow-none">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center">
                <AppIcon name="touch_app" className="text-2xl text-text-primary" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Page Views</span>
            </div>
            <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{stats.pageViews}</div>
            <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Halaman Dilihat</div>
          </Card>

          <Card className="p-8 border-border relative overflow-hidden group bg-white shadow-none">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center">
                <AppIcon name="touch_app" className="text-2xl text-text-primary" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Product Views</span>
            </div>
            <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{stats.productViews}</div>
            <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">{stats.interactions} Total Interaksi</div>
          </Card>

          <Card className="p-8 border-border relative overflow-hidden group bg-white shadow-none">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center">
                <AppIcon name="chat" className="text-2xl text-text-primary" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">WhatsApp Logs</span>
            </div>
            <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{stats.waLogs}</div>
            <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Pesan Terkirim</div>
          </Card>
        </div>
      </div>
    </>
  );
}
