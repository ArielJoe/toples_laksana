"use client";

import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRightIcon, BadgeCheckIcon, BoxesIcon, ClockIcon, HandshakeIcon, MapPinIcon, MessageCircleIcon, NavigationIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MAPS_URL =
  "https://www.google.com/maps/place/Toko+Toples+Laksana/@-6.9219723,107.5995147,823m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e68e623958f611b:0xb6da297f1c6b25f!8m2!3d-6.9219723!4d107.6020896!16s%2Fg%2F11cjj829nv?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D";

const VALUES = [
  {
    step: "01",
    title: "Pilihan Lengkap",
    text: "Menyediakan toples, jar, kaleng, dan kemasan pendukung untuk kebutuhan ritel maupun produksi.",
    icon: BoxesIcon,
  },
  {
    step: "02",
    title: "Konsultasi Ukuran",
    text: "Membantu pelanggan mencocokkan kapasitas, bentuk, dan tipe tutup dengan karakter produk.",
    icon: HandshakeIcon,
  },
  {
    step: "03",
    title: "Siap Grosir",
    text: "Cocok untuk UMKM, reseller, toko bahan kue, hampers, dan kebutuhan stok kemasan musiman.",
    icon: BadgeCheckIcon,
  },
];

export default function TentangPageClient() {
  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="mx-auto max-w-screen-2xl px-6 pt-12 pb-20 lg:px-12 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="inline-block text-xs font-black uppercase tracking-[0.25em] text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full">
              Tentang Kami
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary lg:text-6xl leading-[1.1]">
              Partner kemasan untuk bisnis yang terus bertumbuh.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary lg:text-lg">
              Toples Laksana adalah toko kemasan di Bandung yang melayani kebutuhan toples, jar, kaleng, dan
              kemasan pendukung untuk usaha makanan, hampers, reseller, dan kebutuhan industri.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Link
                href="/catalog"
                className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl bg-primary-500 px-6 font-bold text-white transition-all hover:bg-primary-600 cursor-pointer")}
              >
                Lihat Katalog
                <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href="#lokasi"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl px-6 font-bold border-border transition-all hover:bg-secondary-50 cursor-pointer")}
              >
                <MapPinIcon className="size-4" />
                Kunjungi Toko
              </a>
            </div>
          </motion.div>

          {/* Hero Right Floating Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 grid grid-cols-2 gap-4 relative"
          >
            {/* Stat Card 1 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="bg-white p-6 rounded-2xl border border-border"
            >
              <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-text-muted">Fokus</span>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold text-text-primary">Kemasan</p>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="bg-white p-6 rounded-2xl border border-border mt-4 lg:mt-8"
            >
              <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-text-muted">Lokasi</span>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold text-text-primary">Bandung</p>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-border -mt-4 lg:-mt-2"
            >
              <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-text-muted">Layanan</span>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold text-text-primary">Retail</p>
            </motion.div>

            {/* Stat Card 4 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.7 }}
              className="bg-white p-6 rounded-2xl border border-border mt-0 lg:mt-6"
            >
              <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-text-muted">Skala</span>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold text-text-primary">Grosir</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scrollytelling Journey Section ("Cara Kami Bekerja") */}
      <section className="border-y border-border bg-secondary-50/50 px-6 py-20 lg:px-12 relative">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full inline-block">
              Cara Kami Bekerja
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
              Praktis, jelas, dan dekat dengan kebutuhan pembeli.
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
              Kami memandu Anda dari pencarian awal hingga penyediaan stok dalam jumlah besar.
            </p>
          </div>

          {/* Scrollytelling Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2" />

            {/* Steps */}
            <div className="space-y-12">
              {VALUES.map((item, idx) => {
                const Icon = item.icon;
                const isEven = idx % 2 === 0;

                return (
                  <div key={item.title} className="relative flex flex-col md:flex-row items-start md:items-center">
                    {/* Timeline Node */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex size-8 items-center justify-center rounded-full bg-primary-500 text-white font-black text-xs z-10">
                      {item.step}
                    </div>

                    {/* Left spacer / card container */}
                    <div className={cn(
                      "w-full md:w-1/2 pl-12 md:pl-0",
                      isEven ? "md:pr-12 md:text-right" : "md:order-last md:pl-12 md:text-left"
                    )}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Card className="rounded-2xl border-border bg-white hover:bg-secondary-50/50 transition-colors">
                          <CardContent className="p-6 space-y-4">
                            <div className={cn(
                              "flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500",
                              isEven ? "md:ml-auto" : "md:mr-auto"
                            )}>
                              <Icon className="size-5" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-extrabold text-text-primary">{item.title}</h3>
                              <p className="text-sm font-medium leading-relaxed text-text-secondary">{item.text}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Empty block on the opposite side to hold spacing */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full inline-block">
              Target Pengguna
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
              Untuk siapa Toples Laksana?
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              Kami melayani berbagai skala usaha, membantu menyajikan kemasan terbaik untuk meningkatkan penjualan produk Anda.
            </p>
          </motion.div>

          <div className="lg:col-span-7 grid gap-4">
            {[
              {
                title: "UMKM & Ritel Kuliner",
                desc: "Solusi kemasan toples plastik, jar kaca tebal untuk makanan ringan, kue kering, sambal, selai, dan produk olahan rumahan.",
                bg: "from-blue-500/10 to-indigo-500/10",
              },
              {
                title: "Reseller & Toko Bahan Kue",
                desc: "Penyediaan stok kemasan berkelanjutan dengan harga distributor bersaing untuk reseller kemasan dan toko ritel bahan kue.",
                bg: "from-emerald-500/10 to-teal-500/10",
              },
              {
                title: "Event Organizer & Hampers",
                desc: "Pilihan toples tabung/cylinder, kaleng tin eksklusif untuk seasonal hampers, souvenir pernikahan, dan custom packaging unik.",
                bg: "from-amber-500/10 to-orange-500/10",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 rounded-2xl border border-border p-5 bg-white hover:border-primary-300 hover:bg-secondary-50/30 transition-colors"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-black text-sm text-primary-600">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-black text-text-primary">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-text-secondary">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Maps & Reviews Section */}
      <section id="lokasi" className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-12 lg:px-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6"
        >
          <span className="inline-block text-xs font-black uppercase tracking-[0.25em] text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full">
            Lokasi Toko
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
            Kunjungi Toples Laksana
          </h2>
          <p className="text-base leading-relaxed text-text-secondary">
            Datang langsung untuk melihat pilihan kemasan, mencocokkan ukuran, dan konsultasi kebutuhan grosir.
          </p>

          <div className="space-y-4 pt-2">
            <InfoRow
              icon={<MapPinIcon className="size-5" />}
              title="Alamat"
              text="Jl. Raya Kopo No.125, Situsaeur, Kec. Bojongloa Kidul, Kota Bandung, Jawa Barat 40232"
            />
            <InfoRow
              icon={<ClockIcon className="size-5" />}
              title="Jam Operasional"
              text="Setiap hari, 08.00 - 16.30"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-4">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl bg-primary-500 px-6 font-bold text-white transition-all hover:bg-primary-600 cursor-pointer")}
            >
              <NavigationIcon className="size-4" />
              Buka Google Maps
            </a>
            <a
              href="https://wa.me/6282240923336?text=Halo%20Toples%20Laksana%2C%20saya%20ingin%20bertanya%20stok%20toples."
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl px-6 font-bold border-border transition-all hover:bg-secondary-50 cursor-pointer")}
            >
              <MessageCircleIcon className="size-4" />
              Tanya Stok
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <Card className="overflow-hidden rounded-2xl border border-border bg-white p-0">
            <iframe
              title="Peta Toples Laksana"
              src="https://www.google.com/maps?q=Toko%20Toples%20Laksana%20Jl.%20Raya%20Kopo%20No.125%20Bandung&output=embed"
              className="h-105 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>
        </motion.div>
      </section>

      {/* Google Reviews Section */}
      <section className="border-y border-border bg-secondary-50/50 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full inline-block">
                Google Review
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
                Cuplikan Review Pelanggan
              </h2>
              <p className="max-w-2xl text-text-secondary text-sm">
                Review Google ditampilkan langsung melalui embed resmi widget.
              </p>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl bg-white px-5 font-bold border-border transition-all hover:bg-secondary-50 cursor-pointer")}
            >
              Lihat di Google
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border bg-white p-4"
          >
            <div className="sk-ww-google-reviews" data-embed-id="25684114" />
            <Script
              src="https://widgets.sociablekit.com/google-reviews/widget.js"
              strategy="afterInteractive"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-white p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-black text-text-primary">{title}</h3>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-text-secondary">{text}</p>
      </div>
    </div>
  );
}
