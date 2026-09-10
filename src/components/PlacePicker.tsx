"use client";

import { useMemo, useState } from "react";
import { PLACES, type Place } from "@/lib/data";

type Props = {
  origin: Place | null;
  destination: Place | null;
  onPick: (field: "origin" | "destination", place: Place) => void;
  onSwap: () => void;
};

export default function PlacePicker({ origin, destination, onPick, onSwap }: Props) {
  const [active, setActive] = useState<"origin" | "destination" | null>("destination");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = PLACES.filter((p) => {
      const taken = active === "origin" ? destination : origin;
      return p.name !== taken?.name;
    });
    if (!q) return pool.slice(0, 6);
    return pool
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, active, origin, destination]);

  function choose(place: Place) {
    if (!active) return;
    onPick(active, place);
    setQuery("");
    // Move the user forward through the form naturally.
    setActive(active === "origin" ? "destination" : null);
  }

  return (
    <div className="space-y-3">
      <div className="glass relative p-2">
        {/* Connector between the two dots */}
        <div className="pointer-events-none absolute left-[26px] top-[38px] bottom-[38px] w-px bg-gradient-to-b from-jade via-ink-line to-rosa" />

        <Field
          dot={<span className="block size-2.5 rounded-full bg-jade" />}
          label="Origen"
          value={origin?.name}
          zone={origin?.zone}
          isActive={active === "origin"}
          onClick={() => setActive("origin")}
        />

        <Field
          dot={<span className="block size-2.5 bg-rosa" />}
          label="Destino"
          value={destination?.name}
          zone={destination?.zone}
          isActive={active === "destination"}
          onClick={() => setActive("destination")}
        />

        <button
          type="button"
          onClick={onSwap}
          aria-label="Invertir origen y destino"
          className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-rosa text-white [clip-path:polygon(22%_0,100%_0,78%_100%,0_100%)] transition hover:bg-rosa-deep active:scale-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4 4 4" />
            <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
          </svg>
        </button>
      </div>

      {active && (
        <div className="glass animate-rise p-3">
          <div className="flex items-center gap-2 bg-ink px-3 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                active === "origin" ? "¿Dónde te recogemos?" : "¿A dónde vas?"
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>

          <ul className="mt-2 max-h-[min(14rem,26dvh)] space-y-0.5 overflow-y-auto no-scrollbar">
            {results.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => choose(p)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-ink-raised active:scale-[0.99]"
                >
                  <span className="grid size-9 shrink-0 place-items-center bg-ink-raised text-muted">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted">{p.zone}</span>
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted">
                Sin resultados para “{query}”
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({
  dot,
  label,
  value,
  zone,
  isActive,
  onClick,
}: {
  dot: React.ReactNode;
  label: string;
  value?: string;
  zone?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3  px-3 py-3 pr-14 text-left transition ${
        isActive ? "bg-ink-raised" : "hover:bg-ink-raised/60"
      }`}
    >
      <span className="grid size-5 shrink-0 place-items-center">{dot}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-rosa">
          {label}
        </span>
        <span
          className={`block truncate text-sm ${value ? "font-medium text-cream" : "text-muted"}`}
        >
          {value ?? "Selecciona un punto"}
        </span>
      </span>
      {zone && (
        <span className="hidden shrink-0 text-xs text-muted sm:block">{zone}</span>
      )}
    </button>
  );
}
