import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { NavLink } from "@/components/NavLink";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spa Practice",
  description: "Luyện tập đưa ra phác đồ chăm sóc da mặt",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${playfair.variable}`}>
      <body>
        <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-rose-700">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-600 text-sm font-bold text-white">
                SP
              </span>
              <span className="font-display text-base sm:text-lg">Spa Practice</span>
            </Link>
            <div className="flex items-center gap-1 rounded-full bg-stone-50 p-1 ring-1 ring-stone-100">
              <NavLink href="/advanced">Nâng cao (AI)</NavLink>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
