"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductPrice } from "@/types/product";
import {
  getCategoryLabel,
  getAvailabilityLabel,
  getLidColorLabel,
  getLowestWholesalePrice,
  getProductTypeLabel,
  getSpecValue,
  formatAttributeLabel,
  PRICE_TYPE_IDS,
} from "@/types/product";
import { calculatePrice, formatPrice, getWholesaleNudge } from "@/lib/price-calculator";
import {
  buildBulkInquiryMessage,
  buildBulkInquiryUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp-builder";
import { COLOR_SWATCHES } from "@/lib/use-case-config";
import { Heart, Tag } from "lucide-react";
import { AppIcon } from "@/components/ui/app-icon";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

const EMPTY_PRICE: ProductPrice = { price: 0, lidColorId: "", priceTypeId: "" };

function readPositiveInteger(event: React.ChangeEvent<HTMLInputElement>) {
  const nextValue = Math.max(1, Number.parseInt(event.currentTarget.value, 10) || 1);
  event.currentTarget.value = String(nextValue);
  return nextValue;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { toggleWishlist, isInWishlist, user } = useApp();
  const wishlisted = isInWishlist(product.id);
  const fallbackPrices = product.prices || [];

  // Extract unique price types that actually exist on this product
  const availablePriceTypes = useMemo(() => {
    const uniqueTypes = new Map<string, { id: string; name: string }>();
    (product.prices || []).forEach((p) => {
      if (p.priceTypeId && !uniqueTypes.has(p.priceTypeId)) {
        uniqueTypes.set(p.priceTypeId, {
          id: p.priceTypeId,
          name: p.priceTypeName || p.priceTypeId.replace(/_/g, ' '),
        });
      }
    });
    return Array.from(uniqueTypes.values());
  }, [product.prices]);

  // Set default active price type (prefer retail / withLid, otherwise the first one)
  const defaultPriceTypeId = useMemo(() => {
    if (availablePriceTypes.length === 0) return "";
    const hasRetail = availablePriceTypes.find(t => t.id === PRICE_TYPE_IDS.withLid);
    return hasRetail ? PRICE_TYPE_IDS.withLid : availablePriceTypes[0].id;
  }, [availablePriceTypes]);

  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<string>("");
  const currentPriceTypeId = selectedPriceTypeId || defaultPriceTypeId;

  // Filter colors based on the active price type
  const priceOptions = useMemo(() => {
    return (product.prices || []).filter((p) => p.priceTypeId === currentPriceTypeId);
  }, [product.prices, currentPriceTypeId]);

  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  const activePrice = priceOptions[selectedPriceIdx] || fallbackPrices[0];
  const isPackagePrice = currentPriceTypeId === PRICE_TYPE_IDS.perBal;

  // Get retail price for the same color (for comparison / savings)
  const retailPrice = useMemo(() => {
    if (!activePrice) return undefined;
    return (product.prices || []).find(
      (p) => p.lidColorId === activePrice.lidColorId && p.priceTypeId === PRICE_TYPE_IDS.withLid
    );
  }, [product.prices, activePrice]);

  // Get wholesale price for the same color (for retail mode savings nudge)
  const wholesalePrice = useMemo(() => {
    if (!activePrice) return undefined;
    return (product.prices || []).find(
      (p) => p.lidColorId === activePrice.lidColorId && p.priceTypeId === PRICE_TYPE_IDS.perBal
    );
  }, [product.prices, activePrice]);

  const quantityPerPack = (product.prices || []).find(p => p.priceTypeId === PRICE_TYPE_IDS.perBal)?.quantity || 50;
  const activeQuantityPerPack = activePrice?.quantity || (isPackagePrice ? quantityPerPack : 1);

  const safeActivePrice = activePrice || EMPTY_PRICE;

  const calcResult = useMemo(
    () => calculatePrice({
      selectedPrice: safeActivePrice,
      retailPrice: retailPrice,
      quantity,
      mode: isPackagePrice ? "wholesale" : "retail",
      quantityPerPack: activeQuantityPerPack,
    }),
    [safeActivePrice, retailPrice, quantity, isPackagePrice, activeQuantityPerPack]
  );

  const nudge = useMemo(
    () => wholesalePrice && activePrice ? getWholesaleNudge(wholesalePrice, activePrice, wholesalePrice.quantity || quantityPerPack) : null,
    [wholesalePrice, activePrice, quantityPerPack]
  );

  const images = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return [{ imageUrl: "/toples.png", isPrimary: true }];
    }
    return product.images;
  }, [product.images]);

  const heroImage = images[mainImage]?.imageUrl || "/toples.png";

  const logWhatsAppInquiry = (message: string, subtotal: number, unit: "pcs" | "bal") => {
    fetch("/api/whatsapp-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.email || "guest",
        message,
        grandTotal: subtotal,
        details: [
          {
            productId: product.id,
            lidColorId: safeActivePrice.lidColorId,
            unit,
            quantity,
            priceAtThatTime: subtotal / Math.max(quantity, 1),
            subtotal,
          },
        ],
      }),
    }).catch(console.error);
  };

  const handleWhatsAppClick = () => {
    logWhatsAppInquiry(
      buildWhatsAppMessage(product, safeActivePrice, calcResult),
      calcResult.subtotal,
      calcResult.unitLabel === "bal" ? "bal" : "pcs",
    );
  };

  const handleBulkInquiryClick = () => {
    const wholesalePriceValue = getLowestWholesalePrice(product);
    const retailPriceValue = retailPrice?.price || activePrice?.price || 0;
    const retailFallbackTotal = retailPriceValue * (wholesalePrice?.quantity || quantityPerPack);
    const unitPrice = wholesalePriceValue > 0 ? wholesalePriceValue : retailFallbackTotal;
    logWhatsAppInquiry(
      buildBulkInquiryMessage(product, safeActivePrice, quantity),
      unitPrice * quantity,
      "bal",
    );
  };
  const volume = getSpecValue(product, "volume_ml");
  const height = getSpecValue(product, "tinggi_cm");
  const diameter = getSpecValue(product, "diameter_badan_cm");
  const weight = getSpecValue(product, "berat_total_gr");
  const category = product.categoryName || getCategoryLabel(product.categoryId);
  const bodyMaterial = product.bodyMaterialName || formatAttributeLabel(product.bodyMaterial);
  const lidMaterial = product.lidMaterialName || formatAttributeLabel(product.lidMaterial);
  const lidVariant = product.lidVariantName || formatAttributeLabel(product.lidVariant);
  const selectedColor = activePrice?.lidColorName || getLidColorLabel(activePrice?.lidColorId);
  const selectedColorHex = activePrice?.lidColorHex || COLOR_SWATCHES[activePrice?.lidColorId || ""] || "#ccc";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-12 lg:pt-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center flex-wrap gap-1 text-sm text-gray-400 font-medium">
        <Link className="hover:text-primary-500 transition-colors" href="/catalog">Katalog</Link>
        <AppIcon name="chevron_right" className="text-xs" />
        <Link className="hover:text-primary-500 transition-colors" href={`/catalog?category=${product.categoryId}`}>
          {category}
        </Link>
        <AppIcon name="chevron_right" className="text-xs" />
        <span className="max-w-45 truncate font-semibold text-gray-900 sm:max-w-[320px]">{product.name}</span>
      </nav>

      {/* Main Grid: Image Left + Info Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">

        {/* Left Column: Image Gallery */}
        <div className="min-w-0 space-y-4">
          {/* Main Image */}
          <div className="relative flex aspect-square max-h-[75svh] items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4 sm:p-6 lg:max-h-none lg:p-8">
            {heroImage ? (
              <Image
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-8"
                src={heroImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <AppIcon name="inventory_2" className="text-8xl text-gray-200" />
            )}

            {/* Prev/Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setMainImage(Math.max(0, mainImage - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <AppIcon name="chevron_left" className="text-lg" />
                </button>
                <button
                  onClick={() => setMainImage(Math.min(images.length - 1, mainImage + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <AppIcon name="chevron_right" className="text-lg" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, i) => (
                <button
                  key={`${image.imageUrl}-${i}`}
                  onClick={() => setMainImage(i)}
                  className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white p-1 transition-all sm:h-16 sm:w-16 ${i === mainImage ? "border-2 border-primary-500" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Image alt={`${product.name} ${i + 1}`} fill className="object-contain scale-75 p-1" src={image.imageUrl} sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="min-w-0">
          {/* Name & SKU */}
          <h1 className="mb-2 wrap-break-word text-xl font-bold text-gray-900 sm:text-2xl">{product.name}</h1>
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
            <span className="min-w-0 break-all">SKU: {product.sku}</span>
            <span>
              Ketersediaan:{" "}
              <span className={cn("font-semibold uppercase", product.isAvailable !== false ? "text-emerald-600" : "text-red-500")}>
                {getAvailabilityLabel(product.isAvailable)}
              </span>
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Tipe Produk: <span className="font-semibold text-gray-900">{category}</span>
          </p>

          {product.description && (
            <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-6 flex flex-wrap items-baseline gap-2">
            <span className="wrap-break-word text-2xl font-bold text-gray-900">
              {calcResult.pricePerPcs > 0 ? formatPrice(calcResult.pricePerPcs) : "Hubungi Kami"}
            </span>
          </div>

          {/* Pricing mode badges */}
          {availablePriceTypes.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {availablePriceTypes.map((type) => {
                const isActive = currentPriceTypeId === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedPriceTypeId(type.id); setQuantity(1); setSelectedPriceIdx(0); }}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${isActive
                        ? "bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/10"
                        : "bg-slate-50 text-gray-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {type.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Color Selection - Rendered immediately below the price type badges */}
          {priceOptions.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                <span>Warna Tutup Tersedia:</span>
                <span className="font-semibold text-gray-900">{selectedColor}</span>
                <span className="text-xs text-gray-400 font-normal uppercase">{selectedColorHex}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {priceOptions.map((price, i) => {
                  const colorLabel = price.lidColorName || getLidColorLabel(price.lidColorId);
                  const hex = price.lidColorHex || COLOR_SWATCHES[price.lidColorId] || "#ccc";
                  const isSelected = i === selectedPriceIdx;
                  return (
                    <button
                      key={`${price.lidColorId}-${price.priceTypeId}`}
                      onClick={() => { setSelectedPriceIdx(i); setQuantity(1); }}
                      className={`flex max-w-full items-center gap-2 rounded-xl border px-3 py-2 transition-all cursor-pointer ${isSelected
                        ? "border-2 border-primary-500 bg-primary-50/50 text-primary-700 font-bold"
                        : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                        }`}
                      title={colorLabel}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-border shadow-sm" style={{ backgroundColor: hex }} />
                      <span className="min-w-0 truncate text-xs font-semibold">{colorLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isPackagePrice && nudge && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-primary-50 text-primary-600 font-semibold px-2 py-1 rounded flex items-center gap-1">
                <Tag size={12} /> Hemat {nudge.percentage}%
              </span>
              <span className="text-gray-400">vs harga ecer</span>
            </div>
          )}

          {/* Quick Specs */}
          <div className="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-x-6">
            {[
              { label: "Volume", value: volume ? `${volume}ml` : "-" },
              { label: "Berat", value: weight ? `${weight}gr` : "-" },
              { label: "Bahan Badan", value: bodyMaterial },
              { label: "Bahan Tutup", value: lidMaterial },
            ].map((item) => (
              <div className="flex justify-between gap-4" key={item.label}>
                <span className="shrink-0 text-gray-400">{item.label}</span>
                <span className="min-w-0 wrap-break-word text-right font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Quantity: {isPackagePrice && <span className="text-gray-400">(bal)</span>}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(readPositiveInteger(e))}
                className="w-24 px-3 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-primary-500 transition-all"
              />
            </div>
            {activeQuantityPerPack > 1 && (
              <p className="text-xs text-gray-400 mt-2">
                1 {isPackagePrice ? "bal" : "pilihan"} = {activeQuantityPerPack}. Total: <span className="font-semibold text-gray-900">{calcResult.totalPcs.toLocaleString("id-ID")}</span>
              </p>
            )}
          </div>

          {/* Subtotal */}
          <div className="mb-6 flex flex-col gap-1 border-t border-gray-100 pt-4 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="text-sm text-gray-500">Subtotal:</span>
            <span className="wrap-break-word text-xl font-bold text-gray-900">
              {calcResult.subtotal > 0 ? formatPrice(calcResult.subtotal) : "-"}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppUrl(product, safeActivePrice, calcResult)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all text-sm"
              >
                <AppIcon name="chat" className="text-xl" />
                Pesan via WhatsApp
              </a>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "flex h-12 w-full shrink-0 items-center justify-center rounded-xl border border-border bg-white text-gray-400 transition-all hover:border-red-200 hover:text-red-500 sm:w-12 cursor-pointer",
                  wishlisted && "text-red-500 border-red-100 bg-red-50"
                )}
                title={wishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              >
                <Heart
                  className={cn(
                    "size-5 transition-transform",
                    wishlisted ? "fill-red-500 text-red-500 scale-110" : ""
                  )}
                />
              </button>
            </div>
            {quantity >= 5 && isPackagePrice && (
              <a
                href={buildBulkInquiryUrl(product, safeActivePrice, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBulkInquiryClick}
                className="w-full py-2.5 text-primary-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
              >
                <AppIcon name="request_quote" className="text-lg" />
                Minta Harga Spesial
              </a>
            )}
          </div>

          {/* Info bullets */}
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
            {[
              { icon: "local_shipping", title: "Pengiriman", desc: "Tersedia via ekspedisi ke seluruh Indonesia" },
              { icon: "verified", title: "Kualitas Terjamin", desc: "Produk food-grade dengan standar industri" },
              { icon: "storefront", title: "Grosir B2B", desc: "Hubungi kami untuk harga spesial grosir" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <AppIcon name={item.icon} className="text-lg text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Tabs: Dimensions / Packaging / Specs */}
      <div className="mt-10 sm:mt-16">
        <SpecTabs
          product={product}
          height={height}
          diameter={diameter}
          weight={weight}
          category={category}
          selectedColor={selectedColor}
          selectedColorHex={selectedColorHex}
          bodyMaterial={bodyMaterial}
          lidMaterial={lidMaterial}
          lidVariant={lidVariant}
        />
      </div>
    </main>
  );
}

// Separated tab component to keep main component cleaner
function SpecTabs({ product, height, diameter, weight, category, selectedColor, selectedColorHex, bodyMaterial, lidMaterial, lidVariant }: {
  product: Product;
  height?: number;
  diameter?: number;
  weight?: number;
  category: string;
  selectedColor: string;
  selectedColorHex: string;
  bodyMaterial: string;
  lidMaterial: string;
  lidVariant: string;
}) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "packaging" | "specs">("dimensions");

  return (
    <>
      <div className="mb-6 border-b border-gray-200">
        <div className="grid grid-cols-3">
          {[
            { id: "dimensions" as const, label: "Dimensi Detail" },
            { id: "packaging" as const, label: "Info Pengemasan" },
            { id: "specs" as const, label: "Spesifikasi Lengkap" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-0 border-b-2 px-1.5 py-3 text-center text-[0.7rem] font-medium leading-tight transition-all sm:px-5 sm:text-sm ${activeTab === tab.id ? "border-primary-500 text-primary-500" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dimensions" && (
        <div className="grid max-w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Tinggi", value: height, unit: "cm" },
            { label: "Diameter", value: diameter, unit: "cm" },
            { label: "Berat", value: weight, unit: "gr" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-5 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-gray-900">{item.value || "-"}</span>
              <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "packaging" && (
        <div className="max-w-full rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Dimensi Pengemasan Paket</h4>
          {(product.packaging || []).length > 0 ? (
            <div className="space-y-4">
              {(product.packaging || []).map((pack, index) => (
                <div key={index} className="grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-[minmax(9rem,0.8fr)_minmax(0,1.2fr)] sm:gap-x-3 sm:gap-y-3">
                  <span className="text-gray-400">Dimensi Kemasan</span>
                  <span className="wrap-break-word font-medium">{pack.lengthCm || "-"} x {pack.widthCm || "-"} x {pack.heightCm || "-"} cm</span>
                  <span className="text-gray-400">Berat Paket</span>
                  <span className="wrap-break-word font-medium">{pack.weightKg || "-"} kg</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 leading-relaxed space-y-1">
                <span className="font-bold text-gray-700 block mb-1">Catatan Pengiriman:</span>
                <p>• Dimensi paket kemasan di atas digunakan oleh pihak ekspedisi untuk menghitung ongkos kirim berdasarkan volume atau berat barang.</p>
                <p>• Pembelian grosir atau bal dikemas langsung dari pabrik menggunakan perlindungan kemasan ekstra.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Informasi dimensi pengemasan paket belum tersedia.</p>
          )}
        </div>
      )}

      {activeTab === "specs" && (
        <div className="max-w-full overflow-hidden rounded-xl border border-gray-100">
          {[
            { label: "SKU", value: product.sku },
            { label: "Kategori", value: category },
            { label: "Tipe Produk", value: getProductTypeLabel(product.productTypeId) },
            {
              label: "Status Ketersediaan",
              value: (
                <span className={cn("uppercase", product.isAvailable !== false ? "text-emerald-600" : "text-red-500")}>
                  {getAvailabilityLabel(product.isAvailable)}
                </span>
              ),
            },
            { label: "Bahan Badan", value: bodyMaterial },
            { label: "Bahan Tutup", value: lidMaterial },
            { label: "Variasi Tutup", value: lidVariant },
            {
              label: "Warna Tutup",
              value: (
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="h-4 w-4 shrink-0 rounded-full border border-border shadow-sm" style={{ backgroundColor: selectedColorHex }} />
                  <span className="min-w-0 wrap-break-word">{selectedColor}</span>
                  <span className="text-xs uppercase text-gray-400">{selectedColorHex}</span>
                </div>
              )
            },
          ].map((row, i) => (
            <div key={row.label} className={`grid grid-cols-1 text-sm sm:grid-cols-[minmax(9rem,0.8fr)_minmax(0,1.2fr)] ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <div className="px-4 pb-1 pt-3 font-medium text-gray-400 sm:px-5 sm:py-3">{row.label}</div>
              <div className="min-w-0 wrap-break-word px-4 pb-3 pt-0 font-medium text-gray-900 sm:px-5 sm:py-3">{row.value || "-"}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
