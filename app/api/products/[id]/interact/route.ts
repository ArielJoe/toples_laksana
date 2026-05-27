import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Interaction from "@/models/Interaction";

function normalizeUserId(userId: unknown) {
  return typeof userId === "string" && userId.includes("@") ? userId : "guest";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const product = await Product.findOne({
      deletedAt: null,
      $or: [{ id }, { sku: id }],
    }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await Interaction.create({
      id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: normalizeUserId(body.userId),
      productId: product.id,
      interactionType: "detail_click",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[API] POST /api/products/[id]/interact error:", error);
    const message = error instanceof Error ? error.message : "Failed to track interaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
