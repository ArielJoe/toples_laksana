import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
import AdminPageContent from "./AdminPageContent";
import { Product } from "@/types/product";
import { IInteraction } from "@/models/Interaction";

export const metadata: Metadata = {
  title: "Dashboard Admin - Toples Laksana",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  // Fetch all products from real DB
  const rawProducts = await ProductModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
  const products: Product[] = JSON.parse(JSON.stringify(rawProducts));

  // Fetch recent interactions (last 100)
  const rawInteractions = await InteractionModel.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  const interactions: IInteraction[] = JSON.parse(JSON.stringify(rawInteractions));

  return <AdminPageContent initialProducts={products} initialInteractions={interactions} />;
}
