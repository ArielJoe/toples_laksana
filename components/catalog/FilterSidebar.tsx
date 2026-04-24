"use client";

import { useState } from "react";
import type { CatalogFilters, FacetCounts } from "@/types/product";
import { USE_CASE_FILTER_CONFIG, CATEGORY_CONFIG, MATERIAL_LABELS, LID_TYPE_LABELS, COLOR_SWATCHES } from "@/lib/use-case-config";

interface FilterSidebarProps {
  filters: CatalogFilters;
  facets: FacetCounts | null;
  onToggleArray: (key: "category" | "tags" | "material_body" | "lid_type" | "colors", value: string) => void;
  onSetFilters: (f: Partial<CatalogFilters>) => void;
}

export default function FilterSidebar({
  filters,
  facets,
  onToggleArray,
  onSetFilters,
}: FilterSidebarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [volumeMin, setVolumeMin] = useState(filters.volume_min || 0);
  const [volumeMax, setVolumeMax] = useState(filters.volume_max || 1500);

  const vRange = facets?.volume_range || { min: 0, max: 1500 };
  const categoryList = facets?.categories || [];

  return (
    <aside className="space-y-10">
      {/* Search Input */}
      <section>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
            defaultValue={filters.search || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSetFilters({ search: (e.target as HTMLInputElement).value || undefined });
              }
            }}
          />
        </div>
      </section>

      {/* Primary Filter: Packaging Type (Category) */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-600 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">category</span>
          Jenis Kemasan
        </h3>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-2">
          {categoryList.map((cat) => {
            const isActive = filters.category?.includes(cat.value);
            const config = CATEGORY_CONFIG[cat.value];
            return (
              <button
                key={cat.value}
                onClick={() => onToggleArray("category", cat.value)}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-[0.65rem] font-black transition-all border ${
                  isActive
                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                    : "bg-white text-text-secondary border-border hover:border-primary-200 hover:text-primary-600"
                }`}
              >
                {config && (
                  <span className="material-symbols-outlined text-lg">
                    {config.icon}
                  </span>
                )}
                <span>{config?.label || cat.value}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Primary Filter: Use-Case (Best For) */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-600 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">local_offer</span>
          Cocok Untuk
        </h3>
        <div className="space-y-1.5">
          {USE_CASE_FILTER_CONFIG.map((uc) => {
            const isActive = filters.tags?.includes(uc.tag);
            const facetCount = facets?.tags.find((t) => t.value === uc.tag)?.count;

            if (facetCount === undefined && !isActive) return null;

            return (
              <label
                key={uc.tag}
                className={`flex items-start gap-2 px-2 py-2.5 rounded-xl cursor-pointer transition-all group ${
                  isActive
                    ? "bg-primary-50 border border-primary-200 shadow-sm"
                    : "hover:bg-secondary-50 border border-transparent"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  <input
                    className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("tags", uc.tag)}
                  />
                </div>
                <span className="material-symbols-outlined text-lg text-text-muted group-hover:text-primary-500 transition-colors shrink-0">
                  {uc.icon}
                </span>
                <span className={`text-[0.7rem] font-bold flex-1 min-w-0 leading-tight pt-0.5 ${isActive ? "text-primary-700" : "text-text-secondary group-hover:text-primary-600"} transition-colors`}>
                  {uc.label}
                </span>
                {facetCount !== undefined && (
                  <span className="text-[0.6rem] font-black text-text-muted bg-white border border-border px-2 py-0.5 rounded-lg shadow-xs shrink-0">
                    {facetCount}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </section>

      {/* ── Primary Filter 3: Volume Range ── */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-600 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">straighten</span>
          Volume / Ukuran
        </h3>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-2">
          {[
            { label: "150ml", value: 150 },
            { label: "250ml", value: 250 },
            { label: "500ml", value: 500 },
            { label: "750ml", value: 750 },
            { label: "1000ml", value: 1000 },
            { label: "1500ml", value: 1500 },
          ].map((chip) => {
            const isActive = filters.volume_min === chip.value && filters.volume_max === chip.value;
            return (
              <button
                key={chip.label}
                onClick={() => {
                  if (isActive) {
                    onSetFilters({ volume_min: undefined, volume_max: undefined });
                  } else {
                    onSetFilters({ volume_min: chip.value, volume_max: chip.value });
                  }
                }}
                className={`px-3 py-2.5 rounded-xl text-[0.65rem] font-black transition-all border ${
                  isActive
                    ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20"
                    : "bg-white text-text-secondary border-border hover:border-primary-200"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-border hover:border-primary-500/30 transition-all group shadow-sm active:scale-[0.98]"
      >
        <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-primary group-hover:text-primary-600 transition-colors flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">tune</span>
          Filter Lanjutan
        </span>
        <span
          className={`material-symbols-outlined text-lg text-text-muted transition-transform duration-500 ${
            showAdvanced ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Advanced Filters Panel */}
      <div
        className={`space-y-8 overflow-hidden transition-all duration-500 ease-in-out ${
          showAdvanced ? "max-h-[1000px] opacity-100 mt-6 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        {/* Material Body */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">science</span>
            Material Badan
          </h3>
          <div className="space-y-1">
            {(facets?.materials || []).map((mat) => {
              const isActive = filters.material_body?.includes(mat.value);
              const label = MATERIAL_LABELS[mat.value];
              return (
                <label key={mat.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <input
                    className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("material_body", mat.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {label?.label || mat.value}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{mat.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Lid Type */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">settings</span>
            Tipe Tutup
          </h3>
          <div className="space-y-1">
            {(facets?.lid_types || []).map((lid) => {
              const isActive = filters.lid_type?.includes(lid.value);
              const label = LID_TYPE_LABELS[lid.value];
              return (
                <label key={lid.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <input
                    className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("lid_type", lid.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {label?.label || lid.value}
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
            <span className="material-symbols-outlined text-base">palette</span>
            Warna Tutup
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-5 p-1.5">
            {(facets?.colors || []).map((color) => {
              const isActive = filters.colors?.includes(color.value);
              const hex = COLOR_SWATCHES[color.value] || "#ccc";
              return (
                <button
                  key={color.value}
                  onClick={() => onToggleArray("colors", color.value)}
                  className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                    isActive
                      ? "ring-4 ring-primary-500/20 border-primary-500 scale-110"
                      : "border-border hover:border-primary-300"
                  }`}
                  style={{ backgroundColor: hex }}
                  title={`${color.value} (${color.count})`}
                >
                  {isActive && (
                    <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: hex === "#FFFFFF" || hex === "#F5F5F5" ? "#096447" : "#fff" }}>
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Trust Badge / Certification */}
      <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 shadow-inner">
        <span className="material-symbols-outlined text-primary-500 mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified
        </span>
        <h4 className="text-xs font-black text-primary-700 mb-2 uppercase tracking-tight">
          Standar Food Grade
        </h4>
        <p className="text-[0.7rem] text-primary-600/80 font-bold leading-relaxed">
          Semua produk kemasan kami bersertifikat aman untuk kontak makanan dan memenuhi standar kualitas industri.
        </p>
      </div>
    </aside>
  );
}
