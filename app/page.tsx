"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  MessageCircleIcon,
  TrendingUp
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCleanWANumber } from "@/lib/whatsapp-builder";

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

interface TrendingProduct {
  id: string;
  name: string;
  price: string;
  img: string;
  clickCount: number;
}

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products/trending?limit=4", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: TrendingProduct[] } | null) => {
        if (payload?.data?.length) {
          setTrendingProducts(payload.data);
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to load trending products:", error);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsTrendingLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-svh flex-col lg:flex-row lg:items-stretch w-full bg-white pt-17 lg:pt-0 lg:h-screen lg:min-h-0 overflow-hidden">
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2 flex items-center px-6 py-12 lg:px-16 lg:pt-20 lg:pb-8 lg:h-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl mx-auto lg:mx-0 w-full space-y-5 lg:space-y-6"
          >
            <h1 className="text-4xl font-extrabold leading-[1.1] text-text-primary lg:text-6xl">
              Kemasan toples untuk kebutuhan usaha.
            </h1>
            <p className="text-base leading-relaxed text-text-secondary lg:text-lg">
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
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 h-87.5 sm:h-125 lg:h-full bg-slate-100 flex items-center justify-center relative p-8 sm:p-16 lg:pt-28 lg:pb-12 lg:px-24 overflow-hidden mt-5"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/toples.png"
              alt="Koleksi toples Toples Laksana"
              fill
              className="object-contain transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>
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
            {isTrendingLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={`trending-loading-${index}`}
                  className="h-full overflow-hidden rounded-2xl border border-border bg-white p-0"
                >
                  <CardContent className="flex h-full flex-col p-4">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-secondary-50" />
                    <div className="mt-auto space-y-3">
                      <div className="h-4 w-3/4 rounded-full bg-secondary-50" />
                      <div className="h-3 w-1/2 rounded-full bg-secondary-50" />
                    </div>
                  </CardContent>
                </Card>
              ))
              : trendingProducts.map((item, index) => (
              <motion.div
                key={item.id}
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
                      <div className="mt-2 flex items-center gap-1.5 text-sm font-black text-primary-500">
                        <TrendingUp className="h-4 w-4 stroke-[2.5]" />
                        <span>{item.clickCount || 0}</span>
                      </div>
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
              <ArrowRightIcon className="size-4" />
            </Link>
            <a
              href={`https://wa.me/${getCleanWANumber()}?text=Halo%20Toples%20Laksana%2C%20saya%20ingin%20bertanya%20stok%20toples.`}
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
