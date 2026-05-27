"use client";

import { useState } from "react";
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
import { PaginationControls } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MasterDataDialog, { MasterDataField, MasterDataForm } from "@/components/admin/MasterDataDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";

export interface SimpleMasterItem {
  id: string;
  name: string;
  usage?: "body" | "lid" | "both";
  description?: string;
}

interface SimpleMasterDataPageProps {
  title: string;
  addLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyMessage: string;
  apiPath: string;
  initialItems: SimpleMasterItem[];
  fields: MasterDataField[];
}

const USAGE_LABELS: Record<NonNullable<SimpleMasterItem["usage"]>, string> = {
  body: "Badan",
  lid: "Tutup",
  both: "Badan & Tutup",
};

const MASTER_DATA_PAGE_SIZE = 10;

export default function SimpleMasterDataPage({
  title,
  addLabel,
  searchPlaceholder,
  emptyTitle,
  emptyMessage,
  apiPath,
  initialItems,
  fields,
}: SimpleMasterDataPageProps) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SimpleMasterItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.usage ? USAGE_LABELS[item.usage].toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const showUsageColumn = fields.some((field) => field.name === "usage");
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / MASTER_DATA_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = filteredItems.length === 0
    ? 0
    : (safePage - 1) * MASTER_DATA_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * MASTER_DATA_PAGE_SIZE, filteredItems.length);
  const paginatedItems = filteredItems.slice(startIndex - 1, endIndex);

  const handleSave = async (data: MasterDataForm) => {
    const isEditing = !!editingItem;
    const url = isEditing ? `${apiPath}/${editingItem.id}` : apiPath;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Gagal menyimpan ${title.toLowerCase()}`);
      }

      const saved = await response.json();
      if (isEditing) {
        setItems(items.map((item) => item.id === editingItem.id ? saved.data : item));
      } else {
        setItems([saved.data, ...items]);
        setPage(1);
      }

      toast.success(isEditing ? `${title} berhasil diperbarui` : `${title} berhasil ditambahkan`);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : `Gagal menyimpan ${title.toLowerCase()}`);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`${apiPath}/${itemToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Gagal menghapus ${title.toLowerCase()}`);
      }

      setItems(items.filter((item) => item.id !== itemToDelete));
      toast.success(`${title} berhasil dihapus`);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : `Gagal menghapus ${title.toLowerCase()}`);
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">{title}</h2>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer shadow-lg shadow-primary-500/20"
        >
          <AppIcon name="add" className="text-lg" />
          {addLabel}
        </button>
      </header>

      <button
        onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-primary-500/30"
      >
        <AppIcon name="add" className="text-2xl" />
      </button>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" name="search" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama</TableHead>
                  {showUsageColumn && (
                    <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Untuk</TableHead>
                  )}
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Deskripsi</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showUsageColumn ? 5 : 4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="inventory_2" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">{emptyTitle}</p>
                        <p className="text-sm font-medium">{emptyMessage}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{item.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{item.name}</p>
                      </TableCell>
                      {showUsageColumn && (
                        <TableCell className="px-8 py-5">
                          <span className="inline-flex rounded-lg bg-secondary-50 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary">
                            {item.usage ? USAGE_LABELS[item.usage] : "-"}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="px-8 py-5">
                        <p className="max-w-md text-sm font-medium text-text-secondary truncate">{item.description || "-"}</p>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsDialogOpen(true);
                            }}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(item.id);
                              setIsConfirmOpen(true);
                            }}
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

          {filteredItems.length > 0 && (
            <div className="border-t border-border bg-[#F9FAFB]/30 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                Menampilkan <span className="text-text-primary font-black">{startIndex}-{endIndex}</span> dari <span className="text-text-primary font-black">{filteredItems.length}</span> data
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
        title={editingItem ? `Edit ${title}` : addLabel}
        fields={fields}
        initialData={editingItem}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Hapus ${title}?`}
        message={`Tindakan ini tidak dapat dibatalkan. ${title} akan dihapus secara permanen.`}
        confirmLabel="Hapus Sekarang"
        variant="danger"
      />
    </>
  );
}
