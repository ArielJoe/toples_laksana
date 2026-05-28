import connectDB from "@/lib/mongodb";
import LidVariantModel from "@/models/LidVariant";
import LidTypeModel from "@/models/LidType";
import SimpleMasterDataPage from "@/components/admin/SimpleMasterDataPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Variasi Tutup - Admin",
};

export const dynamic = "force-dynamic";

export default async function LidVariantsPage() {
  await connectDB();
  const rawLidVariants = await LidVariantModel.find().sort({ name: 1 }).lean();
  const rawLidTypes = await LidTypeModel.find().sort({ name: 1 }).lean();
  const lidTypeOptions = rawLidTypes.map((t) => ({ value: t.id, label: t.name }));

  return (
    <SimpleMasterDataPage
      title="Variasi Tutup"
      addLabel="Tambah Variasi Tutup"
      searchPlaceholder="Cari variasi tutup..."
      emptyTitle="Variasi tutup tidak ditemukan"
      emptyMessage="Tambahkan variasi tutup untuk dipakai di data produk."
      apiPath="/api/lid-variants"
      initialItems={JSON.parse(JSON.stringify(rawLidVariants))}
      fields={[
        { name: "id", label: "ID", type: "text", placeholder: "misal: twist_off", required: true },
        { name: "name", label: "Nama Variasi Tutup", type: "text", placeholder: "misal: Twist Off", required: true },
        { name: "lidTypeId", label: "Tipe Tutup", type: "select", options: lidTypeOptions, required: true },
        { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Catatan singkat variasi tutup" },
      ]}
    />
  );
}
