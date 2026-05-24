"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MenuIcon, ShieldUserIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { AppIcon } from "@/components/ui/app-icon";

export default function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Close mobile menu and profile dropdown on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setProfileDropdownOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setProfileDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      const timeout = setTimeout(() => {
        setProfileDropdownOpen(false);
      }, 200); // 200ms delay to bridge hover gaps
      setHoverTimeout(timeout);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setProfileDropdownOpen(!profileDropdownOpen);
  };

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
            {/* Google Login / Profile Dropdown */}
            {loading ? (
              <div className="size-8 rounded-full border border-white/20 border-t-white animate-spin" />
            ) : user ? (
              <div
                className="relative flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center size-10 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer overflow-hidden focus:outline-none"
                  title="Menu Profil"
                >
                  <Image
                    src={user.photoURL || "/toples.png"}
                    alt={user.displayName || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full pt-2 z-130">
                    <div className="w-56 bg-white border border-border rounded-xl py-2 shadow-none flex flex-col">
                      <div className="px-4 py-2.5 border-b border-border mb-1.5 min-w-0">
                        <p className="text-xs font-black text-text-primary truncate">{user.displayName || "User"}</p>
                        <p className="text-[10px] font-bold text-text-muted truncate mt-0.5">{user.email || ""}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer border-none bg-transparent"
                      >
                        <AppIcon name="logout" className="text-sm text-red-500" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white bg-white text-primary-600 text-xs font-black uppercase tracking-wider hover:bg-primary-50 cursor-pointer shadow-sm transition-all"
              >
                Masuk
              </button>
            )}

            {/* Wishlist Link (if user is logged in) */}
            {user && (
              <Link
                href="/wishlist"
                className="flex items-center justify-center size-10 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                title="Wishlist Saya"
              >
                <Heart className="size-5" />
              </Link>
            )}

            <Link
              href="/login"
              className="flex items-center justify-center size-10 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              title="Login Admin"
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

            <div className="mt-auto border-t border-white/20 pt-6 space-y-3">
              {/* Wishlist Link for Mobile */}
              {user && (
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                >
                  <Heart className="size-5" />
                  <span>Wishlist Saya</span>
                </Link>
              )}

              {/* Google Login for Mobile */}
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Image
                      src={user.photoURL || "/toples.png"}
                      alt={user.displayName || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border border-white/20 object-cover"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">{user.displayName}</p>
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all cursor-pointer"
                  >
                    <AppIcon name="logout" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-primary-600 font-bold transition-all cursor-pointer"
                >
                  <AppIcon name="google" />
                  <span>Masuk dengan Google</span>
                </button>
              )}

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
