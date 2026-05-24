"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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
import { formatAttributeLabel, getAvailabilityLabel, getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getProductTypeLabel, Product } from "@/types/product";

interface MasterDataItem {
  id: string;
  name: string;
  color?: string;
  colorCode?: string;
}

interface ProductsPageContentProps {
  initialProducts: Product[];
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

export default function ProductsPageContent({ initialProducts, masterData }: ProductsPageContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    const materialMap = Object.fromEntries(masterData.materials.map(m => [m.id, m.name]));
    const categoryMap = Object.fromEntries(masterData.categories.map(c => [c.id, c.name]));
    const typeMap = Object.fromEntries(masterData.productTypes.map(t => [t.id, t.name]));
    const lidTypeMap = Object.fromEntries(masterData.lidTypes.map(t => [t.id, t.name]));

    return products.filter((p) => {
      const skuMatch = p.sku?.toLowerCase().includes(query);
      const nameMatch = p.name?.toLowerCase().includes(query);
      
      const bodyMat = (materialMap[p.bodyMaterial] || p.bodyMaterial || "").toLowerCase();
      const lidMat = (materialMap[p.lidMaterial] || p.lidMaterial || "").toLowerCase();
      const materialMatch = bodyMat.includes(query) || lidMat.includes(query);
      
      const categoryMatch = (categoryMap[p.categoryId] || "").toLowerCase().includes(query);
      const typeMatch = (typeMap[p.productTypeId || ""] || "").toLowerCase().includes(query);
      const lidTypeMatch = (lidTypeMap[p.lidType] || "").toLowerCase().includes(query);

      return skuMatch || nameMatch || materialMatch || categoryMatch || typeMatch || lidTypeMatch;
    });
  }, [products, searchQuery, masterData]);

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

  // Toggle availability status of a product
  const toggleAvailability = async (product: Product) => {
    const isCurrentlyAvailable = product.isAvailable !== false;
    const newIsAvailable = !isCurrentlyAvailable;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newIsAvailable }),
      });

      if (!response.ok) throw new Error("Gagal memperbarui status ketersediaan");

      toast.success(`Status ${product.name} berhasil diubah menjadi ${newIsAvailable ? "Tersedia" : "Tidak Tersedia"}`);

      // Update local state
      setProducts(products.map(p => p.id === product.id ? { ...p, isAvailable: newIsAvailable } : p));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status ketersediaan");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const categoryMap = Object.fromEntries(masterData.categories.map(c => [c.id, c.name]));
  const typeMap = Object.fromEntries(masterData.productTypes.map(t => [t.id, t.name]));
  const lidTypeMap = Object.fromEntries(masterData.lidTypes.map(t => [t.id, t.name]));


  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Produk</h2>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer"
        >
          <AppIcon name="add" className="text-lg" />
          Tambah Produk Baru
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all"
      >
        <AppIcon name="add" className="text-2xl" />
      </button>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <input
                type="text"
                placeholder="Cari SKU, nama, atau material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 lg:gap-3">
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                <AppIcon name="tune" className="text-sm" /> Filter
              </button>
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
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
                <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Katalog masih kosong</h2>
                <p className="text-sm mt-2 max-w-xs text-text-secondary font-medium">Mulai kembangkan bisnis Anda dengan menambahkan produk pertama.</p>
              </div>
            ) : (
              <Table className="min-w-200">
                <TableHeader>
                  <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Info Produk</TableHead>
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">SKU & Material</TableHead>
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Kategori</TableHead>
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Harga Dasar</TableHead>
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Status</TableHead>
                    <TableHead className="px-4 py-3 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center justify-center text-text-muted">
                          <AppIcon name="inventory_2" className="text-6xl opacity-10 mb-4" />
                          <p className="text-lg font-black text-text-primary">Produk tidak ditemukan</p>
                          <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map(p => {
                      const image = getPrimaryImage(p);

                      return (
                        <TableRow key={p.id} className="transition-all duration-200 group border-border">
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] flex items-center justify-center p-1 border border-border shrink-0 overflow-hidden transition-all">
                                {image ? (
                                  <Image
                                    className="object-cover rounded-lg"
                                    alt={p.name}
                                    src={image}
                                    width={40}
                                    height={40}
                                  />
                                ) : (
                                  <AppIcon name="inventory_2" className="text-xl opacity-30" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">{p.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none text-[0.5rem] font-black uppercase px-1 h-3.5">
                                    {typeMap[p.productTypeId || ""] || getProductTypeLabel(p.productTypeId)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <p className="text-xs font-black text-text-primary font-mono tracking-tighter">{p.sku}</p>
                            <p className="text-[9px] font-bold text-text-muted mt-0.5 uppercase tracking-widest">
                              {lidTypeMap[p.lidType] || formatAttributeLabel(p.lidType)}
                            </p>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <Badge variant="outline" className="bg-white border-border text-text-secondary text-[0.55rem] font-black uppercase tracking-widest px-1.5 py-0.5">
                              {categoryMap[p.categoryId] || getCategoryLabel(p.categoryId)}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <p className="text-xs font-black text-text-primary tracking-tight">
                              {formatPrice(getLowestRetailPrice(p))}
                            </p>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {!p.deletedAt ? (
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() => toggleAvailability(p)}
                                  className={cn(
                                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none p-0.5 border-none outline-none shadow-none",
                                    p.isAvailable !== false ? "bg-emerald-500" : "bg-red-500"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                                      p.isAvailable !== false ? "translate-x-4" : "translate-x-0"
                                    )}
                                  />
                                </button>
                                <span className={cn(
                                  "text-[0.6rem] font-black uppercase tracking-widest",
                                  p.isAvailable !== false ? "text-emerald-600" : "text-red-500"
                                )}>
                                  {getAvailabilityLabel(p.isAvailable)}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                <span className="text-[0.6rem] font-black uppercase tracking-widest">Draft</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right">
                          <div className="flex items-center gap-1">
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
                  })
                )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-8 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-[#F9FAFB]/30 gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Showing <span className="text-text-primary font-black">1-{filteredProducts.length}</span> of <span className="text-text-primary font-black">{filteredProducts.length}</span> items
              </span>
              <div className="flex items-center gap-1.5">
                <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-text-muted opacity-50 cursor-not-allowed transition-all">
                  <AppIcon name="chevron_left" className="text-lg" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-primary-500 text-white font-black text-[0.65rem] cursor-pointer">1</button>
                <button className="w-9 h-9 rounded-xl bg-white border border-border hover:bg-secondary-50 flex items-center justify-center text-text-primary transition-all cursor-pointer">
                  <AppIcon name="chevron_right" className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </Card>
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
    </>
  );
}
