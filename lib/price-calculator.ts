import type { ProductPrice } from "@/types/product";
import { PRICE_TYPE_IDS } from "@/types/product";

export type PricingMode = "retail" | "wholesale";

export interface CalculatorState {
  selectedPrice: ProductPrice;
  retailPrice?: ProductPrice;
  quantity: number;
  mode: PricingMode;
  quantityPerPack?: number;
}

export interface CalculatorResult {
  quantity: number;
  totalPcs: number;
  pricePerPcs: number;
  subtotal: number;
  savingsVsRetail: number;
  savingsPercentage: number;
  unitLabel: string;
  totalPerUnit: number;
}

export interface WholesaleNudge {
  message: string;
  savings: number;
  percentage: number;
}

export function calculatePrice(state: CalculatorState): CalculatorResult {
  const quantityPerPack = state.quantityPerPack || 1;
  const isWholesale = state.mode === "wholesale" || state.selectedPrice.priceTypeId === PRICE_TYPE_IDS.perBal;
  const totalPcs = isWholesale ? state.quantity * quantityPerPack : state.quantity;
  const pricePerPcs = isWholesale && quantityPerPack > 1
    ? Math.round(state.selectedPrice.price / quantityPerPack)
    : state.selectedPrice.price;
  const subtotal = isWholesale ? state.selectedPrice.price * state.quantity : pricePerPcs * state.quantity;
  const retailEquivalent = state.retailPrice ? state.retailPrice.price * totalPcs : subtotal;
  const savingsVsRetail = Math.max(0, retailEquivalent - subtotal);

  return {
    quantity: state.quantity,
    totalPcs,
    pricePerPcs,
    subtotal,
    savingsVsRetail,
    savingsPercentage: retailEquivalent > 0
      ? Math.round((savingsVsRetail / retailEquivalent) * 100)
      : 0,
    unitLabel: isWholesale ? "bal" : "pcs",
    totalPerUnit: isWholesale ? state.selectedPrice.price : pricePerPcs,
  };
}

export function getWholesaleNudge(
  wholesalePrice: ProductPrice,
  retailPrice?: ProductPrice,
  quantityPerPack = 1
): WholesaleNudge | null {
  if (!retailPrice || quantityPerPack <= 1) return null;

  const retailEquivalent = retailPrice.price * quantityPerPack;
  const savings = retailEquivalent - wholesalePrice.price;

  if (savings <= 0) return null;

  return {
    message: `Beli 1 bal (${quantityPerPack} pcs) - hemat Rp ${savings.toLocaleString("id-ID")}!`,
    savings,
    percentage: Math.round((savings / retailEquivalent) * 100),
  };
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUnitType(unitType: string): string {
  return unitType.charAt(0).toUpperCase() + unitType.slice(1);
}
