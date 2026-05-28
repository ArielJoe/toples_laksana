import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";

interface ProductImage {
  imageUrl?: string;
  isPrimary?: boolean;
}

interface ProductPrice {
  price?: number;
}

interface TrendingProductDocument {
  id: string;
  name: string;
  images?: ProductImage[];
  prices?: ProductPrice[];
}

function formatPrice(price: number) {
  if (!price) return "Hubungi Kami";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\u00a0/g, " ");
}

function getPrimaryImage(product: TrendingProductDocument) {
  const images = product.images || [];
  if (images.length === 0) return "/toples.png";

  return (
    images.find((image) => image.isPrimary)?.imageUrl ||
    images[0]?.imageUrl ||
    "/toples.png"
  );
}

function getLowestPrice(product: TrendingProductDocument) {
  const prices = (product.prices || [])
    .map((price) => price.price)
    .filter((price): price is number => typeof price === "number" && price > 0);

  return prices.length > 0 ? Math.min(...prices) : 0;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 4, 1), 12);
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const groupedInteractions = await InteractionModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          interactionType: "detail_click",
          productId: { $type: "string", $ne: "" },
          createdAt: { $gte: since },
        },
      },
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: limit },
    ]);

    const productIds = groupedInteractions.map((item) => item._id);
    const products = await ProductModel.find({
      id: { $in: productIds },
      deletedAt: null,
    })
      .select("id name images prices")
      .lean<TrendingProductDocument[]>();

    const productById = new Map(products.map((product) => [product.id, product]));
    const data = groupedInteractions
      .map((item) => {
        const product = productById.get(item._id);
        if (!product) return null;

        return {
          id: product.id,
          name: product.name,
          price: formatPrice(getLowestPrice(product)),
          img: getPrimaryImage(product),
          clickCount: item.count,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 },
    );
  }
}
