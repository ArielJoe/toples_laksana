"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  formatAttributeLabel,
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
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
  onInquiryToggle,
  isInquirySelected = false,
  priceType,
  viewMode = "grid",
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist, user } = useApp();
  const volume = getSpecValue(product, "volume_ml");
  const heroImage = getPrimaryImage(product);
  const productHref = `/products/${product.id}`;
  const wishlisted = isInWishlist(product.id);
  const material = product.bodyMaterialName || formatAttributeLabel(product.bodyMaterial);
  const meta = [
    material && material !== "-" ? material : null,
    volume ? `${volume}ml` : null,
  ].filter(Boolean).join(" • ");
  const isList = viewMode === "list";

  const priceContent = (() => {
    const priceTypes = priceType || [];
    const onlyWholesale = priceTypes.length === 1 && priceTypes.includes("ptype_004");
    const onlyRetail = priceTypes.length === 1 && priceTypes.includes("ptype_001");
    const showBoth = priceTypes.length === 2 || priceTypes.length === 0;

    const retailPrice = getLowestRetailPrice(product);
    const wholesalePrice = getLowestWholesalePrice(product);

    if (onlyWholesale && wholesalePrice > 0) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-text-primary">{formatPrice(wholesalePrice)}</span>
          <span className="text-[10px] font-medium text-text-muted">/ bal</span>
        </div>
      );
    }

    if (onlyRetail && retailPrice > 0) {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-text-primary">{formatPrice(retailPrice)}</span>
          <span className="text-[10px] font-medium text-text-muted">/ pcs</span>
        </div>
      );
    }

    if (showBoth) {
      return (
        <div className="space-y-0.5">
          {retailPrice > 0 ? (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-text-primary">{formatPrice(retailPrice)}</span>
              <span className="text-[10px] font-medium text-text-muted">/ pcs</span>
            </div>
          ) : (
            <div className="text-sm font-bold text-text-primary">Hubungi Kami</div>
          )}
          {wholesalePrice > 0 && (
            <div className="text-[10px] font-black tracking-wide text-primary-600">
              Grosir: {formatPrice(wholesalePrice)} <span className="font-medium text-text-muted">/ bal</span>
            </div>
          )}
        </div>
      );
    }

    return <div className="text-sm font-bold text-text-primary">Hubungi Kami</div>;
  })();

  const handleInteraction = async () => {
    try {
      await fetch(`/api/products/${product.id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.email || "guest" }),
      });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border border-border bg-white p-0 transition-colors hover:border-primary-300 hover:bg-secondary-50/40",
        isList ? "flex min-h-36" : "flex flex-col"
      )}
    >
      <Link
        href={productHref}
        onClick={handleInteraction}
        aria-label={`Lihat detail ${product.name}`}
        className="absolute inset-0 z-0 cursor-pointer"
      />
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
      <div className={cn("pointer-events-none relative z-10 flex h-full w-full", isList ? "flex-row" : "flex-col")}>
        <div
          className={cn(
            "relative block shrink-0 overflow-hidden bg-secondary-50",
            isList ? "h-auto w-30 p-3 sm:size-40 lg:size-44" : "aspect-square w-full p-5"
          )}
        >
          {heroImage ? (
            <div className="relative h-full w-full transform transition-transform duration-500 group-hover:scale-105">
              <Image
                alt={product.name}
                fill
                className="object-contain"
                src={heroImage}
                sizes={isList ? "(max-width: 640px) 100vw, 176px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PackageIcon className="size-14 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={cn(
          "flex min-w-0 flex-1 flex-col border-t border-border/60 px-4 pb-4 pt-3",
          isList && "border-l border-t-0 px-3 py-3 pr-11 sm:px-5 sm:py-4 sm:pr-12"
        )}>
          {/* Product Name */}
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary-500">
              {product.name}
            </h3>
          </div>

          {meta && (
            <p className="mt-2 line-clamp-1 text-xs font-medium text-text-muted">{meta}</p>
          )}

          <p className={cn(
            "mt-2 text-[0.65rem] font-bold uppercase tracking-widest",
            product.isAvailable !== false ? "text-emerald-600" : "text-red-500"
          )}>
            {getAvailabilityLabel(product.isAvailable)}
          </p>

          {/* Price Section */}
          <div className="mt-auto space-y-1 pt-3">
            {priceContent}
          </div>

          {/* Compare */}
          <div className="mt-3 flex items-center">
            <label
              className="pointer-events-auto flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                className="size-3.5 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/50"
                checked={isComparing}
                onCheckedChange={() => onCompareToggle?.(product.id)}
              />
              <span className="text-xs font-medium text-text-muted">
                Bandingkan
              </span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
