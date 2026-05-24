import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toples Laksana",
  description: "Penyedia kemasan industri berkualitas tinggi di Bandung.",
};

import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", jakarta.variable, "font-sans")}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AppProvider>
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
