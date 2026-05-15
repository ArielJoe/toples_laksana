import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LidColor from "@/models/LidColor";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = await params;

    const item = await LidColor.findOneAndUpdate({ id }, body, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: "Lid color not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[API] PATCH /api/lid-colors/[id] error:", error);
    return NextResponse.json({ error: "Failed to update lid color" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await LidColor.findOneAndDelete({ id });
    if (!item) {
      return NextResponse.json({ error: "Lid color not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lid color deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/lid-colors/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete lid color" }, { status: 500 });
  }
}
