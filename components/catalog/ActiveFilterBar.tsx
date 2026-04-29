"use client";

import { CATEGORY_CONFIG, MATERIAL_LABELS, LID_TYPE_LABELS } from "@/lib/use-case-config";
import { CatalogFilters, getCategoryLabel, getLidColorLabel } from "@/types/product";

interface ActiveFilterBarProps {
  filters: CatalogFilters;
  totalResults: number;
  onRemove: (key: keyof CatalogFilters, value?: string) => void;
  onClearAll: () => void;
}

function getFilterLabel(key: string, value: string): string {
  switch (key) {
    case "category":
      return getCategoryLabel(value);
    case "material_body":
      return MATERIAL_LABELS[value]?.label || value;
    case "lid_type":
      return LID_TYPE_LABELS[value]?.label || value;
    case "colors":
      return getLidColorLabel(value);
    default:
      return value;
  }
}

export default function ActiveFilterBar({
  filters,
  totalResults,
  onRemove,
  onClearAll,
}: ActiveFilterBarProps) {
  // Collect all active filter pills
  const pills: { key: keyof CatalogFilters; value: string; label: string }[] = [];

  if (filters.search) {
    pills.push({ key: "search", value: filters.search, label: `"${filters.search}"` });
  }
  filters.category?.forEach((v) =>
    pills.push({ key: "category", value: v, label: getFilterLabel("category", v) })
  );
  if (filters.volume_min || filters.volume_max) {
    pills.push({
      key: "volume_min",
      value: "",
      label: `${filters.volume_min || 0}–${filters.volume_max || "∞"}ml`,
    });
  }
  filters.material_body?.forEach((v) =>
    pills.push({ key: "material_body", value: v, label: getFilterLabel("material_body", v) })
  );
  filters.lid_type?.forEach((v) =>
    pills.push({ key: "lid_type", value: v, label: getFilterLabel("lid_type", v) })
  );
  filters.colors?.forEach((v) =>
    pills.push({ key: "colors", value: v, label: getFilterLabel("colors", v) })
  );

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] mr-2">
        Filter Aktif:
      </span>

      {pills.map((pill, i) => (
        <button
          key={`${pill.key}-${pill.value}-${i}`}
          onClick={() => {
            if (pill.key === "volume_min") {
              onRemove("volume_min");
              onRemove("volume_max");
            } else {
              onRemove(pill.key, pill.value || undefined);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200 rounded-xl text-xs font-bold hover:bg-primary-100 transition-all group shadow-sm"
        >
          {pill.label}
          <span className="material-symbols-outlined text-[0.8rem] opacity-40 group-hover:opacity-100 transition-opacity">
            close
          </span>
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs font-black text-red-500 hover:text-red-600 transition-colors ml-2 uppercase tracking-widest"
      >
        Hapus Semua
      </button>

      <span className="ml-auto text-xs font-bold text-text-secondary bg-secondary-50 px-4 py-2 rounded-xl border border-border">
        Ditemukan <span className="text-text-primary font-black">{totalResults}</span> produk
      </span>
    </div>
  );
}
