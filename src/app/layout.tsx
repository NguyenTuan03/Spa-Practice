import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

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
      <body>
        <header className="border-b border-rose-100 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-semibold text-rose-700">Spa Practice</Link>
            <Link href="/" className="text-sm text-stone-600 hover:text-rose-700">Danh sách ca</Link>
            <Link href="/advanced" className="text-sm text-stone-600 hover:text-rose-700">Nâng cao (AI)</Link>
            <Link href="/history" className="text-sm text-stone-600 hover:text-rose-700">Lịch sử</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
