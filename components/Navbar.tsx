"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/catalog" },
    { label: "Bandingkan", href: "/compare" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-110 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-white/90 backdrop-blur-xl shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="flex justify-between items-center px-6 lg:px-12 max-w-screen-2xl mx-auto">
          {/* Brand */}
          <Link href="/" className="text-xl font-extrabold text-primary-500 tracking-tight flex items-center gap-2">
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
                  className={`px-4 py-2 rounded-full transition-all ${isActive
                      ? "bg-primary-50 text-primary-600 font-bold"
                      : "text-text-secondary hover:text-primary-500 hover:bg-secondary-50"
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
              className="hidden lg:flex bg-accent-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-accent-600 transition-all shadow-sm items-center gap-2"
            >
              <span className="material-symbols-outlined text-[1.1rem]">shield_person</span>
              Portal Admin
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-secondary-50 text-primary-500 hover:bg-primary-50 transition-colors"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
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
            className="fixed inset-0 z-100 bg-white pt-24 px-6 pb-6 lg:hidden flex flex-col"
          >
            <div className="flex flex-col gap-2 mb-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-6 py-4 rounded-xl text-lg transition-all ${isActive
                        ? "bg-primary-50 text-primary-600 font-bold"
                        : "text-text-secondary font-semibold hover:bg-secondary-50 hover:text-primary-500"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto border-t border-border pt-6">
              <Link
                href="/login"
                className="w-full bg-accent-500 text-white px-6 py-4 rounded-xl text-base font-bold hover:bg-accent-600 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shield_person</span>
                Login Portal Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
