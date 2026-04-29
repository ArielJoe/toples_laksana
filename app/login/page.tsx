import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Admin - Toples Laksana",
};

export default function LoginPage() {
  return (
    <div className="bg-background text-text-primary min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient BG */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <main className="grow flex items-center justify-center p-6 relative z-10 w-full max-w-screen-2xl mx-auto">
        {/* Back Link */}
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-primary-500 transition-colors font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full border border-border bg-white/50 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Beranda
          </Link>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-2xl shadow-2xl shadow-primary-500/5 rounded-2xl overflow-hidden flex flex-col border border-border transition-all duration-500">
          {/* Header */}
          <div className="px-10 pt-12 pb-6 text-center">
            <Link href="/" className="inline-block text-2xl font-extrabold text-primary-500 tracking-tight mb-6">
              Toples Laksana
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">Login Admin</h1>
          </div>

          <form
            className="px-10 pb-12 space-y-6"
            action="/admin"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-text-muted px-1" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input
                  autoFocus
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-border rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-sm font-bold shadow-sm"
                  id="email"
                  name="email"
                  placeholder="admin@topleslaksana.com"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-text-muted" htmlFor="password">
                  Kata Sandi
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input
                  className="block w-full pl-12 pr-12 py-4 bg-white border border-border rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-sm font-bold shadow-sm"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                className="w-full bg-primary-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-xs active:scale-[0.98]"
                type="submit"
              >
                <span>Masuk</span>
                <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
