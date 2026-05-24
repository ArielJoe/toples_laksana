"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  productCount: number;
  interactionCount: number;
  waLogsCount: number;
}

export default function AdminLayoutClient({
  children,
  productCount,
  interactionCount,
  waLogsCount,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(pathname.startsWith("/admin/products") || pathname.includes("categories") || pathname.includes("lid-colors") || pathname.includes("product-types") || pathname.includes("units") || pathname.includes("price-types") || pathname.includes("materials") || pathname.includes("lid-types") || pathname.includes("lid-variants"));

  const MAIN_NAV = [
    { label: "Dashboard", icon: "dashboard", href: "/admin", active: pathname === "/admin" },
    { label: "Invoice", icon: "request_quote", href: "/admin/invoice", active: pathname === "/admin/invoice" },
    { 
      label: "Produk", 
      icon: "inventory_2", 
      href: "/admin/products", 
      active: pathname === "/admin/products", 
      count: productCount,
      hasSub: true,
      subItems: [
        { label: "Kategori", icon: "category", href: "/admin/categories", active: pathname === "/admin/categories" },
        { label: "Material", icon: "inventory_2", href: "/admin/materials", active: pathname === "/admin/materials" },
        { label: "Warna Tutup", icon: "palette", href: "/admin/lid-colors", active: pathname === "/admin/lid-colors" },
        { label: "Tipe Tutup", icon: "grade", href: "/admin/lid-types", active: pathname === "/admin/lid-types" },
        { label: "Varian Tutup", icon: "category", href: "/admin/lid-variants", active: pathname === "/admin/lid-variants" },
        { label: "Tipe Produk", icon: "grade", href: "/admin/product-types", active: pathname === "/admin/product-types" },
        { label: "Satuan", icon: "straighten", href: "/admin/units", active: pathname === "/admin/units" },
        { label: "Tipe Harga", icon: "sell", href: "/admin/price-types", active: pathname === "/admin/price-types" },
      ]
    },
    { label: "Interaksi", icon: "touch_app", href: "/admin/interactions", active: pathname === "/admin/interactions", count: interactionCount },
    { label: "WhatsApp Log", icon: "chat", href: "/admin/wa-logs", active: pathname === "/admin/wa-logs", count: waLogsCount },
  ];

  return (
    <div className="bg-background text-text-primary flex min-h-screen font-sans relative selection:bg-primary-500/10">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-all duration-300 border-r border-border",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 lg:h-24 px-8 flex items-center border-b border-border">
          <Link href="/" className="text-xl font-black text-primary-500 tracking-tight flex items-center gap-2">
            Toples Laksana
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {MAIN_NAV.map((item) => (
            <div key={item.href} className="space-y-1">
              <div
                className={cn(
                  "group w-full flex items-center justify-between rounded-xl transition-all duration-200 font-bold text-sm",
                  item.active
                    ? "bg-primary-500 text-white"
                    : "text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
                )}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 flex items-center gap-3.5 px-4 py-3.5 cursor-pointer"
                >
                  <AppIcon name={item.icon} className={cn(
                    "text-xl transition-colors",
                    item.active ? "text-white" : "text-text-muted group-hover:text-text-primary"
                  )} />
                  {item.label}
                </Link>

                {item.hasSub && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProductsOpen(!isProductsOpen);
                    }}
                    className={cn(
                      "flex items-center justify-center w-14 py-3.5 transition-all cursor-pointer",
                      item.active ? "text-white" : "text-text-muted group-hover:text-text-primary"
                    )}
                  >
                    <ChevronDown 
                      size={18}
                      className={cn(
                        "transition-transform duration-200",
                        isProductsOpen && "rotate-180",
                        item.active ? "text-white" : "text-text-muted"
                      )} 
                    />
                  </button>
                )}

                {!item.hasSub && item.count !== undefined && (
                  <div className="px-4">
                    <Badge variant={item.active ? "outline" : "secondary"} className={cn(
                      "rounded-lg px-1.5 py-0.5 text-[0.6rem] font-black",
                      item.active ? "border-white/40 text-white" : "text-white bg-primary-500"
                    )}>
                      {item.count}
                    </Badge>
                  </div>
                )}
              </div>

              {item.hasSub && isProductsOpen && (
                <div className="ml-8 space-y-1 mt-1 border-l-2 border-divider pl-2 transition-all">
                  {item.subItems?.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-bold text-[0.8rem] cursor-pointer",
                        sub.active
                          ? "bg-secondary-100 text-primary-600"
                          : "text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
                      )}
                    >
                      <AppIcon name={sub.icon} className={cn(
                        "text-lg transition-colors",
                        sub.active ? "text-primary-500" : "text-text-muted group-hover:text-text-primary"
                      )} />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
              router.refresh();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[0.65rem] uppercase tracking-widest border border-border hover:border-red-200 cursor-pointer"
          >
            <AppIcon name="logout" className="text-lg" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
        {/* Mobile Navbar Header */}
        <header className="lg:hidden h-20 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-text-secondary border border-border hover:bg-white transition-all cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <AppIcon name="menu" />
            </button>
            <h2 className="text-lg font-black text-text-primary tracking-tight">
              {MAIN_NAV.map(n => [n, ...(n.subItems || [])]).flat().find(n => n.active)?.label || "Admin"}
            </h2>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
