import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import LidVariant from "@/models/LidVariant";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await LidVariant.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) {
      return NextResponse.json({ error: "Lid variant not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/lid-variants/[id] error:", error);
    return NextResponse.json({ error: "Failed to update lid variant" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await LidVariant.findOne({ id }).lean();
    if (!item) {
      return NextResponse.json({ error: "Lid variant not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({ lidVariant: id });
    if (productCount > 0) {
      return masterDataInUseResponse("Variasi tutup", productCount);
    }

    await LidVariant.deleteOne({ id });

    return NextResponse.json({ message: "Lid variant deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/lid-variants/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete lid variant" }, { status: 500 });
  }
}
