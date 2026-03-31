'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10 font-manrope">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Left: Brand */}
        <Link href="/" className="text-xl font-bold text-emerald-900 tracking-tight">
          Toples Laksana
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-emerald-800 transition-colors">Beranda</Link>
          <Link href="/catalog" className="hover:text-emerald-800 transition-colors">Katalog</Link>
          <Link href="#" className="hover:text-emerald-800 transition-colors">Tentang Kami</Link>
          <Link href="#" className="hover:text-emerald-800 transition-colors">Kontak</Link>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary-container transition-all shadow-sm"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
