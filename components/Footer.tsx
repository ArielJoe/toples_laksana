import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-slate-50 border-t border-slate-200 font-manrope text-sm leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-screen-2xl mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="text-lg font-bold text-emerald-900 mb-6 italic">Toples Laksana</div>
          <p className="text-slate-500 mb-8">
            Distributor kemasan toples dan jar premium terpercaya di Bandung. Memberikan solusi kemasan berkualitas untuk masa depan bisnis Anda.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-emerald-800">social_leaderboard</span>
            <span className="material-symbols-outlined text-emerald-800">public</span>
          </div>
        </div>
        <div>
          <h5 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-[10px]">Navigasi</h5>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="/catalog">Katalog</Link></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="#">Tentang Kami</Link></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="#">Kontak</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-[10px]">Bantuan</h5>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="#">Kebijakan Privasi</Link></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="#">Syarat & Ketentuan</Link></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-opacity duration-200" href="#">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-emerald-900 mb-6 uppercase tracking-widest text-[10px]">Kontak Kami</h5>
          <p className="text-slate-500 mb-4">Jl. Raya Bandung No. 123, Bojongloa Kaler, Bandung City, West Java</p>
          <p className="text-slate-500 mb-4">+62 812-3456-7890</p>
          <p className="text-slate-500">info@topleslaksana.com</p>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-8 py-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500">© 2024 Toples Laksana Bandung. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span className="text-[10px] font-bold tracking-widest text-slate-400">VISA</span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400">MASTERCARD</span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400">BCA</span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400">MANDIRI</span>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110 flex items-center gap-3"
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
        <span className="font-bold pr-2 hidden md:inline tracking-tight">Hubungi Kami</span>
      </a>
    </footer>
  );
}
