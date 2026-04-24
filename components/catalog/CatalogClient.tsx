"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductCard from "@/components/catalog/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilterBar from "@/components/catalog/ActiveFilterBar";
import type { Product, FacetCounts, PaginatedResponse } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgePercent } from "lucide-react";

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
    page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
  });
  const [facets, setFacets] = useState<FacetCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch filter facets (categories, tags, etc.) once on component mount
  useEffect(() => {
    fetch("/api/products/facets")
      .then((r) => r.json())
      .then((data) => setFacets(data))
      .catch(console.error);
  }, []);

  // Re-fetch product list whenever filters or page change
  useEffect(() => {
    if (!loading) setLoading(true);
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data: PaginatedResponse<Product>) => {
        setProducts(data.data || []);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  /**
   * Toggles a product in the comparison list (max 3 products).
   */
  const handleCompareToggle = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  return (
    <div className="bg-background text-text-primary min-h-screen pt-8">
      <main className="pb-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-text-secondary font-medium">
          <Link className="hover:text-primary-500 transition-colors" href="/">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-text-primary font-bold tracking-tight">Katalog</span>
        </nav>

        {/* Page Title & Controls */}
        <div className="mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
              Koleksi Kami
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Temukan berbagai pilihan kemasan industri premium kami, dirancang untuk keindahan estetika dan ketahanan praktis.
            </p>
          </div>
        </div>

        {/* Sticky Controls & Active Filters */}
        <div className="sticky top-[66px] z-40 bg-white/95 backdrop-blur-md -mx-6 px-6 lg:-mx-12 lg:px-12 py-5 mb-8 border-b border-border shadow-sm transition-all space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile/Tablet filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-border text-sm font-bold shadow-sm hover:border-primary-500/30 transition-all"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                Filter
                {activeFilterCount > 0 && (
                  <span className="bg-primary-500 text-white text-[0.65rem] font-black px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">grid_view</span>
                <span className="text-[0.65rem] font-black text-text-primary uppercase tracking-[0.2em]">Katalog Produk</span>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-border shadow-sm">
              <span className="text-[0.65rem] uppercase font-black text-text-muted tracking-widest hidden sm:inline">
                Urutkan:
              </span>
              <Select
                value={filters.sort || "popular"}
                onValueChange={(val) => setFilters({ sort: val as any })}
              >
                <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0 font-bold text-sm h-auto p-0 bg-transparent flex items-center justify-between">
                  <SelectValue>{SORT_LABELS[filters.sort || "popular"]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="border-t border-border/50">
              <ActiveFilterBar
                filters={filters}
                totalResults={pagination.total}
                onRemove={removeFilter}
                onClearAll={clearAll}
              />
            </div>
          )}
        </div>

        {/* Main Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block sticky top-28">
            <FilterSidebar
              filters={filters}
              facets={facets}
              onToggleArray={toggleArrayFilter}
              onSetFilters={setFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-100 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 pb-32 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-text-primary">Filter Produk</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-50 text-text-secondary"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
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
                <div className="mt-auto absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-border rounded-b-2xl">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-4 bg-primary-900 text-white font-black uppercase tracking-widest rounded-xl text-xs shadow-2xl shadow-primary-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Tampilkan {pagination.total} Produk
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="lg:col-span-3 min-h-[600px]">
            {loading ? (
              /* Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-border overflow-hidden rounded-xl animate-pulse">
                    <div className="aspect-square bg-secondary-50" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-secondary-50 w-3/4 rounded-lg" />
                      <div className="h-4 bg-secondary-50 w-1/2 rounded-lg" />
                      <div className="h-8 bg-secondary-50 w-2/3 rounded-lg" />
                      <div className="h-12 bg-secondary-50 w-full mt-2 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-border">
                <span className="material-symbols-outlined text-7xl text-text-muted/20 mb-6">
                  inventory_2
                </span>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Produk tidak ditemukan
                </h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Coba sesuaikan filter atau kata kunci pencarian Anda untuk menemukan produk yang Anda cari.
                </p>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10"
                >
                  Hapus Semua Filter
                </button>
              </div>
            ) : (
              <>
                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onCompareToggle={handleCompareToggle}
                      isComparing={compareIds.includes(product._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-3">
                    <button
                      disabled={!pagination.hasPrev}
                      onClick={() => setPage(pagination.page - 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          const current = pagination.page;
                          return p === 1 || p === pagination.totalPages || Math.abs(p - current) <= 1;
                        })
                        .map((p, idx, arr) => {
                          const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                          return (
                            <span key={p} className="flex items-center gap-2">
                              {showEllipsis && (
                                <span className="w-8 text-center text-text-muted font-bold">...</span>
                              )}
                              <button
                                onClick={() => setPage(p)}
                                className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all border ${p === pagination.page
                                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
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
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Floating Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-primary-900 text-white rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary-800/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 sm:gap-4 pl-1 sm:pl-2">
              <div className="flex -space-x-3">
                {compareIds.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-900 bg-primary-700 flex items-center justify-center text-white"
                  >
                    <span className="material-symbols-outlined text-xs sm:text-base">inventory_2</span>
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
                className="flex-1 sm:flex-none bg-accent-500 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[0.65rem] sm:text-xs font-black uppercase tracking-widest hover:bg-accent-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent-500/20 active:scale-95"
              >
                Bandingkan
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
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
            <p className="text-primary-600 font-bold tracking-widest text-xs uppercase">Memuat Katalog...</p>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
