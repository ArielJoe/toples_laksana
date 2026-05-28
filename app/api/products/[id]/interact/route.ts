import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Interaction from "@/models/Interaction";
import User from "@/models/User";

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

    let resolvedUserId = "guest";
    const rawUserId = body.userId;
    if (typeof rawUserId === "string" && rawUserId.includes("@")) {
      const user = await User.findOrCreateByEmail(rawUserId);
      resolvedUserId = user.id;
    }

    await Interaction.create({
      id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: resolvedUserId,
      productId: product.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[API] POST /api/products/[id]/interact error:", error);
    const message = error instanceof Error ? error.message : "Failed to track interaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
