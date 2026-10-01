import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavLink } from "@/components/NavLink";
import "./globals.css";

// Không dùng next/font/google: loader của nó crash khi Google trả URL font không có đuôi file,
// làm build Vercel thất bại ngẫu nhiên. Tải font bằng thẻ <link> ở trình duyệt thì build không phụ thuộc Google.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap";

export const metadata: Metadata = {
  title: "Spa Practice",
  description: "Luyện tập đưa ra phác đồ chăm sóc da mặt",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
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
