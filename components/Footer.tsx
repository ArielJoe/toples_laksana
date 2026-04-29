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
        className="fixed bottom-6 right-6 z-45 bg-[#25D366] text-white w-14 h-14 rounded-full hover:bg-[#1EBE53] transition-all hover:scale-110 flex items-center justify-center"
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Toples%20Laksana"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
}
