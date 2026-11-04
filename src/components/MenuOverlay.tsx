"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SITE } from "@/lib/site";
import { useI18n } from "@/i18n/client";
import { stripLang } from "@/i18n/config";
import { LOGIN_PATH, NAV } from "@/lib/nav";

/** Main menu entries, then the operator login set apart at the end. */
const ITEMS = [...NAV, LOGIN_PATH] as const;

/**
 * Full-screen navigation overlay, opened from the hamburger in the header.
 */
export default function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const { dict, path } = useI18n();
  const current = stripLang(usePathname());

  // Escape closes; lock scroll while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.header.openMenu}
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-md bg-taxi text-coal transition hover:bg-taxi-bright"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
          aria-modal="true"
          aria-label={dict.header.mainMenu}
          className="fixed inset-0 z-[1000] flex flex-col bg-ink"
        >
          <div className="flex items-center justify-between px-5 pt-5">
            <p className="eyebrow">{dict.header.menu}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.header.closeMenu}
              autoFocus
              className="grid size-10 place-items-center bg-taxi text-coal transition hover:bg-taxi-deep"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-5 pb-16">
            {ITEMS.map((href, i) => {
              const active = current === href;
              // The operator login is not a public page; set it apart. It is
              // Spanish-only, so its URL never gets a language prefix.
              const isStaff = href === LOGIN_PATH;
              return (
                <Link
                  key={href}
                  href={isStaff ? href : path(href)}
                  onClick={() => setOpen(false)}
                  className={`group flex items-baseline gap-4 py-2 ${
                    isStaff ? "mt-6 border-t border-ink-line pt-6" : ""
                  }`}
                  style={{ animation: `rise 0.4s ${i * 60}ms both` }}
                >
                  <span className="font-display text-[11px] font-bold tabular-nums text-accent">
                    {isStaff ? "→" : `0${i + 1}`}
                  </span>
                  <span
                    className={`font-display font-extrabold uppercase leading-none transition-colors ${
                      isStaff ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
                    } ${
                      active
                        ? "text-accent"
                        : isStaff
                          ? "text-muted group-hover:text-accent"
                          : "text-cream group-hover:text-accent"
                    }`}
                  >
                    {isStaff ? dict.header.login : dict.nav[href]}
                  </span>
                  {isStaff && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                      {dict.header.fleetPanel}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

            <div className="border-t border-ink-line px-5 py-5 text-xs text-muted">
              <p className="font-bold uppercase tracking-widest text-cream">
                {dict.header.coverage247}
              </p>
              <p className="mt-1">{SITE.email}</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
