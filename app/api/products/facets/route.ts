import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getCategoryLabel, getLidColorLabel } from "@/types/product";

export async function GET() {
  try {
    await connectDB();

    const activeFilter = { deletedAt: null };

    const [
      categories,
      categoryDocs,
      materials,
      lidTypes,
      colors,
      volumeRange,
      priceRange,
    ] = await Promise.all([
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Category.find().select("id name").lean(),
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$bodyMaterial", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$lidType", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$prices" },
        { $group: { _id: "$prices.lidColorId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: null,
            min: { $min: "$dimension.volumeMl" },
            max: { $max: "$dimension.volumeMl" },
          },
        },
        { $project: { _id: 0 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$prices" },
        {
          $group: {
            _id: null,
            min: { $min: "$prices.price" },
            max: { $max: "$prices.price" },
          },
        },
        { $project: { _id: 0 } },
      ]),
    ]);

    const categoryNames = new Map(categoryDocs.map((category) => [category.id, category.name]));

    return NextResponse.json({
      categories: categories.map((category) => ({
        value: category._id,
        count: category.count,
      })),
      materials: materials.filter((item) => item.value),
      lid_types: lidTypes.filter((item) => item.value),
      colors: colors.map((color) => ({
        value: color._id,
        count: color.count,
      })),
      volume_range: volumeRange[0] || { min: 0, max: 1500 },
      price_range: priceRange[0] || { min: 0, max: 50000 },
    });
  } catch (error) {
    console.error("[API] GET /api/products/facets error:", error);
    return NextResponse.json({ error: "Failed to fetch facets" }, { status: 500 });
  }
}
