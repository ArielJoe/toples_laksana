"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MasterDataDialog, { MasterDataField, MasterDataForm } from "@/components/admin/MasterDataDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProductType } from "@/models/ProductType";

interface ProductTypesPageContentProps {
  initialProductTypes: IProductType[];
}

const PRODUCT_TYPE_FIELDS: MasterDataField[] = [
  { name: "id", label: "ID", type: "text", placeholder: "misal: toples-jar", required: true },
  { name: "name", label: "Nama Tipe Produk", type: "text", placeholder: "misal: Toples Jar", required: true },
];

const ADMIN_TABLE_PAGE_SIZE = 10;

export default function ProductTypesPageContent({ initialProductTypes }: ProductTypesPageContentProps) {
  const [productTypes, setProductTypes] = useState(initialProductTypes);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState<IProductType | null>(null);
  const [productTypeToDelete, setProductTypeToDelete] = useState<string | null>(null);
  const [filterTypeGroup, setFilterTypeGroup] = useState(""); // "" | "toples" | "others"
  
  const router = useRouter();

  const filteredProductTypes = productTypes.filter(pt => {
    const matchQuery = pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       pt.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchQuery) return false;

    if (filterTypeGroup === "toples") {
      return pt.name.toLowerCase().includes("toples");
    } else if (filterTypeGroup === "others") {
      return !pt.name.toLowerCase().includes("toples");
    }

    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProductTypes.length / ADMIN_TABLE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredProductTypes.length === 0
    ? 0
    : (safePage - 1) * ADMIN_TABLE_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * ADMIN_TABLE_PAGE_SIZE, filteredProductTypes.length);
  const paginatedProductTypes = filteredProductTypes.slice(startIndex - 1, endIndex);

  const handleSave = async (data: MasterDataForm) => {
    const isEditing = !!editingProductType;
    const url = isEditing ? `/api/product-types/${editingProductType.id}` : "/api/product-types";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menyimpan tipe produk");
      }

      toast.success(isEditing ? "Tipe produk berhasil diperbarui" : "Tipe produk berhasil ditambahkan");
      
      const saved = await response.json();
      if (isEditing) {
        setProductTypes(productTypes.map(p => p.id === editingProductType.id ? saved.data : p));
      } else {
        setProductTypes([saved.data, ...productTypes]);
        setPage(1);
      }
      
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan tipe produk");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!productTypeToDelete) return;

    try {
      const response = await fetch(`/api/product-types/${productTypeToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus tipe produk");
      }

      setProductTypes(productTypes.filter(p => p.id !== productTypeToDelete));
      toast.success("Tipe produk berhasil dihapus");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus tipe produk");
    } finally {
      setIsConfirmOpen(false);
      setProductTypeToDelete(null);
    }
  };

  const openAddDialog = () => {
    setEditingProductType(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (pt: IProductType) => {
    setEditingProductType(pt);
    setIsDialogOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setProductTypeToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Tipe Produk</h2>
        </div>
        <button 
          onClick={openAddDialog}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer shadow-lg shadow-primary-500/20"
        >
          <AppIcon name="add" className="text-lg" />
          Tambah Tipe Produk
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={openAddDialog}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-primary-500/30"
      >
        <AppIcon name="add" className="text-2xl" />
      </button>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <input
                type="text"
                placeholder="Cari tipe produk..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 lg:gap-3">
              <Popover>
                <PopoverTrigger className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                  <AppIcon name="tune" className="text-sm" /> Filter
                  {filterTypeGroup && (
                    <span className="size-2 rounded-full bg-primary-500" />
                  )}
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-3 space-y-2 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-black/10 ring-0 text-text-primary">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-wider ml-1">Kelompok Tipe</label>
                      <Select
                        value={filterTypeGroup || "__all__"}
                        onValueChange={(val) => {
                          setFilterTypeGroup(val === "__all__" || !val ? "" : val);
                          setPage(1);
                        }}
                        items={[
                          { value: "__all__", label: "Semua Tipe" },
                          { value: "toples", label: "Hanya Toples" },
                          { value: "others", label: "Tipe Lainnya" }
                        ]}
                      >
                        <SelectTrigger className="h-10 w-full bg-secondary-50/30 border-border font-bold text-xs rounded-xl px-3.5">
                          <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectItem value="__all__">Semua Tipe</SelectItem>
                            <SelectItem value="toples">Hanya Toples</SelectItem>
                            <SelectItem value="others">Tipe Lainnya</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {filterTypeGroup && (
                    <button
                      onClick={() => {
                        setFilterTypeGroup("");
                        setPage(1);
                      }}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer text-center"
                    >
                      Reset Filter
                    </button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <Table className="min-w-150">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="w-1/3 px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Tipe Produk</TableHead>
                  <TableHead className="w-32 px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="inventory_2" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Tipe produk tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProductTypes.map((pt) => (
                    <TableRow key={pt.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-3">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{pt.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-3">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{pt.name}</p>
                      </TableCell>
                      <TableCell className="px-8 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditDialog(pt)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(pt.id)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View: Cards List */}
          <div className="block sm:hidden divide-y divide-border bg-white">
            {filteredProductTypes.length === 0 ? (
              <div className="p-16 text-center text-text-muted">
                <AppIcon name="inventory_2" className="text-5xl opacity-10 mb-4" />
                <p className="text-base font-black text-text-primary">Tipe produk tidak ditemukan</p>
                <p className="text-xs font-medium mt-1">Coba gunakan kata kunci pencarian lain.</p>
              </div>
            ) : (
              paginatedProductTypes.map((pt) => (
                <div key={pt.id} className="p-5 flex flex-col gap-3 hover:bg-secondary-50/10 transition-colors">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-black text-text-muted font-mono tracking-tighter block mb-0.5">{pt.id}</span>
                    <h4 className="text-sm font-black text-text-primary tracking-tight truncate">{pt.name}</h4>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-secondary-50/50">
                    <button
                      onClick={() => openEditDialog(pt)}
                      className="h-8 px-3.5 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AppIcon name="edit" className="text-xs" /> Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(pt.id)}
                      className="h-8 px-3.5 bg-red-50 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AppIcon name="delete" className="text-xs" /> Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredProductTypes.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredProductTypes.length}</span> data
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

      <MasterDataDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        title={editingProductType ? "Edit Tipe Produk" : "Tambah Tipe Produk"}
        fields={PRODUCT_TYPE_FIELDS}
        initialData={editingProductType}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Tipe Produk?"
        message="Tindakan ini tidak dapat dibatalkan. Tipe produk akan dihapus secara permanen."
        confirmLabel="Hapus Sekarang"
        variant="danger"
      />
    </>
  );
}
