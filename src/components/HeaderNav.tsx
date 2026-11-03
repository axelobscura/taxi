"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

const PUBLIC_NAV = NAV.filter((item) => item.href !== "/entrar");

/**
 * Inline nav shown on wide screens so the menu items are visible up front
 * instead of hidden behind the hamburger. MenuOverlay still covers narrow
 * screens, where there isn't room for this.
 */
export default function HeaderNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {PUBLIC_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition ${
            isActive(item.href)
              ? "bg-taxi text-coal"
              : "text-snow/80 hover:text-taxi"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/entrar"
        className={`ml-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition ${
          pathname === "/entrar"
            ? "border-taxi text-taxi"
            : "border-snow/30 text-snow hover:border-taxi hover:text-taxi"
        }`}
      >
        Entrar
      </Link>
    </nav>
  );
}
