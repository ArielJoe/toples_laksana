import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import LidColor from "@/models/LidColor";
import Material from "@/models/Material";
import LidType from "@/models/LidType";
import LidVariant from "@/models/LidVariant";

type MongoFilter = Record<string, unknown>;
type MongoRange = Record<string, number>;

async function resolveCategoryIds(values: string[]): Promise<string[]> {
  if (values.length === 0) return [];

  const categories = await Category.find({
    $or: [{ id: { $in: values } }, { name: { $in: values } }],
  }).select("id").lean();
  const idsFromNames = categories.map((category) => category.id);

  return [...new Set([...values, ...idsFromNames])];
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Number.parseInt(searchParams.get("limit") || "10", 10));
    const sort = searchParams.get("sort") || "popular";
    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("category");
    const materialBody = searchParams.getAll("material_body");
    const lidMaterial = searchParams.getAll("lid_material");
    const lidType = searchParams.getAll("lid_type");
    const colors = searchParams.getAll("colors");
    const availability = searchParams.getAll("availability");
    const volumeMin = searchParams.get("volume_min");
    const volumeMax = searchParams.get("volume_max");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    const priceTypes = searchParams.getAll("price_type");
    const ids = searchParams.getAll("id");

    const filter: MongoFilter = { deletedAt: null };

    if (ids.length > 0) {
      filter.id = { $in: ids };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const categoryIds = await resolveCategoryIds(categories);
    if (categoryIds.length > 0) {
      filter.categoryId = { $in: categoryIds };
    }

    if (materialBody.length > 0) {
      filter.bodyMaterial = { $in: materialBody };
    }

    if (lidMaterial.length > 0) {
      filter.lidMaterial = { $in: lidMaterial };
    }

    if (lidType.length > 0) {
      filter.lidType = { $in: lidType };
    }

    if (colors.length > 0) {
      const colorDocs = await LidColor.find({
        $or: [{ id: { $in: colors } }, { color: { $in: colors } }],
      }).select("id").lean();
      const colorIds = [...new Set([...colors, ...colorDocs.map((color) => color.id)])];
      filter["prices.lidColorId"] = { $in: colorIds };
    }

    if (availability.length > 0) {
      const booleanAvailability = availability
        .map((val) => {
          if (val === "true" || val === "available") return true;
          if (val === "false" || val === "unavailable") return false;
          return null;
        })
        .filter((val) => val !== null);

      if (booleanAvailability.length > 0) {
        filter.isAvailable = { $in: booleanAvailability };
      }
    }

    if (volumeMin || volumeMax) {
      const volumeMatch: MongoRange = {};
      if (volumeMin) volumeMatch.$gte = Number.parseInt(volumeMin, 10);
      if (volumeMax) volumeMatch.$lte = Number.parseInt(volumeMax, 10);
      filter["dimension.volumeMl"] = volumeMatch;
    }

    if (priceMin || priceMax || priceTypes.length > 0) {
      const elemMatch: MongoFilter = {};
      if (priceTypes.length > 0) {
        elemMatch.priceTypeId = { $in: priceTypes };
      }
      if (priceMin || priceMax) {
        const priceMatch: MongoRange = {};
        if (priceMin) priceMatch.$gte = Number.parseInt(priceMin, 10);
        if (priceMax) priceMatch.$lte = Number.parseInt(priceMax, 10);
        elemMatch.price = priceMatch;
      }
      filter.prices = { $elemMatch: elemMatch };
    }

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price_asc":
        sortQuery = { "prices.price": 1 };
        break;
      case "price_desc":
        sortQuery = { "prices.price": -1 };
        break;
      case "newest":
      case "popular":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    const materialIds = [
      ...new Set(products.flatMap((product) => [product.bodyMaterial, product.lidMaterial]).filter(Boolean)),
    ];
    const lidTypeIds = [...new Set(products.map((product) => product.lidType).filter(Boolean))];
    const lidVariantIds = [...new Set(products.map((product) => product.lidVariant).filter(Boolean))];

    const [materials, lidTypes, lidVariants] = await Promise.all([
      Material.find({ id: { $in: materialIds } }).select("id name").lean(),
      LidType.find({ id: { $in: lidTypeIds } }).select("id name").lean(),
      LidVariant.find({ id: { $in: lidVariantIds } }).select("id name").lean(),
    ]);

    const materialMap = new Map(materials.map((material) => [material.id, material.name]));
    const lidTypeMap = new Map(lidTypes.map((lidType) => [lidType.id, lidType.name]));
    const lidVariantMap = new Map(lidVariants.map((lidVariant) => [lidVariant.id, lidVariant.name]));
    const enrichedProducts = products.map((product) => ({
      ...product,
      bodyMaterialName: materialMap.get(product.bodyMaterial),
      lidMaterialName: materialMap.get(product.lidMaterial),
      lidTypeName: lidTypeMap.get(product.lidType),
      lidVariantName: lidVariantMap.get(product.lidVariant),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: enrichedProducts,
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
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id || !body.name || !body.sku || !body.categoryId || !body.unitId) {
      return NextResponse.json(
        { error: "Missing required fields (id, name, sku, categoryId, unitId)" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] POST /api/products error:", error);
    const message = error instanceof Error ? error.message : "Failed to create product";
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;

    if (code === 11000) {
      return NextResponse.json({ error: "SKU or ID already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
