import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Material from "@/models/Material";

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function GET() {
  try {
    await connectDB();
    const items = await Material.find().sort({ name: 1 }).lean();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[API] GET /api/materials error:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
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

    const item = await Material.create(body);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/materials error:", error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ error: "ID or name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
