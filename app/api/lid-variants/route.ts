import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LidVariant from "@/models/LidVariant";

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function GET() {
  try {
    await connectDB();
    const items = await LidVariant.find().sort({ name: 1 }).lean();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[API] GET /api/lid-variants error:", error);
    return NextResponse.json({ error: "Failed to fetch lid variants" }, { status: 500 });
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

    const item = await LidVariant.create(body);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/lid-variants error:", error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "ID or name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create lid variant" }, { status: 500 });
  }
}
