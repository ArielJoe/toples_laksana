import type { Product, ProductPrice } from "@/types/product";
import type { CalculatorResult } from "@/lib/price-calculator";
import { getLidColorLabel, getSpecValue } from "@/types/product";
import { formatRupiah } from "@/lib/price-calculator";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";

export function buildWhatsAppUrl(
  product: Product,
  price: ProductPrice,
  calc: CalculatorResult
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = getLidColorLabel(price?.lidColorId);

  const lines: string[] = [
    "Halo Toples Laksana",
    "",
    "Saya tertarik untuk memesan:",
    "----------------",
    `Produk: ${product.name}`,
    `SKU: ${product.sku}`,
  ];

  if (volume) {
    lines.push(`Volume: ${volume}ml`);
  }

  lines.push(
    `Warna tutup: ${color}`,
    `Jumlah: ${calc.quantity} ${calc.unitLabel} (${calc.totalPcs.toLocaleString("id-ID")} pcs)`,
    `Estimasi: ${formatRupiah(calc.subtotal)}`
  );

  if (calc.savingsVsRetail > 0) {
    lines.push(`Hemat: ${formatRupiah(calc.savingsVsRetail)} (${calc.savingsPercentage}%)`);
  }

  lines.push(
    "----------------",
    "",
    "Mohon konfirmasi ketersediaan stok dan ongkir ke [kota saya].",
    "Terima kasih!"
  );

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildInquiryUrl(product: Product): string {
  const volume = getSpecValue(product, "volume_ml");

  const message = [
    "Halo Toples Laksana",
    "",
    "Saya ingin bertanya tentang produk:",
    `${product.name}${volume ? ` (${volume}ml)` : ""}`,
    `SKU: ${product.sku}`,
    "",
    "Mohon informasi ketersediaan dan harga terbaru.",
    "Terima kasih!",
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildBulkInquiryUrl(
  product: Product,
  price: ProductPrice,
  desiredQty: number
): string {
  const volume = getSpecValue(product, "volume_ml");
  const color = getLidColorLabel(price?.lidColorId);

  const message = [
    "Halo Toples Laksana",
    "",
    "Saya tertarik order dalam jumlah besar:",
    "----------------",
    `Produk: ${product.name}${volume ? ` (${volume}ml)` : ""}`,
    `Warna tutup: ${color}`,
    `Jumlah: ${desiredQty} bal`,
    "----------------",
    "",
    "Apakah ada harga spesial untuk jumlah ini?",
    "Terima kasih!",
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
