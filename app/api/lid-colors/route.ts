import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LidColor from "@/models/LidColor";

export async function GET() {
  try {
    await connectDB();
    const items = await LidColor.find().sort({ color: 1 }).lean();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[API] GET /api/lid-colors error:", error);
    return NextResponse.json({ error: "Failed to fetch lid colors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id || !body.color) {
      return NextResponse.json(
        { error: "Missing required fields (id, color)" },
        { status: 400 }
      );
    }

    const item = await LidColor.create(body);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/lid-colors error:", error);
    const isDuplicateKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000;

    if (isDuplicateKeyError) {
      return NextResponse.json({ error: "ID or color already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create lid color" }, { status: 500 });
  }
}
