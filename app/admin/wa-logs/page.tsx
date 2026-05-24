import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { getWaLogs } from "@/lib/actions/interaction.actions";
import { Metadata } from "next";
import WaLogsPageContent from "./WaLogsPageContent";

export const metadata: Metadata = {
  title: "WhatsApp Log - Admin",
};

export const dynamic = "force-dynamic";

export default async function WaLogsPage() {
  await connectDB();
  
  const [{ data: logs }, rawProducts] = await Promise.all([
    getWaLogs({ limit: 1000 }),
    ProductModel.find({ deletedAt: null }).select("id name").lean(),
  ]);

  return (
    <WaLogsPageContent
      initialLogs={logs}
      products={JSON.parse(JSON.stringify(rawProducts))}
    />
  );
}
