import Link from "next/link";
import CarIcon from "./CarIcon";

/** Brand mark: yellow taxi tile plus wordmark. `sub` is the small line under it. */
export default function Logo({ sub = "Pide y relájate" }: { sub?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="TAXI-MEX, inicio">
      <span className="grid size-10 place-items-center rounded-md bg-taxi">
        <CarIcon size={24} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-tight text-snow">
          TAXI<span className="text-taxi">-MEX</span>
        </span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-snow/60">
          {sub}
        </span>
      </span>
    </Link>
  );
}
