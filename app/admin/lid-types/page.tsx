import connectDB from "@/lib/mongodb";
import LidTypeModel from "@/models/LidType";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipe Tutup - Admin",
};

export const dynamic = "force-dynamic";

export default async function LidTypesPage() {
  await connectDB();
  const rawLidTypes = await LidTypeModel.find().sort({ name: 1 }).lean();

  return (
    <SimpleMasterDataPage
      title="Tipe Tutup"
      addLabel="Tambah Tipe Tutup"
      searchPlaceholder="Cari tipe tutup..."
      emptyTitle="Tipe tutup tidak ditemukan"
      emptyMessage="Tambahkan tipe tutup untuk dipakai di data produk."
      apiPath="/api/lid-types"
      initialItems={JSON.parse(JSON.stringify(rawLidTypes))}
      fields={[
        { name: "id", label: "ID Tipe Tutup", type: "text", placeholder: "misal: ulir", required: true },
        { name: "name", label: "Nama Tipe Tutup", type: "text", placeholder: "misal: Ulir", required: true },
        { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Catatan singkat tipe tutup" },
      ]}
    />
  );
}
