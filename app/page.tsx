export default function HomePage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex items-center overflow-hidden px-8">
          <div className="max-w-screen-2xl mx-auto w-full editorial-grid gap-8">
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center z-10">
              <span className="text-tertiary font-bold tracking-[0.2em] text-sm mb-6 uppercase">Industrial Packaging Excellence</span>
              <h1 className="text-6xl md:text-8xl font-extrabold text-on-surface leading-[0.95] tracking-tighter mb-8">
                Pilih Toples <br />Sesuai Kebutuhan
              </h1>
              <p className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                Solusi kemasan premium untuk UMKM hingga industri besar. Distribusi terpercaya dari Bandung dengan standar kualitas tinggi untuk menjaga kesegaran produk Anda.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-on-primary px-8 py-4 font-bold flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                  Lihat Katalog
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold transition-all hover:bg-surface-container-high">
                  Konsultasi Produk
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 relative mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-primary-fixed rounded-full blur-[120px] opacity-30 -z-10 transform translate-x-1/4"></div>
              <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden relative shadow-2xl">
                <img
                  alt="Premium Glass Jars"
                  className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWD0LOM87TroBp7p7bL0Gmhik6I5j0yZzU4iyEoppXP9FP7XgrCkaoCBa8eVNWA8I_4AB5BbhksOPFpUOZHJMo-LEMQ0JNXsGd_tMTrMw2CpfkXDA09rHXTp_-e79KeLxBr8-SyRSBfe8PjZ3F2HyJVjYigXdSkLe24H1BWPeHaOqnZ_wGq2k8xQKsH9xTQjF4s3Xh78FokPVdL82DmnQrZPyQHIU7cvic4_Prx1yz8C0MwQFwoKY14noYZ35ikgOTxxHYv1U6Tjc"
                />
                <div className="absolute bottom-8 left-8 bg-surface/90 backdrop-blur-md p-6 border-l-4 border-tertiary">
                  <p className="text-sm font-bold text-tertiary mb-1">BEST SELLER 2024</p>
                  <p className="text-lg font-bold text-on-surface">Cylinder Premium Series</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-surface-container-low py-20 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center md:items-start">
                <h2 className="text-5xl font-extrabold text-primary mb-2">50+</h2>
                <p className="text-on-surface-variant font-medium tracking-wide">Varian Produk Aktif</p>
              </div>
              <div className="flex flex-col items-center md:items-start border-l-0 md:border-l border-outline-variant/20 md:pl-12">
                <h2 className="text-5xl font-extrabold text-primary mb-2">4</h2>
                <p className="text-on-surface-variant font-medium tracking-wide">Kategori Utama Kemasan</p>
              </div>
              <div className="flex flex-col items-center md:items-start border-l-0 md:border-l border-outline-variant/20 md:pl-12">
                <div className="flex items-center gap-3">
                  <h2 className="text-5xl font-extrabold text-primary mb-2">Siap Kirim</h2>
                  <span className="material-symbols-outlined text-tertiary text-4xl">local_shipping</span>
                </div>
                <p className="text-on-surface-variant font-medium tracking-wide">Pusat Distribusi Bandung</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="py-32 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-4 block">Our Specialties</span>
                <h2 className="text-4xl font-extrabold tracking-tight">Kategori Kemasan</h2>
              </div>
              <p className="text-on-surface-variant max-w-md text-right hidden md:block">
                Kami menyediakan berbagai material berkualitas tinggi untuk menyesuaikan dengan karakteristik produk Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-surface-container-lowest p-8 hover:bg-primary transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center mb-8 group-hover:bg-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl group-hover:text-primary-container">inventory_2</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-on-primary">Jar Cylinder</h3>
                <p className="text-on-surface-variant group-hover:text-on-primary-container/80 text-sm leading-relaxed">
                  Pilihan utama untuk cookies dan snack premium dengan tampilan modern transparan.
                </p>
              </div>
              <div className="group bg-surface-container-lowest p-8 hover:bg-primary transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center mb-8 group-hover:bg-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl group-hover:text-primary-container">liquor</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-on-primary">Jar Kaca</h3>
                <p className="text-on-surface-variant group-hover:text-on-primary-container/80 text-sm leading-relaxed">
                  Material kaca tebal grade industri, cocok untuk selai, madu, dan produk artisan.
                </p>
              </div>
              <div className="group bg-surface-container-lowest p-8 hover:bg-primary transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center mb-8 group-hover:bg-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl group-hover:text-primary-container">deployed_code</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-on-primary">Tin Kaleng</h3>
                <p className="text-on-surface-variant group-hover:text-on-primary-container/80 text-sm leading-relaxed">
                  Proteksi maksimal dengan material metalic yang memberikan kesan klasik dan eksklusif.
                </p>
              </div>
              <div className="group bg-surface-container-lowest p-8 hover:bg-primary transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center mb-8 group-hover:bg-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl group-hover:text-primary-container">layers</span>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-on-primary">Jar Plastik</h3>
                <p className="text-on-surface-variant group-hover:text-on-primary-container/80 text-sm leading-relaxed">
                  Ringan, ekonomis, dan tahan banting. Tersedia dalam berbagai ukuran praktis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-surface-container-low py-32 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">Produk Unggulan</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Product 1 */}
              <div className="bg-surface-container-lowest group overflow-hidden">
                <div className="aspect-[4/5] relative bg-white overflow-hidden flex items-center justify-center p-12">
                  <div className="absolute inset-0 bg-primary-fixed/20 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full blur-3xl opacity-50"></div>
                  <img
                    alt="Cylinder Jar Premium"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzxJdzAeDvCiiTEev_KPuhufrOsW-4weP20hY9TdXs8er6TOmLr4AvXn3K8qRC0hIwnPgMxbStj7wyzIDaNpCsFdsdo95aViXcLJAdRCqipUnLC4LegjActcaa15seUDTBk61Oe66f5bP_P3jWz4QNuEsS0FxNdCU6UFhzmuFNvhow5KXfEQCrIUXSy9GpqpAgT-3X6qeoKFsiyT-YtUeac0p6a9AmnKITQYmEOEh2kU2UdOyGpFWCNxDdoDIHxC5uyHymdk-cfN4"
                  />
                  <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-3 py-1 tracking-widest uppercase">GRADE A+</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Jar Cylinder Premium 600ml</h4>
                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1">600ml</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Material PET High-Density, Seal Kedap Udara.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Mulai Dari</span>
                      <span className="text-xl font-extrabold text-primary">Rp 4.500</span>
                    </div>
                    <button className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Product 2 */}
              <div className="bg-surface-container-lowest group overflow-hidden">
                <div className="aspect-[4/5] relative bg-white overflow-hidden flex items-center justify-center p-12">
                  <img
                    alt="Cylinder Jar Premium"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFC2Ygg12kybLX9yMU5bRNrzDjx8VvZUey0ur302MkDoHkye25yEINLA2SScmPJfiwrTHAxOA46ONTQRM7EYlWKjZMMUPzxnd5hAauHNAptky5xNzBpZeIe9HUoy34PwbuAj21D28RfdDacmSWjZmCSMZDXGhbkxJ9w6XwRbIeN3bq5sbbMqvjbKw-S_yQOh_COD1W3jkhSc8EcUN-BzMnZTupiuhvNyTz_BqaS5LMMc6LwBQMEkrM9i95ILvicI8q4w1GTX8O8UI"
                  />
                  <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-3 py-1 tracking-widest uppercase">GRADE A+</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Jar Cylinder Premium 800ml</h4>
                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1">800ml</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Material PET High-Density, Scratch Resistant.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Mulai Dari</span>
                      <span className="text-xl font-extrabold text-primary">Rp 5.200</span>
                    </div>
                    <button className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Product 3 */}
              <div className="bg-surface-container-lowest group overflow-hidden">
                <div className="aspect-[4/5] relative bg-white overflow-hidden flex items-center justify-center p-12">
                  <img
                    alt="Cylinder Jar Premium"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKbnfpr0jzrRcJR179yN8q6F8d3bHp8A8tB31VCdmKcJF7o76mMI5iN_6vsxsh18xv5TqJgUBDsjftWT5X6mTgUVFe9sErpcvP5q5XWnPQl0H0BGeDvnz9H4rOmpbhtBvy0MbODM15gRWaczjbB6P9v2iD93j3-FSaPVx6UfKk_hB5X5SEmvlOYAH8_wmbcVU-s8ZcT2oRxl8Dg4njkVRbRerOxt-M-qQ3atFWa7IYFiojwiDa8f7YoZF-WRHZMWj__EdbCf9ReU8"
                  />
                  <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-3 py-1 tracking-widest uppercase">GRADE A+</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Jar Cylinder Premium 1000ml</h4>
                    <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1">1000ml</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Ideal untuk penyimpanan pasta atau sereal.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Mulai Dari</span>
                      <span className="text-xl font-extrabold text-primary">Rp 6.000</span>
                    </div>
                    <button className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 text-center">
              <button className="border-b-2 border-primary text-primary font-bold pb-1 hover:text-primary-container hover:border-primary-container transition-all">
                Tampilkan Semua Katalog Produk
              </button>
            </div>
          </div>
        </section>

        {/* Info / Location Section */}
        <section className="py-32 px-8">
          <div className="max-w-screen-2xl mx-auto editorial-grid gap-16 items-center">
            <div className="col-span-12 lg:col-span-6 bg-surface-container-high relative min-h-[400px]">
              <div className="absolute inset-0 grayscale contrast-125 opacity-40">
                <img
                  alt="Industrial Warehouse"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_wMtWhj_UxjMo9O2INgEuZ1PLuaR0VC8I91V17liFjw42XYBunVDI5kaPdERBMI7qjKCNST5w9RqcbEomAY0U9x30fW37LEeQdBecB02M1Dm972I1a4sXASQmJgTULMPueBNcY-k63v4d6B7unxDzERD0No_RXoqs-vaoPdxoSdDw0U793Glx_DCWlX_7ei457Jq8CeNLbYpSv1Qwmnqso9DhWUM8fx_knDxqBegPTcHa6-9WibcoMumrlknXcR1rxCCWNxsg-Ak"
                />
              </div>
              <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                <div className="bg-primary p-12 text-on-primary max-w-sm ml-auto -mb-16 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">Pengiriman Dari Bandung</h3>
                  <p className="text-on-primary/80 text-sm mb-6 leading-relaxed">
                    Strategis untuk distribusi ke seluruh pulau Jawa dan Indonesia. Kami menggunakan ekspedisi terpercaya untuk keamanan barang pecah belah.
                  </p>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="material-symbols-outlined">location_on</span>
                    Bojongloa Kaler, Kota Bandung
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <h2 className="text-4xl font-extrabold tracking-tight mb-8">Mengapa Toples Laksana?</h2>
              <ul className="space-y-8">
                <li className="flex gap-6">
                  <span className="text-tertiary font-bold text-lg">01.</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Kualitas Industri</h4>
                    <p className="text-on-surface-variant text-sm">
                      Hanya menjual produk grade industri yang lolos kontrol kualitas ketat untuk ketebalan dan kejernihan material.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <span className="text-tertiary font-bold text-lg">02.</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Ready Stock</h4>
                    <p className="text-on-surface-variant text-sm">
                      Gudang kami selalu terisi penuh untuk mendukung kelancaran produksi bisnis Anda tanpa hambatan stok.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <span className="text-tertiary font-bold text-lg">03.</span>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Harga Kompetitif</h4>
                    <p className="text-on-surface-variant text-sm">
                      Skema harga grosir yang sangat bersahabat bagi reseller maupun pelaku industri kecil menengah.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
