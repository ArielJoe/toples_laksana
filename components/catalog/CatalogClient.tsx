"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductCard from "@/components/catalog/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilterBar from "@/components/catalog/ActiveFilterBar";
import { AppIcon } from "@/components/ui/app-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CatalogFilters,
  FacetCounts,
  PaginatedResponse,
  Product,
} from "@/types/product";

const SORT_LABELS: Record<string, string> = {
  popular: "Terpopuler",
  price_asc: "Harga Terendah",
  price_desc: "Harga Tertinggi",
  newest: "Produk Terbaru",
};

function CatalogContent() {
  const {
    filters,
    setFilters,
    toggleArrayFilter,
    setPage,
    clearAll,
    removeFilter,
    activeFilterCount,
    apiUrl,
  } = useProductFilters();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [facets, setFacets] = useState<FacetCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch facets on mount
  useEffect(() => {
    fetch("/api/products/facets")
      .then((r) => r.json())
      .then((data) => setFacets(data))
      .catch(console.error);
  }, []);

  // Re-fetch products on filter/page change
  useEffect(() => {
    let ignore = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data: PaginatedResponse<Product>) => {
        if (ignore) return;
        setProducts(data.data || []);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [apiUrl]);

  // Toggle product comparison (max 3)
  const handleCompareToggle = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <main className="w-full">
        {/* Sticky Header: Controls Bar + Active Filters */}
        <div className="sticky top-18.75 z-30 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6 lg:px-10">
          <div className="flex min-h-20 flex-col gap-3 pb-3 pt-5 sm:flex-row sm:items-center sm:justify-between sm:py-3">
            <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:flex sm:flex-1 sm:items-center">
              {/* Mobile/Tablet filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium transition-all hover:border-primary-500/30 sm:w-auto lg:hidden cursor-pointer"
              >
                <AppIcon name="tune" className="text-lg" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[0.65rem] font-bold leading-none text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Tabs */}
              <div className="hidden min-w-0 items-center gap-1 overflow-x-auto sm:flex">
                {Object.entries(SORT_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() =>
                      setFilters({ sort: val as CatalogFilters["sort"] })
                    }
                    className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer lg:px-4 ${
                      (filters.sort || "popular") === val
                        ? "bg-primary-500 text-white"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Mobile Sort */}
              <div className="min-w-0 sm:hidden">
                <Select
                  value={filters.sort || "popular"}
                  onValueChange={(val) =>
                    setFilters({ sort: val as CatalogFilters["sort"] })
                  }
                >
                  <SelectTrigger className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm cursor-pointer">
                    <SelectValue>
                      {SORT_LABELS[filters.sort || "popular"]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    sideOffset={8}
                    className="min-w-[var(--anchor-width)]"
                  >
                    {Object.entries(SORT_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-all cursor-pointer ${viewMode === "grid" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                  title="Grid view"
                >
                  <AppIcon name="grid_view" className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-all cursor-pointer ${viewMode === "list" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                  title="List view"
                >
                  <AppIcon name="view_list" className="text-lg" />
                </button>
              </div>
              <span className="text-sm text-gray-400">
                {pagination.total} produk
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] relative">
          {/* Vertical Border Line (Non-breaking) */}
          <div className="hidden lg:block absolute left-75 top-0 bottom-0 border-r border-border z-10" />

          {/* Desktop Sidebar (Sticky & Fit Height) */}
          <div className="hidden lg:block sticky top-35 h-fit px-6 pb-10 pt-6 bg-white z-20">
            <FilterSidebar
              filters={filters}
              facets={facets}
              onToggleArray={toggleArrayFilter}
              onSetFilters={setFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="min-h-150 flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {activeFilterCount > 0 && (
              <ActiveFilterBar
                filters={filters}
                onRemove={removeFilter}
                onClearAll={clearAll}
                facets={facets}
              />
            )}

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="fixed inset-0 z-100 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <div className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col overflow-hidden rounded-t-2xl border-t border-border bg-background">
                  <div className="flex shrink-0 items-center justify-between border-b border-border px-6 pb-5 pt-10 sm:px-8">
                    <h2 className="text-xl font-bold text-text-primary">
                      Filter Produk
                    </h2>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-50 text-text-secondary"
                    >
                      <AppIcon name="close" className="text-lg" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6 sm:px-8">
                    <FilterSidebar
                      filters={filters}
                      facets={facets}
                      onToggleArray={(key, value) => {
                        toggleArrayFilter(key, value);
                      }}
                      onSetFilters={(f) => {
                        setFilters(f);
                      }}
                    />
                  </div>
                  <div className="shrink-0 border-t border-border bg-white p-5 sm:p-6">
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="w-full py-4 bg-primary-900 text-white font-black uppercase tracking-widest rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Tampilkan {pagination.total} Produk
                      <AppIcon name="arrow_forward" className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid Content */}
            <div className="w-full">
              {loading ? (
                /* Skeleton Grid */
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "grid grid-cols-1 items-stretch gap-4"
                  }
                >
                  {Array.from({ length: 8 }).map((_, i) =>
                    viewMode === "grid" ? (
                      <div
                        key={i}
                        className="h-full overflow-hidden rounded-xl border border-border bg-white animate-pulse"
                      >
                        <div className="aspect-square bg-secondary-50" />
                        <div className="border-t border-border/60 p-4 space-y-3">
                          <div className="h-4 bg-secondary-50 w-3/4 rounded" />
                          <div className="h-3 bg-secondary-50 w-1/2 rounded" />
                          <div className="h-4 bg-secondary-50 w-2/3 rounded" />
                        </div>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="h-full overflow-hidden rounded-xl border border-border bg-white animate-pulse"
                      >
                        <div className="flex min-h-36 flex-row">
                          <div className="w-30 shrink-0 bg-secondary-50 sm:size-40 lg:size-44" />
                          <div className="flex-1 space-y-3 border-l border-border/60 p-4 sm:p-5">
                            <div className="h-4 bg-secondary-50 w-3/4 rounded" />
                            <div className="h-3 bg-secondary-50 w-1/2 rounded" />
                            <div className="h-3 bg-secondary-50 w-1/4 rounded" />
                            <div className="h-4 bg-secondary-50 w-1/3 rounded" />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : products.length === 0 ? (
                /* Empty State */
                <div className="p-20 flex flex-col items-center justify-center text-text-muted text-center bg-white rounded-xl border border-dashed border-border">
                  <div className="flex items-center justify-center mb-6">
                    <AppIcon
                      name="inventory_2"
                      className="text-6xl opacity-20"
                    />
                  </div>
                  <p className="text-xl font-black text-text-primary tracking-tight">
                    Produk tidak ditemukan
                  </p>
                  <p className="text-sm mt-2 mb-8 max-w-md text-text-secondary font-medium">
                    Coba sesuaikan filter atau kata kunci pencarian Anda untuk
                    menemukan produk yang Anda cari.
                  </p>
                  <button
                    onClick={clearAll}
                    className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all border border-primary-600"
                  >
                    Hapus Semua Filter
                  </button>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    /* Product Cards Grid */
                    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onCompareToggle={handleCompareToggle}
                          isComparing={compareIds.includes(product.id)}
                          priceType={filters.price_type}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Product List View */
                    <div className="grid grid-cols-1 items-stretch gap-4">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onCompareToggle={handleCompareToggle}
                          isComparing={compareIds.includes(product.id)}
                          priceType={filters.price_type}
                          viewMode="list"
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-3">
                      <button
                        disabled={!pagination.hasPrev}
                        onClick={() => setPage(pagination.page - 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                      >
                        <AppIcon name="chevron_left" />
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: pagination.totalPages },
                          (_, i) => i + 1,
                        )
                          .filter((p) => {
                            const current = pagination.page;
                            return (
                              p === 1 ||
                              p === pagination.totalPages ||
                              Math.abs(p - current) <= 1
                            );
                          })
                          .map((p, idx, arr) => {
                            const showEllipsis =
                              idx > 0 && p - arr[idx - 1] > 1;
                            return (
                              <span key={p} className="flex items-center gap-2">
                                {showEllipsis && (
                                  <span className="w-8 text-center text-text-muted font-bold">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => setPage(p)}
                                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all border ${
                                    p === pagination.page
                                      ? "bg-primary-500 text-white border-primary-500"
                                      : "bg-white border-border text-text-secondary hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                                  }`}
                                >
                                  {p}
                                </button>
                              </span>
                            );
                          })}
                      </div>
                      <button
                        disabled={!pagination.hasNext}
                        onClick={() => setPage(pagination.page + 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                      >
                        <AppIcon name="chevron_right" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-primary-900 text-white rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary-800/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 sm:gap-4 pl-1 sm:pl-2">
              <div className="flex -space-x-3">
                {compareIds.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-900 bg-primary-700 flex items-center justify-center text-white"
                  >
                    <AppIcon
                      name="inventory_2"
                      className="text-xs sm:text-base"
                    />
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] sm:text-xs font-black uppercase tracking-widest text-primary-200 whitespace-nowrap">
                  {compareIds.length} Produk Terpilih
                </p>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-primary-400 font-medium truncate">
                  Bandingkan maks. 3 produk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setCompareIds([])}
                className="text-[0.65rem] sm:text-xs font-bold text-primary-300 hover:text-white transition-colors px-2 tracking-widest whitespace-nowrap"
              >
                BATAL
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(",")}`}
                className="flex-1 sm:flex-none bg-primary-500 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[0.65rem] sm:text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Bandingkan
                <AppIcon name="compare_arrows" className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-primary-600 font-bold tracking-widest text-xs uppercase">
              Memuat Katalog...
            </p>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
