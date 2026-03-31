'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should NOT have the global public navbar/footer
  const isDedicatedPage = pathname === '/login' || pathname.startsWith('/admin');

  if (isDedicatedPage) {
    return <main className="flex-grow flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 flex-grow flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}
