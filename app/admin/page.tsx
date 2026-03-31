export default function AdminDashboard() {
  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-body">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-surface-container-low flex flex-col fixed inset-y-0 left-0 z-50 transition-all border-r border-outline-variant/15">
        <div className="px-8 py-8">
          <h1 className="text-xl font-bold text-primary tracking-tight">Toples Laksana</h1>
          <p className="text-[0.65rem] text-secondary font-bold tracking-widest uppercase mt-1">Admin Management</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-primary-fixed/30 rounded transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary">dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded transition-colors shadow-sm shadow-primary/10" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="font-bold text-sm">Produk</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-primary-fixed/30 rounded transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary">category</span>
            <span className="font-medium text-sm">Kategori</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-primary-fixed/30 rounded transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary">settings</span>
            <span className="font-medium text-sm">Admin Settings</span>
          </a>
        </nav>
        <div className="px-4 pb-4">
          <a 
            href="/login" 
            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded transition-colors group"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-bold text-sm uppercase tracking-widest">Keluar</span>
          </a>
        </div>
        <div className="p-8 border-t border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">AL</div>
            <div>
              <p className="text-xs font-bold text-on-surface">Admin Laksana</p>
              <p className="text-[10px] text-secondary">Super User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-72 flex flex-col">

        {/* Dashboard Content */}
        <div className="p-10 space-y-10 flex-1">
          {/* Stat Cards: Bento-ish Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 shadow-sm border border-outline-variant/15 hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 bg-primary-fixed/20 rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">inventory</span>
              </div>
              <div>
                <p className="text-secondary text-xs font-bold tracking-wider uppercase">Total Products</p>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">1,284</h2>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 shadow-sm border border-outline-variant/15 hover:border-error/30 transition-colors">
              <div className="w-14 h-14 bg-error-container/20 rounded-lg flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <div>
                <p className="text-secondary text-xs font-bold tracking-wider uppercase">Low Stock</p>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">24</h2>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 shadow-sm border border-outline-variant/15 hover:border-tertiary/30 transition-colors">
              <div className="w-14 h-14 bg-tertiary-container/20 rounded-lg flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-3xl">layers</span>
              </div>
              <div>
                <p className="text-secondary text-xs font-bold tracking-wider uppercase">Categories Active</p>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">12</h2>
              </div>
            </div>
          </section>

          {/* Product Table Section */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden">
            <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/30 border-b border-outline-variant/10">
              <div>
                <h3 className="text-lg font-extrabold text-on-surface tracking-tight">Katalog Produk</h3>
                <p className="text-xs text-secondary mt-0.5 font-medium">Manage and monitor your industrial container inventory</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-outline-variant/20 rounded text-secondary flex items-center gap-2 hover:bg-surface-container-low transition-colors outline-none">
                  <span className="material-symbols-outlined text-sm leading-none">filter_list</span>
                  Filter
                </button>
                <button className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-outline-variant/20 rounded text-secondary flex items-center gap-2 hover:bg-surface-container-low transition-colors outline-none">
                  <span className="material-symbols-outlined text-sm leading-none">download</span>
                  Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">SKU ID</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">Nama Produk</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">Kategori</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">Grade</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em]">Stock Status</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-secondary uppercase tracking-[0.1em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-8 py-5 text-sm font-mono text-primary font-bold">PRD-801</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/10">
                          <img
                            className="w-full h-full object-cover"
                            alt="Product"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVLe1BlbZlk_TAkfPvyWD6j0ozLVU4UA3sI8wXEEShtHzD-9kc0exYJWe8IhvMVbNXnb5UBLaMjP0VxsDicuit0wwHomWWF2DLT9Bt4gz6Ti2QBlnX5zy7PFwdgD-aKS0zwYEYpHui0y86U8fc4G4ZYlhnP4aiCnHhrolj4RtF6aRV5mJvvmFAT43unRHbxd565VYGH_3Uv2R4cuQbzL41Ty1mSQl4faNNr6IPw_QkzBO_Z8oJxGxJzEFxTS-ZEKcQvPNxgzLBO5g"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Cylinder 500ml Clear</p>
                          <p className="text-[10px] text-secondary font-medium">Premium PET Series</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded">
                        Jar Makanan
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded">Grade A+</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-primary">In Stock</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-secondary hover:text-primary outline-none">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-secondary hover:text-error outline-none">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group border-t border-outline-variant/10">
                    <td className="px-8 py-5 text-sm font-mono text-primary font-bold">PRD-422</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/10">
                          <img
                            className="w-full h-full object-cover"
                            alt="Product"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSUTqz0BOpkTzvXN-ZxuWzj1JDfT8w4msuQReYy1JUxa5yfJEDyREX459SvAPtDfv4xwSsFiYvzasBsz_kijL8SUo8_G9RM3l1o7sJuw-DcIYEr5-uZW7au_at2VCLzg4eaiFqKw1evnhz0M5in0kLrvhT4cO0_yK-B-Jhnujl9fa7UP6IwKGTnbjKKj5WiTGtD36f7V1ponih7MkNgpHeNLlf074uwcpPcv0bgAPb7N8UQCbCY7c9ayiXCLLFV37RERf2EH62d4U"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Square Jar 1000ml Opaque</p>
                          <p className="text-[10px] text-secondary font-medium">Industrial HDPE</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded">
                        Kebutuhan Industri
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-surface-container-highest text-secondary text-[10px] font-bold rounded">Standard</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-error/20 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-error rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-error">Low Stock</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-secondary hover:text-primary outline-none">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-secondary hover:text-error outline-none">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-xs text-secondary font-medium">Showing 1 to 10 of 1,284 results</p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-800 border border-outline-variant/20 text-secondary hover:bg-primary hover:text-white transition-colors outline-none">
                  <span className="material-symbols-outlined text-sm leading-none">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold outline-none">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-800 border border-outline-variant/20 text-secondary hover:bg-primary-fixed/50 text-xs font-bold outline-none">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-800 border border-outline-variant/20 text-secondary hover:bg-primary hover:text-white transition-colors outline-none">
                  <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
