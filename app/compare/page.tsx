import Link from "next/link";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { formatPrice } from "@/lib/price-calculator";
import { buildInquiryUrl } from "@/lib/whatsapp-builder";
import type { Metadata } from "next";
import { getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getSpecValue, Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Bandingkan Spesifikasi Kemasan - Toples Laksana",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

/**
 * Dynamic grid class based on product count.
 * 1 product  -> 2 cols (label + 1 product)
 * 2 products -> 3 cols
 * 3 products -> 4 cols
 */
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
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-100/20 rounded-full blur-3xl -z-10" />

      <main className="max-w-7xl mx-auto px-6 pb-20 lg:px-12 relative">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Link href="/catalog" className="group flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-primary-500 transition-all">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
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
          <div className="bg-white border border-border rounded-4xl p-20 text-center max-w-2xl mx-auto shadow-xl shadow-secondary-900/5">
            <div className="w-24 h-24 bg-secondary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-secondary-200">compare</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary mb-3 tracking-tight">Belum ada produk yang dipilih</h2>
            <p className="text-text-secondary mb-10 font-medium opacity-70">
              Pilih hingga 3 produk dari katalog untuk membandingkan spesifikasinya secara detail di sini.
            </p>
            <Link href="/catalog" className="bg-primary-500 text-white px-10 py-4.5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 inline-flex text-[0.7rem] active:scale-95">
              Lihat Katalog Produk
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar pb-8">
            {/* Product Cards Header */}
            <div className={`grid ${gridCols} items-stretch gap-6 mb-8 min-w-[700px]`}>
              <div className="flex flex-col justify-end pb-8">
                <h3 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-primary-500 mb-1">Spesifikasi</h3>
                <p className="text-[0.65rem] font-bold text-text-muted">Detail Kemasan</p>
              </div>

              {products.map((product) => {
                const image = getPrimaryImage(product);
                return (
                  <div key={product.id} className="bg-white/70 backdrop-blur-md p-6 flex flex-col items-center text-center shadow-sm border border-white rounded-4xl relative group hover:shadow-xl hover:shadow-secondary-900/5 transition-all duration-500">
                    <Link href={`/compare?ids=${ids?.split(",").filter((id) => id !== product.id).join(",")}`} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary-50 hover:bg-red-50 text-text-muted hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                      <span className="material-symbols-outlined text-base">close</span>
                    </Link>
                    <div className="relative w-full aspect-square mb-6">
                      <div className="absolute inset-0 bg-secondary-50/50 rounded-2xl -z-10" />
                      {image ? (
                        <img alt={product.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4" src={image} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <span className="material-symbols-outlined text-6xl">inventory_2</span>
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
            <div className="flex flex-col border border-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-secondary-900/5 bg-white/40 backdrop-blur-xl min-w-[700px]">
              {[
                { label: "Volume Kapasitas", getter: (p: Product) => `${getSpecValue(p, "volume_ml") || "-"} ml` },
                { label: "Tinggi Total", getter: (p: Product) => `${getSpecValue(p, "tinggi_cm") || "-"} cm` },
                { label: "Diameter Badan", getter: (p: Product) => `${getSpecValue(p, "diameter_badan_cm") || "-"} cm` },
                { label: "Bahan Badan", getter: (p: Product) => p.bodyMaterial },
                { label: "Bahan Tutup", getter: (p: Product) => p.lidMaterial },
                { label: "Tipe Tutup", getter: (p: Product) => p.lidType },
                { label: "Kategori", getter: (p: Product) => getCategoryLabel(p.categoryId) },
              ].map((row, idx) => (
                <div key={row.label} className={`grid ${gridCols} items-stretch ${idx % 2 === 0 ? "bg-white/50" : "bg-transparent"} hover:bg-primary-50/30 transition-colors border-b border-white last:border-b-0`}>
                  <div className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] border-r border-white flex items-center">{row.label}</div>
                  {products.map((p) => (
                    <div key={`${p.id}-${row.label}`} className="px-8 py-5 text-sm text-center text-text-primary font-black border-r border-white last:border-r-0 flex items-center justify-center tracking-tight">
                      {row.getter(p)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Price Row */}
              <div className={`grid ${gridCols} items-stretch bg-primary-50/50 backdrop-blur-md`}>
                <div className="px-8 py-8 text-[0.65rem] font-black text-primary-600 uppercase tracking-[0.25em] border-r border-primary-100/30 flex items-center">
                  Harga Ecer Terendah
                </div>
                {products.map((p) => {
                  const price = getLowestRetailPrice(p);
                  return (
                    <div key={`${p.id}-price`} className="px-8 py-8 text-center border-r border-primary-100/30 last:border-r-0 flex flex-col items-center justify-center bg-primary-500/5">
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
                <a key={`${p.id}-cta`} href={buildInquiryUrl(p)} target="_blank" rel="noopener noreferrer" className="w-full bg-white border-2 border-primary-500/10 text-primary-600 py-4 px-6 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-xl shadow-primary-500/5 active:scale-95 group">
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">chat</span>
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
