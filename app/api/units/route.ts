import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Unit from "@/models/Unit";

export async function GET() {
  try {
    await connectDB();
    const items = await Unit.find().sort({ name: 1 }).lean();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[API] GET /api/units error:", error);
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id || !body.name || !body.symbol) {
      return NextResponse.json(
        { error: "Missing required fields (id, name, symbol)" },
        { status: 400 }
      );
    }

    const item = await Unit.create(body);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/units error:", error);
    const isDuplicateKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000;

    if (isDuplicateKeyError) {
      return NextResponse.json({ error: "ID or name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }
}
