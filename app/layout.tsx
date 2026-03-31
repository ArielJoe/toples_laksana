import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Toples Laksana - Industrial Packaging Excellence",
  description: "Penyedia kemasan industri berkualitas tinggi di Bandung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
