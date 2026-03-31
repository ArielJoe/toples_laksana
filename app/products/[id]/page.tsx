export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <main className="pb-20 max-w-screen-2xl mx-auto px-8 font-body">
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center space-x-2 text-sm text-on-surface-variant font-medium">
          <a className="hover:text-primary transition-colors" href="/">Home</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="/catalog">Katalog</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface">Jar Cylinder 200ml Premium (ID: {params.id})</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative bg-surface-container-low rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center group">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-fixed to-transparent"></div>
              <img
                alt="Main Product View"
                className="relative z-10 w-3/4 object-contain mix-blend-multiply transform transition-transform duration-500 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX-RypJj6vldkkkyplAyZGjCIGKPGnZlx_St3AXZOAy7GMTGKQHsjxhYzE7xwnuJdTENU1ziyQYWMQQWh1QJMISK9aE7sX_x7OMb3QvhaJ6Ch6dLvZaRMxV4NMipZdfC5JT0so_wF8lS2F8jTw69crJGXscqzAlQZerA4YA12RSwHT8NcXgkcZJEJ6j49hYxGOaoFrqppjLW2kcB16kzbTz5xovS60bZJronf2NNvl97_F_7ae5IsxmWG2lYM1Ja1JWpuxdTjR2cA"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAlFtlC9TwwqE_G10zmguIhgE0eydrKb4-JnGIJjbnpFHXoDwBDE9TNxZw1GoWTo04xpTSm5rHs_X5UMeAo5oHaCRPRy2OkaPsEX7si6gMt-MkmmM2HZ6F0cGMcwvuoR7vIRjalJfHgbLQdxjaSWlXWk91cTiJj9kWGIpGv0y2i-iI7gL714bwC4jbzOCD7twSyaLwzBYrtSullkrCsddSUJeAsRhkK6VuW7EHZoXdK5BplWllT9qPi6MlHfyD3efoS_os2gZTNaJs",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD0N8LWVECGSwc4Q9K-yJezR-j3mvYtgbvs6g8UyVUfP03HpmyjKj_aXwwsBNF4tBM7w8PyNjScpCQGCbOYeGGd7YNzs0RJXiSGgkU6lkwwUmzvP3jgMdPJRVH9sSoaTVuLYpelimgwIMhVbU4PS0VgiTsaP75Jf0UA93maUQKRsBgTXH2Yy7m_VgY0Rl5oeJE5U-CDYHMTr8i_C3OigusGbXWtE6jBFltl_DPrwKrFnVDsUU0OXIbg5xBMamcXPQvQKpthrIWUHNc",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBlHs4mslFZgL8oynhQEx5s_5jWtcoV50kpGU49Gzi2f95rfEMTdBU-gTvsFz9YzR00PWs9add7LszaKlDq-2eGtc6k1UF4-NbMqixJ-P-FMXEzXioXvaOpWIxy8G-tOUHqr4TQfQwTJ93BZyaktnXTIfEwneD-aJmJys0QKBMey5t_jDzBlfOLotelEld9H3Ovpcb_Mirom6WrfQoc2vGQZZFTO9JdM_zzjo2VDGNBK2AG5dzDUhbfeNlgt3cjLWD0u6r5gu9NgCE",
              ].map((src, i) => (
                <button
                  key={i}
                  className={`aspect-square bg-surface-container-low rounded-md p-2 overflow-hidden hover:bg-surface-container-high transition-all ${i === 0 ? "ring-2 ring-primary ring-offset-2" : ""}`}
                >
                  <img alt={`Product ${i}`} className="w-full h-full object-cover" src={src} />
                </button>
              ))}
              <div className="aspect-square bg-surface-container-low rounded-md flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
                <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">360 View</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-extrabold px-2 py-0.5 rounded-sm tracking-widest uppercase">
                Grade: Premium
              </span>
              <span className="text-on-surface-variant/40">|</span>
              <span className="text-label-md text-on-surface-variant font-medium tracking-tight uppercase">CAT-CYL</span>
            </div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-8">Jar Cylinder 200ml Premium</h1>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-y-6 mb-10 bg-surface-container-low p-6 rounded-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Volume</span>
                <span className="text-lg font-bold text-on-surface">200ml</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Berat</span>
                <span className="text-lg font-bold text-on-surface">15gr</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Bahan</span>
                <span className="text-lg font-bold text-on-surface">PP + PP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">Tutup</span>
                <span className="text-lg font-bold text-on-surface">Putar (Screw)</span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-on-surface uppercase tracking-widest">Varian Warna Tutup</span>
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant">Mulai dari</span>
                  <div className="text-2xl font-black text-primary tracking-tighter">
                    Rp 3.500 <span className="text-sm font-medium text-on-surface-variant">/pcs</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="group relative">
                  <div className="w-8 h-8 rounded-sm bg-white ring-2 ring-primary ring-offset-2 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Bening
                  </span>
                </button>
                <div className="w-8 h-8 rounded-sm bg-slate-100 border border-outline-variant/20 hover:ring-2 hover:ring-outline-variant hover:ring-offset-2 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-sm bg-zinc-400 hover:ring-2 hover:ring-outline-variant hover:ring-offset-2 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-sm bg-[#FFD700] hover:ring-2 hover:ring-tertiary hover:ring-offset-2 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-sm bg-zinc-900 hover:ring-2 hover:ring-on-surface hover:ring-offset-2 cursor-pointer"></div>
              </div>
            </div>

            {/* Logistics Info */}
            <div className="flex items-center space-x-6 mb-12 py-4 border-y border-outline-variant/10">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-on-surface-variant text-lg leading-none">inventory_2</span>
                <span className="text-sm font-semibold">150 pcs / Bal</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-on-surface-variant text-lg leading-none">verified</span>
                <span className="text-sm font-semibold">Food Grade</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <button className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold flex items-center justify-center space-x-3 hover:opacity-95 transition-all shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined">chat</span>
                <span>Hubungi via WhatsApp</span>
              </button>
              <a
                className="w-full flex items-center justify-center space-x-2 py-3 text-primary font-bold text-sm hover:bg-surface-container-low rounded-lg transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Download Spec Sheet (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32 uppercase tracking-tight">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Koleksi Serupa</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2">Produk Terkait</h2>
            </div>
            <a className="text-sm font-bold border-b-2 border-primary pb-1" href="/catalog">
              Lihat Semua
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-surface-container-low rounded-lg p-8 mb-4 relative overflow-hidden flex items-center justify-center aspect-square transition-all duration-300">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary-fixed/20 to-transparent"></div>
                  <img
                    className="w-4/5 object-contain transform group-hover:scale-105 transition-transform duration-500"
                    alt={`Related Product ${i}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX-RypJj6vldkkkyplAyZGjCIGKPGnZlx_St3AXZOAy7GMTGKQHsjxhYzE7xwnuJdTENU1ziyQYWMQQWh1QJMISK9aE7sX_x7OMb3QvhaJ6Ch6dLvZaRMxV4NMipZdfC5JT0so_wF8lS2F8jTw69crJGXscqzAlQZerA4YA12RSwHT8NcXgkcZJEJ6j49hYxGOaoFrqppjLW2kcB16kzbTz5xovS60bZJronf2NNvl97_F_7ae5IsxmWG2lYM1Ja1JWpuxdTjR2cA"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm flex items-center justify-center transition-all group/compare">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover/compare:text-primary transition-colors leading-none">
                        compare_arrows
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">CAT-CYL</p>
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">Jar Cylinder 150ml</h3>
                  </div>
                  <span className="text-sm font-black text-on-surface-variant/80">Rp 3.200</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
