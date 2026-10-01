"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export function NavLink({ href, children }: NavLinkProps): ReactNode {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        active ? "bg-rose-600 text-white" : "text-stone-600 hover:bg-rose-50 hover:text-rose-700"
      }`}
    >
      {children}
    </Link>
  );
}
