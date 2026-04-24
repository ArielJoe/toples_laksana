import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="w-full mt-6 bg-white border-t border-border text-sm leading-relaxed relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 lg:px-12 py-16 lg:py-24 max-w-screen-2xl mx-auto relative z-10">

        {/* Brand Column */}
        <div className="md:col-span-12 lg:col-span-5 pr-0 lg:pr-12">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary-500 mb-6">
            Toples Laksana
          </Link>
          <p className="text-text-secondary mb-8 max-w-md text-base">
            Distributor kemasan premium terpercaya di Bandung. Memberikan solusi kemasan berkualitas tinggi dan terjangkau untuk masa depan bisnis UMKM & Industri Nasional.
          </p>
          <div className="flex gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </a>
          </div>
        </div>

        {/* Navigation Links (Column 1) */}
        <div className="md:col-span-4 lg:col-span-2">
          <h5 className="font-black text-text-primary mb-6 uppercase tracking-[0.15em] text-[0.7rem]">Explore</h5>
          <ul className="space-y-4 font-semibold text-text-secondary">
            <li><Link className="hover:text-primary-500 transition-colors" href="/catalog">Katalog Produk</Link></li>
            <li><Link className="hover:text-primary-500 transition-colors" href="/compare">Bandingkan</Link></li>
            <li><Link className="hover:text-primary-500 transition-colors" href="/#mengapa">Mengapa Kami?</Link></li>
          </ul>
        </div>

        {/* Help & Information (Column 2) */}
        <div className="md:col-span-4 lg:col-span-2">
          <h5 className="font-black text-text-primary mb-6 uppercase tracking-[0.15em] text-[0.7rem]">Help & Info</h5>
          <ul className="space-y-4 font-semibold text-text-secondary">
            <li><Link className="hover:text-primary-500 transition-colors" href="#">Pembelian Grosir</Link></li>
            <li><Link className="hover:text-primary-500 transition-colors" href="#">Syarat Pengiriman</Link></li>
            <li><Link className="hover:text-primary-500 transition-colors" href="#">F.A.Q</Link></li>
          </ul>
        </div>

        {/* Contact Information (Column 3) */}
        <div className="md:col-span-4 lg:col-span-3">
          <h5 className="font-black text-text-primary mb-6 uppercase tracking-[0.15em] text-[0.7rem]">Contact Us</h5>
          <div className="space-y-4 text-text-secondary">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary-500 text-xl">location_on</span>
              <p className="font-medium">Jl. Raya Bandung No. 123, Bojongloa Kaler, Kota Bandung, Jawa Barat</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500 text-xl">call</span>
              <p className="font-medium font-mono text-base">+62 812-3456-7890</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-500 text-xl">mail</span>
              <p className="font-medium">sales@topleslaksana.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-background">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-8 flex flex-col items-center justify-center text-center">
          <p className="text-text-muted font-bold text-xs sm:text-sm">
            © {new Date().getFullYear()} Toples Laksana Bandung.
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        className="fixed bottom-6 right-6 z-45 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-xl shadow-[#25D366]/20 hover:bg-[#1EBE53] transition-all hover:scale-110 flex items-center justify-center group"
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Toples%20Laksana"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
        <span className="font-extrabold hidden md:block tracking-tight text-sm max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 whitespace-nowrap">
          Konsultasi Sekarang
        </span>
      </a>
    </footer>
  );
}
