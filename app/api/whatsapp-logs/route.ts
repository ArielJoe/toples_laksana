import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import WhatsAppLogModel from "@/models/WhatsAppLog";
import User from "@/models/User";

interface WhatsAppLogDetailPayload {
  productId?: string;
  lidColorId?: string;
  unit?: string;
  quantity?: number;
  priceAtThatTime?: number;
}

interface NormalizedWhatsAppLogDetail {
  productId: string;
  lidColorId: string | null;
  unit: string;
  quantity: number;
  priceAtThatTime: number;
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const detailPayloads: WhatsAppLogDetailPayload[] = Array.isArray(body.details)
      ? body.details
      : [];
    const details: NormalizedWhatsAppLogDetail[] = detailPayloads
          .map((detail: WhatsAppLogDetailPayload) => ({
            productId: detail.productId || "",
            lidColorId: detail.lidColorId || null,
            unit: detail.unit || "pcs",
            quantity: Math.max(1, toNumber(detail.quantity)),
            priceAtThatTime: toNumber(detail.priceAtThatTime),
          }))
          .filter((detail) => detail.productId);

    if (details.length === 0) {
      return NextResponse.json({ error: "Missing WhatsApp log details" }, { status: 400 });
    }

    let resolvedUserId = "guest";
    const rawUserId = body.userId;
    if (typeof rawUserId === "string" && rawUserId.includes("@")) {
      const user = await User.findOrCreateByEmail(rawUserId);
      resolvedUserId = user.id;
    }

    const log = await WhatsAppLogModel.create({
      id: crypto.randomUUID(),
      userId: resolvedUserId,
      grandTotal: toNumber(body.grandTotal),
      details,
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error("Error creating WhatsApp log:", error);
    return NextResponse.json({ error: "Failed to create WhatsApp log" }, { status: 500 });
  }
}
