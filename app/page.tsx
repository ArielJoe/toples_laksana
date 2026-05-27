"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  MessageCircleIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    name: "Jar Cylinder",
    desc: "Toples silinder untuk makanan kering, display produk, dan kebutuhan ritel.",
    image: "/toples.png",
  },
  {
    name: "Jar Kaca",
    desc: "Kemasan kaca untuk selai, madu, sambal, dan produk makanan rumahan.",
    image: "/toples.png",
  },
  {
    name: "Tin Kaleng",
    desc: "Kemasan metal untuk hampers, souvenir, dan produk yang perlu perlindungan ekstra.",
    image: "/toples.png",
  },
  {
    name: "Jar Plastik",
    desc: "Pilihan ringan untuk stok harian UMKM, reseller, dan toko bahan kue.",
    image: "/toples.png",
  },
];

const TRENDING_PRODUCTS = [
  { name: "Jar Cylinder 200 ml", price: "Rp 2.500", img: "/toples.png" },
  { name: "Jar Cylinder 350 ml", price: "Rp 3.200", img: "/toples.png" },
  { name: "Toples Plastik 500 ml", price: "Rp 4.500", img: "/toples.png" },
  { name: "Jar Kaca Premium", price: "Hubungi Kami", img: "/toples.png" },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[100svh] items-center px-6 pb-10 pt-32 lg:h-screen lg:min-h-0 lg:px-12 lg:pb-12 lg:pt-36">
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-5"
          >
            <h1 className="text-4xl font-extrabold leading-[1.1] text-text-primary lg:text-6xl">
              Kemasan toples untuk kebutuhan usaha.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary lg:text-lg">
              Toples Laksana menyediakan toples plastik, jar kaca, dan kaleng untuk UMKM, reseller, hampers, dan kebutuhan produksi. Tersedia pilihan ecer dan grosir.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/catalog"
                className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl bg-primary-500 px-6 font-bold text-white transition-all hover:bg-primary-600")}
              >
                Jelajahi Katalog
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/tentang"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl border-border px-6 font-bold transition-all hover:bg-secondary-50")}
              >
                Tentang Kami
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary-50/50 sm:h-[340px] lg:h-[min(560px,calc(100vh-13rem))]"
          >
            <Image
              src="/toples.png"
              alt="Koleksi toples Toples Laksana"
              fill
              className="object-contain p-8 transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <section className="border-y border-border bg-secondary-50/50 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-extrabold text-text-primary lg:text-4xl">
                Kategori kemasan yang tersedia.
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                Lihat pilihan berdasarkan jenis kemasan, lalu bandingkan ukuran, warna tutup, dan harga di katalog.
              </p>
            </div>
            <Link
              href="/catalog"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl bg-white px-5 font-bold transition-all hover:bg-secondary-50")}
            >
              Lihat Semua
              <ArrowRightIcon className="size-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="h-full"
              >
                <Link
                  href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary-300 hover:bg-secondary-50/40"
                >
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-xl bg-secondary-50">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-base font-black text-text-primary">{cat.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm font-semibold leading-relaxed text-text-secondary">{cat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="border-y border-border bg-secondary-50/50 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-12 max-w-3xl space-y-4 text-center"
          >
            <h2 className="text-3xl font-extrabold text-text-primary lg:text-4xl">Produk yang sering dicari.</h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Beberapa pilihan kemasan yang banyak digunakan untuk ritel, hampers, dan stok produksi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRENDING_PRODUCTS.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="h-full"
              >
                <Card className="group h-full overflow-hidden rounded-2xl border border-border bg-white p-0 transition-colors hover:border-primary-300 hover:bg-secondary-50/40">
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-secondary-50">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-end">
                      <h3 className="text-sm font-black text-text-primary sm:text-base">{item.name}</h3>
                      <p className="mt-2 text-sm font-bold text-primary-500">{item.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-20 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl space-y-6"
        >
          <h2 className="text-3xl font-extrabold leading-[1.1] text-text-primary lg:text-5xl">
            Cari kemasan yang sesuai dengan produk Anda.
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Buka katalog untuk melihat produk yang tersedia, atau hubungi tim kami untuk konfirmasi stok, warna, dan harga grosir.
          </p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/catalog"
              className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl bg-primary-500 px-6 font-bold text-white transition-all hover:bg-primary-600")}
            >
              Buka Katalog
              <BadgeCheckIcon className="size-4" />
            </Link>
            <a
              href="https://wa.me/6282240923336?text=Halo%20Toples%20Laksana%2C%20saya%20ingin%20bertanya%20stok%20toples."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl border-border bg-white px-6 font-bold transition-all hover:bg-secondary-50")}
            >
              <MessageCircleIcon className="size-4" />
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
