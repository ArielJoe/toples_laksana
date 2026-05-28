"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/price-calculator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export interface ComparePriceOption {
  lidColorId: string;
  priceTypeId: string;
  price: number;
  quantity: number;
  lidColorName: string;
  lidColorHex: string;
  priceTypeName: string;
}

interface ComparePriceSelectorProps {
  options: ComparePriceOption[];
  className?: string;
  fallbackText?: string;
}

export default function ComparePriceSelector({
  options,
  className,
  fallbackText = "Hubungi Kami",
}: ComparePriceSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!options || options.length === 0) {
    return (
      <div className={cn("py-4 text-center", className)}>
        <span className="text-sm font-black text-text-muted">{fallbackText}</span>
      </div>
    );
  }

  const selected = options[selectedIndex] || options[0];

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <Select
        value={String(selectedIndex)}
        onValueChange={(val) => setSelectedIndex(Number(val))}
      >
        <SelectTrigger className="w-full h-auto py-2 px-3 border border-border bg-slate-50/50 hover:bg-slate-50 hover:border-primary-200 transition-all rounded-xl flex items-center justify-between text-left cursor-pointer select-none">
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-black text-text-secondary uppercase tracking-widest leading-none">Pilih Varian:</span>
            <span className="block text-xs font-bold text-text-primary truncate mt-1">
              {selected.priceTypeName} ({selected.lidColorName})
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="w-64 max-h-60 bg-white border border-border shadow-xl rounded-xl z-50">
          {options.map((opt, idx) => (
            <SelectItem key={idx} value={String(idx)} className="cursor-pointer">
              <div className="flex flex-col text-left py-0.5">
                <span className="text-xs font-black text-text-primary leading-tight">{opt.priceTypeName}</span>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted mt-1 uppercase leading-none">
                  <span
                    className="size-1.5 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: opt.lidColorHex }}
                  />
                  <span className="truncate">{opt.lidColorName}</span>
                  <span>/</span>
                  <span>{opt.quantity} pcs</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-full text-center sm:text-left p-3.5 rounded-xl border border-primary-100 bg-primary-50/20 flex flex-col transition-all duration-300">
        <span className="text-[9px] font-black text-primary-700 uppercase tracking-widest leading-none">Harga Varian</span>
        <span className="mt-1.5 text-2xl font-black text-primary-600 tracking-tight leading-none">
          {formatPrice(selected.price)}
        </span>
        <span className="text-[9px] font-bold text-primary-400 mt-1 uppercase tracking-wider leading-none">
          Per {selected.quantity} pcs
        </span>
      </div>
    </div>
  );
}
