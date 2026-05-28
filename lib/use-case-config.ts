// Category display config for catalog filter UI
export const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  cat_tin: { icon: "deployed_code", label: "Tin Kaleng" },
  cat_jar_plastik: { icon: "layers", label: "Jar Plastik" },
  cat_jar_kaca: { icon: "liquor", label: "Jar Kaca" },
  cat_jar_cylinder: { icon: "inventory_2", label: "Jar Cylinder" },
  cat_botol: { icon: "water_bottle", label: "Botol" },
  cat_botol_plastik: { icon: "water_bottle", label: "Botol Plastik" },
};

// Body material labels and tooltips
export const MATERIAL_LABELS: Record<string, { label: string; tooltip: string }> = {
  "Polyethylene Terephthalate (PET)": {
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

// Lid/closure type labels and tooltips
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

// Lid color hex swatches. Keys match IDs from LID_COLOR_LABELS and DB IDs.
export const COLOR_SWATCHES: Record<string, string> = {
  color_bening: "#FFFFFF",
  color_putih: "#F5F5F5",
  color_cling: "#E8E8E0",
  color_silver: "#C0C0C0",
  color_emas: "#FFD700",
  color_rose: "#B76E79",
  color_hitam: "#1A1A1A",
  lc_001: "#FFFFFF",
  lc_002: "#F5F5F5",
  lc_003: "#E8E8E0",
  lc_004: "#C0C0C0",
  lc_005: "#FFD700",
  lc_006: "#B76E79",
  lc_007: "#1A1A1A",
};
