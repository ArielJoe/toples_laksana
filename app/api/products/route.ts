import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import LidColor from "@/models/LidColor";
import Material from "@/models/Material";
import LidVariant from "@/models/LidVariant";

type MongoFilter = Record<string, unknown>;
type MongoRange = Record<string, number>;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, parsed);
}

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
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = Math.min(50, parsePositiveInt(searchParams.get("limit"), 10));
    const sort = searchParams.get("sort") || "popular";
    const search = (searchParams.get("search") || "").trim().slice(0, 80);
    const categories = searchParams.getAll("category");
    const productTypes = searchParams.getAll("product_type");
    const materialBody = searchParams.getAll("material_body");
    const lidMaterial = searchParams.getAll("lid_material");
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
      filter.name = { $regex: escapeRegex(search), $options: "i" };
    }

    const categoryIds = await resolveCategoryIds(categories);
    if (categoryIds.length > 0) {
      filter.categoryId = { $in: categoryIds };
    }

    if (productTypes.length > 0) {
      filter.productTypeId = { $in: productTypes };
    }

    if (materialBody.length > 0) {
      filter.bodyMaterial = { $in: materialBody };
    }

    if (lidMaterial.length > 0) {
      filter.lidMaterial = { $in: lidMaterial };
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

    const skip = (page - 1) * limit;
    let productsPromise;

    if (sort === "popular") {
      productsPromise = Product.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "interactions",
            let: { prodId: "$id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$productId", "$$prodId"]
                  }
                }
              }
            ],
            as: "clicks"
          }
        },
        {
          $addFields: {
            clickCount: { $size: "$clicks" }
          }
        },
        { $sort: { clickCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else if (sort === "price_asc") {
      const conds = [];
      if (priceTypes.length > 0) {
        conds.push({ $in: ["$$price.priceTypeId", priceTypes] });
      }
      if (priceMin) {
        conds.push({ $gte: ["$$price.price", Number.parseInt(priceMin, 10)] });
      }
      if (priceMax) {
        conds.push({ $lte: ["$$price.price", Number.parseInt(priceMax, 10)] });
      }

      const minPriceExpr = conds.length > 0
        ? {
            $min: {
              $map: {
                input: {
                  $filter: {
                    input: "$prices",
                    as: "price",
                    cond: conds.length === 1 ? conds[0] : { $and: conds }
                  }
                },
                as: "p",
                in: "$$p.price"
              }
            }
          }
        : { $min: "$prices.price" };

      productsPromise = Product.aggregate([
        { $match: filter },
        {
          $addFields: {
            minPrice: { $ifNull: [minPriceExpr, 999999999] }
          }
        },
        { $sort: { minPrice: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else if (sort === "price_desc") {
      const conds = [];
      if (priceTypes.length > 0) {
        conds.push({ $in: ["$$price.priceTypeId", priceTypes] });
      }
      if (priceMin) {
        conds.push({ $gte: ["$$price.price", Number.parseInt(priceMin, 10)] });
      }
      if (priceMax) {
        conds.push({ $lte: ["$$price.price", Number.parseInt(priceMax, 10)] });
      }

      const maxPriceExpr = conds.length > 0
        ? {
            $max: {
              $map: {
                input: {
                  $filter: {
                    input: "$prices",
                    as: "price",
                    cond: conds.length === 1 ? conds[0] : { $and: conds }
                  }
                },
                as: "p",
                in: "$$p.price"
              }
            }
          }
        : { $max: "$prices.price" };

      productsPromise = Product.aggregate([
        { $match: filter },
        {
          $addFields: {
            maxPrice: { $ifNull: [maxPriceExpr, -1] }
          }
        },
        { $sort: { maxPrice: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else {
      // newest / default
      productsPromise = Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    const [products, total] = await Promise.all([
      productsPromise,
      Product.countDocuments(filter),
    ]);
    const materialIds = [
      ...new Set(products.flatMap((product) => [product.bodyMaterial, product.lidMaterial]).filter(Boolean)),
    ];
    const lidVariantIds = [...new Set(products.map((product) => product.lidVariant).filter(Boolean))];

    const [materials, lidVariants] = await Promise.all([
      Material.find({ id: { $in: materialIds } }).select("id name").lean(),
      LidVariant.find({ id: { $in: lidVariantIds } }).select("id name").lean(),
    ]);

    const materialMap = new Map(materials.map((material) => [material.id, material.name]));
    const lidVariantMap = new Map(lidVariants.map((lidVariant) => [lidVariant.id, lidVariant]));

    const enrichedProducts = products.map((product) => {
      const variantDoc = lidVariantMap.get(product.lidVariant);
      return {
        ...product,
        bodyMaterialName: materialMap.get(product.bodyMaterial),
        lidMaterialName: materialMap.get(product.lidMaterial),
        lidVariantName: variantDoc?.name,
      };
    });

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

    if (!body.id || !body.name || !body.sku || !body.categoryId) {
      return NextResponse.json(
        { error: "Missing required fields (id, name, sku, categoryId)" },
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
