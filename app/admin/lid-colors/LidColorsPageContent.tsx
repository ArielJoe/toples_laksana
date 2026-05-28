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
import { ILidColor } from "@/models/LidColor";

interface LidColorsPageContentProps {
  initialColors: ILidColor[];
}

const LID_COLOR_FIELDS: MasterDataField[] = [
  { name: "id", label: "ID", type: "text", placeholder: "misal: merah", required: true },
  { name: "color", label: "Nama Warna", type: "text", placeholder: "misal: Merah", required: true },
  { name: "colorCode", label: "Kode Warna (HEX)", type: "color", placeholder: "misal: #FF0000", required: true },
];

const ADMIN_TABLE_PAGE_SIZE = 10;

export default function LidColorsPageContent({ initialColors }: LidColorsPageContentProps) {
  const [colors, setColors] = useState(initialColors);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ILidColor | null>(null);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);
  
  const router = useRouter();

  const filteredColors = colors.filter(color => 
    color.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
    color.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredColors.length / ADMIN_TABLE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredColors.length === 0
    ? 0
    : (safePage - 1) * ADMIN_TABLE_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * ADMIN_TABLE_PAGE_SIZE, filteredColors.length);
  const paginatedColors = filteredColors.slice(startIndex - 1, endIndex);

  const handleSave = async (data: MasterDataForm) => {
    const isEditing = !!editingColor;
    const url = isEditing ? `/api/lid-colors/${editingColor.id}` : "/api/lid-colors";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menyimpan warna");
      }

      toast.success(isEditing ? "Warna berhasil diperbarui" : "Warna berhasil ditambahkan");
      
      const saved = await response.json();
      if (isEditing) {
        setColors(colors.map(c => c.id === editingColor.id ? saved.data : c));
      } else {
        setColors([saved.data, ...colors]);
        setPage(1);
      }
      
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan warna");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!colorToDelete) return;

    try {
      const response = await fetch(`/api/lid-colors/${colorToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus warna");
      }

      setColors(colors.filter(c => c.id !== colorToDelete));
      toast.success("Warna berhasil dihapus");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus warna");
    } finally {
      setIsConfirmOpen(false);
      setColorToDelete(null);
    }
  };

  const openAddDialog = () => {
    setEditingColor(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (color: ILidColor) => {
    setEditingColor(color);
    setIsDialogOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setColorToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Warna Tutup</h2>
        </div>
        <button 
          onClick={openAddDialog}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer shadow-lg shadow-primary-500/20"
        >
          <AppIcon name="add" className="text-lg" />
          Tambah Warna
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
                placeholder="Cari warna..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
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

          <div className="overflow-x-auto">
            <Table className="min-w-150">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Preview</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Warna</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="palette" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Warna tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedColors.map((color) => (
                    <TableRow key={color.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-3">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{color.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-3">
                        <div 
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-gray-50 overflow-hidden" 
                          style={{ backgroundColor: color.colorCode || "#FFFFFF" }}
                        >
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-3">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{color.color}</p>
                      </TableCell>
                      <TableCell className="px-8 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditDialog(color)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(color.id)}
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

          {filteredColors.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredColors.length}</span> data
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
        title={editingColor ? "Edit Warna" : "Tambah Warna"}
        fields={LID_COLOR_FIELDS}
        initialData={editingColor}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Warna?"
        message="Tindakan ini tidak dapat dibatalkan. Warna akan dihapus secara permanen."
        confirmLabel="Hapus Sekarang"
        variant="danger"
      />
    </>
  );
}
