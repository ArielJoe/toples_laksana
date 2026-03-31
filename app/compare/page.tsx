export default function ComparisonPage() {
  return (
    <div className="bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed font-body">

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-tertiary"></span>
            <span className="text-tertiary font-bold text-xs tracking-widest uppercase">Katalog Perbandingan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary leading-tight">Bandingkan Produk</h1>
          <p className="text-on-surface-variant max-w-2xl mt-4 text-lg font-medium leading-relaxed">
            Analisis spesifikasi teknis dari koleksi kemasan premium kami untuk menemukan solusi paling tepat bagi kebutuhan industri Anda.
          </p>
        </div>

        {/* Comparison Matrix Container */}
        <div className="overflow-x-auto no-scrollbar pb-8">
          <div className="min-w-[900px]">
            {/* Table Header (Product Images & Titles) */}
            <div className="grid grid-cols-4 items-stretch mb-8 gap-4">
              {/* Technical Specs Label */}
              <div className="flex flex-col justify-end pb-8">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-outline opacity-60">Spesifikasi Detail</span>
              </div>
              {/* Product 1 Card */}
              <div className="bg-white p-6 flex flex-col items-center text-center shadow-sm border border-outline-variant/10 rounded-sm">
                <div className="relative w-full aspect-square mb-6 group">
                  <div className="absolute inset-0 bg-primary-fixed opacity-10 rounded-full scale-75 group-hover:scale-90 transition-transform duration-500"></div>
                  <img
                    alt="Cylinder Premium Jar"
                    className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZdR4Y9ow5hYRDj17NLaSxnnqoLNUpxvdDxBUSDwF0MeSlefKSOmZa68p0fLuB8RtYscqA7v0-fTNboF2ivtDvYkTj4Sri-cR-ZE1bCHLyxhLl1zQM0cse-WDkM4L6mOT5_XQLNkWnnbKJHN3KC6j54Nt0QKRC6NEaBGG9YSzj1Tnp4hktx6cP5hapjqR4ZD9cIZhSatKfPF0h5t95Q7XKyhTiyxQf2OZzReRuWWP_RuXQkAiAFzG0WC1eS_ZZxRPeA1AHfHPRjiU"
                  />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1 leading-tight">Cylinder Premium 200ml</h3>
                <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">CAT-CYL</span>
              </div>
              {/* Product 2 Card */}
              <div className="bg-white p-6 flex flex-col items-center text-center shadow-sm border border-outline-variant/10 rounded-sm">
                <div className="relative w-full aspect-square mb-6 group">
                  <div className="absolute inset-0 bg-primary-fixed opacity-10 rounded-full scale-75 group-hover:scale-90 transition-transform duration-500"></div>
                  <img
                    alt="Glass Mason Jar"
                    className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDceBXKm1G88zNf02qSebsrnJtRIuhidiTic2UgdMxX51cbGhgLJJU8VPEn0ce9rQBCBPC3zrKQROOEMFCcyoEtbGA2qxQJ58g6oiIVwEOwO7R4GqCMng5JFXR1O4Zhn0LdhWqTttE8OzvfNk0I2gy1Uxi4_F4gioq5b7oNzmzFcHnSUL_y_vCblt0mQPZim5_CFMEwG4ctDY6QfYYIuJK1iWBlOuXlKwjGy7fcsGNvYhuCvrrtplIWjDAzOx8g0wlQUfMXklGOjBg"
                  />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1 leading-tight">Jar Kaca Mason 250ml</h3>
                <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">CAT-KAC</span>
              </div>
              {/* Product 3 Card */}
              <div className="bg-white p-6 flex flex-col items-center text-center shadow-sm border border-outline-variant/10 rounded-sm">
                <div className="relative w-full aspect-square mb-6 group">
                  <div className="absolute inset-0 bg-primary-fixed opacity-10 rounded-full scale-75 group-hover:scale-90 transition-transform duration-500"></div>
                  <img
                    alt="Square Tin Container"
                    className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAoiFS5qJBSiPRbFMei8OZqB0sg3Av31xxHgW0JMa0u5w5HShjdWjfuG2jj8T3uhf88_3paBpDnQbNNfFGG33sG10KuCYPCy9Yh2DOtlw8iSGfZJgUyMIgIzjPSncQd2EHXk2_mQmbGn_oh3c4GCeogxhu3rhZ0ygLZ5k1pw2fh5qPmXDBwDHVuX2VBX6jM_hFt6lUJ2ixLufzOgUTXQ8L8cSlEPznBCtETtG_Mn7Lw48mHVDavwj5uCjmdXOsLcsoE5sVQ1M4Ag"
                  />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1 leading-tight">Tin Kaleng Kotak 1821ml</h3>
                <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">CAT-TIN</span>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="flex flex-col gap-1 ring-1 ring-outline-variant/10 rounded-lg overflow-hidden">
              {/* Volume Row */}
              <div className="grid grid-cols-4 items-center bg-surface-container-low group hover:bg-primary/5 transition-colors">
                <div className="px-6 py-5 text-xs font-black text-on-surface uppercase tracking-widest border-r border-outline-variant/10">Volume</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">200ml</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">250ml</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">1821ml</div>
              </div>
              {/* Material Body Row */}
              <div className="grid grid-cols-4 items-center bg-white group hover:bg-primary/5 transition-colors border-t border-outline-variant/10">
                <div className="px-6 py-5 text-xs font-black text-on-surface uppercase tracking-widest border-r border-outline-variant/10">Bahan Badan</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium border-r border-outline-variant/5">Polypropylene (PP)</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium border-r border-outline-variant/5">Borosilicate Glass</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">Electrolytic Tinplate</div>
              </div>
              {/* Material Lid Row */}
              <div className="grid grid-cols-4 items-center bg-surface-container-low group hover:bg-primary/5 transition-colors border-t border-outline-variant/10">
                <div className="px-6 py-5 text-xs font-black text-on-surface uppercase tracking-widest border-r border-outline-variant/10">Bahan Tutup</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">Polypropylene (PP)</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">Aluminium (ALU)</div>
                <div className="px-6 py-5 text-sm text-center text-on-surface-variant font-medium">Tin-plated Steel</div>
              </div>
              {/* Grade Row */}
              <div className="grid grid-cols-4 items-center bg-white group hover:bg-primary/5 transition-colors border-t border-outline-variant/10">
                <div className="px-6 py-5 text-xs font-black text-on-surface uppercase tracking-widest border-r border-outline-variant/10">Grade</div>
                <div className="px-6 py-5 text-center">
                  <span className="inline-block bg-tertiary-container text-on-tertiary-container text-[8px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase">Premium</span>
                </div>
                <div className="px-6 py-5 text-center">
                  <span className="inline-block bg-tertiary-container text-on-tertiary-container text-[8px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase">Premium</span>
                </div>
                <div className="px-6 py-5 text-center">
                  <span className="inline-block bg-tertiary-container text-on-tertiary-container text-[8px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase">Premium</span>
                </div>
              </div>
              {/* Price Row */}
              <div className="grid grid-cols-4 items-center bg-surface-container-low group hover:bg-primary/5 transition-colors border-t border-outline-variant/10">
                <div className="px-6 py-5 text-xs font-black text-on-surface uppercase tracking-widest border-r border-outline-variant/10">Harga Satuan</div>
                <div className="px-6 py-5 text-center font-bold text-primary text-xl tracking-tighter">Rp 3.500</div>
                <div className="px-6 py-5 text-center font-bold text-primary text-xl tracking-tighter">Rp 8.750</div>
                <div className="px-6 py-5 text-center font-bold text-primary text-xl tracking-tighter">Rp 12.400</div>
              </div>

              {/* Action Row (Buttons) */}
              <div className="grid grid-cols-4 items-center mt-6 bg-transparent border-none">
                <div></div>
                <div className="px-4">
                  <button className="w-full bg-primary text-on-primary py-3 px-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md shadow-primary/10">
                    <span className="material-symbols-outlined text-sm leading-none">send</span>
                    Pesan via WA
                  </button>
                </div>
                <div className="px-4">
                  <button className="w-full bg-primary text-on-primary py-3 px-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md shadow-primary/10">
                    <span className="material-symbols-outlined text-sm leading-none">send</span>
                    Pesan via WA
                  </button>
                </div>
                <div className="px-4">
                  <button className="w-full bg-primary text-on-primary py-3 px-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md shadow-primary/10">
                    <span className="material-symbols-outlined text-sm leading-none">send</span>
                    Pesan via WA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Disclaimer Section */}
        <div className="mt-24 p-8 bg-white border-l-4 border-primary shadow-sm rounded-r-lg">
          <h4 className="text-primary font-bold mb-3 flex items-center gap-2 tracking-tight uppercase text-sm">
            <span className="material-symbols-outlined text-lg leading-none">info</span>
            Catatan Teknis Engineering
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
            Semua dimensi produk diukur dalam toleransi ±0.5mm. Kapasitas volume didasarkan pada pengisian hingga bahu produk (fill to shoulder). Untuk pesanan custom di atas 10.000 unit, mohon hubungi tim teknik kami untuk integrasi label otomatis dan spesifikasi toleransi khusus. Sertifikasi Food Grade tersedia untuk semua SKU yang tercantum di atas.
          </p>
        </div>
      </main>

    </div>
  );
}
