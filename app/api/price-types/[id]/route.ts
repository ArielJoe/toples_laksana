import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import PriceType from "@/models/PriceType";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await PriceType.findOneAndUpdate({ id }, body, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: "Price type not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/price-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to update price type" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await PriceType.findOne({ id }).lean();
    if (!item) {
      return NextResponse.json({ error: "Price type not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({ "prices.priceTypeId": id });
    if (productCount > 0) {
      return masterDataInUseResponse("Tipe harga", productCount);
    }

    await PriceType.deleteOne({ id });

    return NextResponse.json({ message: "Price type deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/price-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete price type" }, { status: 500 });
  }
}
