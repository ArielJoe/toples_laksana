"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import ProductDialog from "@/components/admin/ProductDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import { getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getProductTypeLabel, Product } from "@/types/product";
import type { IInteraction } from "@/models/Interaction";

interface AdminPageProps {
  initialProducts: Product[];
  initialInteractions: IInteraction[];
}

export default function AdminPageContent({ initialProducts, initialInteractions }: AdminPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "lidColors" | "productTypes" | "units" | "priceTypes" | "promos" | "interactions" | "waLogs">("products");
  const router = useRouter();

  // Filter interactions by type
  const waLogs = initialInteractions.filter(i => i.interactionType === "whatsapp_share");
  const allInteractions = initialInteractions;

  /**
   * handleSave
   * Handles creating or updating a product via the API.
   */
  const handleSave = async (productData: Partial<Product>) => {
    const isEditing = !!editingProduct;
    const url = isEditing ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Failed to save product");

    // Refresh the list (in a real app, you might just update the local state)
    router.refresh();
    setIsDialogOpen(false);

    // Manual state update for immediate feedback
    const saved = await response.json();
    if (isEditing) {
      setProducts(products.map(p => p.id === editingProduct.id ? saved.data : p));
    } else {
      setProducts([saved.data, ...products]);
    }
  };

  /**
   * handleDelete
   * Removes a product from the database.
   */
  const handleDelete = async () => {
    if (!productToDelete) return;

    const response = await fetch(`/api/products/${productToDelete}`, { method: "DELETE" });
    if (response.ok) {
      setProducts(products.filter(p => p.id !== productToDelete));
    } else {
      alert("Gagal menghapus produk");
    }
    setProductToDelete(null);
  };

  /**
   * handleEdit
   * Opens the dialog with the product's existing data.
   */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };



  type TabId = "products" | "categories" | "lidColors" | "productTypes" | "units" | "priceTypes" | "promos" | "interactions" | "waLogs";

  const NAV_ITEMS: { label: string; icon: string; id: TabId; active: boolean; count?: number }[] = [
    { label: "Dashboard", icon: "dashboard", id: "products", active: activeTab === "products", count: products.length },
    { label: "Kategori", icon: "category", id: "categories", active: activeTab === "categories" },
    { label: "Warna Tutup", icon: "palette", id: "lidColors", active: activeTab === "lidColors" },
    { label: "Tipe Produk", icon: "grade", id: "productTypes", active: activeTab === "productTypes" },
    { label: "Satuan", icon: "straighten", id: "units", active: activeTab === "units" },
    { label: "Tipe Harga", icon: "sell", id: "priceTypes", active: activeTab === "priceTypes" },
    { label: "Promosi", icon: "campaign", id: "promos", active: activeTab === "promos" },
    { label: "Interaksi", icon: "touch_app", id: "interactions", active: activeTab === "interactions", count: allInteractions.length },
    { label: "WhatsApp Log", icon: "chat", id: "waLogs", active: activeTab === "waLogs", count: waLogs.length },
  ];

  // Reference data for admin tables
  const MOCK_CATEGORIES = [
    { id: "cat_tin", name: "Tin Kaleng", count: products.filter(p => p.categoryId === "cat_tin").length },
    { id: "cat_jar_plastik", name: "Jar Plastik", count: products.filter(p => p.categoryId === "cat_jar_plastik").length },
    { id: "cat_jar_kaca", name: "Jar Kaca", count: products.filter(p => p.categoryId === "cat_jar_kaca").length },
    { id: "cat_jar_cylinder", name: "Jar Cylinder", count: products.filter(p => p.categoryId === "cat_jar_cylinder").length },
    { id: "cat_botol", name: "Botol", count: products.filter(p => p.categoryId === "cat_botol").length },
  ];

  const MOCK_COLORS = [
    { id: "color_bening", name: "Bening", hex: "#ffffff" },
    { id: "color_putih", name: "Putih", hex: "#f0f0f0" },
    { id: "color_cling", name: "Cling", hex: "#e0e0e0" },
    { id: "color_silver", name: "Silver", hex: "#c0c0c0" },
    { id: "color_emas", name: "Emas", hex: "#ffd700" },
    { id: "color_rose", name: "Rose", hex: "#ff007f" },
    { id: "color_hitam", name: "Hitam", hex: "#000000" },
  ];

  const MOCK_TYPES = [
    { id: "type_reguler", name: "Reguler" },
    { id: "type_premium", name: "Premium" },
  ];

  const MOCK_UNITS = [
    { id: "unit_pcs", name: "Pcs", symbol: "pcs" },
    { id: "unit_bal", name: "Bal", symbol: "bal" },
    { id: "unit_dus", name: "Dus", symbol: "dus" },
    { id: "unit_lusin", name: "Lusin", symbol: "lsn" },
    { id: "unit_kg", name: "Kilogram", symbol: "kg" },
  ];

  const MOCK_PRICE_TYPES = [
    { id: "price_with_lid", name: "Harga Ecer (Dengan Tutup)", description: "Harga per pcs dengan tutup" },
    { id: "price_per_bal", name: "Harga Grosir (Per Bal)", description: "Harga per bal untuk pembelian grosir" },
  ];

  const MOCK_PROMOS = [
    { id: "promo_001", code: "DISKON10", name: "Diskon 10%", type: "percentage" as const, value: 10, isActive: true },
    { id: "promo_002", code: "HEMAT5K", name: "Potongan Rp5.000", type: "nominal" as const, value: 5000, isActive: true },
    { id: "promo_003", code: "NEWYEAR", name: "Promo Tahun Baru", type: "percentage" as const, value: 15, isActive: false },
  ];

  return (
    <div className="bg-background text-text-primary flex min-h-screen font-sans relative selection:bg-primary-500/10">
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Navigation ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-all duration-300 border-r border-border shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 lg:h-24 px-8 flex items-center border-b border-border">
          <Link href="/" className="text-xl font-black text-primary-500 tracking-tight flex items-center gap-2">
            Toples Laksana
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={cn(
                "group w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm",
                item.active
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                  : "text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-3.5">
                <span className={cn(
                  "material-symbols-outlined text-xl transition-colors",
                  item.active ? "text-white" : "text-text-muted group-hover:text-text-primary"
                )} style={{ fontVariationSettings: item.active ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {item.count !== undefined && (
                <Badge variant={item.active ? "outline" : "secondary"} className={cn(
                  "rounded-lg px-1.5 py-0.5 text-[0.6rem] font-black",
                  item.active ? "border-white/40 text-white" : "text-white bg-primary-500"
                )}>
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[0.65rem] uppercase tracking-widest border border-border hover:border-red-200"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Keluar
          </Link>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
        {/* Topbar */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-text-secondary border border-border hover:bg-white transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-black text-text-primary tracking-tight">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
            className="bg-primary-500 text-white px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl font-black flex items-center gap-2.5 text-xs lg:text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="hidden sm:inline">Tambah Produk Baru</span>
            <span className="sm:hidden">Produk</span>
          </button>
        </header>

        <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">

          {/* Dashboard Stats */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-500 rounded-4xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/80">Katalog Produk</span>
                </div>
                <div className="text-5xl font-black text-white tracking-tighter mb-1">{products.length}</div>
                <div className="text-[0.65rem] font-bold text-white/60 uppercase tracking-widest">Unit Tersedia</div>
              </div>

              <div className="bg-white rounded-4xl p-8 shadow-sm border border-border relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <span className="material-symbols-outlined text-text-primary group-hover:text-primary-500 transition-colors text-2xl">touch_app</span>
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Interaksi User</span>
                </div>
                <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{allInteractions.length}</div>
                <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Klik & Dilihat</div>
              </div>

              <div className="bg-white rounded-4xl p-8 shadow-sm border border-border relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <span className="material-symbols-outlined text-text-primary group-hover:text-green-600 transition-colors text-2xl">chat</span>
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">WhatsApp Logs</span>
                </div>
                <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{waLogs.length}</div>
                <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Pesan Terkirim</div>
              </div>
            </div>
          )}

          {/* Product Data Table */}
          {activeTab === "products" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              {/* Toolbar */}
              <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
                <div className="relative flex-1 sm:max-w-md group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors">search</span>
                  <input
                    type="text"
                    placeholder="Cari SKU, nama, atau material..."
                    className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-xl text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">tune</span> Filter
                  </button>
                  <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">download</span> Ekspor
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-text-muted text-center">
                    <div className="w-24 h-24 bg-secondary-50 rounded-3xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
                    </div>
                    <p className="text-xl font-black text-text-primary tracking-tight">Katalog masih kosong</p>
                    <p className="text-sm mt-2 max-w-xs text-text-secondary font-medium">Mulai kembangkan bisnis Anda dengan menambahkan produk pertama.</p>
                  </div>
                ) : (
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Info Produk</TableHead>
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">SKU & Material</TableHead>
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Kategori</TableHead>
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Harga Dasar</TableHead>
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Status</TableHead>
                        <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(p => {
                        const image = getPrimaryImage(p);

                        return (
                          <TableRow key={p.id} className="hover:bg-primary-50/20 transition-all duration-200 group border-border">
                            <TableCell className="px-8 py-8">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-[#F9FAFB] flex items-center justify-center p-1.5 border border-border shrink-0 overflow-hidden group-hover:scale-105 group-hover:border-primary-200 transition-all">
                                  {image ? (
                                    <img className="w-full h-full object-cover rounded-lg" alt={p.name} src={image} />
                                  ) : (
                                    <span className="material-symbols-outlined opacity-30 text-2xl">inventory_2</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">{p.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none text-[0.55rem] font-black uppercase px-1.5 h-4">
                                      {getProductTypeLabel(p.productTypeId)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-8 py-8">
                              <p className="text-xs font-black text-text-primary font-mono tracking-tighter">{p.sku}</p>
                              <p className="text-[10px] font-bold text-text-muted mt-0.5 uppercase tracking-widest">{p.lidType}</p>
                            </TableCell>
                            <TableCell className="px-8 py-8">
                              <Badge variant="outline" className="bg-white border-border text-text-secondary text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5">
                                {getCategoryLabel(p.categoryId)}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-8 py-8">
                              <p className="text-sm font-black text-text-primary tracking-tight">
                                {formatPrice(getLowestRetailPrice(p))}
                              </p>
                            </TableCell>
                            <TableCell className="px-8 py-8">
                              {!p.deletedAt ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest">Terbit</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest">Draft</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-8 py-8 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="w-9 h-9 rounded-xl hover:bg-white hover:text-primary-600 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border"
                                >
                                  <span className="material-symbols-outlined text-lg">edit_note</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setProductToDelete(p.id);
                                    setIsConfirmOpen(true);
                                  }}
                                  className="w-9 h-9 rounded-xl hover:bg-white hover:text-red-500 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pagination */}
              {products.length > 0 && (
                <div className="px-8 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-[#F9FAFB]/30 gap-4">
                  <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                    Showing <span className="text-text-primary font-black">1-{products.length}</span> of <span className="text-text-primary font-black">{products.length}</span> items
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-text-muted opacity-50 cursor-not-allowed shadow-sm transition-all">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-primary-500 text-white font-black text-[0.65rem] shadow-lg shadow-primary-500/20">1</button>
                    <button className="w-9 h-9 rounded-xl bg-white border border-border hover:bg-secondary-50 flex items-center justify-center text-text-primary transition-all shadow-sm">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Categories Table */}
          {activeTab === "categories" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Kategori Produk</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Kategori
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Kategori</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Kategori</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Jml Produk</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CATEGORIES.map(cat => (
                    <TableRow key={cat.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{cat.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{cat.name}</TableCell>
                      <TableCell className="px-8 py-8">
                        <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none font-bold">{cat.count}</Badge>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Lid Colors Table */}
          {activeTab === "lidColors" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Warna Tutup</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Warna
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Warna</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Preview</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Warna</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_COLORS.map(color => (
                    <TableRow key={color.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{color.id}</TableCell>
                      <TableCell className="px-8 py-8">
                        <div className="w-8 h-8 rounded-full border border-border shadow-sm flex items-center justify-center bg-gray-50 overflow-hidden" style={{ backgroundColor: color.hex }}>
                          {color.hex === "#ffffff" && <span className="material-symbols-outlined text-[10px] text-gray-300">texture</span>}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{color.name}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Product Types Table */}
          {activeTab === "productTypes" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Tipe Produk</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Tipe
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TYPES.map(ptype => (
                    <TableRow key={ptype.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{ptype.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{ptype.name}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Units Table */}
          {activeTab === "units" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Satuan</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Satuan
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Satuan</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Satuan</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Simbol</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_UNITS.map(unit => (
                    <TableRow key={unit.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{unit.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{unit.name}</TableCell>
                      <TableCell className="px-8 py-8">
                        <Badge variant="outline" className="font-mono font-bold text-xs">{unit.symbol}</Badge>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Price Types Table */}
          {activeTab === "priceTypes" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Tipe Harga</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Tipe Harga
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Deskripsi</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PRICE_TYPES.map(pt => (
                    <TableRow key={pt.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{pt.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{pt.name}</TableCell>
                      <TableCell className="px-8 py-8 text-sm text-text-secondary">{pt.description}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Promo Table */}
          {activeTab === "promos" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-3 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Promosi</h3>
                </div>
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Promo
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Kode</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Promo</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nilai</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Status</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PROMOS.map(promo => (
                    <TableRow key={promo.id} className="hover:bg-primary-50/20 transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-primary-600">{promo.code}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{promo.name}</TableCell>
                      <TableCell className="px-8 py-8">
                        <Badge variant="outline" className="font-bold text-[0.6rem] uppercase tracking-widest">
                          {promo.type === "percentage" ? "Persentase" : "Nominal"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">
                        {promo.type === "percentage" ? `${promo.value}%` : `Rp ${promo.value.toLocaleString("id-ID")}`}
                      </TableCell>
                      <TableCell className="px-8 py-8">
                        {promo.isActive ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[0.6rem] font-black uppercase tracking-widest">Aktif</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                            <span className="text-[0.6rem] font-black uppercase tracking-widest">Nonaktif</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Interactions Table */}
          {activeTab === "interactions" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-4 flex items-center justify-between border-b border-border bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">Interaksi Produk</h3>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allInteractions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-8 py-16 text-center text-text-muted">
                        <span className="material-symbols-outlined text-4xl opacity-20 mb-2 block">touch_app</span>
                        <p className="font-bold">Belum ada data interaksi</p>
                      </TableCell>
                    </TableRow>
                  ) : allInteractions.map(interaction => {
                    const product = products.find(p => p.id === interaction.productId);
                    return (
                      <TableRow key={interaction.id} className="hover:bg-primary-50/20 transition-all border-border">
                        <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{interaction.id}</TableCell>
                        <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{product?.name || interaction.productId}</TableCell>
                        <TableCell className="px-8 py-8">
                          <Badge variant="outline" className="font-bold text-[0.6rem] uppercase tracking-widest">
                            {interaction.interactionType === "detail_click" && "Klik Detail"}
                            {interaction.interactionType === "view" && "Dilihat"}
                            {interaction.interactionType === "whatsapp_share" && "WhatsApp"}
                            {interaction.interactionType === "promo_click" && "Klik Promo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-8 text-sm text-text-secondary">{interaction.userId}</TableCell>
                        <TableCell className="px-8 py-8 text-sm text-text-muted">
                          {interaction.createdAt ? new Date(interaction.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* WhatsApp Logs Table */}
          {activeTab === "waLogs" && (
            <Card className="border-none ring-0 shadow-sm overflow-hidden bg-white">
              <div className="px-6 lg:px-8 py-4 flex items-center justify-between border-b border-border bg-white">
                <div>
                  <h3 className="font-black text-text-primary text-lg">WhatsApp Log</h3>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary-50/50 hover:bg-secondary-50/50">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-8 py-16 text-center text-text-muted">
                        <span className="material-symbols-outlined text-4xl opacity-20 mb-2 block">chat</span>
                        <p className="font-bold">Belum ada log WhatsApp</p>
                      </TableCell>
                    </TableRow>
                  ) : waLogs.map(log => {
                    const product = products.find(p => p.id === log.productId);
                    return (
                      <TableRow key={log.id} className="hover:bg-primary-50/20 transition-all border-border">
                        <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{log.id}</TableCell>
                        <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{product?.name || log.productId}</TableCell>
                        <TableCell className="px-8 py-8 text-sm text-text-secondary">{log.userId}</TableCell>
                        <TableCell className="px-8 py-8 text-sm text-text-muted">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Product Modal */}
        <ProductDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={editingProduct}
          onSave={handleSave}
        />

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Produk?"
          message="Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari katalog."
          confirmLabel="Hapus Sekarang"
          variant="danger"
        />
      </main>
    </div>
  );
}
