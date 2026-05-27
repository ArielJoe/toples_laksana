import { NextResponse } from "next/server";

import Product from "@/models/Product";

type ProductReferenceFilter = Record<string, unknown>;

export async function countProductsUsingMasterData(filter: ProductReferenceFilter) {
  return Product.countDocuments(filter);
}

export function masterDataInUseResponse(label: string, productCount: number) {
  return NextResponse.json(
    {
      code: "MASTER_DATA_IN_USE",
      error: `${label} masih terikat pada ${productCount} produk dan tidak bisa dihapus.`,
      productCount,
    },
    { status: 409 }
  );
}
