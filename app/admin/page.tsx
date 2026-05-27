import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
import WhatsAppLogModel from "@/models/WhatsAppLog";
import DashboardContent from "./DashboardContent";
import { Metadata } from "next";
import { getInteractions, getWaLogs } from "@/lib/actions/interaction.actions";

export const metadata: Metadata = {
  title: "Dashboard Admin - Toples Laksana",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [
    productCount,
    interactionCount,
    , // pageViews
    productViews,
    waLogsCount,
    interactionsRes,
    waLogsRes,
    rawProducts,
  ] = await Promise.all([
    ProductModel.countDocuments({ deletedAt: null }),
    InteractionModel.countDocuments({ interactionType: "detail_click" }),
    InteractionModel.countDocuments({ interactionType: "page_view" }),
    InteractionModel.countDocuments({ interactionType: "detail_click" }),
    WhatsAppLogModel.countDocuments(),
    getInteractions({ type: "detail_click", limit: 10000 }),
    getWaLogs({ limit: 10000 }),
    ProductModel.find({ deletedAt: null }).select("id name sku").lean(),
  ]);

  const interactions = (interactionsRes.data || []) as { id: string; userId: string; productId?: string; interactionType: string; createdAt?: string }[];
  const waLogs = (waLogsRes.data || []) as { id: string; userId: string; details?: { productId?: string }[]; createdAt?: string }[];
  const products = JSON.parse(JSON.stringify(rawProducts)) as { id: string; name: string; sku: string }[];

  return (
    <DashboardContent
      stats={{
        products: productCount,
        interactions: interactionCount,
        productViews,
        waLogs: waLogsCount,
      }}
      products={products}
      interactions={interactions}
      waLogs={waLogs}
      generatedAt={new Date().toISOString()}
    />
  );
}
