"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { CatalogFilters } from "@/types/product";

/**
 * Hook for managing catalog filter state via URL searchParams.
 * All filter state is stored in the URL — shareable, bookmarkable, SSR-friendly.
 */
export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ---- Read current filters from URL ----
  const filters: CatalogFilters = useMemo(() => {
    return {
      search: searchParams.get("search") || undefined,
      category: searchParams.getAll("category"),
      volume_min: searchParams.get("volume_min")
        ? parseInt(searchParams.get("volume_min")!)
        : undefined,
      volume_max: searchParams.get("volume_max")
        ? parseInt(searchParams.get("volume_max")!)
        : undefined,
      price_min: searchParams.get("price_min")
        ? parseInt(searchParams.get("price_min")!)
        : undefined,
      price_max: searchParams.get("price_max")
        ? parseInt(searchParams.get("price_max")!)
        : undefined,
      material_body: searchParams.getAll("material_body"),
      lid_type: searchParams.getAll("lid_type"),
      colors: searchParams.getAll("colors"),
      sort: (searchParams.get("sort") as CatalogFilters["sort"]) || "popular",
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1,
      limit: 10,
    };
  }, [searchParams]);

  // ---- Build query string from filters ----
  const buildQueryString = useCallback(
    (newFilters: Partial<CatalogFilters>) => {
      const merged = { ...filters, ...newFilters };
      const params = new URLSearchParams();

      if (merged.search) params.set("search", merged.search);
      merged.category?.forEach((c) => params.append("category", c));
      if (merged.volume_min) params.set("volume_min", String(merged.volume_min));
      if (merged.volume_max) params.set("volume_max", String(merged.volume_max));
      if (merged.price_min) params.set("price_min", String(merged.price_min));
      if (merged.price_max) params.set("price_max", String(merged.price_max));
      merged.material_body?.forEach((m) => params.append("material_body", m));
      merged.lid_type?.forEach((l) => params.append("lid_type", l));
      merged.colors?.forEach((c) => params.append("colors", c));
      if (merged.sort && merged.sort !== "popular") params.set("sort", merged.sort);
      if (merged.page && merged.page > 1) params.set("page", String(merged.page));

      return params.toString();
    },
    [filters]
  );

  // ---- Update filters (replaces URL, resets page to 1) ----
  const setFilters = useCallback(
    (newFilters: Partial<CatalogFilters>) => {
      const qs = buildQueryString({ ...newFilters, page: 1 });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, buildQueryString]
  );

  // ---- Toggle a value in an array filter ----
  const toggleArrayFilter = useCallback(
    (key: "category" | "material_body" | "lid_type" | "colors", value: string) => {
      const current = filters[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setFilters({ [key]: next });
    },
    [filters, setFilters]
  );

  // ---- Set page ----
  const setPage = useCallback(
    (page: number) => {
      const qs = buildQueryString({ page });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, buildQueryString]
  );

  // ---- Clear all filters ----
  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // ---- Remove a specific filter ----
  const removeFilter = useCallback(
    (key: keyof CatalogFilters, value?: string) => {
      if (value && Array.isArray(filters[key])) {
        const current = (filters[key] as string[]) || [];
        setFilters({ [key]: current.filter((v) => v !== value) });
      } else {
        setFilters({ [key]: undefined });
      }
    },
    [filters, setFilters]
  );

  // ---- Count active filters ----
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    count += (filters.category?.length || 0);
    if (filters.volume_min || filters.volume_max) count++;
    if (filters.price_min || filters.price_max) count++;
    count += (filters.material_body?.length || 0);
    count += (filters.lid_type?.length || 0);
    count += (filters.colors?.length || 0);
    return count;
  }, [filters]);

  // ---- Build API URL ----
  const apiUrl = useMemo(() => {
    const qs = buildQueryString(filters);
    return `/api/products${qs ? `?${qs}` : ""}`;
  }, [buildQueryString, filters]);

  return {
    filters,
    setFilters,
    toggleArrayFilter,
    setPage,
    clearAll,
    removeFilter,
    activeFilterCount,
    apiUrl,
  };
}
