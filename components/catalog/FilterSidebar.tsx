"use client";

import { useRef, useState } from "react";
import { CatalogFilters, FacetCounts, formatAttributeLabel, getCategoryLabel, getLidColorLabel } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  BadgeCheckIcon,
  CheckIcon,
  FlaskConicalIcon,
  PackageIcon,
  PaletteIcon,
  RulerIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  TagIcon,
} from "lucide-react";

interface FilterSidebarProps {
  filters: CatalogFilters;
  facets: FacetCounts | null;
  onToggleArray: (key: "category" | "material_body" | "lid_material" | "colors" | "availability" | "price_type" | "product_type", value: string) => void;
  onSetFilters: (f: Partial<CatalogFilters>) => void;
}

export default function FilterSidebar({
  filters,
  facets,
  onToggleArray,
  onSetFilters,
}: FilterSidebarProps) {
  const [volumeMin, setVolumeMin] = useState(filters.volume_min || 0);
  const [volumeMax, setVolumeMax] = useState(filters.volume_max || 1500);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const vRange = facets?.volume_range || { min: 0, max: 1500 };
  const categoryList = facets?.categories || [];
  const productTypeList = facets?.product_types || [];
  const priceTypeList = facets?.price_types?.length
    ? facets.price_types
    : [
        { value: "ptype_001", name: "Harga Per Pcs", count: 0 },
        { value: "ptype_004", name: "Harga Per Bal", count: 0 },
      ];

  const submitSearch = () => {
    const nextSearch = searchInputRef.current?.value.trim() || "";
    onSetFilters({ search: nextSearch || undefined });
  };

  return (
    <aside className="space-y-8">
      {/* Search Input */}
      <section>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              key={filters.search || "empty-search"}
              ref={searchInputRef}
              type="text"
              placeholder="Cari produk..."
              className="h-12 bg-secondary-50/50 border-border font-bold text-sm pl-11 pr-4 focus:bg-white transition-all rounded-xl"
              defaultValue={filters.search || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitSearch();
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={submitSearch}
            className="h-12 shrink-0 rounded-xl bg-primary-500 px-4 text-sm font-black text-white hover:bg-primary-600"
          >
            Cari
          </Button>
        </div>
      </section>

      {/* Pilihan Satuan Harga */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <SlidersHorizontalIcon className="size-4" />
          Satuan Harga
        </h3>
        <div className="space-y-1">
          {priceTypeList.map((type) => {
            const isActive = !!filters.price_type?.includes(type.value);
            return (
              <label
                key={type.value}
                className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors"
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => onToggleArray("price_type", type.value)}
                />
                <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                  {type.name}
                </span>
                {type.count > 0 && (
                  <span className="text-[0.6rem] font-black text-text-muted">{type.count}</span>
                )}
              </label>
            );
          })}
        </div>
      </section>

      {/* Primary Filter: Packaging Type (Category) */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <PackageIcon className="size-4" />
          Jenis Kemasan
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {categoryList.map((cat) => {
            const isActive = !!filters.category?.includes(cat.value);
            const categoryName = cat.name && cat.name !== cat.value
              ? cat.name
              : getCategoryLabel(cat.value);
            return (
              <Button
                type="button"
                variant={isActive ? "default" : "outline"}
                key={cat.value}
                onClick={() => onToggleArray("category", cat.value)}
                className="h-auto min-h-16 p-2.5 text-center text-xs font-black leading-snug sm:text-sm lg:min-h-18"
              >
                <span className="wrap-break-word">{categoryName}</span>
              </Button>
            );
          })}
        </div>
      </section>

      {/* Tipe Produk */}
      {productTypeList.length > 0 && (
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
            <TagIcon className="size-4" />
            Tipe Produk
          </h3>
          <div className="space-y-1">
            {productTypeList.map((type) => {
              const isActive = !!filters.product_type?.includes(type.value);
              return (
                <label
                  key={type.value}
                  className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors"
                >
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => onToggleArray("product_type", type.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {type.name || formatAttributeLabel(type.value)}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{type.count}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Volume Range */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <RulerIcon className="size-4" />
          Volume / Ukuran
        </h3>

        <div className="space-y-6 px-2">
          {/* Min Volume Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-text-secondary">
              <span>Min: <span className="text-primary-600">{volumeMin}ml</span></span>
            </div>
            <input
              type="range"
              min={vRange.min}
              max={volumeMax || vRange.max}
              step={10}
              value={volumeMin}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value, 10);
                setVolumeMin(val);
              }}
              onMouseUp={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              onTouchEnd={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          {/* Max Volume Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-text-secondary">
              <span>Max: <span className="text-primary-600">{volumeMax}ml</span></span>
            </div>
            <input
              type="range"
              min={Math.max(volumeMin, vRange.min)}
              max={vRange.max}
              step={10}
              value={volumeMax}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value, 10);
                setVolumeMax(val);
              }}
              onMouseUp={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              onTouchEnd={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>
      </section>

      <div className="space-y-7 pb-2">
        {/* Material Body */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <FlaskConicalIcon className="size-4" />
            Material Badan
          </h3>
          <div className="space-y-1">
            {(facets?.materials || []).map((mat) => {
              const isActive = !!filters.material_body?.includes(mat.value);
              return (
                <label key={mat.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <Checkbox
                    checked={isActive || false}
                    onCheckedChange={() => onToggleArray("material_body", mat.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {mat.name || formatAttributeLabel(mat.value)}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{mat.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Lid Material */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <SettingsIcon className="size-4" />
            Bahan Tutup
          </h3>
          <div className="space-y-1">
            {(facets?.lid_materials || []).map((lid) => {
              const isActive = !!filters.lid_material?.includes(lid.value);
              return (
                <label key={lid.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <Checkbox
                    checked={isActive || false}
                    onCheckedChange={() => onToggleArray("lid_material", lid.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {lid.name || formatAttributeLabel(lid.value)}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{lid.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Color Swatches */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <PaletteIcon className="size-4" />
            Warna Tutup
          </h3>
          <div className="space-y-1">
            {(facets?.colors || []).map((color) => {
              const isActive = !!filters.colors?.includes(color.value);
              const hex = color.hex || "#ccc";
              const colorName = color.name || getLidColorLabel(color.value);
              return (
                <label key={color.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <div
                    className={`relative w-6 h-6 rounded-full border-2 transition-all shrink-0 ${isActive
                        ? "ring-2 ring-primary-500/50 border-primary-500 scale-110"
                        : "border-border"
                      }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isActive && (
                      <CheckIcon className="absolute inset-0 m-auto size-3" style={{ color: hex === "#FFFFFF" || hex === "#F5F5F5" ? "#16479D" : "#fff" }} />
                    )}
                  </div>
                  <Checkbox
                    className="sr-only"
                    checked={isActive || false}
                    onCheckedChange={() => onToggleArray("colors", color.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {colorName} <span className="text-[0.6rem] text-text-muted ml-1 uppercase font-normal">{hex}</span>
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{color.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Availability */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <BadgeCheckIcon className="size-4" />
            Ketersediaan
          </h3>
          <div className="space-y-1">
            {(facets?.availability_statuses || []).map((status) => {
              const isActive = !!filters.availability?.includes(status.value);
              return (
                <label key={status.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <Checkbox
                    checked={isActive || false}
                    onCheckedChange={() => onToggleArray("availability", status.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {status.name || formatAttributeLabel(status.value)}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{status.count}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

    </aside>
  );
}
