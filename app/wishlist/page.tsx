"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/catalog/ProductCard";
import { Product, ProductPrice, getLowestRetailPrice, getLowestWholesalePrice, PRICE_TYPE_IDS } from "@/types/product";
import { Heart } from "lucide-react";
import { AppIcon } from "@/components/ui/app-icon";
import {
  buildWishlistInquiryWithPricesMessage,
  buildWishlistInquiryWithPricesUrl,
} from "@/lib/whatsapp-builder";
import { formatPrice } from "@/lib/price-calculator";

interface ModalItem {
  product: Product;
  quantity: number;
  unit: "pcs" | "bal";
  priceTypeId?: string;
}

export default function WishlistPage() {
  const { user, loading, wishlist, loginWithGoogle } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [inquirySelections, setInquirySelections] = useState<{ id: string; unit: "pcs" | "bal" }[]>([]);
  const inquiryIds = inquirySelections.map((item) => item.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<ModalItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [priceTypeNames, setPriceTypeNames] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    const fetchPriceTypes = async () => {
      try {
        const res = await fetch("/api/price-types");
        const data = await res.json();
        if (data.data) {
          const map: Record<string, string> = {};
          data.data.forEach((pt: { id: string; name: string }) => {
            map[pt.id] = pt.name;
          });
          setPriceTypeNames(map);
        }
      } catch (err) {
        console.error("Failed to fetch price types", err);
      }
    };
    fetchPriceTypes();
  }, []);

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

  // Filter out compareIds and inquirySelections that are no longer in the wishlist
  useEffect(() => {
    setCompareIds((prev) => prev.filter((id) => wishlist.includes(id)));
    setInquirySelections((prev) => prev.filter((item) => wishlist.includes(item.id)));
  }, [wishlist]);

  // Toggle product comparison (max 3)
  const handleCompareToggle = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  // Handle inquiry selection with unit
  const handleInquirySelect = (productId: string, unit: "pcs" | "bal" | "") => {
    setInquirySelections((prev) => {
      if (!unit) {
        return prev.filter((item) => item.id !== productId);
      }
      const exists = prev.some((item) => item.id === productId);
      if (exists) {
        return prev.map((item) =>
          item.id === productId ? { ...item, unit } : item
        );
      }
      return [...prev, { id: productId, unit }];
    });
  };

  // Open modal and pre-fill items with their chosen unit and default quantity of 1
  const handleOpenModal = () => {
    const items = inquirySelections
      .map((sel) => {
        const product = products.find((p) => p.id === sel.id);
        if (!product) return null;

        const productPrices = product.prices || [];
        let defaultPriceType = "";
        if (sel.unit === "bal") {
          const wholesalePrice = productPrices.find(p => p.priceTypeId === PRICE_TYPE_IDS.perBal && p.price > 0);
          defaultPriceType = wholesalePrice ? wholesalePrice.priceTypeId : PRICE_TYPE_IDS.perBal;
        } else {
          const retailPrice = productPrices.find(p => p.priceTypeId !== PRICE_TYPE_IDS.perBal && p.price > 0);
          defaultPriceType = retailPrice ? retailPrice.priceTypeId : PRICE_TYPE_IDS.withLid;
        }

        return {
          product,
          quantity: 1,
          unit: sel.unit,
          priceTypeId: defaultPriceType,
        };
      })
      .filter(Boolean) as ModalItem[];
    setModalItems(items);
    setIsModalOpen(true);
  };

  // Update quantity inside the modal
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setModalItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  const getPriceTypeLabel = (priceTypeId?: string, price?: ProductPrice | null) => {
    if (price?.priceTypeName) return price.priceTypeName;
    if (priceTypeId && priceTypeNames[priceTypeId]) return priceTypeNames[priceTypeId];
    if (priceTypeId === PRICE_TYPE_IDS.withLid) return "Harga Per Pcs";
    if (priceTypeId === PRICE_TYPE_IDS.perBal) return "Harga Per Bal";
    return priceTypeId ? priceTypeId.replace(/[_-]+/g, " ") : "Harga";
  };

  const getSelectedPriceVariant = (item: ModalItem) => {
    if (!item.priceTypeId) return null;

    const matches = (item.product.prices || [])
      .filter((price) => price.priceTypeId === item.priceTypeId && price.price > 0)
      .sort((a, b) => a.price - b.price);

    return matches[0] || null;
  };

  const getPriceVariantOptions = (product: Product) => {
    const options = new Map<string, { id: string; name: string; quantity: number; price: number }>();

    (product.prices || []).forEach((price) => {
      if (!price.priceTypeId || price.price <= 0) return;

      const existing = options.get(price.priceTypeId);
      if (existing && existing.price <= price.price) return;

      options.set(price.priceTypeId, {
        id: price.priceTypeId,
        name: getPriceTypeLabel(price.priceTypeId, price),
        quantity: price.quantity || 1,
        price: price.price,
      });
    });

    return Array.from(options.values());
  };

  // Update price type inside the modal
  const handleUpdatePriceType = (productId: string, priceTypeId: string) => {
    const isBal = priceTypeId === PRICE_TYPE_IDS.perBal;
    setModalItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, priceTypeId, unit: isBal ? "bal" : "pcs" }
          : item
      )
    );
  };

  const getModalItemPricing = (item: ModalItem) => {
    const selectedPrice = getSelectedPriceVariant(item);
    const wholesalePriceObj = (item.product.prices || []).find(p => p.priceTypeId === PRICE_TYPE_IDS.perBal);
    const defaultBalQuantity = wholesalePriceObj?.quantity || 50;

    let unitPrice = selectedPrice?.price || 0;
    let variantQuantity = selectedPrice?.quantity || (item.unit === "bal" ? defaultBalQuantity : 1);
    let isPackagePrice = selectedPrice?.priceTypeId === PRICE_TYPE_IDS.perBal || item.priceTypeId === PRICE_TYPE_IDS.perBal;
    const priceTypeLabel = getPriceTypeLabel(item.priceTypeId, selectedPrice);

    if (unitPrice === 0) {
      const isWholesale = item.unit === "bal";
      const wholesalePrice = getLowestWholesalePrice(item.product);
      const retailPrice = getLowestRetailPrice(item.product);
      isPackagePrice = isWholesale;
      variantQuantity = isWholesale ? defaultBalQuantity : 1;
      unitPrice = isWholesale && wholesalePrice > 0
        ? wholesalePrice
        : isWholesale
        ? retailPrice * defaultBalQuantity
        : retailPrice;
    }

    return {
      unitPrice,
      variantQuantity,
      totalPcs: item.quantity * variantQuantity,
      priceTypeLabel,
      subtotal: isPackagePrice ? unitPrice * item.quantity : unitPrice * item.quantity * variantQuantity,
    };
  };

  const handleSendWishlistInquiry = () => {
    const details = modalItems.map((item) => {
      const { unitPrice, subtotal, variantQuantity } = getModalItemPricing(item);

      return {
        productId: item.product.id,
        unit: variantQuantity > 1 ? `x ${variantQuantity} pcs` : "pcs",
        quantity: item.quantity,
        priceAtThatTime: unitPrice,
        subtotal,
      };
    });

    fetch("/api/whatsapp-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.email || "guest",
        message: buildWishlistInquiryWithPricesMessage(modalItems, priceTypeNames),
        grandTotal: details.reduce((sum, detail) => sum + detail.subtotal, 0),
        details: details.map(({ subtotal, ...rest }) => rest),
      }),
    }).catch(console.error);

    setIsModalOpen(false);
  };

  return (
    <main className="bg-white min-h-[70vh] px-6 py-4 lg:px-12 lg:py-8 relative">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6">
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
            Wishlist Saya
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Daftar produk kemasan pilihan Anda yang disimpan untuk konsultasi atau pemesanan nanti.
          </p>
        </div>

        {!mounted || loading || (fetching && products.length === 0) ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
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
          <>
            {/* WhatsApp Inquiry Selection Toolbar */}
            <div className="sticky top-25 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-text-secondary uppercase tracking-wider">
                  Pilih produk untuk ditanyakan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-primary mr-1">
                  Terpilih: <span className="font-black text-text-primary">{inquiryIds.length}</span> produk
                </span>
                {inquiryIds.length > 0 && (
                  <>
                    <button
                      onClick={() => setInquirySelections([])}
                      className="px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all active:scale-[0.97] shadow-sm"
                    >
                      Reset Pilihan
                    </button>
                    <button
                      onClick={handleOpenModal}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97] border border-emerald-600 shadow-sm"
                    >
                      <AppIcon name="chat" className="text-sm" />
                      Tanya via WhatsApp
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
              {products.map((product) => {
                const selection = inquirySelections.find((item) => item.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCompareToggle={handleCompareToggle}
                    isComparing={compareIds.includes(product.id)}
                    onInquirySelect={handleInquirySelect}
                    selectedUnit={selection?.unit || ""}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-white/95 text-text-primary rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 sm:gap-4 pl-1 sm:pl-2">
              <div className="flex -space-x-3">
                {compareIds.slice(0, 3).map((id) => {
                  const product = products.find((p) => p.id === id);
                  const imageUrl = product?.images?.[0]?.imageUrl || "/toples.png";
                  return (
                    <div
                      key={id}
                      className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-50 overflow-hidden flex items-center justify-center shadow-xs"
                    >
                      <Image
                        src={imageUrl}
                        alt={product?.name || "Product"}
                        fill
                        className="object-contain p-0.5"
                        sizes="40px"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] sm:text-xs font-black uppercase tracking-widest text-text-primary whitespace-nowrap">
                  {compareIds.length} Produk Terpilih
                </p>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-text-secondary font-medium truncate">
                  Bandingkan maks. 3 produk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setCompareIds([])}
                className="text-[0.65rem] sm:text-xs font-bold text-text-secondary hover:text-text-primary transition-colors px-2 tracking-widest whitespace-nowrap cursor-pointer border-none bg-transparent"
              >
                BATAL
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(",")}`}
                className="flex-1 sm:flex-none bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[0.65rem] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer border-none shadow-md"
              >
                Bandingkan
                <AppIcon name="compare_arrows" className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Inquiry Summary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-2xl font-black text-text-primary tracking-tight">Ringkasan Diskusi WhatsApp</h3>
                <p className="text-sm text-text-secondary mt-0.5">Tentukan jumlah masing-masing produk sebelum memulai obrolan.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border text-text-secondary hover:text-red-500 hover:border-red-100 transition-colors cursor-pointer"
              >
                <AppIcon name="close" className="text-lg" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
              {modalItems.map((item, idx) => {
                const product = item.product;
                const image = product.images?.[0]?.imageUrl || "/toples.png";
                const { unitPrice, subtotal, variantQuantity, totalPcs } = getModalItemPricing(item);
                const priceOptions = getPriceVariantOptions(product);

                return (
                  <div key={product.id} className={`flex items-center gap-4 ${idx > 0 ? "pt-4" : ""}`}>
                    {/* Product Image */}
                    <div className="relative size-16 shrink-0 border border-border rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                      <Image src={image} alt={product.name} fill className="object-contain" sizes="64px" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-text-primary truncate">{product.name}</h4>
                      <p className="text-[10px] text-text-secondary font-mono tracking-wider mt-0.5">{product.sku}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {priceOptions.length === 0 ? (
                          <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-primary-500 text-white border border-primary-500">
                            {item.unit === "bal" ? "Harga Per Bal" : "Harga Per Pcs"}
                          </span>
                        ) : priceOptions.map((option) => {
                          const isActive = item.priceTypeId
                            ? option.id === item.priceTypeId
                            : (item.unit === "bal" && option.id === PRICE_TYPE_IDS.perBal) ||
                              (item.unit === "pcs" && option.id === PRICE_TYPE_IDS.withLid) ||
                              (priceOptions.length === 1);

                          return (
                            <button
                              key={option.id}
                              onClick={() => {
                                handleUpdatePriceType(product.id, option.id);
                              }}
                              className={`flex min-w-28 flex-col rounded-md border px-2 py-1 text-left transition-all cursor-pointer ${
                                isActive
                                  ? "bg-primary-500 text-white border-primary-500 shadow-xs"
                                  : "bg-slate-50 text-gray-500 border-slate-200 hover:bg-slate-100 hover:text-gray-700"
                              }`}
                            >
                              <span className="text-[9px] font-black uppercase tracking-wider leading-tight">{option.name}</span>
                              <span className={`mt-0.5 text-[9px] font-bold leading-tight ${isActive ? "text-white/80" : "text-text-muted"}`}>
                                {option.quantity} pcs / {formatPrice(option.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs font-black text-primary-500 mt-1">
                        {formatPrice(unitPrice)} <span className="text-[10px] font-bold text-text-muted">/ {variantQuantity} pcs</span>
                      </p>
                      <p className="text-[10px] font-bold text-text-muted mt-0.5">
                        Jumlah: {item.quantity} x {variantQuantity} pcs = {totalPcs} pcs
                      </p>
                    </div>

                    {/* Quantity Controller & Price */}
                    <div className="flex flex-col items-end gap-2 shrink-0">

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1 bg-gray-50 border border-border rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, item.quantity - 1)}
                          className="size-7 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-md bg-white border border-border hover:bg-gray-50 cursor-pointer text-sm font-black active:scale-90 transition-all"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-10 text-center bg-transparent border-none outline-none font-bold text-xs"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(product.id, item.quantity + 1)}
                          className="size-7 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-md bg-white border border-border hover:bg-gray-50 cursor-pointer text-sm font-black active:scale-90 transition-all"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-black text-text-primary">
                        Total: {formatPrice(subtotal)}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted">
                        {totalPcs} pcs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & CTA */}
            <div className="p-6 border-t border-border bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Harga:</span>
                <span className="text-xl font-black text-primary-600">
                  {formatPrice(
                    modalItems.reduce((acc, item) => {
                      const { subtotal } = getModalItemPricing(item);
                      return acc + subtotal;
                    }, 0)
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-border bg-white text-text-secondary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 hover:text-text-primary transition-all active:scale-[0.97] cursor-pointer"
                >
                  Batal
                </button>
                <a
                  href={buildWishlistInquiryWithPricesUrl(modalItems, priceTypeNames)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSendWishlistInquiry}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-600 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                >
                  Kirim ke WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
