"use client";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import type { Product, ProductPrice } from "@/types/product";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PriceLookupItem {
  id: string;
  name?: string;
  color?: string;
  colorCode?: string;
  hex?: string;
}

interface ProductPriceDropdownProps {
  product: Product;
  priceTypes: PriceLookupItem[];
  lidColors: PriceLookupItem[];
  selectedPrice?: ProductPrice | null;
  onSelectPrice?: (price: ProductPrice) => void;
  className?: string;
  fallbackText?: string;
}

function cleanLabel(value?: string) {
  return (value || "-").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPriceTypeLabel(price: ProductPrice, priceTypeMap: Map<string, PriceLookupItem>) {
  return price.priceTypeName || priceTypeMap.get(price.priceTypeId)?.name || cleanLabel(price.priceTypeId);
}

function getLidColorLabel(price: ProductPrice, lidColorMap: Map<string, PriceLookupItem>) {
  const color = lidColorMap.get(price.lidColorId);
  return price.lidColorName || color?.name || color?.color || cleanLabel(price.lidColorId);
}

function getLidColorHex(price: ProductPrice, lidColorMap: Map<string, PriceLookupItem>) {
  const color = lidColorMap.get(price.lidColorId);
  return price.lidColorHex || color?.colorCode || color?.hex || "#E5E7EB";
}

export default function ProductPriceDropdown({
  product,
  priceTypes,
  lidColors,
  selectedPrice,
  onSelectPrice,
  className,
  fallbackText,
}: ProductPriceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceTypeMap = new Map(priceTypes.map((item) => [item.id, item]));
  const lidColorMap = new Map(lidColors.map((item) => [item.id, item]));
  const priceRows = (product.prices || []).filter((price) => price.price > 0);
  const lowestPrice = priceRows.reduce<ProductPrice | null>(
    (lowest, price) => (!lowest || price.price < lowest.price ? price : lowest),
    null,
  );

  const activePrice = selectedPrice || lowestPrice;

  const openMenu = (pointerType?: string) => {
    if (pointerType && pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const closeMenu = (pointerType?: string) => {
    if (pointerType && pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setIsOpen(false), 60);
  };

  if (priceRows.length === 0 || !activePrice) {
    return (
      <span className={cn("text-xs font-black text-text-muted", className)}>
        {fallbackText || "Belum ada harga"}
      </span>
    );
  }

  const colorHex = getLidColorHex(activePrice, lidColorMap);
  const colorLabel = getLidColorLabel(activePrice, lidColorMap);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        type="button"
        onPointerEnter={(event) => openMenu(event.pointerType)}
        onPointerLeave={(event) => closeMenu(event.pointerType)}
        className={cn(
          "inline-flex max-w-full items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-1.5 text-left transition-all hover:border-primary-200 hover:bg-primary-50 focus-visible:border-primary-500 focus-visible:outline-none data-[state=open]:border-primary-200 data-[state=open]:bg-primary-50 cursor-pointer",
          className,
        )}
      >
        <span className="min-w-0">
          <span className="block text-xs font-black leading-none text-text-primary">
            {formatPrice(activePrice.price)}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-wider text-text-muted">
            <span
              className="size-2 rounded-full border border-border shrink-0"
              style={{ backgroundColor: colorHex }}
            />
            <span className="truncate max-w-22.5">{colorLabel}</span>
            <span className="shrink-0">•</span>
            <span className="shrink-0">{priceRows.length} varian</span>
          </span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        onPointerEnter={(event) => openMenu(event.pointerType)}
        onPointerLeave={(event) => closeMenu(event.pointerType)}
        className="w-80 border border-slate-200 bg-white p-2 shadow-xl shadow-black/10 rounded-2xl ring-0 z-50"
      >
        <div className="px-2 pb-1">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-text-muted">
            Varian Harga
          </p>
        </div>
        <div className="max-h-72 space-y-1 overflow-y-auto">
          {priceRows.map((price, index) => {
            const quantity = price.quantity || 1;
            const rowColorHex = getLidColorHex(price, lidColorMap);
            const isSelected = activePrice &&
              activePrice.priceTypeId === price.priceTypeId &&
              activePrice.lidColorId === price.lidColorId;

            return (
              <button
                type="button"
                key={`${price.priceTypeId}-${price.lidColorId}-${index}`}
                onClick={() => {
                  onSelectPrice?.(price);
                  setIsOpen(false);
                }}
                className={cn(
                  "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50 transition-colors border border-transparent bg-transparent cursor-pointer outline-none",
                  isSelected && "bg-primary-50/50 hover:bg-primary-100/50 border-primary-200"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-text-primary">
                    {getPriceTypeLabel(price, priceTypeMap)}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-wider text-text-muted">
                    <span
                      className="size-2.5 rounded-full border border-border"
                      style={{ backgroundColor: rowColorHex }}
                    />
                    <span className="truncate">{getLidColorLabel(price, lidColorMap)}</span>
                    <span>/</span>
                    <span>{quantity} pcs</span>
                  </div>
                </div>
                <p className="whitespace-nowrap text-right text-xs font-black text-primary-600">
                  {formatPrice(price.price)}
                </p>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
