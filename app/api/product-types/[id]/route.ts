import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import ProductType from "@/models/ProductType";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await ProductType.findOneAndUpdate({ id }, body, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: "Product type not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/product-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product type" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await ProductType.findOne({ id }).lean();
    if (!item) {
      return NextResponse.json({ error: "Product type not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({ productTypeId: id });
    if (productCount > 0) {
      return masterDataInUseResponse("Tipe produk", productCount);
    }

    await ProductType.deleteOne({ id });

    return NextResponse.json({ message: "Product type deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/product-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product type" }, { status: 500 });
  }
}
