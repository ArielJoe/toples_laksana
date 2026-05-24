import type { Metadata } from "next";
import TentangPageClient from "@/components/tentang/TentangPageClient";

export const metadata: Metadata = {
  title: "Tentang Kami - Toples Laksana",
  description: "Tentang Toples Laksana, penyedia kemasan toples dan jar di Bandung.",
};

export default function TentangPage() {
  return <TentangPageClient />;
}
