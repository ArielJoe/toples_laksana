import type { Product, ProductPrice } from "@/types/product";
import type { CalculatorResult } from "@/lib/price-calculator";
import { PRICE_TYPE_IDS, getSpecValue, getLowestRetailPrice, getLowestWholesalePrice } from "@/types/product";
import { formatRupiah } from "@/lib/price-calculator";

export function getCleanWANumber(): string {
  const rawNumber = process.env.NEXT_PUBLIC_WA_NUMBER;
  if (!rawNumber) return "6282119668009";
  // Clean all non-digit characters (quotes, spaces, plus signs, dashes, etc.)
  return rawNumber.replace(/[^0-9]/g, "");
}

export function getCleanColorName(colorId?: string, colorMap: Record<string, string> = {}): string {
  if (!colorId) return "-";
  
  const cleanId = colorId.trim().toLowerCase();
  
  if (colorMap[cleanId]) return colorMap[cleanId];
  if (colorMap[colorId]) return colorMap[colorId];

  // If it's already a friendly name (doesn't start with color_ or lc_ and contains no underscores)
  if (!cleanId.startsWith("color_") && !cleanId.startsWith("lc_") && !cleanId.includes("_")) {
    return colorId.charAt(0).toUpperCase() + colorId.slice(1);
  }

  return colorId.replace("color_", "").replace("lc_", "").replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function getCleanPriceTypeName(priceTypeId?: string, priceTypeMap: Record<string, string> = {}): string {
  if (!priceTypeId) return "-";

  const cleanId = priceTypeId.trim().toLowerCase();

  if (priceTypeMap[cleanId]) return priceTypeMap[cleanId];
  if (priceTypeMap[priceTypeId]) return priceTypeMap[priceTypeId];

  return priceTypeId.replace("ptype_", "").replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function buildWhatsAppUrlFromMessage(message: string): string {
  return `https://wa.me/${getCleanWANumber()}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppMessage(
  product: Product,
  price: ProductPrice,
  calc: CalculatorResult,
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = price?.lidColorName || getCleanColorName(price?.lidColorId, lidColorNames);

  const lines: string[] = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan produk berikut:",
    "",
    `• *Nama Produk:* ${product.name}`,
    `• *SKU:* ${product.sku}`,
  ];

  if (volume) {
    lines.push(`• *Volume:* ${volume}ml`);
  }

  lines.push(`• *Warna Tutup:* ${color}`);

  if (calc && calc.quantity > 0) {
    const typeLabel = price.priceTypeName || getCleanPriceTypeName(price.priceTypeId, priceTypeNames);
    lines.push(
      `• *Tipe Harga:* ${typeLabel}`,
      `• *Jumlah:* ${calc.quantity} (${calc.totalPcs.toLocaleString("id-ID")} pcs)`,
    );
  }

  if (calc && calc.subtotal > 0) {
    lines.push(`• *Harga:* ${formatRupiah(calc.subtotal)}`);
  }

  lines.push(
    "",
    "Mohon info ketersediaan stok dan detail lebih lanjut untuk produk ini.",
    "",
    "Terima kasih!",
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  product: Product,
  price: ProductPrice,
  calc: CalculatorResult,
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  return buildWhatsAppUrlFromMessage(buildWhatsAppMessage(product, price, calc, priceTypeNames, lidColorNames));
}

export function buildInquiryUrl(product: Product): string {
  const volume = getSpecValue(product, "volume_ml");

  const lines = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan produk berikut:",
    "",
    `• *Nama Produk:* ${product.name}`,
    `• *SKU:* ${product.sku}`,
  ];

  if (volume) {
    lines.push(`• *Volume:* ${volume}ml`);
  }

  lines.push(
    "",
    "Saya tertarik untuk berdiskusi, mohon info lebih lanjut.",
    "",
    "Terima kasih!",
  );

  return buildWhatsAppUrlFromMessage(lines.join("\n"));
}

export function buildBulkInquiryMessage(
  product: Product,
  price: ProductPrice,
  desiredQty: number,
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = price?.lidColorName || getCleanColorName(price?.lidColorId, lidColorNames);

  const lines = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan produk berikut:",
    "",
    `• *Nama Produk:* ${product.name}`,
    `• *SKU:* ${product.sku}`,
  ];

  if (volume) {
    lines.push(`• *Volume:* ${volume}ml`);
  }

  lines.push(`• *Warna Tutup:* ${color}`);

  if (desiredQty > 0) {
    const typeLabel = price.priceTypeName || getCleanPriceTypeName(price.priceTypeId, priceTypeNames);
    lines.push(
      `• *Tipe Harga:* ${typeLabel}`,
      `• *Jumlah:* ${desiredQty} (${(desiredQty * (price.quantity || 1)).toLocaleString("id-ID")} pcs)`,
    );
  }

  const wholesalePrice = getLowestWholesalePrice(product);
  if (wholesalePrice > 0 && desiredQty > 0) {
    lines.push(`• *Harga:* ${formatRupiah(wholesalePrice * desiredQty)}`);
  }

  lines.push(
    "",
    "Saya tertarik untuk berdiskusi, mohon info lebih lanjut.",
    "Terima kasih!",
  );

  return lines.join("\n");
}

export function buildBulkInquiryUrl(
  product: Product,
  price: ProductPrice,
  desiredQty: number,
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  return buildWhatsAppUrlFromMessage(buildBulkInquiryMessage(product, price, desiredQty, priceTypeNames, lidColorNames));
}

export function buildWishlistInquiryUrl(products: Product[]): string {
  const lines: string[] = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan beberapa produk berikut:",
    "",
  ];

  products.forEach((product, index) => {
    const volume = getSpecValue(product, "volume_ml");
    lines.push(`${index + 1}. *Nama Produk:* ${product.name}`);
    lines.push(`   • *SKU:* ${product.sku}`);
    if (volume) {
      lines.push(`   • *Volume:* ${volume}ml`);
    }
  });

  lines.push(
    "",
    "Saya tertarik untuk berdiskusi, mohon info lebih lanjut.",
    "Terima kasih!",
  );

  return buildWhatsAppUrlFromMessage(lines.join("\n"));
}

export interface WishlistInquiryItem {
  product: Product;
  quantity: number;
  unit: "pcs" | "bal";
  priceTypeId?: string;
  lidColorId?: string;
}

function getWishlistPriceTypeLabel(
  priceTypeId: string | undefined,
  price?: ProductPrice | null,
  priceTypeNames: Record<string, string> = {},
) {
  if (price?.priceTypeName) return price.priceTypeName;
  if (priceTypeId && priceTypeNames[priceTypeId]) return priceTypeNames[priceTypeId];
  return getCleanPriceTypeName(priceTypeId);
}

export function buildWishlistInquiryWithPricesMessage(
  items: WishlistInquiryItem[],
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  const lines: string[] = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan beberapa produk berikut:",
    "",
  ];

  let grandTotal = 0;

  items.forEach((item, index) => {
    const volume = getSpecValue(item.product, "volume_ml");

    const wholesalePriceObj = (item.product.prices || []).find(p => p.priceTypeId === PRICE_TYPE_IDS.perBal);
    const defaultBalQuantity = wholesalePriceObj?.quantity || 50;

    let unitPrice = 0;
    let unitPcs = item.unit === "bal" ? defaultBalQuantity : 1;
    let isPackagePrice = item.priceTypeId === PRICE_TYPE_IDS.perBal;
    let priceTypeLabel = getWishlistPriceTypeLabel(item.priceTypeId, null, priceTypeNames);
    if (item.priceTypeId) {
      const matches = (item.product.prices || []).filter(
        (p) => p.priceTypeId === item.priceTypeId && p.price > 0 && (!item.lidColorId || p.lidColorId === item.lidColorId)
      ).sort((a, b) => a.price - b.price);
      
      let selectedMatch = matches[0] || null;
      if (!selectedMatch) {
        const typeOnlyMatches = (item.product.prices || []).filter(
          (p) => p.priceTypeId === item.priceTypeId && p.price > 0
        ).sort((a, b) => a.price - b.price);
        selectedMatch = typeOnlyMatches[0] || null;
      }

      if (selectedMatch) {
        unitPrice = selectedMatch.price;
        unitPcs = selectedMatch.quantity || unitPcs;
        isPackagePrice = selectedMatch.priceTypeId === PRICE_TYPE_IDS.perBal;
        priceTypeLabel = getWishlistPriceTypeLabel(item.priceTypeId, selectedMatch, priceTypeNames);
      }
    }

    if (unitPrice === 0) {
      const isWholesale = item.unit === "bal";
      const wholesalePrice = getLowestWholesalePrice(item.product);
      const retailPrice = getLowestRetailPrice(item.product);

      isPackagePrice = isWholesale;
      unitPcs = isWholesale ? defaultBalQuantity : 1;
      unitPrice = isWholesale && wholesalePrice > 0
        ? wholesalePrice
        : isWholesale
        ? retailPrice * defaultBalQuantity
        : retailPrice;
    }

    const itemTotal = isPackagePrice ? unitPrice * item.quantity : unitPrice * item.quantity * unitPcs;
    const totalPcs = item.quantity * unitPcs;
    const quantityLabel = unitPcs > 1
      ? `${item.quantity} x ${unitPcs} pcs = ${totalPcs.toLocaleString("id-ID")} pcs`
      : `${item.quantity.toLocaleString("id-ID")} pcs`;
    const unitPriceLabel = unitPcs > 1 ? `${unitPcs} pcs` : "pcs";
    grandTotal += itemTotal;

    lines.push(`${index + 1}. *Nama Produk:* ${item.product.name}`);
    lines.push(`   • *SKU:* ${item.product.sku}`);
    if (volume) {
      lines.push(`   • *Volume:* ${volume}ml`);
    }
    if (item.lidColorId) {
      const colorMatch = (item.product.prices || []).find(p => p.lidColorId === item.lidColorId);
      lines.push(`   • *Warna Tutup:* ${colorMatch?.lidColorName || getCleanColorName(item.lidColorId, lidColorNames)}`);
    }
    lines.push(`   • *Tipe Harga:* ${priceTypeLabel}`);
    lines.push(`   • *Jumlah:* ${quantityLabel}`);
    lines.push(`   • *Harga:* ${formatRupiah(itemTotal)} (${formatRupiah(unitPrice)}/${unitPriceLabel})`);
    lines.push("");
  });

  lines.push(
    "------------------------------------",
    `*Total Harga:* *${formatRupiah(grandTotal)}*`,
    "------------------------------------",
    "",
    "Mohon info ketersediaan stok, ongkir, dan detail lebih lanjut untuk produk-produk tersebut.",
    "",
    "Terima kasih!"
  );

  return lines.join("\n");
}

export function buildWishlistInquiryWithPricesUrl(
  items: WishlistInquiryItem[],
  priceTypeNames: Record<string, string> = {},
  lidColorNames: Record<string, string> = {},
): string {
  return buildWhatsAppUrlFromMessage(buildWishlistInquiryWithPricesMessage(items, priceTypeNames, lidColorNames));
}
