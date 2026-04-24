/**
 * GET /api/products
 * Fetches a list of products with support for advanced filtering, text search, and pagination.
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const sort = searchParams.get("sort") || "popular";
    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("category");
    const tags = searchParams.getAll("tags");
    const materialBody = searchParams.getAll("material_body");
    const lidType = searchParams.getAll("lid_type");
    const colors = searchParams.getAll("colors");
    const volumeMin = searchParams.get("volume_min");
    const volumeMax = searchParams.get("volume_max");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");

    // Build MongoDB query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { is_active: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }

    // Use-case tags filter
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Material body filter
    if (materialBody.length > 0) {
      filter["materials.body"] = { $in: materialBody };
    }

    // Lid type filter
    if (lidType.length > 0) {
      filter["materials.lid_type"] = { $in: lidType };
    }

    // Color filter (across variants)
    if (colors.length > 0) {
      filter["variants.color"] = { $in: colors };
    }

    // Volume range filter (via specifications Attribute Pattern)
    if (volumeMin || volumeMax) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const volumeMatch: Record<string, any> = { key: "volume_ml" };
      if (volumeMin) volumeMatch.value = { ...volumeMatch.value, $gte: parseInt(volumeMin) };
      if (volumeMax) volumeMatch.value = { ...volumeMatch.value, $lte: parseInt(volumeMax) };
      filter.specifications = { $elemMatch: volumeMatch };
    }

    // Price range filter (retail price of first variant)
    if (priceMin || priceMax) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceMatch: Record<string, any> = {};
      if (priceMin) priceMatch.$gte = parseInt(priceMin);
      if (priceMax) priceMatch.$lte = parseInt(priceMax);
      filter["variants.pricing.retail.price"] = priceMatch;
    }

    // Determine sort order
    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price_asc":
        sortQuery = { "variants.0.pricing.retail.price": 1 };
        break;
      case "price_desc":
        sortQuery = { "variants.0.pricing.retail.price": -1 };
        break;
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      case "popular":
      default:
        sortQuery = { interaction_count: -1, createdAt: -1 };
        break;
    }

    // ---- Execute Query ----
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
