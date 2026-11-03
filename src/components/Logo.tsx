import Link from "next/link";

/** Brand mark: yellow taxi tile plus wordmark. `sub` is the small line under it. */
export default function Logo({ sub = "Pide y relájate" }: { sub?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="TAXI_MEX, inicio">
      <span className="grid size-10 place-items-center rounded-md bg-taxi">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="#111" />
          <rect x="9.2" y="2.4" width="5.6" height="2.6" rx="0.8" fill="#111" />
          <circle cx="7.8" cy="16.6" r="1.9" fill="#111" />
          <circle cx="16.2" cy="16.6" r="1.9" fill="#111" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight text-snow">
          TAXI<span className="text-taxi">_MEX</span>
        </span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-snow/60">
          {sub}
        </span>
      </span>
    </Link>
  );
}
