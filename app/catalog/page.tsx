import Link from 'next/link';

export default function CatalogPage() {
  const products = [
    {
      id: "PRD-801",
      name: "PL-Cyl-Gold 750",
      volume: "750ml",
      price: "4.500",
      grade: "Premium",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeAb3bpvjd_NLJ8qjVzmTrfEi_jUw6UdGDj4khynxXpSknYsgfQhTW7AIMwzoVJqQBM2Ush_0rlKvy-LnnrsytcycDSi1JAc457iWfau55PlHe7nYHpdpKZ49KbUG_qFv5JDVxfZbJ6wFq_TKe5QMiidmitBMiN1TBuMG6zPLxExiafgDihe27CCGQZNNldVytu15Tdno6k-EQustUqI_yB2rVanHA8Faxl4Dv8yabJmkWqlZk8C4NUfEmRg6K0yBqy3n7ggaCUeI"
    },
    {
      id: "PRD-422",
      name: "GL-Square Eco",
      volume: "350ml",
      price: "2.850",
      grade: "Economis",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgwvOK9IKRTSMalOw5mL0YrGoiA1E0rhWQ7k_-hr6JjxNfqVKIV3vx-57SgSFNZcUfdoX03TCZhdU1GAlkcXFXVBPJvzgOpLGgPJ-oA-vRXJ6yaZyuaqaVt4DnrX-nBIxrNO5knubPIY6KlgiwPWV3msuqPOpp7hdfaVsZbu3SNIqyzPytItzAh6foDvEqUjxSw_ICWs3nEH3V5Rps4skPFCWmvwIR8uQyyOnlZS8lgi4L6iXaGquFt3zOJgh-hjdhD9UbTcW1_54"
    },
    {
      id: "PRD-109",
      name: "TN-Industrial Black",
      volume: "1000ml",
      price: "8.200",
      grade: "Premium",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzbnUYPGFnrizJg85JdIntlsVr_nidWYdjnUmWCxWc0OkwV3_cM0GqPFlNEDSgqJ5Hr_99yUBmwIuBQ53Vl-aLQM4c3jxqojj_YeI7qoFh_2vJRKk-wp3W3meoFYf4TDJnDThXGMcVKSTuhS2HavqTvazGj25hfFM00yvyPk7eV1F4Bhhd3mb4D3dVWG7RASl6JlEu7GazezyMDmljZnge1bia6m4NizhnTRPLlfSKEy0ZvGv0KsWgRfqbV_96EJAJs8RBXc2kDhI"
    },
    {
      id: "PRD-205",
      name: "PL-Mini-Clear",
      volume: "50ml",
      price: "1.200",
      grade: "Economis",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuhq8pONvTzDtrcsXkiBj47kh14Fd1EeabFtk5t4zTlun5OigrfbRRCuMX-arRvQC9nux-6UlRTBgUo3nWgRr5HPFqQeVf1mtv90nZ-G3Gyg24rrqm3zAFxJQ1ZiGMVdkLO5rtzUtIxjZP8ffSj7iW0-YJBCavVR2w7oCEw3dovANpoaRzY6JD5alTmOCAtQnY5EcPCNrSkalJsaYNNAEiBnevHNw7qpsP6gezip-9s2YbWost9qIOHFra56VZSGkBd2NuZha_pXY"
    },
  ];

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Main Content Layout */}
      <main className="pb-20 max-w-screen-2xl mx-auto px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-manrope">
          <Link className="hover:text-primary transition-colors font-medium underline underline-offset-4" href="/">Beranda</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-bold">Katalog</span>
        </nav>

        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-on-surface tracking-tighter mb-4 uppercase">Katalog Produk</h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Eksplorasi koleksi kemasan industri berkualitas tinggi kami. Dari polimer premium hingga wadah logam yang presisi.
            </p>
          </div>
          <div className="flex items-center gap-4 font-manrope">
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/10">
              <span className="label-md uppercase text-[0.7rem] font-bold text-on-surface-variant">Urutkan:</span>
              <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer outline-none">
                <option>Terpopuler</option>
                <option>Harga Terendah</option>
                <option>Harga Terbesar</option>
                <option>Volume</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          {/* Left Sidebar Filters */}
          <aside className="space-y-10 sticky top-28">
            {/* Category Filter */}
            <section>
              <h3 className="label-md uppercase text-[0.75rem] font-bold tracking-widest text-primary mb-6">Kategori</h3>
              <div className="space-y-3">
                {["CAT-CYL (Cylindrical)", "CAT-KAC (Kaca)", "CAT-PLS (Plastik)", "CAT-TIN (Tinplate)"].map((cat, i) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary outline-none" type="checkbox" defaultChecked={i === 2} />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Volume Filter */}
            <section>
              <h3 className="label-md uppercase text-[0.75rem] font-bold tracking-widest text-primary mb-6">Volume</h3>
              <div className="space-y-4">
                <input className="w-full accent-primary cursor-pointer" max="1500" min="25" type="range" defaultValue="750" />
                <div className="flex justify-between text-[0.7rem] font-black text-secondary tracking-widest">
                  <span>25ML</span>
                  <span>1500ML</span>
                </div>
              </div>
            </section>

            {/* Grade Filter */}
            <section>
              <h3 className="label-md uppercase text-[0.75rem] font-bold tracking-widest text-primary mb-6">Grade Material</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-primary text-on-primary text-[10px] font-black rounded-sm tracking-widest uppercase">PREMIUM</button>
                <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-[10px] font-black rounded-sm hover:bg-secondary-container transition-colors tracking-widest uppercase">EKONOMIS</button>
              </div>
            </section>

            {/* Technical Specs Reminder */}
            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">verified</span>
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-tight">Standar Industri</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Semua toples kami memenuhi standar Food Grade dan ketahanan tekanan tinggi.</p>
            </div>
          </aside>

          {/* Product Grid Section */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div key={p.id} className="group relative bg-white overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-sm border border-outline-variant/10 rounded-sm">
                  <div className="aspect-square relative bg-surface-container-low flex items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-primary-fixed/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img alt={p.name} className="w-full h-full object-contain relative z-10 transform transition-transform duration-500 group-hover:scale-105" src={p.image} />
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`text-[0.65rem] font-black px-2 py-1 rounded-sm uppercase tracking-tighter ${p.grade === 'Premium' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                        {p.grade}
                      </span>
                    </div>
                    {/* Compare Checkbox */}
                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-outline-variant/20 flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                      <input className="w-3.5 h-3.5 rounded-sm border-outline text-primary focus:ring-primary cursor-pointer outline-none" id={`compare-${p.id}`} type="checkbox" />
                      <label className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-tight cursor-pointer" htmlFor={`compare-${p.id}`}>Bandingkan</label>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-primary leading-tight font-manrope">{p.name}</h3>
                      <span className="text-[0.65rem] font-black text-secondary bg-surface-container px-2 py-1 uppercase">{p.volume}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4 font-manrope">
                      <span className="text-[0.7rem] text-on-surface-variant font-bold uppercase tracking-widest">Mulai dari</span>
                      <span className="text-xl font-extrabold text-primary tracking-tighter">Rp {p.price}</span>
                    </div>
                    <Link 
                      href={`/products/${p.id}`} 
                      className="w-full inline-block text-center py-3 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-container transition-all shadow-sm shadow-primary/10"
                    >
                      Detail Produk
                    </Link>
                  </div>
                </div>
              ))}

              {/* Skeletons */}
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-outline-variant/10 overflow-hidden rounded-sm">
                  <div className="aspect-square skeleton"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 skeleton w-3/4 rounded-sm"></div>
                    <div className="h-4 skeleton w-1/2 rounded-sm"></div>
                    <div className="h-10 skeleton w-full mt-4 rounded-sm"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-2 font-manrope">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-colors border border-outline-variant/10">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-md shadow-primary/20">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-outline-variant/10 text-on-surface-variant hover:bg-primary/10 transition-colors font-bold">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-outline-variant/10 text-on-surface-variant hover:bg-primary/10 transition-colors font-bold">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-colors border border-outline-variant/10">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Comparison Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 transition-all duration-500 transform font-manrope">
        <div className="bg-emerald-950/95 text-white rounded-full p-3 shadow-2xl flex items-center justify-between border border-emerald-700/30 backdrop-blur-xl">
          <div className="flex items-center gap-4 pl-4">
            <div className="flex -space-x-3">
              {/* Selected items indicator */}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-800 bg-white overflow-hidden p-1">
                <img alt="Compare 1" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeAb3bpvjd_NLJ8qjVzmTrfEi_jUw6UdGDj4khynxXpSknYsgfQhTW7AIMwzoVJqQBM2Ush_0rlKvy-LnnrsytcycDSi1JAc457iWfau55PlHe7nYHpdpKZ49KbUG_qFv5JDVxfZbJ6wFq_TKe5QMiidmitBMiN1TBuMG6zPLxExiafgDihe27CCGQZNNldVytu15Tdno6k-EQustUqI_yB2rVanHA8Faxl4Dv8yabJmkWqlZk8C4NUfEmRg6K0yBqy3n7ggaCUeI" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-800 bg-white overflow-hidden p-1">
                <img alt="Compare 2" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgwvOK9IKRTSMalOw5mL0YrGoiA1E0rhWQ7k_-hr6JjxNfqVKIV3vx-57SgSFNZcUfdoX03TCZhdU1GAlkcXFXVBPJvzgOpLGgPJ-oA-vRXJ6yaZyuaqaVt4DnrX-nBIxrNO5knubPIY6KlgiwPWV3msuqPOpp7hdfaVsZbu3SNIqyzPytItzAh6foDvEqUjxSw_ICWs3nEH3V5Rps4skPFCWmvwIR8uQyyOnlZS8lgi4L6iXaGquFt3zOJgh-hjdhD9UbTcW1_54" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-emerald-800 bg-emerald-800/80 flex items-center justify-center text-[10px] font-black uppercase">
                +1
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">3 Produk Terpilih</p>
              <p className="text-[10px] text-emerald-400 font-medium">Siap untuk dibandingkan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-[10px] font-black text-emerald-300 hover:text-white transition-colors px-4 tracking-[0.2em]">BATAL</button>
            <Link 
              href="/compare" 
              className="bg-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              Bandingkan Sekarang
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
