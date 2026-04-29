"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  getLowestRetailPrice,
  getPrimaryImage,
  getSpecValue,
} from "@/types/product";
import { formatPrice } from "@/lib/price-calculator";

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
    <div className="group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 rounded-lg">
      {/* Image Section */}
      <Link
        href={productHref}
        onClick={handleInteraction}
        className="block aspect-square relative bg-white overflow-hidden p-6"
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
            <span className="material-symbols-outlined text-6xl text-gray-200">
              inventory_2
            </span>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-50">
        {/* Product Name */}
        <Link href={productHref} onClick={handleInteraction} className="block mb-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Volume */}
        {volume && (
          <p className="text-xs text-gray-400 mb-2">{volume}ml</p>
        )}

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
            <input
              className="w-3.5 h-3.5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
              type="checkbox"
              checked={isComparing}
              onChange={() => onCompareToggle?.(product.id)}
            />
            <span className="text-xs text-gray-400 font-medium">
              Bandingkan
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
