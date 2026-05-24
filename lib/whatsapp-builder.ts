import type { Product, ProductPrice } from "@/types/product";
import type { CalculatorResult } from "@/lib/price-calculator";
import { getLidColorLabel, getSpecValue, getLowestRetailPrice, getLowestWholesalePrice } from "@/types/product";
import { formatRupiah } from "@/lib/price-calculator";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;

export function buildWhatsAppUrl(
  product: Product,
  price: ProductPrice,
  calc: CalculatorResult,
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = getLidColorLabel(price?.lidColorId);

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
    lines.push(
      `• *Jumlah:* ${calc.quantity} ${calc.unitLabel} (${calc.totalPcs.toLocaleString("id-ID")} pcs)`,
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

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
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

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildBulkInquiryUrl(
  product: Product,
  price: ProductPrice,
  desiredQty: number,
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = getLidColorLabel(price?.lidColorId);

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
    lines.push(`• *Jumlah:* ${desiredQty} bal`);
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

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
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

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export interface WishlistInquiryItem {
  product: Product;
  quantity: number;
  unit: "pcs" | "bal";
}

export function buildWishlistInquiryWithPricesUrl(items: WishlistInquiryItem[]): string {
  const lines: string[] = [
    "Halo Admin Toples Laksana,",
    "Saya tertarik dengan beberapa produk berikut:",
    "",
  ];

  let grandTotal = 0;

  items.forEach((item, index) => {
    const volume = getSpecValue(item.product, "volume_ml");
    const isWholesale = item.unit === "bal";
    const wholesalePrice = getLowestWholesalePrice(item.product);
    const retailPrice = getLowestRetailPrice(item.product);

    // Determine unit price
    const unitPrice = isWholesale && wholesalePrice > 0
      ? wholesalePrice
      : isWholesale
      ? retailPrice * (item.product.packaging?.[0]?.quantityPerPack || 50)
      : retailPrice;

    const itemTotal = unitPrice * item.quantity;
    grandTotal += itemTotal;

    lines.push(`${index + 1}. *Nama Produk:* ${item.product.name}`);
    lines.push(`   • *SKU:* ${item.product.sku}`);
    if (volume) {
      lines.push(`   • *Volume:* ${volume}ml`);
    }
    lines.push(`   • *Jumlah:* ${item.quantity} ${item.unit}`);
    lines.push(`   • *Harga:* ${formatRupiah(itemTotal)} (${formatRupiah(unitPrice)}/${item.unit})`);
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

  return `https://wa.me/${WA_NUMBER || "6281234567890"}?text=${encodeURIComponent(lines.join("\n"))}`;
}
