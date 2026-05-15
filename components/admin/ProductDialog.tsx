"use client";

import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2, ImagePlus, X } from "lucide-react";
import { AppIcon } from "../ui/app-icon";

interface MasterDataItem {
  id: string;
  name: string;
  color?: string;
  colorCode?: string;
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
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

const emptyProduct: Partial<Product> = {
  id: "",
  name: "",
  sku: "",
  categoryId: "cat_001",
  productTypeId: "pt_003",
  unitId: "unit_005",
  bodyMaterial: "",
  lidMaterial: "",
  lidVariant: "",
  lidType: "",
  availabilityStatus: "available",
  availabilityNote: "",
  description: "",
  dimension: {
    heightCm: 0,
    diameterCm: 0,
    volumeMl: 0,
    weightGram: 0,
  },
  images: [],
  prices: [],
  packaging: [],
  deletedAt: null,
};

export default function ProductDialog({ isOpen, onClose, product, onSave, masterData }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ id: string; file: File; preview: string; isPrimary: boolean }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("productImage");

  useEffect(() => {
    if (isOpen) {
      setFormData(product || {
        ...emptyProduct,
        id: `prod_${Date.now()}`,
      });
    }
  }, [product, isOpen]);

  const updateDimension = (key: keyof NonNullable<Product["dimension"]>, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimension: {
        ...(prev.dimension || { heightCm: 0, diameterCm: 0, volumeMl: 0, weightGram: 0 }),
        [key]: value,
      },
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newPending = files
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        preview: URL.createObjectURL(f),
        isPrimary: (formData.images?.length || 0) === 0 && pendingFiles.length === 0
      }));
    setPendingFiles(prev => [...prev, ...newPending]);
  };

  const removePending = (id: string) => {
    setPendingFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      // Revoke URL to avoid memory leak
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImages = [...(formData.images || [])];

      // 1. Upload pending files if any
      if (pendingFiles.length > 0) {
        const uploadResult = await startUpload(pendingFiles.map(pf => pf.file));
        if (!uploadResult) throw new Error("Gagal mengunggah gambar");

        const uploadedImages = uploadResult.map((res, i) => ({
          imageUrl: res.url,
          order: finalImages.length + i,
          isPrimary: pendingFiles[i].isPrimary
        }));
        finalImages = [...finalImages, ...uploadedImages];
      }

      // 2. Ensure only one image is primary
      const primaryCount = finalImages.filter(img => img.isPrimary).length;
      if (primaryCount === 0 && finalImages.length > 0) {
        finalImages[0].isPrimary = true;
      } else if (primaryCount > 1) {
        const firstPrimaryIndex = finalImages.findIndex(img => img.isPrimary);
        finalImages = finalImages.map((img, i) => ({ ...img, isPrimary: i === firstPrimaryIndex }));
      }

      await onSave({ ...formData, images: finalImages });
      
      // Cleanup
      pendingFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setPendingFiles([]);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden flex flex-col p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-white/90 px-8 py-6 backdrop-blur-md">
          <DialogTitle className="text-xl font-black text-text-primary">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="ID Produk" value={formData.id || ""} onChange={(value) => setFormData({ ...formData, id: value })} required />
              <Field label="SKU" value={formData.sku || ""} onChange={(value) => setFormData({ ...formData, sku: value })} required />
              <Field label="Nama Produk" value={formData.name || ""} onChange={(value) => setFormData({ ...formData, name: value })} required />
              <SelectField
                label="Kategori"
                value={formData.categoryId || ""}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
                options={masterData.categories.map(c => [c.id, c.name])}
              />
              <SelectField
                label="Tipe Produk"
                value={formData.productTypeId || ""}
                onChange={(value) => setFormData({ ...formData, productTypeId: value })}
                options={masterData.productTypes.map(pt => [pt.id, pt.name])}
              />
              <SelectField
                label="Satuan"
                value={formData.unitId || ""}
                onChange={(value) => setFormData({ ...formData, unitId: value })}
                options={masterData.units.map(u => [u.id, u.name])}
              />
              <SelectField
                label="Status Ketersediaan"
                value={formData.availabilityStatus || "available"}
                onChange={(value) => setFormData({ ...formData, availabilityStatus: value as Product["availabilityStatus"] })}
                options={[
                  ["available", "Tersedia"],
                  ["limited", "Terbatas"],
                  ["preorder", "Preorder"],
                  ["unavailable", "Tidak Tersedia"],
                ]}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Material</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Material Badan"
                  value={formData.bodyMaterial || ""}
                  onChange={(value) => setFormData({ ...formData, bodyMaterial: value })}
                  options={masterData.materials.map(m => [m.id, m.name])}
                  fallbackLabel={formData.bodyMaterial}
                />
                <SelectField
                  label="Material Tutup"
                  value={formData.lidMaterial || ""}
                  onChange={(value) => setFormData({ ...formData, lidMaterial: value })}
                  options={masterData.materials.map(m => [m.id, m.name])}
                  fallbackLabel={formData.lidMaterial}
                />
                <SelectField
                  label="Varian Tutup"
                  value={formData.lidVariant || ""}
                  onChange={(value) => setFormData({ ...formData, lidVariant: value })}
                  options={masterData.lidVariants.map(v => [v.id, v.name])}
                  fallbackLabel={formData.lidVariant}
                />
                <SelectField
                  label="Tipe Tutup"
                  value={formData.lidType || ""}
                  onChange={(value) => setFormData({ ...formData, lidType: value })}
                  options={masterData.lidTypes.map(t => [t.id, t.name])}
                  fallbackLabel={formData.lidType}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Dimensi</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NumberField label="Tinggi cm" value={formData.dimension?.heightCm || 0} onChange={(value) => updateDimension("heightCm", value)} />
                <NumberField label="Diameter cm" value={formData.dimension?.diameterCm || 0} onChange={(value) => updateDimension("diameterCm", value)} />
                <NumberField label="Volume ml" value={formData.dimension?.volumeMl || 0} onChange={(value) => updateDimension("volumeMl", value)} />
                <NumberField label="Berat gr" value={formData.dimension?.weightGram || 0} onChange={(value) => updateDimension("weightGram", value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Catatan Ketersediaan</Label>
              <Textarea
                value={formData.availabilityNote || ""}
                onChange={(e) => setFormData({ ...formData, availabilityNote: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Gambar Produk</h4>
                  <span className="text-[0.6rem] text-text-muted font-bold">Maks. 4MB per file</span>
                </div>

                {/* Dropzone Container */}
                <div 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-secondary-50/30 rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center justify-center min-h-[160px] w-full transition-all hover:bg-secondary-50/50 hover:border-primary-300 cursor-pointer group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ImagePlus className="text-primary-500 w-8 h-8" />
                  </div>
                  <p className="text-sm font-black text-text-primary">Klik atau lepas gambar di sini</p>
                  <p className="text-xs font-bold text-text-muted mt-1">Mendukung format JPG, PNG, WEBP</p>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {(formData.images || []).map((img, index) => (
                    <div key={`existing-${index}`} className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                      img.isPrimary ? "border-primary-500 shadow-lg shadow-primary-500/10" : "border-border hover:border-primary-200"
                    )}>
                      <img src={img.imageUrl} alt="Product" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              images: (prev.images || []).filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg backdrop-blur-sm"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              images: (prev.images || []).map((im, i) => ({ ...im, isPrimary: i === index }))
                            }));
                            // Ensure pending files are not primary if an existing one is set
                            setPendingFiles(prev => prev.map(f => ({ ...f, isPrimary: false })));
                          }}
                          className={cn(
                            "w-full py-1.5 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all cursor-pointer",
                            img.isPrimary ? "bg-primary-500 text-white" : "bg-white/90 text-text-primary hover:bg-white"
                          )}
                        >
                          {img.isPrimary ? "Utama" : "Set Utama"}
                        </button>
                      </div>
                      {img.isPrimary && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-[0.5rem] font-black uppercase tracking-widest rounded-md shadow-lg">
                          Utama
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pending Images */}
                  {pendingFiles.map((pf) => (
                    <div key={pf.id} className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                      pf.isPrimary ? "border-primary-500 shadow-lg shadow-primary-500/10" : "border-border border-dashed hover:border-primary-200"
                    )}>
                      <img src={pf.preview} alt="Pending" className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePending(pf.id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg backdrop-blur-sm"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingFiles(prev => prev.map(f => ({ ...f, isPrimary: f.id === pf.id })));
                            // Clear primary status from existing images
                            setFormData(prev => ({
                              ...prev,
                              images: (prev.images || []).map(img => ({ ...img, isPrimary: false }))
                            }));
                          }}
                          className={cn(
                            "w-full py-1.5 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all cursor-pointer",
                            pf.isPrimary ? "bg-primary-500 text-white" : "bg-white/90 text-text-primary hover:bg-white"
                          )}
                        >
                          {pf.isPrimary ? "Utama" : "Set Utama"}
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 text-text-muted text-[0.45rem] font-black uppercase rounded shadow-sm border border-border">
                        Baru
                      </div>
                      {pf.isPrimary && (
                        <div className={cn(
                          "absolute left-2 px-2 py-0.5 bg-primary-500 text-white text-[0.5rem] font-black uppercase tracking-widest rounded-md shadow-lg transition-all",
                          "top-8" // Offset from top since "Baru" is at top-2
                        )}>
                          Utama
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Varian Harga</h4>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    prices: [...(prev.prices || []), { lidColorId: masterData.lidColors[0]?.id || "", priceTypeId: masterData.priceTypes[0]?.id || "", price: 0, validFrom: new Date().toISOString() }]
                  }))}
                  className="h-8 px-3 text-[0.6rem] font-black uppercase tracking-widest gap-2 border border-border rounded-lg hover:bg-secondary-50 transition-colors flex items-center"
                >
                  <AppIcon name="add" className="text-sm" /> Tambah Harga
                </button>
              </div>
              <div className="space-y-3">
                {(formData.prices || []).map((price, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-secondary-50/50 p-4 rounded-xl border border-border relative">
                    <SelectField
                      label="Warna Tutup"
                      value={price.lidColorId}
                      onChange={(val) => {
                        setFormData(prev => {
                          const newPrices = [...(prev.prices || [])];
                          if (newPrices[index]) newPrices[index].lidColorId = val;
                          return { ...prev, prices: newPrices };
                        });
                      }}
                      options={masterData.lidColors.map(c => [
                        c.id,
                        <div key={c.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-border shadow-inner" style={{ backgroundColor: c.colorCode }}></div>
                          <span>{c.color}</span>
                        </div>
                      ])}
                    />
                    <SelectField
                      label="Tipe Harga"
                      value={price.priceTypeId}
                      onChange={(val) => {
                        setFormData(prev => {
                          const newPrices = [...(prev.prices || [])];
                          if (newPrices[index]) newPrices[index].priceTypeId = val;
                          return { ...prev, prices: newPrices };
                        });
                      }}
                      options={masterData.priceTypes.map(t => [t.id, t.name.replace(/_/g, ' ')])}
                    />
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label className="text-[0.65rem] uppercase tracking-wider opacity-60">Harga (Rp)</Label>
                        <Input
                          type="number"
                          value={price.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFormData(prev => {
                              const newPrices = [...(prev.prices || [])];
                              if (newPrices[index]) newPrices[index].price = val;
                              return { ...prev, prices: newPrices };
                            });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          prices: (prev.prices || []).filter((_, i) => i !== index)
                        }))}
                        className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
                      >
                        <AppIcon name="delete" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Spesifikasi Kemasan</h4>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    packaging: [...(prev.packaging || []), { quantityPerPack: 1, lengthCm: 0, widthCm: 0, heightCm: 0, weightKg: 0 }]
                  }))}
                  className="h-8 px-3 text-[0.6rem] font-black uppercase tracking-widest gap-2 border border-border rounded-lg hover:bg-secondary-50 transition-colors flex items-center"
                >
                  <AppIcon name="add" className="text-sm" /> Tambah Kemasan
                </button>
              </div>
              <div className="space-y-3">
                {(formData.packaging || []).map((pack, index) => (
                  <div key={index} className="bg-secondary-50/50 p-4 rounded-xl border border-border relative space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 max-w-[120px]">
                        <Label className="text-[0.65rem] uppercase tracking-wider opacity-60">Isi Per Bal</Label>
                        <Input
                          type="number"
                          value={pack.quantityPerPack}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFormData(prev => {
                              const newPack = [...(prev.packaging || [])];
                              if (newPack[index]) newPack[index].quantityPerPack = val;
                              return { ...prev, packaging: newPack };
                            });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          packaging: (prev.packaging || []).filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:bg-red-50 text-[0.6rem] font-black uppercase tracking-widest h-8 px-3 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <NumberField label="P (cm)" value={pack.lengthCm || 0} onChange={(val) => {
                        setFormData(prev => {
                          const newPack = [...(prev.packaging || [])];
                          if (newPack[index]) newPack[index].lengthCm = val;
                          return { ...prev, packaging: newPack };
                        });
                      }} />
                      <NumberField label="L (cm)" value={pack.widthCm || 0} onChange={(val) => {
                        setFormData(prev => {
                          const newPack = [...(prev.packaging || [])];
                          if (newPack[index]) newPack[index].widthCm = val;
                          return { ...prev, packaging: newPack };
                        });
                      }} />
                      <NumberField label="T (cm)" value={pack.heightCm || 0} onChange={(val) => {
                        setFormData(prev => {
                          const newPack = [...(prev.packaging || [])];
                          if (newPack[index]) newPack[index].heightCm = val;
                          return { ...prev, packaging: newPack };
                        });
                      }} />
                      <NumberField label="Berat (kg)" value={pack.weightKg || 0} onChange={(val) => {
                        setFormData(prev => {
                          const newPack = [...(prev.packaging || [])];
                          if (newPack[index]) newPack[index].weightKg = val;
                          return { ...prev, packaging: newPack };
                        });
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-none border-t border-border bg-white/95 px-8 py-6 backdrop-blur-md">
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1 h-12 font-black uppercase tracking-widest text-[0.65rem] rounded-xl">
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="flex-2 h-12 font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 text-[0.65rem] rounded-xl bg-primary-500 hover:bg-primary-600 text-white">
                {loading ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[0.65rem] uppercase tracking-wider opacity-60">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  fallbackLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, ReactNode][];
  fallbackLabel?: ReactNode;
}) {
  const selectedOption = options.find(([optValue]) => optValue === value);
  const safeOptions = selectedOption || !value
    ? options
    : [[value, fallbackLabel || value] as [string, ReactNode], ...options];
  const selectedLabel = selectedOption ? selectedOption[1] : (fallbackLabel || value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(val) => onChange(val || "")}>
        <SelectTrigger className="h-10 w-full bg-background px-3 font-bold text-left">
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {safeOptions.map(([optionValue, optionLabel]) => (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
