import connectDB from "@/lib/mongodb";
import MaterialModel from "@/models/Material";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bahan Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await connectDB();
  const rawMaterials = await MaterialModel.find().sort({ name: 1 }).lean();

  return (
    <SimpleMasterDataPage
      title="Bahan Produk"
      addLabel="Tambah Bahan"
      searchPlaceholder="Cari bahan..."
      emptyTitle="Bahan tidak ditemukan"
      emptyMessage="Tambahkan bahan badan atau bahan tutup untuk dipakai di data produk."
      apiPath="/api/materials"
      initialItems={JSON.parse(JSON.stringify(rawMaterials))}
      fields={[
        { name: "id", label: "ID", type: "text", placeholder: "misal: plastik_pet", required: true },
        { name: "name", label: "Nama Bahan", type: "text", placeholder: "misal: Plastik PET", required: true },
        {
          name: "usage",
          label: "Dipakai Untuk",
          type: "select",
          required: true,
          options: [
            { value: "both", label: "Badan & Tutup" },
            { value: "body", label: "Badan Produk" },
            { value: "lid", label: "Tutup Produk" },
          ],
        },
      ]}
    />
  );
}
