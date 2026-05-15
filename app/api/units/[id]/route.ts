import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Unit from "@/models/Unit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await Unit.findOneAndUpdate({ id }, body, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/units/[id] error:", error);
    return NextResponse.json({ error: "Failed to update unit" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await Unit.findOneAndDelete({ id });
    if (!item) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/units/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete unit" }, { status: 500 });
  }
}
