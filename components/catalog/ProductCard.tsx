"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  getAvailabilityLabel,
  getLowestRetailPrice,
  getLowestWholesalePrice,
  getPrimaryImage,
  getSpecValue,
} from "@/types/product";
import { formatPrice } from "@/lib/price-calculator";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, PackageIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (productId: string) => void;
  isComparing?: boolean;
  onInquiryToggle?: (productId: string) => void;
  isInquirySelected?: boolean;
  priceType?: string[];
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
  onInquiryToggle,
  isInquirySelected = false,
  priceType,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useApp();
  const volume = getSpecValue(product, "volume_ml");
  const heroImage = getPrimaryImage(product);
  const productHref = `/products/${product.id}`;
  const wishlisted = isInWishlist(product.id);

  const handleInteraction = async () => {
    try {
      await fetch(`/api/products/${product.id}/interact`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg border border-border bg-card py-0 transition-all duration-300">
      {/* WhatsApp Selection Checkbox */}
      {onInquiryToggle && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center justify-center p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            className="size-5 rounded border border-border bg-white data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            checked={isInquirySelected}
            onCheckedChange={() => onInquiryToggle?.(product.id)}
          />
        </div>
      )}
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={cn(
          "absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full border border-border bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer",
          wishlisted && "text-red-500 border-red-100 bg-red-50"
        )}
        title={wishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
      >
        <Heart
          className={cn(
            "size-4 transition-transform",
            wishlisted ? "fill-red-500 text-red-500 scale-110" : ""
          )}
        />
      </button>
      {/* Image Section */}
      <Link
        href={productHref}
        onClick={handleInteraction}
        className="relative block aspect-square overflow-hidden bg-white p-6 cursor-pointer"
      >
        {heroImage ? (
          <div className="relative w-full h-full transform transition-transform duration-500 scale-75 group-hover:scale-90">
            <Image
              alt={product.name}
              fill
              className="object-contain"
              src={heroImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageIcon className="size-14 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-50">
        {/* Product Name */}
        <Link href={productHref} onClick={handleInteraction} className="block mb-2 cursor-pointer">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Volume */}
        {volume && (
          <p className="text-xs text-gray-400 mb-2">{volume}ml</p>
        )}

        <p className={`mb-2 text-[0.65rem] font-bold uppercase tracking-widest ${product.isAvailable !== false ? "text-emerald-600" : "text-red-500"}`}>
          {getAvailabilityLabel(product.isAvailable)}
        </p>

        {/* Price Section */}
        <div className="space-y-1 mt-2 mb-2">
          {(() => {
            const priceTypes = priceType || [];
            const onlyWholesale = priceTypes.length === 1 && priceTypes.includes("ptype_004");
            const onlyRetail = priceTypes.length === 1 && priceTypes.includes("ptype_001");
            const showBoth = priceTypes.length === 2 || priceTypes.length === 0;

            const retailPrice = getLowestRetailPrice(product);
            const wholesalePrice = getLowestWholesalePrice(product);

            if (onlyWholesale && wholesalePrice > 0) {
              return (
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(wholesalePrice)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">/ bal</span>
                </div>
              );
            }
            if (onlyRetail && retailPrice > 0) {
              return (
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(retailPrice)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">/ pcs</span>
                </div>
              );
            }
            if (showBoth) {
              return (
                <div className="space-y-0.5">
                  {retailPrice > 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold text-gray-900">
                        {formatPrice(retailPrice)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">/ pcs</span>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-gray-900">Hubungi Kami</div>
                  )}
                  {wholesalePrice > 0 && (
                    <div className="text-[10px] text-primary-600 font-black tracking-wide">
                      Grosir: {formatPrice(wholesalePrice)} <span className="text-text-muted font-medium">/ bal</span>
                    </div>
                  )}
                </div>
              );
            }
            return <div className="text-sm font-bold text-gray-900">Hubungi Kami</div>;
          })()}
        </div>

        {/* Compare */}
        <div className="mt-3 flex items-center">
          <label
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              className="size-3.5 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
              checked={isComparing}
              onCheckedChange={() => onCompareToggle?.(product.id)}
            />
            <span className="text-xs text-gray-400 font-medium">
              Bandingkan
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
}
