import connectDB from "@/lib/mongodb";
import LidTypeModel from "@/models/LidType";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jenis Tutup - Admin",
};

export const dynamic = "force-dynamic";

export default async function LidTypesPage() {
  await connectDB();
  const rawLidTypes = await LidTypeModel.find().sort({ name: 1 }).lean();

  return (
    <SimpleMasterDataPage
      title="Jenis Tutup"
      addLabel="Tambah Jenis Tutup"
      searchPlaceholder="Cari jenis tutup..."
      emptyTitle="Jenis tutup tidak ditemukan"
      emptyMessage="Tambahkan jenis tutup untuk validasi internal data produk."
      apiPath="/api/lid-types"
      initialItems={JSON.parse(JSON.stringify(rawLidTypes))}
      fields={[
        { name: "id", label: "ID", type: "text", placeholder: "misal: ulir", required: true },
        { name: "name", label: "Nama Jenis Tutup", type: "text", placeholder: "misal: Ulir", required: true },
        { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Catatan singkat jenis tutup" },
      ]}
    />
  );
}
