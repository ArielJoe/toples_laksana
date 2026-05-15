import Link from "next/link";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { formatPrice } from "@/lib/price-calculator";
import { buildInquiryUrl } from "@/lib/whatsapp-builder";
import type { Metadata } from "next";
import { formatAttributeLabel, getAvailabilityLabel, getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getSpecValue, Product } from "@/types/product";
import { AppIcon } from "@/components/ui/app-icon";

export const metadata: Metadata = {
  title: "Bandingkan Spesifikasi Kemasan - Toples Laksana",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

// Grid columns based on product count (+1 for label column)
function getGridCols(count: number) {
  if (count === 1) return "grid-cols-2";
  if (count === 2) return "grid-cols-3";
  return "grid-cols-4";
}

export default async function ComparisonPage({ searchParams }: ComparePageProps) {
  const { ids } = await searchParams;
  let products: Product[] = [];

  if (ids) {
    const idArray = ids.split(",").slice(0, 3);
    await connectDB();
    const fetched = await ProductModel.find({
      id: { $in: idArray },
      deletedAt: null,
    }).lean();

    products = JSON.parse(JSON.stringify(fetched));
    products.sort((a, b) => idArray.indexOf(a.id) - idArray.indexOf(b.id));
  }

  const gridCols = getGridCols(products.length);

  return (
    <div className="bg-[#F8FAFC] text-text-primary font-sans min-h-screen pt-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary-50/50 to-transparent -z-10" />

      <main className="max-w-7xl mx-auto px-6 pb-20 lg:px-12 relative">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Link href="/catalog" className="group flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-primary-500 transition-all">
              <AppIcon name="arrow_back" className="text-sm transition-transform group-hover:-translate-x-1" />
              Kembali ke Katalog
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-[1.1] mb-4">
            Analisis <span className="text-primary-500">Spesifikasi</span>
          </h1>
          <p className="text-text-secondary max-w-2xl text-lg font-medium leading-relaxed opacity-80">
            Bandingkan detail teknis antar kemasan untuk menemukan solusi terbaik bagi produk Anda.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-text-muted text-center bg-white border border-border rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <AppIcon name="compare_arrows" className="text-6xl opacity-20" />
            </div>
            <p className="text-xl font-black text-text-primary tracking-tight">Belum ada produk yang dipilih</p>
            <p className="text-sm mt-2 mb-10 max-w-md text-text-secondary font-medium opacity-70">
              Pilih hingga 3 produk dari katalog untuk membandingkan spesifikasinya secara detail di sini.
            </p>
            <Link href="/catalog" className="bg-primary-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all inline-flex text-[0.7rem] active:scale-95">
              Lihat Katalog Produk
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar pb-8">
            {/* Product Cards Header */}
            <div className={`grid ${gridCols} items-stretch gap-6 mb-8 min-w-[700px]`}>
              {products.map((product) => {
                const image = getPrimaryImage(product);
                return (
                  <div key={product.id} className="bg-white/70 backdrop-blur-md p-6 flex flex-col items-center text-center border border-white rounded-xl relative group transition-all duration-500">
                    <Link href={`/compare?ids=${ids?.split(",").filter((id) => id !== product.id).join(",")}`} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary-50 hover:bg-red-50 text-text-muted hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                      <AppIcon name="close" className="text-base" />
                    </Link>
                    <div className="relative w-full aspect-square mb-6">
                      <div className="absolute inset-0 bg-secondary-50/50 rounded-2xl -z-10" />
                      {image ? (
                        <img alt={product.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4" src={image} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <AppIcon name="inventory_2" className="text-6xl" />
                        </div>
                      )}
                    </div>
                    <Link href={`/products/${product.id}`} className="hover:text-primary-500 transition-colors">
                      <h3 className="text-sm font-black text-text-primary mb-2 leading-tight line-clamp-2 px-2">{product.name}</h3>
                    </Link>
                    <span className="text-[0.6rem] font-mono font-black px-3 py-1 rounded-lg bg-secondary-50 text-text-muted tracking-widest uppercase border border-border/50">
                      {product.sku}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Spec Comparison Table */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-white/40 backdrop-blur-xl min-w-[700px]">
              {[
                { label: "Volume Kapasitas", getter: (p: Product) => `${getSpecValue(p, "volume_ml") || "-"} ml` },
                { label: "Tinggi Total", getter: (p: Product) => `${getSpecValue(p, "tinggi_cm") || "-"} cm` },
                { label: "Diameter Badan", getter: (p: Product) => `${getSpecValue(p, "diameter_badan_cm") || "-"} cm` },
                { label: "Bahan Badan", getter: (p: Product) => p.bodyMaterialName || formatAttributeLabel(p.bodyMaterial) },
                { label: "Bahan Tutup", getter: (p: Product) => p.lidMaterialName || formatAttributeLabel(p.lidMaterial) },
                { label: "Tipe Tutup", getter: (p: Product) => p.lidTypeName || formatAttributeLabel(p.lidType) },
                { label: "Status", getter: (p: Product) => getAvailabilityLabel(p.availabilityStatus) },
                { label: "Kategori", getter: (p: Product) => getCategoryLabel(p.categoryId) },
              ].map((row, idx) => (
                <div key={row.label} className={`grid ${gridCols} items-stretch ${idx % 2 === 0 ? "bg-white/50" : "bg-transparent"} hover:bg-primary-50/30 transition-colors`}>
                  <div className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] flex items-center">{row.label}</div>
                  {products.map((p) => (
                    <div key={`${p.id}-${row.label}`} className="px-8 py-5 text-sm text-center text-text-primary font-black flex items-center justify-center tracking-tight">
                      {row.getter(p)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Price Row */}
              <div className={`grid ${gridCols} items-stretch bg-primary-50/50 backdrop-blur-md`}>
                <div className="px-8 py-8 text-[0.65rem] font-black text-primary-600 uppercase tracking-[0.25em] flex items-center">
                  Harga Ecer Terendah
                </div>
                {products.map((p) => {
                  const price = getLowestRetailPrice(p);
                  return (
                    <div key={`${p.id}-price`} className="px-8 py-8 text-center flex flex-col items-center justify-center bg-primary-500/5">
                      <span className="text-2xl font-black text-primary-600 tracking-tighter">
                        {price > 0 ? formatPrice(price) : "Hubungi Kami"}
                      </span>
                      {price > 0 && <span className="text-[0.6rem] font-black text-primary-400 mt-1 uppercase tracking-[0.2em]">/ per pcs</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`grid ${gridCols} items-center mt-8 gap-6 min-w-[700px]`}>
              <div />
              {products.map((p) => (
                <a key={`${p.id}-cta`} href={buildInquiryUrl(p)} target="_blank" rel="noopener noreferrer" className="w-full bg-white border-2 border-primary-500/10 text-primary-600 py-3 px-6 rounded-xl font-black text-[0.7rem] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-95 group">
                  <AppIcon name="chat" className="text-xl transition-transform group-hover:rotate-12" />
                  Tanya Kami
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
