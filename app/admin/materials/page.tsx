import connectDB from "@/lib/mongodb";
import MaterialModel from "@/models/Material";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Material Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await connectDB();
  const rawMaterials = await MaterialModel.find().sort({ name: 1 }).lean();

  return (
    <SimpleMasterDataPage
      title="Material Produk"
      addLabel="Tambah Material"
      searchPlaceholder="Cari material..."
      emptyTitle="Material tidak ditemukan"
      emptyMessage="Tambahkan material untuk dipakai di data produk."
      apiPath="/api/materials"
      initialItems={JSON.parse(JSON.stringify(rawMaterials))}
      fields={[
        { name: "id", label: "ID Material", type: "text", placeholder: "misal: plastik_pet", required: true },
        { name: "name", label: "Nama Material", type: "text", placeholder: "misal: Plastik PET", required: true },
        { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Catatan singkat material" },
      ]}
    />
  );
}
