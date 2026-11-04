"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { localePath, stripLang } from "@/i18n/config";

/**
 * Links to the current page in the other language. The path is normalized
 * with `stripLang`, so it comes out the same whether `usePathname` returns
 * the browser URL or the proxy-rewritten `/es/...` one.
 */
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, dict } = useI18n();
  const path = stripLang(usePathname());
  const other = lang === "es" ? "en" : "es";

  return (
    <Link
      href={localePath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={dict.header.switchLabel}
      className={`inline-flex items-center gap-1.5 rounded-full border border-snow/30 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-snow transition hover:border-taxi hover:text-taxi ${className}`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
      </svg>
      {other.toUpperCase()}
    </Link>
  );
}
