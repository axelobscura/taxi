"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NAV } from "@/lib/nav";

/**
 * Full-screen navigation overlay, opened from the hamburger in the header.
 */
export default function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        aria-label="Abrir menú"
        aria-expanded={open}
        className="grid size-9 place-items-center text-white transition hover:bg-black/15"
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
          aria-label="Menú principal"
          className="fixed inset-0 z-[1000] flex flex-col bg-ink"
        >
          <div className="flex items-center justify-between px-5 pt-5">
            <p className="eyebrow">Menú</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              autoFocus
              className="grid size-10 place-items-center bg-rosa text-white transition hover:bg-rosa-deep"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-5 pb-16">
            {NAV.map((item, i) => {
              const active = pathname === item.href;
              // The operator login is not a public page; set it apart.
              const isStaff = item.href === "/entrar";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-baseline gap-4 py-2 ${
                    isStaff ? "mt-6 border-t border-ink-line pt-6" : ""
                  }`}
                  style={{ animation: `rise 0.4s ${i * 60}ms both` }}
                >
                  <span className="font-display text-[11px] font-bold tabular-nums text-rosa">
                    {isStaff ? "→" : `0${i + 1}`}
                  </span>
                  <span
                    className={`font-display font-extrabold uppercase leading-none transition-colors ${
                      isStaff ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
                    } ${
                      active
                        ? "text-rosa"
                        : isStaff
                          ? "text-muted group-hover:text-rosa"
                          : "text-cream group-hover:text-rosa"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isStaff && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                      Panel de flota
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

            <div className="border-t border-ink-line px-5 py-5 text-xs text-muted">
              <p className="font-bold uppercase tracking-widest text-cream">
                24/7 en toda la CDMX
              </p>
              <p className="mt-1">55 0011-52256 · hola@taxi.org.mx</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
