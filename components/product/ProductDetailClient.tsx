"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductPrice } from "@/types/product";
import {
  getCategoryLabel,
  getAvailabilityLabel,
  getLidColorLabel,
  getPricesByType,
  getProductTypeLabel,
  getSpecValue,
  formatAttributeLabel,
  PRICE_TYPE_IDS,
} from "@/types/product";
import { calculatePrice, formatPrice, getWholesaleNudge } from "@/lib/price-calculator";
import { buildBulkInquiryUrl, buildWhatsAppUrl } from "@/lib/whatsapp-builder";
import { COLOR_SWATCHES } from "@/lib/use-case-config";
import { Heart, Tag } from "lucide-react";
import { AppIcon } from "@/components/ui/app-icon";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { toggleWishlist, isInWishlist } = useApp();
  const wishlisted = isInWishlist(product.id);
  const retailPrices = getPricesByType(product, PRICE_TYPE_IDS.withLid);
  const fallbackPrices = product.prices || [];
  const priceOptions = retailPrices.length > 0 ? retailPrices : fallbackPrices;
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pricingMode, setPricingMode] = useState<"retail" | "wholesale">("retail");
  const [mainImage, setMainImage] = useState(0);

  const selectedPrice = priceOptions[selectedPriceIdx] || fallbackPrices[0];
  const wholesalePrice = getPricesByType(product, PRICE_TYPE_IDS.perBal).find(
    (price) => price.lidColorId === selectedPrice?.lidColorId
  );
  const activePrice: ProductPrice = pricingMode === "wholesale" && wholesalePrice
    ? wholesalePrice
    : selectedPrice;
  const quantityPerPack = product.packaging?.[0]?.quantityPerPack || 1;

  const safeActivePrice = activePrice || { price: 0, lidColorId: "", priceTypeId: "" } as ProductPrice;
  const safeSelectedPrice = selectedPrice || { price: 0, lidColorId: "", priceTypeId: "" } as ProductPrice;

  const calcResult = useMemo(
    () => calculatePrice({
      selectedPrice: safeActivePrice,
      retailPrice: safeSelectedPrice,
      quantity,
      mode: pricingMode,
      quantityPerPack,
    }),
    [safeActivePrice, safeSelectedPrice, quantity, pricingMode, quantityPerPack]
  );

  const nudge = useMemo(
    () => wholesalePrice ? getWholesaleNudge(wholesalePrice, selectedPrice, quantityPerPack) : null,
    [wholesalePrice, selectedPrice, quantityPerPack]
  );

  const images = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return [{ imageUrl: "/toples.png", isPrimary: true, order: 0 }];
    }
    return [...product.images].sort((a, b) => a.order - b.order);
  }, [product.images]);

  const heroImage = images[mainImage]?.imageUrl || "/toples.png";

  useEffect(() => {
    // Log view interaction on mount
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        interactionType: "view",
      }),
    }).catch(console.error);
  }, [product.id]);

  const handleWhatsAppClick = () => {
    fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        interactionType: "whatsapp_share",
      }),
    }).catch(console.error);
  };
  const volume = getSpecValue(product, "volume_ml");
  const height = getSpecValue(product, "tinggi_cm");
  const diameter = getSpecValue(product, "diameter_badan_cm");
  const weight = getSpecValue(product, "berat_total_gr");
  const category = product.categoryName || getCategoryLabel(product.categoryId);
  const bodyMaterial = product.bodyMaterialName || formatAttributeLabel(product.bodyMaterial);
  const lidMaterial = product.lidMaterialName || formatAttributeLabel(product.lidMaterial);
  const lidVariant = product.lidVariantName || formatAttributeLabel(product.lidVariant);
  const lidType = product.lidTypeName || formatAttributeLabel(product.lidType);
  const selectedColor = activePrice?.lidColorName || getLidColorLabel(activePrice?.lidColorId);
  const selectedColorHex = activePrice?.lidColorHex || COLOR_SWATCHES[activePrice?.lidColorId || ""] || "#ccc";

  return (
    <main className="pb-12 pt-12 max-w-7xl mx-auto px-6 lg:px-12 w-full">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center flex-wrap gap-1 text-sm text-gray-400 font-medium">
        <Link className="hover:text-primary-500 transition-colors" href="/catalog">Katalog</Link>
        <AppIcon name="chevron_right" className="text-xs" />
        <Link className="hover:text-primary-500 transition-colors" href={`/catalog?category=${product.categoryId}`}>
          {category}
        </Link>
        <AppIcon name="chevron_right" className="text-xs" />
        <span className="text-gray-900 font-semibold truncate max-w-[220px]">{product.name}</span>
      </nav>

      {/* Main Grid: Image Left + Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white border border-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
            {heroImage ? (
              <Image
                alt={product.name}
                fill
                className="object-contain scale-75 p-8"
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
            <div className="flex gap-2">
              {images.map((image, i) => (
                <button
                  key={`${image.imageUrl}-${i}`}
                  onClick={() => setMainImage(i)}
                  className={`w-16 h-16 bg-white border rounded-lg p-1 overflow-hidden transition-all cursor-pointer relative ${i === mainImage ? "border-primary-500 border-2" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Image alt={`${product.name} ${i + 1}`} fill className="object-contain scale-75 p-1" src={image.imageUrl} sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div>
          {/* Name & SKU */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span>SKU: {product.sku}</span>
            <span>Availability: <span className="text-gray-900">{getAvailabilityLabel(product.isAvailable)}</span></span>
          </div>
          {product.availabilityNote && (
            <p className="text-sm text-gray-500 mb-4">{product.availabilityNote}</p>
          )}
          <p className="text-sm text-gray-400 mb-4">Product Type: {category}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {calcResult.pricePerPcs > 0 ? formatPrice(calcResult.pricePerPcs) : "Hubungi Kami"}
            </span>
            {calcResult.pricePerPcs > 0 && <span className="text-sm text-gray-400">/pcs</span>}
          </div>

          {/* Pricing mode toggle */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6 w-fit">
            <button
              onClick={() => { setPricingMode("retail"); setQuantity(1); }}
              className={`px-5 py-2 text-sm font-medium transition-all cursor-pointer ${pricingMode === "retail" ? "bg-primary-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              Ecer
            </button>
            <button
              disabled={!wholesalePrice}
              onClick={() => { setPricingMode("wholesale"); setQuantity(1); }}
              className={`px-5 py-2 text-sm font-medium transition-all disabled:opacity-40 cursor-pointer ${pricingMode === "wholesale" ? "bg-primary-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              Per Bal
            </button>
          </div>

          {pricingMode === "wholesale" && nudge && (
            <div className="mb-4 flex items-center gap-2 text-xs">
              <span className="bg-primary-50 text-primary-600 font-semibold px-2 py-1 rounded flex items-center gap-1">
                <Tag size={12} /> Hemat {nudge.percentage}%
              </span>
              <span className="text-gray-400">vs harga ecer</span>
            </div>
          )}

          {/* Color Selection */}
          {priceOptions.length > 1 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                Color: <span className="font-semibold text-gray-900">{selectedColor} <span className="text-xs text-gray-400 font-normal uppercase ml-1">{selectedColorHex}</span></span>
              </p>
              <div className="flex flex-wrap gap-2">
                {priceOptions.map((price, i) => {
                  const colorLabel = price.lidColorName || getLidColorLabel(price.lidColorId);
                  const hex = price.lidColorHex || COLOR_SWATCHES[price.lidColorId] || "#ccc";
                  const isSelected = i === selectedPriceIdx;
                  return (
                    <button
                      key={`${price.lidColorId}-${price.priceTypeId}`}
                      onClick={() => { setSelectedPriceIdx(i); setQuantity(1); }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${isSelected
                          ? "border-2 border-primary-500 scale-110 bg-primary-50 text-primary-700 font-semibold"
                          : "border-gray-200 hover:border-gray-300 text-gray-600 bg-white"
                        }`}
                      title={colorLabel}
                    >
                      <span className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ backgroundColor: hex }} />
                      <span className="text-sm">{colorLabel}</span>
                      <span className="text-xs opacity-50 uppercase">{hex}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
            {[
              { label: "Volume", value: volume ? `${volume}ml` : "-" },
              { label: "Berat", value: weight ? `${weight}gr` : "-" },
              { label: "Bahan", value: bodyMaterial },
              { label: "Tutup", value: lidType },
            ].map((item) => (
              <div className="flex justify-between" key={item.label}>
                <span className="text-gray-400">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Quantity: <span className="text-gray-400">({pricingMode === "wholesale" ? "bal" : "pcs"})</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
                className="w-24 px-3 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-primary-500 transition-all"
              />
            </div>
            {pricingMode === "wholesale" && (
              <p className="text-xs text-gray-400 mt-2">
                1 bal = {quantityPerPack} pcs. Total: <span className="font-semibold text-gray-900">{calcResult.totalPcs.toLocaleString("id-ID")} pcs</span>
              </p>
            )}
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-baseline border-t border-gray-100 pt-4 mb-6">
            <span className="text-sm text-gray-500">Subtotal:</span>
            <span className="text-xl font-bold text-gray-900">
              {calcResult.subtotal > 0 ? formatPrice(calcResult.subtotal) : "-"}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
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
                  "size-12 shrink-0 flex items-center justify-center rounded-xl border border-border bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer",
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
            {quantity >= 5 && pricingMode === "wholesale" && (
              <a
                href={buildBulkInquiryUrl(product, safeActivePrice, quantity)}
                target="_blank"
                rel="noopener noreferrer"
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
      <div className="mt-16">
        <SpecTabs
          product={product}
          volume={volume}
          height={height}
          diameter={diameter}
          weight={weight}
          category={category}
          selectedColor={selectedColor}
          selectedColorHex={selectedColorHex}
          bodyMaterial={bodyMaterial}
          lidMaterial={lidMaterial}
          lidVariant={lidVariant}
          lidType={lidType}
        />
      </div>
    </main>
  );
}

// Separated tab component to keep main component cleaner
function SpecTabs({ product, volume, height, diameter, weight, category, selectedColor, selectedColorHex, bodyMaterial, lidMaterial, lidVariant, lidType }: {
  product: Product;
  volume?: number;
  height?: number;
  diameter?: number;
  weight?: number;
  category: string;
  selectedColor: string;
  selectedColorHex: string;
  bodyMaterial: string;
  lidMaterial: string;
  lidVariant: string;
  lidType: string;
}) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "packaging" | "specs">("dimensions");

  return (
    <>
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: "dimensions" as const, label: "Dimensi Detail" },
          { id: "packaging" as const, label: "Info Pengemasan" },
          { id: "specs" as const, label: "Spesifikasi Lengkap" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? "border-primary-500 text-primary-500" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dimensions" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
          {[
            { label: "Tinggi Total", value: height, unit: "cm" },
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
        <div className="max-w-full bg-white p-6 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Pengemasan</h4>
          {(product.packaging || []).length > 0 ? (
            <div className="space-y-4">
              {(product.packaging || []).map((pack, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-gray-400">Tipe Pengemasan</span>
                  <span className="font-semibold text-primary-600">
                    {pack.quantityPerPack > 1 ? "Bal (Grosir/Box)" : "Ecer (Eceran/Satuan)"}
                  </span>
                  <span className="text-gray-400">Isi per pack</span>
                  <span className="font-medium">{pack.quantityPerPack} pcs</span>
                  <span className="text-gray-400">Dimensi</span>
                  <span className="font-medium">{pack.lengthCm || "-"} x {pack.widthCm || "-"} x {pack.heightCm || "-"} cm</span>
                  <span className="text-gray-400">Berat</span>
                  <span className="font-medium">{pack.weightKg || "-"} kg</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 leading-relaxed space-y-1">
                <span className="font-bold text-gray-700 block mb-1">Catatan Pembelian:</span>
                <p>• Pembelian <strong>Eceran</strong> dikemas per satuan (pcs) dengan pengemasan ecer standar pabrik.</p>
                <p>• Pembelian <strong>Grosir/Bal</strong> dikemas langsung per pack/dus (1 bal = {product.packaging?.[0]?.quantityPerPack || 1} pcs) dari pabrik untuk perlindungan ekstra selama pengiriman.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Informasi pengemasan belum tersedia.</p>
          )}
        </div>
      )}

      {activeTab === "specs" && (
        <div className="max-w-full overflow-hidden rounded-xl border border-gray-100">
          {[
            { label: "SKU", value: product.sku },
            { label: "Kategori", value: category },
            { label: "Tipe Produk", value: getProductTypeLabel(product.productTypeId) },
            { label: "Status Ketersediaan", value: getAvailabilityLabel(product.isAvailable) },
            { label: "Material Badan", value: bodyMaterial },
            { label: "Material Tutup", value: lidMaterial },
            { label: "Varian Tutup", value: lidVariant },
            { label: "Tipe Tutup", value: lidType },
            {
              label: "Warna Tutup",
              value: (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ backgroundColor: selectedColorHex }} />
                  <span>{selectedColor}</span>
                  <span className="text-xs text-gray-400 uppercase">{selectedColorHex}</span>
                </div>
              )
            },
          ].map((row, i) => (
            <div key={row.label} className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <div className="px-5 py-3 text-gray-400 font-medium">{row.label}</div>
              <div className="px-5 py-3 text-gray-900 font-medium">{row.value || "-"}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
