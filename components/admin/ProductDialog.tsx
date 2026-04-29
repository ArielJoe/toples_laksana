"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
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

export default function ProductDialog({ isOpen, onClose, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(product || {
      ...emptyProduct,
      id: `prod_${Date.now()}`,
    });
  }, [product, isOpen]);

  if (!isOpen) return null;

  const updateDimension = (key: keyof NonNullable<Product["dimension"]>, value: number) => {
    setFormData({
      ...formData,
      dimension: {
        heightCm: formData.dimension?.heightCm || 0,
        diameterCm: formData.dimension?.diameterCm || 0,
        volumeMl: formData.dimension?.volumeMl || 0,
        weightGram: formData.dimension?.weightGram || 0,
        [key]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Gagal menyimpan produk. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-border z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-text-primary tracking-tight">
              {product ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
              Format data terbaru
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-secondary-50 text-text-muted transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="ID Produk" value={formData.id || ""} onChange={(value) => setFormData({ ...formData, id: value })} required />
            <Field label="SKU" value={formData.sku || ""} onChange={(value) => setFormData({ ...formData, sku: value })} required />
            <Field label="Nama Produk" value={formData.name || ""} onChange={(value) => setFormData({ ...formData, name: value })} required />
            <SelectField
              label="Kategori"
              value={formData.categoryId || ""}
              onChange={(value) => setFormData({ ...formData, categoryId: value })}
              options={[
                ["cat_jar_cylinder", "Jar Cylinder"],
                ["cat_jar_kaca", "Jar Kaca"],
                ["cat_jar_plastik", "Jar Plastik"],
                ["cat_botol_plastik", "Botol Plastik"],
                ["cat_botol", "Botol"],
                ["cat_tin", "Tin Kaleng"],
              ]}
            />
            <SelectField
              label="Tipe Produk"
              value={formData.productTypeId || ""}
              onChange={(value) => setFormData({ ...formData, productTypeId: value })}
              options={[
                ["type_premium", "Premium"],
                ["type_reguler", "Reguler"],
              ]}
            />
            <Field label="Unit ID" value={formData.unitId || ""} onChange={(value) => setFormData({ ...formData, unitId: value })} required />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Material Badan" value={formData.bodyMaterial || ""} onChange={(value) => setFormData({ ...formData, bodyMaterial: value })} required />
              <Field label="Material Tutup" value={formData.lidMaterial || ""} onChange={(value) => setFormData({ ...formData, lidMaterial: value })} required />
              <Field label="Varian Tutup" value={formData.lidVariant || ""} onChange={(value) => setFormData({ ...formData, lidVariant: value })} required />
              <Field label="Tipe Tutup" value={formData.lidType || ""} onChange={(value) => setFormData({ ...formData, lidType: value })} required />
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
            <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Deskripsi</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-secondary-50 border border-border rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all min-h-28"
            />
          </div>

          <div className="pt-6 sticky bottom-0 bg-white/80 backdrop-blur-md mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-secondary-50 text-text-primary font-black uppercase tracking-widest text-xs hover:bg-secondary-100 transition-all">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-2 py-4 rounded-2xl bg-primary-500 text-white font-black uppercase tracking-widest text-xs hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50">
              {loading ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
      <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-secondary-50 border border-border rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
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
      <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        className="w-full px-4 py-3 bg-secondary-50 border border-border rounded-xl font-bold text-sm focus:bg-white focus:border-primary-500 outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-2">
      <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">{label}</label>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-secondary-50 border border-border rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>{label}</option>
        ))}
      </select>
    </div>
  );
}
