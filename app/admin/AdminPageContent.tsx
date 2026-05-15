"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
import { AppIcon } from "@/components/ui/app-icon";
import ProductDialog from "@/components/admin/ProductDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import { getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getProductTypeLabel, Product } from "@/types/product";
import type { IInteraction } from "@/models/Interaction";

interface MasterDataItem {
  id: string;
  name: string;
  color?: string;
  colorCode?: string;
  hex?: string;
  symbol?: string;
  description?: string;
}

interface AdminPageProps {
  initialProducts: Product[];
  initialInteractions: IInteraction[];
  masterData: {
    categories: MasterDataItem[];
    productTypes: MasterDataItem[];
    units: MasterDataItem[];
    lidColors: MasterDataItem[];
    priceTypes: MasterDataItem[];
    materials: MasterDataItem[];
    lidTypes: MasterDataItem[];
    lidVariants: MasterDataItem[];
  };
}

export default function AdminPageContent({ initialProducts, initialInteractions, masterData }: AdminPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "lidColors" | "productTypes" | "units" | "priceTypes" | "promos" | "interactions" | "waLogs">("products");
  const router = useRouter();

  const waLogs = initialInteractions.filter(i => i.interactionType === "whatsapp_share");
  const allInteractions = initialInteractions;

  // Create or update a product via the API
  const handleSave = async (productData: Partial<Product>) => {
    const isEditing = !!editingProduct;
    const url = isEditing ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Gagal menyimpan produk");

    toast.success(isEditing ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");

    router.refresh();
    setIsDialogOpen(false);

    const saved = await response.json();
    if (isEditing) {
      setProducts(products.map(p => p.id === editingProduct.id ? saved.data : p));
    } else {
      setProducts([saved.data, ...products]);
    }
  };

  // Soft-delete a product
  const handleDelete = async () => {
    if (!productToDelete) return;

    const response = await fetch(`/api/products/${productToDelete}`, { method: "DELETE" });
    if (response.ok) {
      setProducts(products.filter(p => p.id !== productToDelete));
      toast.success("Produk berhasil dihapus");
    } else {
      toast.error("Gagal menghapus produk");
    }
    setProductToDelete(null);
  };

  // Open dialog with existing product data
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
  const CATEGORIES = masterData.categories.map(c => ({
    ...c,
    count: products.filter(p => p.categoryId === c.id).length
  }));

  const COLORS = masterData.lidColors;
  const TYPES = masterData.productTypes;
  const UNITS = masterData.units;
  const PRICE_TYPES = masterData.priceTypes;

  // Lookup maps for name resolution
  const categoryMap = Object.fromEntries(masterData.categories.map(c => [c.id, c.name]));
  const typeMap = Object.fromEntries(masterData.productTypes.map(t => [t.id, t.name]));
  const unitMap = Object.fromEntries(masterData.units.map(u => [u.id, u.name]));

  const MOCK_PROMOS = [
    { id: "promo_001", code: "DISKON10", name: "Diskon 10%", type: "percentage" as const, value: 10, isActive: true },
    { id: "promo_002", code: "HEMAT5K", name: "Potongan Rp5.000", type: "nominal" as const, value: 5000, isActive: true },
    { id: "promo_003", code: "NEWYEAR", name: "Promo Tahun Baru", type: "percentage" as const, value: 15, isActive: false },
  ];

  return (
    <div className="bg-background text-text-primary flex min-h-screen font-sans relative selection:bg-primary-500/10">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
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
                "group w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm cursor-pointer",
                item.active
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                  : "text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-3.5">
                <AppIcon name={item.icon} className={cn(
                  "text-xl transition-colors",
                  item.active ? "text-white" : "text-text-muted group-hover:text-text-primary"
                )} />
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
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
              router.refresh();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[0.65rem] uppercase tracking-widest border border-border hover:border-red-200 cursor-pointer"
          >
            <AppIcon name="logout" className="text-lg" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
        {/* Topbar */}
        <header className="h-20 lg:h-24 bg-white border-b border-border flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-text-secondary border border-border hover:bg-white transition-all cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <AppIcon name="menu" />
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-black text-text-primary tracking-tight">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
            className="bg-primary-500 text-white px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl font-black flex items-center gap-2.5 text-xs lg:text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer"
          >
            <AppIcon name="add" className="text-lg" />
            <span className="hidden sm:inline">Tambah Produk Baru</span>
            <span className="sm:hidden">Produk</span>
          </button>
        </header>

        <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">

          {/* Dashboard Stats */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-500 rounded-2xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <AppIcon name="inventory_2" className="text-2xl text-white" />
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-white/80">Katalog Produk</span>
                </div>
                <div className="text-5xl font-black text-white tracking-tighter mb-1">{products.length}</div>
                <div className="text-[0.65rem] font-bold text-white/60 uppercase tracking-widest">Unit Tersedia</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <AppIcon name="touch_app" className="text-2xl text-text-primary transition-colors group-hover:text-primary-500" />
                  </div>
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Interaksi User</span>
                </div>
                <div className="text-5xl font-black text-text-primary tracking-tighter mb-1">{allInteractions.length}</div>
                <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">Klik & Dilihat</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <AppIcon name="chat" className="text-2xl text-text-primary transition-colors group-hover:text-green-600" />
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
                  <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
                  <input
                    type="text"
                    placeholder="Cari SKU, nama, atau material..."
                    className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                    <AppIcon name="tune" className="text-sm" /> Filter
                  </button>
                  <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                    <AppIcon name="download" className="text-sm" /> Ekspor
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="p-20 flex flex-col items-center justify-center text-text-muted text-center">
                    <div className="flex items-center justify-center mb-6">
                      <AppIcon name="inventory_2" className="text-6xl opacity-20" />
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
                          <TableRow key={p.id} className="transition-all duration-200 group border-border">
                            <TableCell className="px-8 py-8">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-lg bg-[#F9FAFB] flex items-center justify-center p-1.5 border border-border shrink-0 overflow-hidden group-hover:scale-105 group-hover:border-primary-200 transition-all">
                                  {image ? (
                                    <img className="w-full h-full object-cover rounded-lg" alt={p.name} src={image} />
                                  ) : (
                                    <AppIcon name="inventory_2" className="text-2xl opacity-30" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">{p.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none text-[0.55rem] font-black uppercase px-1.5 h-4">
                                      {typeMap[p.productTypeId || ""] || getProductTypeLabel(p.productTypeId)}
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
                                {categoryMap[p.categoryId] || getCategoryLabel(p.categoryId)}
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
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest">Aktif</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest">Draft</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-8 py-8 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                                >
                                  <AppIcon name="edit" className="text-lg" />
                                </button>
                                <button
                                  onClick={() => {
                                    setProductToDelete(p.id);
                                    setIsConfirmOpen(true);
                                  }}
                                  className="w-9 h-9 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                                >
                                  <AppIcon name="delete" className="text-lg" />
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
                      <AppIcon name="chevron_left" className="text-lg" />
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-primary-500 text-white font-black text-[0.65rem] shadow-lg shadow-primary-500/20 cursor-pointer">1</button>
                    <button className="w-9 h-9 rounded-xl bg-white border border-border hover:bg-secondary-50 flex items-center justify-center text-text-primary transition-all shadow-sm cursor-pointer">
                      <AppIcon name="chevron_right" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Kategori
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Kategori</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Kategori</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Jml Produk</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CATEGORIES.map(cat => (
                    <TableRow key={cat.id} className="transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{cat.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{cat.name}</TableCell>
                      <TableCell className="px-8 py-8">
                        <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none font-bold">{cat.count}</Badge>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Warna
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Warna</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Preview</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Warna</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COLORS.map(color => (
                    <TableRow key={color.id} className="transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{color.id}</TableCell>
                      <TableCell className="px-8 py-8">
                        <div className="w-8 h-8 rounded-full border border-border shadow-sm flex items-center justify-center bg-gray-50 overflow-hidden" style={{ backgroundColor: color.hex }}>
                          {color.hex === "#ffffff" && <AppIcon name="texture" className="text-[10px] text-gray-300" />}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{color.name}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Tipe
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterData.productTypes.map(type => (
                    <TableRow key={type.id} className="transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{type.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{type.name}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Satuan
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Satuan</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Satuan</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Simbol</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterData.units.map(unit => (
                    <TableRow key={unit.id} className="transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{unit.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{unit.name}</TableCell>
                      <TableCell className="px-8 py-8">
                        <Badge variant="outline" className="font-mono font-bold text-xs">{unit.symbol}</Badge>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Tipe Harga
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Tipe</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Deskripsi</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterData.priceTypes.map(pt => (
                    <TableRow key={pt.id} className="transition-all border-border">
                      <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{pt.id}</TableCell>
                      <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{pt.name}</TableCell>
                      <TableCell className="px-8 py-8 text-sm text-text-secondary">{pt.description}</TableCell>
                      <TableCell className="px-8 py-8 text-right">
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                <button className="bg-primary-50 text-primary-600 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary-100 transition-colors uppercase tracking-widest cursor-pointer">
                  <AppIcon name="add" className="text-sm" /> Tambah Promo
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
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
                    <TableRow key={promo.id} className="transition-all border-border">
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
                        <button className="w-9 h-9 rounded-xl hover:bg-primary-50 text-primary-500 inline-flex items-center justify-center transition-colors cursor-pointer">
                          <AppIcon name="edit" className="text-lg" />
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
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
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
                      <TableCell colSpan={5} className="p-20 text-center text-text-muted">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center mb-6">
                            <AppIcon name="touch_app" className="text-6xl opacity-20" />
                          </div>
                          <p className="text-xl font-black text-text-primary tracking-tight">Belum ada data interaksi</p>
                          <p className="text-sm mt-2 max-w-xs text-text-secondary font-medium">Data interaksi user akan muncul di sini.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : allInteractions.map(interaction => {
                    const product = products.find(p => p.id === interaction.productId);
                    return (
                      <TableRow key={interaction.id} className="transition-all border-border">
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
                        <TableCell className="px-8 py-8 text-sm text-text-secondary">
                          {interaction.userId.startsWith("user_admin") ? "Admin" : "Pengunjung"}
                        </TableCell>
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
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User</TableHead>
                    <TableHead className="px-8 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="p-20 text-center text-text-muted">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center mb-6">
                            <AppIcon name="chat" className="text-6xl opacity-20" />
                          </div>
                          <p className="text-xl font-black text-text-primary tracking-tight">Belum ada log WhatsApp</p>
                          <p className="text-sm mt-2 max-w-xs text-text-secondary font-medium">Log pesan WhatsApp akan muncul di sini.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : waLogs.map(log => {
                    const product = products.find(p => p.id === log.productId);
                    return (
                      <TableRow key={log.id} className="transition-all border-border">
                        <TableCell className="px-8 py-8 font-mono text-xs font-black text-text-muted">{log.id}</TableCell>
                        <TableCell className="px-8 py-8 font-black text-sm text-text-primary">{product?.name || log.productId}</TableCell>
                        <TableCell className="px-8 py-8 text-sm text-text-secondary">
                          {log.userId.startsWith("user_admin") ? "Admin" : "Pengunjung"}
                        </TableCell>
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
          masterData={masterData}
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
