import Link from "next/link";
import MenuOverlay from "./MenuOverlay";

/**
 * The angled brand bar shared by every public page.
 * `floating` overlays it on the map instead of sitting in flow.
 */
export default function SiteHeader({ floating = false }: { floating?: boolean }) {
  return (
    <header className={floating ? "relative z-10" : "relative"}>
      <div className="hidden items-center gap-6 bg-ink-soft px-5 py-2 text-[11px] text-muted sm:flex">
        <span className="flex items-center gap-2">
          <span className="grid size-5 place-items-center bg-rosa text-ink">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
            </svg>
          </span>
          55 0011-52256
        </span>
        <span className="hidden md:inline">hola@taxi.org.mx</span>
        <span className="ml-auto font-semibold tracking-widest text-cream">
          24/7 EN TODA LA CDMX
        </span>
      </div>

      <div className="relative flex items-stretch">
        <Link href="/" className="skewed relative -ml-4 bg-cream px-7 py-3 pl-10">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center bg-rosa">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="white" />
                <rect x="9.2" y="2.4" width="5.6" height="2.6" rx="0.8" fill="white" />
                <circle cx="7.8" cy="16.6" r="1.9" fill="#0b0b0f" />
                <circle cx="16.2" cy="16.6" r="1.9" fill="#0b0b0f" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="font-display text-lg font-extrabold tracking-tight text-ink">
                TAXI_MEX
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                CDMX
              </p>
            </div>
          </div>
        </Link>

        <div className="relative flex flex-1 items-center justify-end bg-rosa px-5">
          <MenuOverlay />
        </div>
      </div>
    </header>
  );
}
