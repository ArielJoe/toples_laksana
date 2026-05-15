"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  getAvailabilityLabel,
  getLowestRetailPrice,
  getPrimaryImage,
  getSpecValue,
} from "@/types/product";
import { formatPrice } from "@/lib/price-calculator";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PackageIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (productId: string) => void;
  isComparing?: boolean;
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
}: ProductCardProps) {
  const volume = getSpecValue(product, "volume_ml");
  const retailPrice = getLowestRetailPrice(product);
  const heroImage = getPrimaryImage(product);
  const productHref = `/products/${product.id}`;

  const handleInteraction = async () => {
    try {
      await fetch(`/api/products/${product.id}/interact`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg border border-border bg-card py-0 transition-all duration-300">
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

        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-emerald-600">
          {getAvailabilityLabel(product.availabilityStatus)}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-gray-900">
            {retailPrice > 0 ? formatPrice(retailPrice) : "Hubungi Kami"}
          </span>
        </div>

        {/* Compare */}
        <div className="mt-3 flex items-center">
          <label
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              className="size-3.5"
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
