"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/catalog/ProductCard";
import { Product } from "@/types/product";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { user, loading, wishlist, loginWithGoogle } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user || wishlist.length === 0) {
      setProducts([]);
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        setFetching(true);
        // Build query string like id=1&id=2...
        const query = wishlist.map((id) => `id=${encodeURIComponent(id)}`).join("&");
        const res = await fetch(`/api/products?${query}&limit=50`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch wishlist products", error);
      } finally {
        setFetching(false);
      }
    };

    fetchWishlistProducts();
  }, [user, wishlist]);

  return (
    <main className="bg-white min-h-[70vh] px-6 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-10">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-500">
            Aktivitas Saya
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
            Wishlist Saya
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Daftar produk kemasan pilihan Anda yang disimpan untuk konsultasi atau pemesanan nanti.
          </p>
        </div>

        {loading || (fetching && products.length === 0) ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-primary-600 font-bold tracking-widest text-xs uppercase mt-4">Memuat Wishlist...</p>
          </div>
        ) : !user ? (
          /* Unauthenticated State - Flat Design */
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-center mb-6 text-text-muted opacity-25">
              <Heart className="size-16" />
            </div>
            <p className="text-xl font-black text-text-primary tracking-tight">Belum Masuk Akun</p>
            <p className="text-sm mt-2 mb-8 max-w-md text-text-secondary font-medium">
              Silakan masuk menggunakan akun Google Anda terlebih dahulu untuk menyimpan dan melihat wishlist produk.
            </p>
            <button
              onClick={loginWithGoogle}
              className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all border border-primary-600 cursor-pointer"
            >
              Masuk dengan Google
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty Wishlist State - Flat Design */
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-center mb-6 text-text-muted opacity-25">
              <Heart className="size-16" />
            </div>
            <p className="text-xl font-black text-text-primary tracking-tight">Wishlist Kosong</p>
            <p className="text-sm mt-2 mb-8 max-w-md text-text-secondary font-medium">
              Anda belum menambahkan produk apa pun ke dalam wishlist Anda. Jelajahi katalog kami untuk menemukan kemasan yang cocok!
            </p>
            <Link
              href="/catalog"
              className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all border border-primary-600 cursor-pointer"
            >
              Jelajahi Katalog
            </Link>
          </div>
        ) : (
          /* Wishlist Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
