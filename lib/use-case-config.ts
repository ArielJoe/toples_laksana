/**
 * Use-Case Filter Configuration
 * Maps database tags to user-friendly labels and icons.
 */

export interface UseCaseConfig {
  tag: string;          // Must match tags[] values in database
  label: string;        // Display label in filter UI
  icon: string;         // Material Symbol icon name
  description: string;  // Tooltip/Help text
}

/**
 * Master configuration for the "Cocok Untuk..." (Best for...) filter.
 * To add a new use-case:
 * 1. Add the tag to products in database
 * 2. Add an entry here with the matching tag value
 */
export const USE_CASE_FILTER_CONFIG: UseCaseConfig[] = [
  {
    tag: "nastar",
    label: "Cookies / Nastar",
    icon: "cookie",
    description: "Containers for cookies, pastries, and holiday snacks",
  },
  {
    tag: "kue kering",
    label: "Other Pastries",
    icon: "bakery_dining",
    description: "Packaging for various dry snacks and cakes",
  },
  {
    tag: "bubuk kopi",
    label: "Coffee / Tea Powder",
    icon: "coffee",
    description: "Airtight packaging for ground coffee and tea",
  },
  {
    tag: "biji kopi",
    label: "Coffee Beans / Granola",
    icon: "grain",
    description: "Containers for whole beans and granola",
  },
  {
    tag: "selai",
    label: "Jam / Honey / Sauce",
    icon: "humidity_percentage",
    description: "Jars for semi-liquid products and spreads",
  },
  {
    tag: "bumbu",
    label: "Spices & Herbs",
    icon: "spa",
    description: "Small containers for kitchen spices",
  },
  {
    tag: "manisan",
    label: "Sweets / Candy",
    icon: "candy",
    description: "Jars for candies, sweets, and sweet snacks",
  },
  {
    tag: "sambal",
    label: "Chili / Pickles",
    icon: "local_fire_department",
    description: "Jars for chili sauce, pickles, and fermented products",
  },
];

/**
 * Retrieves the UI configuration for a specific tag.
 */
export function getUseCaseConfig(tag: string): UseCaseConfig | undefined {
  return USE_CASE_FILTER_CONFIG.find((c) => c.tag === tag);
}

/**
 * Returns the display label for a tag, falling back to capitalized tag if not configured.
 */
export function getUseCaseLabel(tag: string): string {
  const config = getUseCaseConfig(tag);
  return config?.label ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * Color mapping and icons for main category filters.
 */
export const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  "Tin Kaleng": { icon: "deployed_code", label: "Tin Cans" },
  "Jar Plastik": { icon: "layers", label: "Plastic Jars" },
  "Jar Kaca": { icon: "liquor", label: "Glass Jars" },
  "Jar Cylinder": { icon: "inventory_2", label: "Cylinder Jars" },
  "Botol": { icon: "water_bottle", label: "Bottles" },
  "Botol Plastik": { icon: "water_bottle", label: "Plastic Bottles" },
};

/**
 * Humanized labels and tooltips for material types.
 */
export const MATERIAL_LABELS: Record<string, { label: string; tooltip: string }> = {
  "Polyethylene Terephthalate (PET) no.1": {
    label: "Clear Plastic (PET)",
    tooltip: "Lightweight, clear, food-safe material. Best for cookies.",
  },
  "Polypropylene(PP) no.3": {
    label: "Strong Plastic (PP)",
    tooltip: "Durable and heat-resistant up to 100°C. Ideal for reheat-capable products.",
  },
  "Tin kaleng": {
    label: "Tin Metal",
    tooltip: "Premium metallic material. Maximum protection with a classic look.",
  },
  "Soda lime glass": {
    label: "Standard Glass",
    tooltip: "Thick food-grade glass. Heavy, premium, and reusable.",
  },
};

/**
 * Humanized labels and tooltips for lid/closure types.
 */
export const LID_TYPE_LABELS: Record<string, { label: string; tooltip: string }> = {
  "tutup ulir": {
    label: "Screw Cap",
    tooltip: "Traditional screw-on closure. Most common and secure.",
  },
  "twist off": {
    label: "Twist-Off Cap",
    tooltip: "Requires pressure and a short twist. Stronger seal for liquids.",
  },
  "slide on": {
    label: "Slide-On Lid",
    tooltip: "Simple push-on/slide closure for quick access.",
  },
};

/**
 * Color swatch mapping for variant selection.
 */
export const COLOR_SWATCHES: Record<string, string> = {
  "Bening": "#FFFFFF",
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Rose": "#B76E79",
  "Rose Gold": "#B76E79",
  "Hitam": "#1A1A1A",
  "Putih": "#F5F5F5",
  "Merah": "#DC2626",
};
