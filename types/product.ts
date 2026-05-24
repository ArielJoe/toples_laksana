// --- Interfaces ---

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
  lidColorName?: string;
  lidColorHex?: string;
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
  categoryName?: string;
  productTypeId?: string;
  unitId: string;
  lidMaterial: string;
  lidVariant: string;
  bodyMaterial: string;
  lidType: string;
  lidMaterialName?: string;
  lidVariantName?: string;
  bodyMaterialName?: string;
  lidTypeName?: string;
  isAvailable?: boolean;
  availabilityNote?: string;
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

// --- Lookup Tables ---

export const CATEGORY_LABELS: Record<string, string> = {
  cat_001: "Jar Cylinder",
  cat_002: "Jar Kaca",
  cat_003: "Jar Plastik",
  cat_004: "Botol Plastik",
  cat_005: "Tin Kaleng",
};

export const LID_COLOR_LABELS: Record<string, string> = {
  lc_001: "Bening",
  lc_002: "Putih",
  lc_003: "Cling",
  lc_004: "Silver",
  lc_005: "Emas",
  lc_006: "Rose",
  lc_007: "Hitam",
};

export const PRICE_TYPE_IDS = {
  withLid: "ptype_001",
  perBal: "ptype_004",
} as const;

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  pt_001: "Premium",
  pt_002: "Economis",
  pt_003: "Standard",
};

// --- Helper Functions ---

export function getCategoryLabel(categoryId: string): string {
  return CATEGORY_LABELS[categoryId] || categoryId || "-";
}

export function getLidColorLabel(lidColorId?: string): string {
  if (!lidColorId) return "-";
  return LID_COLOR_LABELS[lidColorId] || lidColorId;
}

export function getProductTypeLabel(productTypeId?: string): string {
  if (!productTypeId) return "Reguler";
  return PRODUCT_TYPE_LABELS[productTypeId] || productTypeId;
}

// Extract a spec value from dimension object or specifications array
export function getSpecValue(product: Product, key: string): number | undefined {
  if (product.dimension) {
    const dimMap: Record<string, number | undefined> = {
      volume_ml: product.dimension.volumeMl,
      tinggi_cm: product.dimension.heightCm,
      diameter_badan_cm: product.dimension.diameterCm,
      berat_total_gr: product.dimension.weightGram,
    };
    if (dimMap[key] !== undefined) return dimMap[key];
  }
  return product.specifications?.find((s) => s.key === key)?.value;
}

export function getPrimaryImage(product: Product): string {
  if (!product.images || product.images.length === 0) return "/toples.png";
  const primary = product.images.find(img => img.isPrimary);
  return primary?.imageUrl || product.images[0].imageUrl || "/toples.png";
}

// Get the lowest retail (withLid) price across all color variants
export function getLowestRetailPrice(product: Product): number {
  const retail = (product.prices || []).filter(
    (p) => p.priceTypeId === PRICE_TYPE_IDS.withLid
  );
  if (retail.length === 0) {
    const all = product.prices || [];
    return all.length > 0 ? Math.min(...all.map((p) => p.price)) : 0;
  }
  return Math.min(...retail.map((p) => p.price));
}

// Get the lowest wholesale (perBal) price across all color variants
export function getLowestWholesalePrice(product: Product): number {
  const wholesale = (product.prices || []).filter(
    (p) => p.priceTypeId === PRICE_TYPE_IDS.perBal
  );
  if (wholesale.length === 0) return 0;
  return Math.min(...wholesale.map((p) => p.price));
}

export function getPricesByType(product: Product, priceTypeId: string): ProductPrice[] {
  return (product.prices || []).filter((p) => p.priceTypeId === priceTypeId);
}

// --- Filter & Pagination Types ---

export interface CatalogFilters {
  search?: string;
  category?: string[];
  volume_min?: number;
  volume_max?: number;
  price_min?: number;
  price_max?: number;
  price_type?: string[];
  material_body?: string[];
  lid_material?: string[];
  colors?: string[];
  availability?: string[];
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
  categories: { value: string; count: number; name?: string }[];
  materials: { value: string; count: number; name?: string }[];
  lid_materials: { value: string; count: number; name?: string }[];
  colors: { value: string; count: number; name?: string; hex?: string }[];
  volume_range: { min: number; max: number };
  price_range: { min: number; max: number };
  availability_statuses?: { value: string; count: number; name?: string }[];
}

export function getAvailabilityLabel(isAvailable?: boolean | string): string {
  if (typeof isAvailable === "string") {
    return isAvailable === "false" || isAvailable === "unavailable" ? "Tidak Tersedia" : "Tersedia";
  }
  return isAvailable === false ? "Tidak Tersedia" : "Tersedia";
}

export function formatAttributeLabel(value?: string): string {
  if (!value) return "-";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
