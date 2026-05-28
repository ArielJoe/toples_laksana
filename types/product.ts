// --- Interfaces ---



export interface ProductPrice {
  lidColorId: string;
  priceTypeId: string;
  price: number;
  quantity?: number;
  validFrom?: string;
  validUntil?: string;
  lidColorName?: string;
  lidColorHex?: string;
  priceTypeName?: string;
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
  lidMaterial: string;
  lidVariant: string;
  bodyMaterial: string;
  lidType?: string;
  lidMaterialName?: string;
  lidVariantName?: string;
  bodyMaterialName?: string;
  lidTypeName?: string;
  isAvailable?: boolean;
  availabilityNote?: string;
  description?: string;
  dimension?: ProductDimension;
  packaging?: ProductPackaging[];
  images?: ProductImage[];
  prices?: ProductPrice[];
  deletedAt?: string | null;
  createdAt?: string;
}

// --- Constants ---

export const PRICE_TYPE_IDS = {
  withLid: "ptype_001",
  perBal: "ptype_004",
} as const;

// --- Helper Functions ---

// Fallback label when resolved name is not available from the database
export function getCategoryLabel(categoryId: string): string {
  return formatAttributeLabel(categoryId);
}

// Fallback label when resolved name is not available from the database
export function getLidColorLabel(lidColorId?: string): string {
  if (!lidColorId) return "-";
  return formatAttributeLabel(lidColorId);
}

// Fallback label when resolved name is not available from the database
export function getProductTypeLabel(productTypeId?: string): string {
  if (!productTypeId) return "Reguler";
  return formatAttributeLabel(productTypeId);
}

// Extract a spec value from the product dimension object
export function getSpecValue(product: Product, key: string): number | undefined {
  if (!product.dimension) return undefined;
  const dimMap: Record<string, number | undefined> = {
    volume_ml: product.dimension.volumeMl,
    tinggi_cm: product.dimension.heightCm,
    diameter_badan_cm: product.dimension.diameterCm,
    berat_total_gr: product.dimension.weightGram,
  };
  return dimMap[key];
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
  product_type?: string[];
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
  price_types?: { value: string; count: number; name?: string }[];
  product_types?: { value: string; count: number; name?: string }[];
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
