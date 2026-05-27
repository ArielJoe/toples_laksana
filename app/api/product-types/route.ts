import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProductType from "@/models/ProductType";

export async function GET() {
  try {
    await connectDB();
    const items = await ProductType.find().sort({ name: 1 }).lean();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[API] GET /api/product-types error:", error);
    return NextResponse.json({ error: "Failed to fetch product types" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields (id, name)" },
        { status: 400 }
      );
    }

    const item = await ProductType.create(body);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/product-types error:", error);
    const isDuplicateKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000;

    if (isDuplicateKeyError) {
      return NextResponse.json({ error: "ID or name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product type" }, { status: 500 });
  }
}
