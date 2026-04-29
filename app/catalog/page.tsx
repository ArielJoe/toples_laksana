import type { Metadata } from "next";
import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Katalog Produk - Toples Laksana",
  description:
    "Eksplorasi koleksi kemasan industri berkualitas tinggi. Toples plastik, kaca, cylinder, kaleng, dan botol dari distributor terpercaya di Bandung.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}
