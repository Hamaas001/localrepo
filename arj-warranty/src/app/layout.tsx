import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARJ MOTORS | Warranty Admin",
  description: "Warranty management for ARJ MOTORS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="container h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-[--color-brand]" aria-hidden />
              <Link href="/" className="font-semibold tracking-tight">ARJ MOTORS</Link>
              <span className="text-sm text-black/50">Warranty Admin</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/warranties/new" className="btn btn-primary">Add Warranty</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6"><Providers>{children}</Providers></main>
        <footer className="border-t border-black/10 py-6 mt-8 text-sm text-black/50">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} ARJ MOTORS</span>
            <a href="https://www.arjmotors.co.uk/" target="_blank" rel="noreferrer" className="hover:underline">arjmotors.co.uk</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
