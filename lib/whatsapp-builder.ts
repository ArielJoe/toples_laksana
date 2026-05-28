import type { Product, ProductPrice } from "@/types/product";
import type { CalculatorResult } from "@/lib/price-calculator";
import { PRICE_TYPE_IDS, getSpecValue, getLowestRetailPrice, getLowestWholesalePrice } from "@/types/product";
import { formatRupiah } from "@/lib/price-calculator";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;

function buildWhatsAppUrlFromMessage(message: string): string {
  return `https://wa.me/${WA_NUMBER || "6281234567890"}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppMessage(
  product: Product,
  price: ProductPrice,
  calc: CalculatorResult,
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = price?.lidColorName || price?.lidColorId || "-";

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
    const typeLabel = price.priceTypeName || (price.priceTypeId === "ptype_001" ? "Ecer" : "Grosir");
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
): string {
  return buildWhatsAppUrlFromMessage(buildWhatsAppMessage(product, price, calc));
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
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = price?.lidColorName || price?.lidColorId || "-";

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
    const typeLabel = price.priceTypeName || "Bal";
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
): string {
  return buildWhatsAppUrlFromMessage(buildBulkInquiryMessage(product, price, desiredQty));
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
}

function getWishlistPriceTypeLabel(
  priceTypeId: string | undefined,
  price?: ProductPrice | null,
  priceTypeNames: Record<string, string> = {},
) {
  if (price?.priceTypeName) return price.priceTypeName;
  if (priceTypeId && priceTypeNames[priceTypeId]) return priceTypeNames[priceTypeId];
  if (priceTypeId === PRICE_TYPE_IDS.withLid) return "Harga Per Pcs";
  if (priceTypeId === PRICE_TYPE_IDS.perBal) return "Harga Per Bal";
  return priceTypeId ? priceTypeId.replace(/[_-]+/g, " ") : "Harga";
}

export function buildWishlistInquiryWithPricesMessage(
  items: WishlistInquiryItem[],
  priceTypeNames: Record<string, string> = {},
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
        (p) => p.priceTypeId === item.priceTypeId && p.price > 0
      ).sort((a, b) => a.price - b.price);
      if (matches.length > 0) {
        unitPrice = matches[0].price;
        unitPcs = matches[0].quantity || unitPcs;
        isPackagePrice = matches[0].priceTypeId === PRICE_TYPE_IDS.perBal;
        priceTypeLabel = getWishlistPriceTypeLabel(item.priceTypeId, matches[0], priceTypeNames);
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
): string {
  return buildWhatsAppUrlFromMessage(buildWishlistInquiryWithPricesMessage(items, priceTypeNames));
}
