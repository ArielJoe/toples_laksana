/**
 * UI Configuration for catalog filters.
 * Maps database field values to display labels, icons, and tooltips.
 */

/**
 * Category display config for catalog filter UI.
 */
export const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  cat_tin: { icon: "deployed_code", label: "Tin Kaleng" },
  cat_jar_plastik: { icon: "layers", label: "Jar Plastik" },
  cat_jar_kaca: { icon: "liquor", label: "Jar Kaca" },
  cat_jar_cylinder: { icon: "inventory_2", label: "Jar Cylinder" },
  cat_botol: { icon: "water_bottle", label: "Botol" },
  cat_botol_plastik: { icon: "water_bottle", label: "Botol Plastik" },
};

/**
 * Labels and tooltips for body material types.
 */
export const MATERIAL_LABELS: Record<string, { label: string; tooltip: string }> = {
  "Polyethylene Terephthalate (PET) no.1": {
    label: "PET Plastic",
    tooltip: "Bening, ringan, dan aman untuk makanan.",
  },
  "Polypropylene(PP) no.3": {
    label: "PP Plastic",
    tooltip: "Tahan panas dan lebih lentur.",
  },
  "Tin kaleng": {
    label: "Tin Metal",
    tooltip: "Material kaleng premium.",
  },
  "Soda lime glass": {
    label: "Glass",
    tooltip: "Kaca tebal berkualitas.",
  },
};

/**
 * Labels and tooltips for lid/closure types.
 */
export const LID_TYPE_LABELS: Record<string, { label: string; tooltip: string }> = {
  "tutup ulir": {
    label: "Tutup Ulir",
    tooltip: "Tutup putar standar.",
  },
  "twist off": {
    label: "Twist Off",
    tooltip: "Tutup putar sekali klik.",
  },
  "slide on": {
    label: "Slide On",
    tooltip: "Tutup geser/tekan.",
  },
};

/**
 * Color swatch hex values for lid color selection.
 * Keys must match lowercase labels from LID_COLOR_LABELS.
 */
export const COLOR_SWATCHES: Record<string, string> = {
  color_bening: "#FFFFFF",
  color_putih: "#F5F5F5",
  color_cling: "#E8E8E0",
  color_silver: "#C0C0C0",
  color_emas: "#FFD700",
  color_rose: "#B76E79",
  color_hitam: "#1A1A1A",
};
