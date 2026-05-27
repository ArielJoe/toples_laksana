import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import Material from "@/models/Material";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await Material.findOneAndUpdate({ id }, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/materials/[id] error:", error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await Material.findOne({ id }).lean();
    if (!item) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({
      $or: [{ bodyMaterial: id }, { lidMaterial: id }],
    });
    if (productCount > 0) {
      return masterDataInUseResponse("Bahan produk", productCount);
    }

    await Material.deleteOne({ id });

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/materials/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
