import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
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
    InteractionModel.countDocuments(),
    InteractionModel.countDocuments({ interactionType: "page_view" }),
    InteractionModel.countDocuments({ interactionType: "view" }),
    InteractionModel.countDocuments({ interactionType: "whatsapp_share" }),
    getInteractions({ limit: 1000 }),
    getWaLogs({ limit: 1000 }),
    ProductModel.find({ deletedAt: null }).select("id name sku").lean(),
  ]);

  const interactions = (interactionsRes.data || []) as { id: string; userId: string; productId?: string; interactionType: string; createdAt?: string }[];
  const waLogs = (waLogsRes.data || []) as { id: string; userId: string; productId?: string; createdAt?: string }[];
  const products = JSON.parse(JSON.stringify(rawProducts)) as { id: string; name: string; sku: string }[];
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  // Calculate top viewed (interactionType: "view")
  const viewCounts = new Map<string, number>();
  interactions.forEach((i) => {
    if (i.interactionType === "view" && i.productId) {
      viewCounts.set(i.productId, (viewCounts.get(i.productId) || 0) + 1);
    }
  });
  const topViewedProducts = Array.from(viewCounts.entries())
    .map(([productId, count]) => ({
      productId,
      name: productMap[productId] || productId,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate top wa logs (interactionType: "whatsapp_share")
  const waCounts = new Map<string, number>();
  waLogs.forEach((l) => {
    if (l.productId) {
      waCounts.set(l.productId, (waCounts.get(l.productId) || 0) + 1);
    }
  });
  const topWaProducts = Array.from(waCounts.entries())
    .map(([productId, count]) => ({
      productId,
      name: productMap[productId] || productId,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <DashboardContent
      stats={{
        products: productCount,
        interactions: interactionCount,
        productViews,
        waLogs: waLogsCount,
      }}
      topViewedProducts={topViewedProducts}
      topWaProducts={topWaProducts}
      totalInteractionsCount={interactions.length}
      totalWaLogsCount={waLogs.length}
      interactions={interactions}
      waLogs={waLogs}
    />
  );
}
