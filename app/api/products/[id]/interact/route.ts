import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Interaction from "@/models/Interaction";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findOne({
      deletedAt: null,
      $or: [{ id }, { sku: id }],
    }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await Interaction.create({
      id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: "guest",
      productId: product.id,
      interactionType: "detail_click",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Interaction Tracking Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
