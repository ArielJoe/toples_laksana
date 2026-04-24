/**
 * GET /api/products/facets
 * Aggregates distinct filter values (categories, materials, etc.) and their respective product counts.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const activeFilter = { is_active: true };

    // Run all aggregations in parallel
    const [
      categories,
      tags,
      materials,
      lidTypes,
      colors,
      volumeRange,
      priceRange,
    ] = await Promise.all([
      // Distinct categories with count
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Distinct tags with count
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Distinct body materials with count
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$materials.body", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Distinct lid types with count
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$materials.lid_type", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Distinct variant colors with count
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$variants" },
        { $group: { _id: "$variants.color", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Volume range (min/max)
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$specifications" },
        { $match: { "specifications.key": "volume_ml" } },
        {
          $group: {
            _id: null,
            min: { $min: "$specifications.value" },
            max: { $max: "$specifications.value" },
          },
        },
        { $project: { _id: 0 } },
      ]),

      // Price range (min/max retail price)
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$variants" },
        {
          $group: {
            _id: null,
            min: { $min: "$variants.pricing.retail.price" },
            max: { $max: "$variants.pricing.retail.price" },
          },
        },
        { $project: { _id: 0 } },
      ]),
    ]);

    return NextResponse.json({
      categories,
      tags,
      materials,
      lid_types: lidTypes,
      colors,
      volume_range: volumeRange[0] || { min: 0, max: 1500 },
      price_range: priceRange[0] || { min: 0, max: 50000 },
    });
  } catch (error) {
    console.error("[API] GET /api/products/facets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facets" },
      { status: 500 }
    );
  }
}
