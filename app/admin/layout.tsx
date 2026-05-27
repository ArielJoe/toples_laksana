import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
import WhatsAppLogModel from "@/models/WhatsAppLog";
import { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Panel - Toples Laksana",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  // Fetch counts for sidebar badges
  const [productCount, interactionCount, waLogsCount] = await Promise.all([
    ProductModel.countDocuments({ deletedAt: null }),
    InteractionModel.countDocuments({ interactionType: "detail_click" }),
    WhatsAppLogModel.countDocuments(),
  ]);

  return (
    <AdminLayoutClient 
      productCount={productCount} 
      interactionCount={interactionCount}
      waLogsCount={waLogsCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
