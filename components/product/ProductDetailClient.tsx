"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product, ProductPrice } from "@/types/product";
import {
  getCategoryLabel,
  getLidColorLabel,
  getPricesByType,
  getProductTypeLabel,
  getSpecValue,
  PRICE_TYPE_IDS,
} from "@/types/product";
import { calculatePrice, formatPrice, getWholesaleNudge } from "@/lib/price-calculator";
import { buildBulkInquiryUrl, buildWhatsAppUrl } from "@/lib/whatsapp-builder";
import { COLOR_SWATCHES } from "@/lib/use-case-config";
import { Tag } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
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

  const images = [{ imageUrl: "/toples.png", isPrimary: true, order: 0 }];
  const heroImage = "/toples.png";
  const volume = getSpecValue(product, "volume_ml");
  const height = getSpecValue(product, "tinggi_cm");
  const diameter = getSpecValue(product, "diameter_badan_cm");
  const weight = getSpecValue(product, "berat_total_gr");
  const category = getCategoryLabel(product.categoryId);
  const selectedColor = getLidColorLabel(activePrice?.lidColorId);

  return (
    <main className="pb-20 pt-12 max-w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center flex-wrap gap-1 text-sm text-gray-400 font-medium">
        <Link className="hover:text-primary-500 transition-colors" href="/">Beranda</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary-500 transition-colors" href="/catalog">Katalog</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary-500 transition-colors" href={`/catalog?category=${product.categoryId}`}>
          {category}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-gray-900 font-semibold truncate max-w-[220px]">{product.name}</span>
      </nav>

      {/* Main Grid: Image Left + Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white border border-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center p-8">
            {heroImage ? (
              <img
                alt={product.name}
                className="max-w-full max-h-full object-contain scale-75"
                src={heroImage}
              />
            ) : (
              <span className="material-symbols-outlined text-8xl text-gray-200">inventory_2</span>
            )}

            {/* Prev/Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setMainImage(Math.max(0, mainImage - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                  onClick={() => setMainImage(Math.min(images.length - 1, mainImage + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
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
                  className={`w-16 h-16 bg-white border rounded-lg p-1 overflow-hidden transition-all ${i === mainImage ? "border-primary-500 ring-1 ring-primary-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <img alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain scale-75" src={image.imageUrl} />
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
            <span>Availability: <span className="text-gray-900">In Stock</span></span>
          </div>
          <p className="text-sm text-gray-400 mb-4">Product Type: {category}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {calcResult.pricePerPcs > 0 ? formatPrice(calcResult.pricePerPcs) : "Hubungi Kami"}
            </span>
            {calcResult.pricePerPcs > 0 && <span className="text-sm text-gray-400">/pcs</span>}
          </div>

          {/* Pricing mode toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6 w-fit">
            <button
              onClick={() => { setPricingMode("retail"); setQuantity(1); }}
              className={`px-5 py-2 text-sm font-medium transition-all ${pricingMode === "retail" ? "bg-primary-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              Ecer
            </button>
            <button
              disabled={!wholesalePrice}
              onClick={() => { setPricingMode("wholesale"); setQuantity(1); }}
              className={`px-5 py-2 text-sm font-medium transition-all disabled:opacity-40 ${pricingMode === "wholesale" ? "bg-primary-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
                Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
                <span
                  className="w-4 h-4 rounded-full border border-border inline-block shadow-sm"
                  style={{ backgroundColor: COLOR_SWATCHES[activePrice?.lidColorId] || "#ccc" }}
                />
              </p>
              <div className="flex flex-wrap gap-2">
                {priceOptions.map((price, i) => {
                  const colorLabel = getLidColorLabel(price.lidColorId);
                  const hex = COLOR_SWATCHES[price.lidColorId] || "#ccc";
                  return (
                    <button
                      key={`${price.lidColorId}-${price.priceTypeId}`}
                      onClick={() => { setSelectedPriceIdx(i); setQuantity(1); }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${i === selectedPriceIdx
                          ? "ring-2 ring-primary-500 ring-offset-2 border-primary-500"
                          : "border-gray-200 hover:border-gray-400"
                        }`}
                      style={{ backgroundColor: hex }}
                      title={colorLabel}
                    />
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
              { label: "Bahan", value: product.bodyMaterial || "-" },
              { label: "Tutup", value: product.lidType || "-" },
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
                className="w-24 px-3 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
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
            <a
              href={buildWhatsAppUrl(product, safeActivePrice, calcResult)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan via WhatsApp
            </a>
            {quantity >= 5 && pricingMode === "wholesale" && (
              <a
                href={buildBulkInquiryUrl(product, safeActivePrice, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-primary-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <span className="material-symbols-outlined text-lg">request_quote</span>
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
                <span className="material-symbols-outlined text-lg text-gray-400">{item.icon}</span>
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
          activeColorId={activePrice?.lidColorId}
        />
      </div>
    </main>
  );
}

// Separated tab component to keep main component cleaner
function SpecTabs({ product, volume, height, diameter, weight, category, selectedColor, activeColorId }: {
  product: Product; 
  volume?: number; 
  height?: number; 
  diameter?: number; 
  weight?: number; 
  category: string;
  selectedColor: string;
  activeColorId?: string;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {[
            { label: "Tinggi Total", value: height, unit: "cm" },
            { label: "Diameter", value: diameter, unit: "cm" },
            { label: "Berat", value: weight, unit: "gr" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-5 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-gray-900">{item.value || "-"}</span>
              <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "packaging" && (
        <div className="max-w-3xl bg-white p-6 rounded-lg border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3">Pengemasan</h4>
          {(product.packaging || []).length > 0 ? (
            <div className="space-y-3">
              {(product.packaging || []).map((pack, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 text-sm">
                  <span className="text-gray-400">Isi per pack</span>
                  <span className="font-medium">{pack.quantityPerPack} pcs</span>
                  <span className="text-gray-400">Dimensi</span>
                  <span className="font-medium">{pack.lengthCm || "-"} x {pack.widthCm || "-"} x {pack.heightCm || "-"} cm</span>
                  <span className="text-gray-400">Berat</span>
                  <span className="font-medium">{pack.weightKg || "-"} kg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Informasi pengemasan belum tersedia.</p>
          )}
        </div>
      )}

      {activeTab === "specs" && (
        <div className="max-w-3xl overflow-hidden rounded-lg border border-gray-100">
          {[
            { label: "SKU", value: product.sku },
            { label: "Kategori", value: category },
            { label: "Tipe Produk", value: getProductTypeLabel(product.productTypeId) },
            { label: "Material Badan", value: product.bodyMaterial },
            { label: "Material Tutup", value: product.lidMaterial },
            { label: "Varian Tutup", value: product.lidVariant },
            { label: "Tipe Tutup", value: product.lidType },
            { 
              label: "Warna Tutup", 
              value: (
                <div className="flex items-center gap-2">
                  <span>{selectedColor}</span>
                  <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ backgroundColor: COLOR_SWATCHES[activeColorId || ""] || "#ccc" }} />
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
