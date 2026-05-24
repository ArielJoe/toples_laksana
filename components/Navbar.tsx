"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, ShieldUserIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/catalog" },
    { label: "Tentang Kami", href: "/tentang" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 w-full z-110 bg-primary-500 py-5"
      >
        <div className="flex justify-between items-center px-6 lg:px-12 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <Link href="/" className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 cursor-pointer">
            Toples Laksana
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1 font-semibold text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${isActive
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-semibold transition-all hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <ShieldUserIcon className="size-4" />
            </Link>

            {/* Hamburger */}
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
            >
              {mobileMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-100 bg-primary-500 pt-24 px-6 pb-6 lg:hidden flex flex-col"
          >
            <div className="flex flex-col gap-2 mb-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-6 py-4 rounded-xl text-lg transition-all cursor-pointer ${isActive
                      ? "bg-white/20 text-white font-bold"
                      : "text-white/70 font-semibold hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto border-t border-white/20 pt-6">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
              >
                <ShieldUserIcon className="size-5" />
                <span>Login Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
