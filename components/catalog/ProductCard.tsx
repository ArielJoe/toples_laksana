"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductPrice } from "@/types/product";
import {
  getAvailabilityLabel,
  getPrimaryImage,
} from "@/types/product";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, PackageIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ProductPriceDropdown from "@/components/product/ProductPriceDropdown";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (productId: string) => void;
  isComparing?: boolean;
  onInquiryToggle?: (productId: string) => void;
  isInquirySelected?: boolean;
  viewMode?: "grid" | "list";
  onInquirySelect?: (productId: string, unit: "pcs" | "bal" | "", lidColorId?: string, priceTypeId?: string) => void;
  selectedUnit?: "pcs" | "bal" | "";
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
  onInquiryToggle,
  isInquirySelected = false,
  viewMode = "grid",
  onInquirySelect,
  selectedUnit = "",
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist, user, priceTypes, lidColors } = useApp();
  const heroImage = getPrimaryImage(product);
  const productHref = `/products/${product.id}`;
  const wishlisted = isInWishlist(product.id);
  const isList = viewMode === "list";

  const priceRows = (product.prices || []).filter((price) => price.price > 0);
  const lowestPrice = priceRows.reduce<ProductPrice | null>(
    (lowest, price) => (!lowest || price.price < lowest.price ? price : lowest),
    null,
  );
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(lowestPrice);

  // Sync selected price variant with inquiry selections when it changes
  useEffect(() => {
    if (selectedPrice && selectedUnit && onInquirySelect) {
      onInquirySelect(product.id, selectedUnit, selectedPrice.lidColorId, selectedPrice.priceTypeId);
    }
  }, [selectedPrice, selectedUnit, onInquirySelect, product.id]);

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
        "group relative z-10 h-full overflow-hidden rounded-xl border border-border bg-white p-0 transition-colors hover:border-primary-300 hover:bg-secondary-50/40",
        isList ? "flex min-h-36" : "flex flex-col"
      )}
    >
      <Link
        href={productHref}
        onClick={handleInteraction}
        aria-label={`Lihat detail ${product.name}`}
        className="absolute inset-0 z-10 cursor-pointer"
      />
      {/* WhatsApp Selection Checkbox */}
      {onInquiryToggle && (
        <div
          className="absolute top-3 left-3 z-30 flex items-center justify-center p-1"
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
          "absolute top-3 right-3 z-30 flex size-8 items-center justify-center rounded-full border border-border bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer",
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
      <div className={cn("pointer-events-none relative z-20 flex h-full w-full", isList ? "flex-row" : "flex-col")}>
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

          <p className={cn(
            "mt-2 text-[0.65rem] font-bold uppercase tracking-widest",
            product.isAvailable !== false ? "text-emerald-600" : "text-red-500"
          )}>
            {getAvailabilityLabel(product.isAvailable)}
          </p>

          {/* Price Section */}
          <div
            className="mt-auto space-y-1 pt-3 pointer-events-auto relative z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductPriceDropdown
              product={product}
              priceTypes={priceTypes}
              lidColors={lidColors}
              selectedPrice={selectedPrice}
              onSelectPrice={setSelectedPrice}
              fallbackText="Hubungi Kami"
            />
          </div>

          {/* Compare & Inquiry Selector */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <label
              className="pointer-events-auto flex cursor-pointer items-center gap-2 relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                className="size-3.5 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/50 rounded-sm"
                checked={isComparing}
                onCheckedChange={() => onCompareToggle?.(product.id)}
              />
              <span className="text-xs font-medium text-text-muted">
                Bandingkan
              </span>
            </label>

            {onInquirySelect && (
              <label
                className="pointer-events-auto flex cursor-pointer items-center gap-2 relative z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  className="size-3.5 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/50 rounded-sm data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  checked={!!selectedUnit}
                  onCheckedChange={(checked) => {
                    onInquirySelect(
                      product.id,
                      checked ? "pcs" : "",
                      selectedPrice?.lidColorId,
                      selectedPrice?.priceTypeId
                    );
                  }}
                />
                <span className="text-xs font-medium text-text-muted">
                  Tanya
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
