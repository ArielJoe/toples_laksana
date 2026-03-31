'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="font-body bg-background text-on-background min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 industrial-bg relative min-h-screen">
        <style jsx>{`
          .industrial-bg {
            background-image: linear-gradient(rgba(25, 28, 29, 0.85), rgba(25, 28, 29, 0.85)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDYZSMS557-BoNJ1oiRYsm-yBNdlRVdXCiHr_JRaZTWzTavl3pstLp1Q1n8sqqjpFLEiLEBFKAbFxrhLeST1ILmIxKCfJ3YVvR3Mlc0FQJnr4G7O8qUWGQ65d3f1NpfmTX6N-dRo5XkJ8X432Pa4UV-yFfqY1cE49awSLrhmGNrffATIy2RqF6zOVqxpKXM0y7zvd7FN1MarAxsnaJT3sZ6y-G_27LBesLtNjZ84E9x-GvS_jbHuZKT7IAqLTlKgnYEj91GtABdRk0);
            background-size: cover;
            background-position: center;
          }
        `}</style>

        {/* Home Shortcut */}
        <div className="absolute top-8 left-8 z-50">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Website Utama
          </Link>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[440px] bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col border border-outline-variant/30 relative z-10 transition-all duration-500 hover:shadow-primary/10">
          {/* Card Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-container text-white mb-6 shadow-inner">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
            </div>
            <h1 className="font-headline text-3xl font-black tracking-tighter text-emerald-900 mb-1">Toples Laksana</h1>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest opacity-60">Admin Industrial Portal</p>
          </div>

          {/* Login Form */}
          <form className="px-8 pb-10 space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href = '/admin'; }}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/80 px-1" htmlFor="email">Email Portal</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input 
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-sm font-medium" 
                  id="email" 
                  name="email" 
                  placeholder="admin@laksana.id" 
                  required 
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/80" htmlFor="password">Password</label>
                <a className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-emerald-700 transition-colors" href="#">Lupa Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
                <input 
                  className="block w-full pl-12 pr-12 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-sm font-medium" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-outline hover:text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center px-1">
              <input 
                className="h-4 w-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" 
                id="remember" 
                name="remember" 
                type="checkbox"
              />
              <label className="ml-3 block text-sm font-bold text-on-surface-variant/80 cursor-pointer" htmlFor="remember">Keep me logged in</label>
            </div>

            {/* Sign In Button */}
            <button 
              className="w-full bg-emerald-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-emerald-800 transition-all duration-300 flex items-center justify-center gap-3 group uppercase tracking-[0.2em] text-xs" 
              type="submit"
            >
              <span>Authenticating</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Security Footer */}
          <div className="bg-surface-container-high/50 py-5 px-8 border-t border-outline-variant/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-on-surface-variant/60">Secure industrial standard gateway</span>
          </div>
        </div>

        {/* Floating Decorative Element */}
        <div className="absolute bottom-12 right-12 hidden lg:block opacity-10 select-none">
          <span className="material-symbols-outlined text-[240px] text-white">settings_suggest</span>
        </div>
      </main>

      {/* Login Page Footer (Unique) */}
      <footer className="bg-emerald-950 text-white font-manrope text-[10px] uppercase font-black tracking-widest py-8 px-12 w-full border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="opacity-60 text-center md:text-left">
          © 2024 Toples Laksana Industrial Packaging Systems.
        </div>
        <div className="flex gap-8 opacity-40">
          <a className="hover:opacity-100 transition-opacity" href="#">Privacy</a>
          <a className="hover:opacity-100 transition-opacity" href="#">Terms</a>
          <a className="hover:opacity-100 transition-opacity" href="#">Security</a>
        </div>
      </footer>
    </div>
  );
}
