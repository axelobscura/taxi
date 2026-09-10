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

  return (
    <nav className="hidden items-stretch md:flex">
      {PUBLIC_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 text-[11px] font-bold uppercase tracking-widest transition ${
              active
                ? "bg-rosa-deep text-white"
                : "text-cream/80 hover:bg-black/15 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/entrar"
        className={`flex items-center border-l border-black/15 bg-ink px-4 text-[11px] font-bold uppercase tracking-widest transition hover:bg-ink-raised ${
          pathname === "/entrar" ? "text-rosa" : "text-cream"
        }`}
      >
        Entrar
      </Link>
    </nav>
  );
}
