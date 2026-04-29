import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Product } from "@/types/product";
import { getCategoryLabel, getSpecValue } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  await connectDB();

  const product = await ProductModel.findOne({
    deletedAt: null,
    $or: [{ id }, { sku: id }],
  }).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  const volume = getSpecValue(product, "volume_ml");
  const category = getCategoryLabel(product.categoryId);

  return {
    title: `${product.name}${volume ? ` ${volume}ml` : ""} - Toples Laksana`,
    description: `${product.name}, ${category}. Material: ${product.bodyMaterial}. ${volume ? `Volume ${volume}ml. ` : ""}Tersedia untuk pembelian ecer dan grosir.`,
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
