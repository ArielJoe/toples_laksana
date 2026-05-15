import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Product } from "@/types/product";
import { formatAttributeLabel, getCategoryLabel, getSpecValue } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

import CategoryModel from "@/models/Category";
import LidColorModel from "@/models/LidColor";
import MaterialModel from "@/models/Material";
import LidTypeModel from "@/models/LidType";
import LidVariantModel from "@/models/LidVariant";

async function getProduct(id: string): Promise<Product | null> {
  await connectDB();

  const product = await ProductModel.findOne({
    deletedAt: null,
    $or: [{ id }, { sku: id }],
  }).lean();

  if (!product) return null;

  const colorIds = [...new Set((product.prices || []).map((p: { lidColorId?: string }) => p.lidColorId).filter(Boolean))];
  const [
    category,
    lidColors,
    materials,
    lidType,
    lidVariant,
  ] = await Promise.all([
    CategoryModel.findOne({ id: product.categoryId }).select("name").lean(),
    LidColorModel.find({ id: { $in: colorIds } }).select("id color colorCode").lean(),
    MaterialModel.find({ id: { $in: [product.bodyMaterial, product.lidMaterial].filter(Boolean) } }).select("id name").lean(),
    LidTypeModel.findOne({ id: product.lidType }).select("id name").lean(),
    LidVariantModel.findOne({ id: product.lidVariant }).select("id name").lean(),
  ]);
  const colorMap = new Map(lidColors.map((lc) => [lc.id, lc]));
  const materialMap = new Map(materials.map((material) => [material.id, material.name]));

  const parsedProduct = JSON.parse(JSON.stringify(product));
  if (category) {
    parsedProduct.categoryName = category.name;
  }
  parsedProduct.bodyMaterialName = materialMap.get(product.bodyMaterial) || formatAttributeLabel(product.bodyMaterial);
  parsedProduct.lidMaterialName = materialMap.get(product.lidMaterial) || formatAttributeLabel(product.lidMaterial);
  parsedProduct.lidTypeName = lidType?.name || formatAttributeLabel(product.lidType);
  parsedProduct.lidVariantName = lidVariant?.name || formatAttributeLabel(product.lidVariant);
  if (parsedProduct.prices) {
    parsedProduct.prices = parsedProduct.prices.map((p: NonNullable<Product["prices"]>[number]) => {
      const doc = colorMap.get(p.lidColorId);
      if (doc) {
        return {
          ...p,
          lidColorName: doc.color,
          lidColorHex: doc.colorCode,
        };
      }
      return p;
    });
  }

  return parsedProduct;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  const volume = getSpecValue(product, "volume_ml");
  const category = product.categoryName || getCategoryLabel(product.categoryId);

  return {
    title: `${product.name}${volume ? ` ${volume}ml` : ""} - Toples Laksana`,
    description: `${product.name}, ${category}. Material: ${product.bodyMaterialName || formatAttributeLabel(product.bodyMaterial)}. ${volume ? `Volume ${volume}ml. ` : ""}Tersedia untuk pembelian ecer dan grosir.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
