import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import LidColor from "@/models/LidColor";
import Material from "@/models/Material";
import PriceType from "@/models/PriceType";
import ProductType from "@/models/ProductType";
import { getAvailabilityLabel } from "@/types/product";

export async function GET() {
  try {
    await connectDB();

    const activeFilter = { deletedAt: null };

    const [
      categories,
      categoryDocs,
      materials,
      lidMaterials,
      colors,
      availabilityStatuses,
      volumeRange,
      priceRange,
      priceTypes,
      lidColorDocs,
      materialDocs,
      priceTypeDocs,
      productTypes,
      productTypeDocs,
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
        { $group: { _id: "$lidMaterial", count: { $sum: 1 } } },
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
        { $group: { _id: "$isAvailable", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
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
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$prices" },
        { $match: { "prices.priceTypeId": { $ne: "" }, "prices.price": { $gt: 0 } } },
        { $group: { _id: "$prices.priceTypeId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LidColor.find().select("id color colorCode").lean(),
      Material.find().select("id name").lean(),
      PriceType.find().select("id name").lean(),
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$productTypeId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ProductType.find().select("id name").lean(),
    ]);

    const categoryNames = new Map(categoryDocs.map((category) => [category.id, category.name]));
    const lidColorMap = new Map(lidColorDocs.map((lc) => [lc.id, lc]));
    const materialMap = new Map(materialDocs.map((material) => [material.id, material.name]));
    const priceTypeMap = new Map(priceTypeDocs.map((priceType) => [priceType.id, priceType.name]));
    const productTypeMap = new Map(productTypeDocs.map((pt) => [pt.id, pt.name]));

    return NextResponse.json({
      categories: categories.map((category) => ({
        value: category._id,
        count: category.count,
        name: categoryNames.get(category._id) || category._id,
      })),
      materials: materials
        .filter((item) => item.value)
        .map((item) => ({ ...item, name: materialMap.get(item.value) || item.value })),
      lid_materials: lidMaterials
        .filter((item) => item.value)
        .map((item) => ({ ...item, name: materialMap.get(item.value) || item.value })),
      colors: colors.map((color) => {
        const doc = lidColorMap.get(color._id);
        return {
          value: color._id,
          count: color.count,
          name: doc?.color,
          hex: doc?.colorCode,
        };
      }),
      price_types: priceTypes
        .filter((item) => item._id)
        .map((item) => ({
          value: item._id,
          count: item.count,
          name: priceTypeMap.get(item._id) || item._id,
        })),
      product_types: productTypes
        .filter((item) => item._id)
        .map((item) => ({
          value: item._id,
          count: item.count,
          name: productTypeMap.get(item._id) || item._id,
        })),
      availability_statuses: availabilityStatuses
        .filter((item) => item.value !== undefined && item.value !== null)
        .map((item) => ({
          value: String(item.value),
          count: item.count,
          name: getAvailabilityLabel(item.value),
        })),
      volume_range: volumeRange[0] || { min: 0, max: 1500 },
      price_range: priceRange[0] || { min: 0, max: 50000 },
    });
  } catch (error) {
    console.error("[API] GET /api/products/facets error:", error);
    return NextResponse.json({ error: "Failed to fetch facets" }, { status: 500 });
  }
}
