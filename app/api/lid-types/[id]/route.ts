import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import LidType from "@/models/LidType";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await LidType.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) {
      return NextResponse.json({ error: "Lid type not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/lid-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to update lid type" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await LidType.findOne({ id }).lean();
    if (!item) {
      return NextResponse.json({ error: "Lid type not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({ lidType: id });
    if (productCount > 0) {
      return masterDataInUseResponse("Tipe tutup", productCount);
    }

    await LidType.deleteOne({ id });

    return NextResponse.json({ message: "Lid type deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/lid-types/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete lid type" }, { status: 500 });
  }
}
