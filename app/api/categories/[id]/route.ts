import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { countProductsUsingMasterData, masterDataInUseResponse } from "@/lib/master-data-usage";
import Category from "@/models/Category";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const category = await Category.findOneAndUpdate({ id }, body, { new: true }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("[API] PATCH /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findOne({ id }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const productCount = await countProductsUsingMasterData({ categoryId: id });
    if (productCount > 0) {
      return masterDataInUseResponse("Kategori", productCount);
    }

    await Category.deleteOne({ id });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
