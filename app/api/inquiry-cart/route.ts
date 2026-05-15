import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InquiryCart from "@/models/InquiryCart";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = request.nextUrl.searchParams.get("userId");
    const status = request.nextUrl.searchParams.get("status") || "draft";

    if (!userId) {
      return NextResponse.json({ error: "Missing required query param (userId)" }, { status: 400 });
    }

    const cart = await InquiryCart.findOne({ userId, status }).lean();
    return NextResponse.json({ data: cart });
  } catch (error) {
    console.error("[API] GET /api/inquiry-cart error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiry cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ error: "Missing required field (userId)" }, { status: 400 });
    }

    const cart = await InquiryCart.findOneAndUpdate(
      { userId: body.userId, status: body.status || "draft" },
      {
        $set: {
          items: body.items || [],
          status: body.status || "draft",
        },
        $setOnInsert: {
          id: body.id || crypto.randomUUID(),
          userId: body.userId,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({ data: cart });
  } catch (error) {
    console.error("[API] POST /api/inquiry-cart error:", error);
    return NextResponse.json({ error: "Failed to save inquiry cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const userId = request.nextUrl.searchParams.get("userId");
    const status = request.nextUrl.searchParams.get("status") || "draft";

    if (!userId) {
      return NextResponse.json({ error: "Missing required query param (userId)" }, { status: 400 });
    }

    await InquiryCart.findOneAndUpdate(
      { userId, status },
      { $set: { items: [] } },
      { new: true }
    );

    return NextResponse.json({ message: "Inquiry cart cleared successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/inquiry-cart error:", error);
    return NextResponse.json({ error: "Failed to clear inquiry cart" }, { status: 500 });
  }
}
