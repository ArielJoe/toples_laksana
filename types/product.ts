// ============================================================
// Product Types — Matching MongoDB Schema (new structure)
// ============================================================

export interface ProductSpecification {
  key: string;
  value: number;
  type: "number";
}

export interface ProductPrice {
  lidColorId: string;
  priceTypeId: string;
  price: number;
  validFrom?: string;
  validUntil?: string;
}

export interface ProductImage {
  imageUrl: string;
  order: number;
  isPrimary: boolean;
  createdAt?: string;
}

export interface ProductPackaging {
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg?: number;
  quantityPerPack: number;
}

export interface ProductDimension {
  heightCm: number;
  diameterCm: number;
  volumeMl: number;
  weightGram: number;
}

export interface Product {
  _id?: string;
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  productTypeId?: string;
  unitId: string;
  lidMaterial: string;
  lidVariant: string;
  bodyMaterial: string;
  lidType: string;
  description?: string;
  dimension?: ProductDimension;
  specifications?: ProductSpecification[];
  packaging?: ProductPackaging[];
  images?: ProductImage[];
  prices?: ProductPrice[];
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Lookup Tables
// ============================================================

export const CATEGORY_LABELS: Record<string, string> = {
  cat_tin: "Tin Kaleng",
  cat_jar_plastik: "Jar Plastik",
  cat_jar_kaca: "Jar Kaca",
  cat_jar_cylinder: "Jar Cylinder",
  cat_botol: "Botol",
  cat_botol_plastik: "Botol Plastik",
};

export const LID_COLOR_LABELS: Record<string, string> = {
  color_bening: "Bening",
  color_putih: "Putih",
  color_cling: "Cling",
  color_silver: "Silver",
  color_emas: "Emas",
  color_rose: "Rose",
  color_hitam: "Hitam",
};

export const PRICE_TYPE_IDS = {
  withLid: "price_with_lid",
  perBal: "price_per_bal",
} as const;

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  type_reguler: "Reguler",
  type_premium: "Premium",
};

// ============================================================
// Helper Functions
// ============================================================

/** Get human-readable category label from categoryId */
export function getCategoryLabel(categoryId: string): string {
  return CATEGORY_LABELS[categoryId] || categoryId || "-";
}

/** Get human-readable lid color label from lidColorId */
export function getLidColorLabel(lidColorId?: string): string {
  if (!lidColorId) return "-";
  return LID_COLOR_LABELS[lidColorId] || lidColorId;
}

/** Get human-readable product type label from productTypeId */
export function getProductTypeLabel(productTypeId?: string): string {
  if (!productTypeId) return "Reguler";
  return PRODUCT_TYPE_LABELS[productTypeId] || productTypeId;
}

/** Extract a spec value from dimension or specifications array */
export function getSpecValue(product: Product, key: string): number | undefined {
  // Try dimension object first
  if (product.dimension) {
    const dimMap: Record<string, number | undefined> = {
      volume_ml: product.dimension.volumeMl,
      tinggi_cm: product.dimension.heightCm,
      diameter_badan_cm: product.dimension.diameterCm,
      berat_total_gr: product.dimension.weightGram,
    };
    if (dimMap[key] !== undefined) return dimMap[key];
  }
  // Fallback to specifications array
  return product.specifications?.find((s) => s.key === key)?.value;
}

/** Get the primary image URL from a product */
export function getPrimaryImage(product: Product): string {
  return "/toples.png";
}

/** Get the lowest retail (withLid) price across all color variants */
export function getLowestRetailPrice(product: Product): number {
  const retail = (product.prices || []).filter(
    (p) => p.priceTypeId === PRICE_TYPE_IDS.withLid
  );
  if (retail.length === 0) {
    // Fallback: use all prices
    const all = product.prices || [];
    return all.length > 0 ? Math.min(...all.map((p) => p.price)) : 0;
  }
  return Math.min(...retail.map((p) => p.price));
}

/** Get the lowest wholesale (perBal) price across all color variants */
export function getLowestWholesalePrice(product: Product): number {
  const wholesale = (product.prices || []).filter(
    (p) => p.priceTypeId === PRICE_TYPE_IDS.perBal
  );
  if (wholesale.length === 0) return 0;
  return Math.min(...wholesale.map((p) => p.price));
}

/** Get prices filtered by priceTypeId */
export function getPricesByType(product: Product, priceTypeId: string): ProductPrice[] {
  return (product.prices || []).filter((p) => p.priceTypeId === priceTypeId);
}

// ============================================================
// Filter & Pagination Types
// ============================================================

export interface CatalogFilters {
  search?: string;
  category?: string[];
  volume_min?: number;
  volume_max?: number;
  price_min?: number;
  price_max?: number;
  material_body?: string[];
  lid_type?: string[];
  colors?: string[];
  sort?: "popular" | "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FacetCounts {
  categories: { value: string; count: number }[];
  materials: { value: string; count: number }[];
  lid_types: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  volume_range: { min: number; max: number };
  price_range: { min: number; max: number };
}
