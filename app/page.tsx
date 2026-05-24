import Link from 'next/link';
import Image from 'next/image';
import { AppIcon } from "@/components/ui/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const CATEGORIES = [
  {
    name: "Jar Cylinder",
    icon: "inventory_2",
    desc: "Pilihan utama untuk cookies dan snack premium dengan tampilan modern transparan.",
    image: "/toples.png",
  },
  {
    name: "Jar Kaca",
    icon: "liquor",
    desc: "Material kaca tebal grade industri, cocok untuk selai, madu, dan produk artisan.",
    image: "/toples.png",
  },
  {
    name: "Tin Kaleng",
    icon: "deployed_code",
    desc: "Proteksi maksimal dengan material metalic yang memberikan kesan klasik dan eksklusif.",
    image: "/toples.png",
  },
  {
    name: "Jar Plastik",
    icon: "layers",
    desc: "Ringan, ekonomis, dan tahan banting. Tersedia dalam berbagai ukuran praktis.",
    image: "/toples.png",
  },
];

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-28 pb-12 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7">
            <span className="inline-block text-primary-600 font-bold tracking-[0.2em] text-xs mb-4 uppercase">
              Distributor Kemasan Premium
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6">
              Pilih Toples <br />Sesuai Kebutuhan
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
              Tingkatkan nilai produk ritel atau horeka Anda dengan koleksi kemasan organik pilihan kami, dirancang untuk menghadirkan keindahan taktil pada ruang sehari-hari.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary-500 text-white rounded-xl font-bold transition-all hover:bg-primary-600 gap-2 h-12 px-7 cursor-pointer"
                )}
              >
                Jelajahi Katalog
                <AppIcon name="arrow_forward" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="aspect-4/5 w-full max-w-112.5 max-h-[75vh] rounded-2xl overflow-hidden relative group">
              <Image
                src="/toples.png"
                alt="Koleksi Jar Premium"
                fill
                className="object-contain group-hover:scale-[0.82] transition-transform duration-700 scale-75"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Koleksi Pilihan</h2>
            <p className="text-text-secondary mt-2">Dikurasi untuk pembeli profesional dan studio desain.</p>
          </div>
          <Link href="/catalog" className="text-primary-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            Lihat Semua Kategori <AppIcon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col cursor-pointer"
            >
              <div className="aspect-square rounded-xl bg-white border border-border overflow-hidden mb-4 relative transition-all">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain scale-75 group-hover:scale-[0.82] transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-bold text-text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="py-24 bg-secondary-50 px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto text-center mb-16">
          <span className="text-primary-500 font-black tracking-widest text-xs uppercase mb-4 block">Paling Banyak Diminati</span>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Sedang Tren</h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            Produk terpopuler kami berdasarkan interaksi pelanggan dan permintaan grosir bulan ini.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
          {[
            { name: "Sage Stoneware Mug", price: "Rp 12.500", img: "/toples.png" },
            { name: "Oatmeal Linen Napkins", price: "Rp 45.000", img: "/toples.png" },
            { name: "Ribbed Ceramic Canister", price: "Rp 32.000", img: "/toples.png" },
            { name: "Olive Wood Board", price: "Rp 85.000", img: "/toples.png" },
          ].map((item) => (
            <Card key={item.name} className="overflow-hidden border border-border transition-all group rounded-xl bg-white p-0">
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg bg-secondary-50 overflow-hidden mb-4 relative">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-700 scale-75"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm sm:text-base">{item.name}</h4>
                    <p className="text-primary-500 font-bold mt-1 text-sm">{item.price}</p>
                  </div>
                  <div className="bg-primary-50 text-primary-500 p-2 rounded-lg shrink-0">
                    <AppIcon name="trending_up" className="text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 lg:px-12 text-center max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-6xl font-extrabold text-text-primary tracking-tight mb-8">
          Siap meningkatkan estetika <br />
          <span className="text-primary-500">bisnis Anda?</span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/catalog"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-all gap-3 h-14 px-10"
            )}
          >
            Buka Katalog
            <AppIcon name="shopping_bag" />
          </Link>
          <a
            href="https://wa.me/6281234567890"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "bg-white text-text-primary border-2 border-primary-500 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all gap-3 h-14 px-10 cursor-pointer"
            )}
          >
            Hubungi Kami
            <AppIcon name="chat" />
          </a>
        </div>
      </section>
    </main>
  );
}
