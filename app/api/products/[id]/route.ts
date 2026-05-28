import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductUpdateInput = Record<string, unknown>;

const PRODUCT_UPDATE_FIELDS = [
  "id",
  "sku",
  "name",
  "categoryId",
  "productTypeId",
  "unitId",
  "lidMaterial",
  "lidVariant",
  "bodyMaterial",
  "isAvailable",
  "availabilityNote",
  "description",
  "dimension",
  "packaging",
  "images",
  "prices",
] as const;

function productLookup(id: string) {
  const or: Record<string, string>[] = [{ id }, { sku: id }];

  if (id.match(/^[a-f\d]{24}$/i)) {
    or.push({ _id: id });
  }

  return {
    deletedAt: null,
    $or: or,
  };
}

function sanitizeProductUpdate(input: ProductUpdateInput) {
  const update: ProductUpdateInput = {};

  for (const field of PRODUCT_UPDATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      update[field] = input[field];
    }
  }

  return update;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findOne(productLookup(id)).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[API] GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = (await request.json()) as ProductUpdateInput;
    const update = sanitizeProductUpdate(body);

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid product fields to update" }, { status: 400 });
    }

    const product = await Product.findOneAndUpdate(productLookup(id), { $set: update }, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error: unknown) {
    console.error("[API] PATCH /api/products/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findOneAndUpdate(
      productLookup(id),
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: unknown) {
    console.error("[API] DELETE /api/products/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
