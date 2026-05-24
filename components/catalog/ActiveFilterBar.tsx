"use client";

import { ReactNode } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { COLOR_SWATCHES } from "@/lib/use-case-config";
import { CatalogFilters, FacetCounts, formatAttributeLabel, getCategoryLabel, getLidColorLabel } from "@/types/product";

interface ActiveFilterBarProps {
  filters: CatalogFilters;
  totalResults: number;
  onRemove: (key: keyof CatalogFilters, value?: string) => void;
  onClearAll: () => void;
  facets: FacetCounts | null;
}

function getFilterLabel(key: string, value: string, facets: FacetCounts | null): ReactNode {
  switch (key) {
    case "category": {
      const facetCat = facets?.categories.find((c) => c.value === value);
      return facetCat?.name || getCategoryLabel(value);
    }
    case "material_body": {
      const facetMaterial = facets?.materials.find((m) => m.value === value);
      return facetMaterial?.name || formatAttributeLabel(value);
    }
    case "lid_material": {
      const facetLidMaterial = facets?.lid_materials.find((l) => l.value === value);
      return facetLidMaterial?.name || formatAttributeLabel(value);
    }
    case "availability": {
      const facetStatus = facets?.availability_statuses?.find((s) => s.value === value);
      return facetStatus?.name || formatAttributeLabel(value);
    }
    case "colors": {
      const facetColor = facets?.colors?.find((c) => c.value === value);
      const hex = facetColor?.hex || COLOR_SWATCHES[value] || "#ccc";
      const name = facetColor?.name || getLidColorLabel(value);
      return (
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border border-border" style={{ backgroundColor: hex }} />
          <span>{name}</span>
          <span className="text-[10px] font-normal uppercase opacity-70">{hex}</span>
        </span>
      );
    }
    default:
      return value;
  }
}

export default function ActiveFilterBar({
  filters,
  totalResults,
  onRemove,
  onClearAll,
  facets,
}: ActiveFilterBarProps) {
  const pills: { key: keyof CatalogFilters; value: string; label: ReactNode }[] = [];

  if (filters.search) {
    pills.push({ key: "search", value: filters.search, label: `"${filters.search}"` });
  }
  filters.category?.forEach((v) =>
    pills.push({ key: "category", value: v, label: getFilterLabel("category", v, facets) })
  );
  if (filters.volume_min || filters.volume_max) {
    pills.push({
      key: "volume_min",
      value: "",
      label: `${filters.volume_min || 0}-${filters.volume_max || "max"}ml`,
    });
  }
  filters.material_body?.forEach((v) =>
    pills.push({ key: "material_body", value: v, label: getFilterLabel("material_body", v, facets) })
  );
  filters.lid_material?.forEach((v) =>
    pills.push({ key: "lid_material", value: v, label: getFilterLabel("lid_material", v, facets) })
  );
  filters.colors?.forEach((v) =>
    pills.push({ key: "colors", value: v, label: getFilterLabel("colors", v, facets) })
  );
  filters.availability?.forEach((v) =>
    pills.push({ key: "availability", value: v, label: getFilterLabel("availability", v, facets) })
  );

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mr-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted">
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
          className="group inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm transition-all hover:bg-primary-100 cursor-pointer"
        >
          {pill.label}
          <AppIcon name="close" className="text-[0.8rem] opacity-40 transition-opacity group-hover:opacity-100" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="ml-2 text-xs font-black uppercase tracking-widest text-red-500 transition-colors hover:text-red-600 cursor-pointer"
      >
        Hapus Semua
      </button>

      <span className="ml-auto rounded-lg border border-border bg-secondary-50 px-3 py-1.5 text-xs font-bold text-text-secondary">
        Ditemukan <span className="font-black text-text-primary">{totalResults}</span> produk
      </span>
    </div>
  );
}
