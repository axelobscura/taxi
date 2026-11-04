"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { useI18n } from "@/i18n/client";
import { stripLang } from "@/i18n/config";
import { LOGIN_PATH, NAV } from "@/lib/nav";

/**
 * Inline nav shown on wide screens so the menu items are visible up front
 * instead of hidden behind the hamburger. MenuOverlay still covers narrow
 * screens, where there isn't room for this.
 */
export default function HeaderNav() {
  const { dict, path } = useI18n();
  // Language-neutral, so it matches on both `/en/tarifas` and `/tarifas`.
  const current = stripLang(usePathname());
  const isActive = (href: string) =>
    href === "/" ? current === "/" : current.startsWith(href);

  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {NAV.map((href) => (
        <Link
          key={href}
          href={path(href)}
          className={`rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition ${
            isActive(href) ? "bg-taxi text-coal" : "text-snow/80 hover:text-taxi"
          }`}
        >
          {dict.nav[href]}
        </Link>
      ))}
      <LanguageSwitch className="ml-2" />
      <Link
        href={LOGIN_PATH}
        className="ml-1 rounded-full border border-snow/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-snow transition hover:border-taxi hover:text-taxi"
      >
        {dict.header.login}
      </Link>
    </nav>
  );
}
