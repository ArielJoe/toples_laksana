import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { formatPrice } from "@/lib/price-calculator";
import { buildInquiryUrl } from "@/lib/whatsapp-builder";
import type { Metadata } from "next";
import { formatAttributeLabel, getAvailabilityLabel, getCategoryLabel, getLowestRetailPrice, getPrimaryImage, getSpecValue, Product } from "@/types/product";
import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Material from "@/models/Material";
import LidType from "@/models/LidType";
import LidVariant from "@/models/LidVariant";

export const metadata: Metadata = {
  title: "Bandingkan Spesifikasi Kemasan - Toples Laksana",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

interface LookupDoc {
  id: string;
  name: string;
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

    const rawProducts = JSON.parse(JSON.stringify(fetched)) as Product[];

    // Fetch and map metadata from DB for Bahan Badan, Bahan Tutup, Variasi Tutup, etc.
    const materialIds = [
      ...new Set(rawProducts.flatMap((product) => [product.bodyMaterial, product.lidMaterial]).filter(Boolean)),
    ];
    const lidTypeIds = [...new Set(rawProducts.map((product) => product.lidType).filter(Boolean))];
    const lidVariantIds = [...new Set(rawProducts.map((product) => product.lidVariant).filter(Boolean))];

    const [materials, lidTypes, lidVariants] = (await Promise.all([
      Material.find({ id: { $in: materialIds } }).select("id name").lean(),
      LidType.find({ id: { $in: lidTypeIds } }).select("id name").lean(),
      LidVariant.find({ id: { $in: lidVariantIds } }).select("id name").lean(),
    ])) as [LookupDoc[], LookupDoc[], LookupDoc[]];

    const materialMap = new Map(materials.map((m) => [m.id, m.name]));
    const lidTypeMap = new Map(lidTypes.map((t) => [t.id, t.name]));
    const lidVariantMap = new Map(lidVariants.map((v) => [v.id, v.name]));

    products = rawProducts.map((product) => ({
      ...product,
      bodyMaterialName: materialMap.get(product.bodyMaterial) || "",
      lidMaterialName: materialMap.get(product.lidMaterial) || "",
      lidTypeName: lidTypeMap.get(product.lidType) || "",
      lidVariantName: lidVariantMap.get(product.lidVariant) || "",
    }));

    products.sort((a, b) => idArray.indexOf(a.id) - idArray.indexOf(b.id));
  }

  const gridCols = getGridCols(products.length);

  return (
    <div className="bg-[#F8FAFC] text-text-primary font-sans min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-primary-50/20 to-transparent -z-10" />

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-6 lg:px-12 lg:py-6 relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-3">
            <Link href="/catalog" className="group flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-primary-500 transition-all cursor-pointer">
              <AppIcon name="arrow_back" className="text-sm transition-transform group-hover:-translate-x-1" />
              Kembali ke Katalog
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link href="/wishlist" className="group flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary hover:text-red-500 transition-all cursor-pointer">
              <Heart className="size-3 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
              Kembali ke Wishlist
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-[1.1] mb-3">
            Analisis Spesifikasi
          </h1>
          <p className="text-text-secondary max-w-2xl text-base font-medium leading-relaxed opacity-85">
            Bandingkan detail teknis antar kemasan untuk menemukan solusi terbaik bagi produk Anda.
          </p>
        </div>

        {products.length === 0 ? (
          /* Premium Empty State UI */
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center bg-white border border-border rounded-2xl max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-text-muted border border-border shadow-2xs">
              <AppIcon name="compare_arrows" className="text-3xl opacity-45" />
            </div>
            <p className="text-xl font-black text-text-primary tracking-tight">Belum Ada Produk Terpilih</p>
            <p className="text-sm mt-2 mb-10 max-w-md text-text-secondary font-medium opacity-85 leading-relaxed">
              Silakan pilih hingga 3 produk dari katalog terlebih dahulu untuk membandingkan spesifikasinya secara detail di sini.
            </p>
            <Link
              href="/catalog"
              className="bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-primary-600 transition-all text-xs active:scale-95 cursor-pointer shadow-md"
            >
              Jelajahi Katalog
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Spec Table View - Scroll Side-by-Side */}
            <div className="hidden sm:block w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent touch-pan-x">
              {/* Product Cards Header */}
              <div className={`grid ${gridCols} items-stretch gap-6 mb-8 min-w-175`}>
                {/* Invisible spacer cell to preserve spec alignment */}
                <div className="flex flex-col justify-end p-5 min-h-36 sm:min-h-48" />

                {products.map((product) => {
                  const image = getPrimaryImage(product);
                  return (
                    <div key={product.id} className="bg-white p-5 flex flex-col items-center text-center border border-border rounded-2xl relative group hover:border-primary-200 hover:shadow-md transition-all duration-300">
                      <Link
                        href={`/compare?ids=${ids?.split(",").filter((id) => id !== product.id).join(",")}`}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-text-muted hover:text-red-500 flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 scale-100 sm:scale-90 sm:group-hover:scale-100 z-20 cursor-pointer border border-border/30 shadow-2xs"
                        title="Hapus perbandingan"
                      >
                        <AppIcon name="close" className="text-sm" />
                      </Link>
                      <div className="relative size-28 sm:size-36 mx-auto mb-4 bg-slate-50/50 rounded-xl overflow-hidden p-2 border border-border/20 flex items-center justify-center">
                        {image ? (
                          <Image
                            alt={product.name}
                            fill
                            className="object-contain p-3 transform group-hover:scale-105 transition-transform duration-500"
                            src={image}
                            sizes="150px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <AppIcon name="inventory_2" className="text-4xl" />
                          </div>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`} className="hover:text-primary-500 transition-colors cursor-pointer w-full">
                        <h3 className="text-xs sm:text-sm font-black text-text-primary mb-2 leading-tight line-clamp-2 px-1 h-9 flex items-center justify-center">{product.name}</h3>
                      </Link>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-text-muted tracking-wider uppercase border border-border/50">
                        {product.sku}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Spec Comparison Table - Premium SaaS Spec Sheet Grid */}
              <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-border min-w-175">
                {[
                  { label: "Volume Kapasitas", getter: (p: Product) => `${getSpecValue(p, "volume_ml") || "-"} ml` },
                  { label: "Tinggi Total", getter: (p: Product) => `${getSpecValue(p, "tinggi_cm") || "-"} cm` },
                  { label: "Diameter Badan", getter: (p: Product) => `${getSpecValue(p, "diameter_badan_cm") || "-"} cm` },
                  { label: "Bahan Badan", getter: (p: Product) => p.bodyMaterialName || formatAttributeLabel(p.bodyMaterial) },
                  { label: "Bahan Tutup", getter: (p: Product) => p.lidMaterialName || formatAttributeLabel(p.lidMaterial) },
                  { label: "Variasi Tutup", getter: (p: Product) => p.lidVariantName || formatAttributeLabel(p.lidVariant) },
                  { label: "Status", getter: (p: Product) => getAvailabilityLabel(p.isAvailable) },
                  { label: "Kategori", getter: (p: Product) => getCategoryLabel(p.categoryId) },
                ].map((row, idx, arr) => (
                  <div key={row.label} className={cn(
                    "grid items-stretch",
                    idx === arr.length - 1 ? "" : "border-b border-border",
                    gridCols,
                    idx % 2 === 0 ? "bg-slate-50/30" : "bg-white",
                    "hover:bg-primary-50/10 transition-colors"
                  )}>
                    <div className="px-6 py-4.5 text-[10px] font-black text-text-secondary uppercase tracking-wider flex items-center border-r border-border bg-slate-50/20">{row.label}</div>
                    {products.map((p) => (
                      <div key={`${p.id}-${row.label}`} className="px-6 py-4.5 text-sm text-center text-text-primary font-bold flex items-center justify-center border-r border-border last:border-r-0 tracking-tight">
                        {row.getter(p)}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Price Row - Styled Separately as Highlighted Row */}
                <div className={`grid ${gridCols} items-stretch bg-white border-t border-border`}>
                  <div className="px-6 py-6 text-[10px] font-black text-primary-700 uppercase tracking-widest flex items-center border-r border-border bg-white">
                    Harga
                  </div>
                  {products.map((p) => {
                    const price = getLowestRetailPrice(p);
                    return (
                      <div key={`${p.id}-price`} className="px-6 py-6 text-center flex flex-col items-center justify-center border-r border-border last:border-r-0 bg-white">
                        <span className="text-xl sm:text-2xl font-black text-primary-600 tracking-tight">
                          {price > 0 ? formatPrice(price) : "Hubungi Kami"}
                        </span>
                        {price > 0 && <span className="text-[10px] font-bold text-primary-400 mt-1 uppercase tracking-widest">/ pcs</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons - Color Consistent Emerald Inquiry Buttons */}
              <div className={`grid ${gridCols} items-center mt-6 gap-6 min-w-175`}>
                <div />
                {products.map((p) => (
                  <a
                    key={`${p.id}-cta`}
                    href={buildInquiryUrl(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 border border-emerald-600 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm group"
                  >
                    <AppIcon name="chat" className="text-sm" />
                    Tanya via WhatsApp
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Stacked View - Vertical Cards (No sideways scroll) */}
            <div className="block sm:hidden space-y-6">
              {products.map((product) => {
                const image = getPrimaryImage(product);
                const price = getLowestRetailPrice(product);
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-border overflow-hidden p-5 relative">
                    <Link
                      href={`/compare?ids=${ids?.split(",").filter((id) => id !== product.id).join(",")}`}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-text-muted flex items-center justify-center border border-border/30 cursor-pointer shadow-2xs"
                      title="Hapus perbandingan"
                    >
                      <AppIcon name="close" className="text-sm" />
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative size-20 shrink-0 bg-slate-50 rounded-xl overflow-hidden p-2 border border-border/10">
                        {image ? (
                          <Image src={image} alt={product.name} fill className="object-contain p-1" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <AppIcon name="inventory_2" className="text-3xl" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-text-muted tracking-wider uppercase border border-border/50">
                          {product.sku}
                        </span>
                        <Link href={`/products/${product.id}`} className="hover:text-primary-500 transition-colors cursor-pointer block mt-1">
                          <h3 className="text-sm font-black text-text-primary leading-tight line-clamp-2">{product.name}</h3>
                        </Link>
                      </div>
                    </div>

                    {/* Spec List */}
                    <div className="divide-y divide-border border-y border-border mb-4">
                      {[
                        { label: "Volume Kapasitas", value: `${getSpecValue(product, "volume_ml") || "-"} ml` },
                        { label: "Tinggi Total", value: `${getSpecValue(product, "tinggi_cm") || "-"} cm` },
                        { label: "Diameter Badan", value: `${getSpecValue(product, "diameter_badan_cm") || "-"} cm` },
                        { label: "Bahan Badan", value: product.bodyMaterialName || formatAttributeLabel(product.bodyMaterial) },
                        { label: "Bahan Tutup", value: product.lidMaterialName || formatAttributeLabel(product.lidMaterial) },
                        { label: "Variasi Tutup", value: product.lidVariantName || formatAttributeLabel(product.lidVariant) },
                        { label: "Status", value: getAvailabilityLabel(product.isAvailable) },
                        { label: "Kategori", value: getCategoryLabel(product.categoryId) },
                      ].map((item) => (
                        <div key={item.label} className="py-2.5 flex justify-between gap-4 text-xs">
                          <span className="font-semibold text-text-secondary">{item.label}</span>
                          <span className="font-bold text-text-primary text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price Row */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-border mb-4">
                      <span className="text-[10px] font-black text-primary-700 uppercase tracking-wider">Harga:</span>
                      <div className="text-right">
                        <span className="text-lg font-black text-primary-600 tracking-tight block">
                          {price > 0 ? formatPrice(price) : "Hubungi Kami"}
                        </span>
                        {price > 0 && <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest">/ pcs</span>}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={buildInquiryUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-500 border border-emerald-600 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm group"
                    >
                      <AppIcon name="chat" className="text-sm" />
                      Tanya via WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
