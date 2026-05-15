import connectDB from "@/lib/mongodb";
import LidVariantModel from "@/models/LidVariant";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Varian Tutup - Admin",
};

export const dynamic = "force-dynamic";

export default async function LidVariantsPage() {
  await connectDB();
  const rawLidVariants = await LidVariantModel.find().sort({ name: 1 }).lean();

  return (
    <SimpleMasterDataPage
      title="Varian Tutup"
      addLabel="Tambah Varian Tutup"
      searchPlaceholder="Cari varian tutup..."
      emptyTitle="Varian tutup tidak ditemukan"
      emptyMessage="Tambahkan varian tutup untuk dipakai di data produk."
      apiPath="/api/lid-variants"
      initialItems={JSON.parse(JSON.stringify(rawLidVariants))}
      fields={[
        { name: "id", label: "ID Varian Tutup", type: "text", placeholder: "misal: polos", required: true },
        { name: "name", label: "Nama Varian Tutup", type: "text", placeholder: "misal: Polos", required: true },
        { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Catatan singkat varian tutup" },
      ]}
    />
  );
}
