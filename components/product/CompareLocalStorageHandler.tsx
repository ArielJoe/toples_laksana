"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface CompareLocalStorageHandlerProps {
  ids: string | undefined;
}

export default function CompareLocalStorageHandler({ ids }: CompareLocalStorageHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if the current URL has the search param 'ids' (even if empty)
    const params = new URLSearchParams(window.location.search);
    const hasIdsParam = params.has("ids");

    if (hasIdsParam) {

      const currentIds = params.get("ids") || "";
      
      // Hapus dulu semua di localStorage
      localStorage.removeItem("compare_product_ids");
      
      // Baru tambahkan product yang dipilih
      if (currentIds) {
        localStorage.setItem("compare_product_ids", currentIds);
      }
    } else {

      const savedIds = localStorage.getItem("compare_product_ids");
      if (savedIds) {
        router.replace(`/compare?ids=${savedIds}`);
      }
    }
  }, [ids, router]);

  return null;
}
