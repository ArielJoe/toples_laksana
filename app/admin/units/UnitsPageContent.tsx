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
import { IUnit } from "@/models/Unit";

interface UnitsPageContentProps {
  initialUnits: IUnit[];
}

const UNIT_FIELDS: MasterDataField[] = [
  { name: "id", label: "ID", type: "text", placeholder: "misal: box", required: true },
  { name: "name", label: "Nama Satuan", type: "text", placeholder: "misal: Box", required: true },
  { name: "symbol", label: "Simbol/Abbrev", type: "text", placeholder: "misal: bx", required: true },
];

const ADMIN_TABLE_PAGE_SIZE = 10;

export default function UnitsPageContent({ initialUnits }: UnitsPageContentProps) {
  const [units, setUnits] = useState(initialUnits);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<IUnit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  
  const router = useRouter();

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / ADMIN_TABLE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredUnits.length === 0
    ? 0
    : (safePage - 1) * ADMIN_TABLE_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * ADMIN_TABLE_PAGE_SIZE, filteredUnits.length);
  const paginatedUnits = filteredUnits.slice(startIndex - 1, endIndex);

  const handleSave = async (data: MasterDataForm) => {
    const isEditing = !!editingUnit;
    const url = isEditing ? `/api/units/${editingUnit.id}` : "/api/units";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menyimpan satuan");
      }

      toast.success(isEditing ? "Satuan berhasil diperbarui" : "Satuan berhasil ditambahkan");
      
      const saved = await response.json();
      if (isEditing) {
        setUnits(units.map(u => u.id === editingUnit.id ? saved.data : u));
      } else {
        setUnits([saved.data, ...units]);
        setPage(1);
      }
      
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan satuan");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      const response = await fetch(`/api/units/${unitToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus satuan");
      }

      setUnits(units.filter(u => u.id !== unitToDelete));
      toast.success("Satuan berhasil dihapus");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus satuan");
    } finally {
      setIsConfirmOpen(false);
      setUnitToDelete(null);
    }
  };

  const openAddDialog = () => {
    setEditingUnit(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (unit: IUnit) => {
    setEditingUnit(unit);
    setIsDialogOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setUnitToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Satuan</h2>
        </div>
        <button 
          onClick={openAddDialog}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer shadow-lg shadow-primary-500/20"
        >
          <AppIcon name="add" className="text-lg" />
          Tambah Satuan
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
                placeholder="Cari satuan..."
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
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Satuan</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Simbol</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="straighten" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Satuan tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUnits.map((unit) => (
                    <TableRow key={unit.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{unit.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{unit.name}</p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-bold text-text-secondary">{unit.symbol}</p>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditDialog(unit)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(unit.id)}
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

          {filteredUnits.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredUnits.length}</span> data
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
        title={editingUnit ? "Edit Satuan" : "Tambah Satuan"}
        fields={UNIT_FIELDS}
        initialData={editingUnit}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Satuan?"
        message="Tindakan ini tidak dapat dibatalkan. Satuan akan dihapus secara permanen."
        confirmLabel="Hapus Sekarang"
        variant="danger"
      />
    </>
  );
}
