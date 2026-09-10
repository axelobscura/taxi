"use client";

import { useEffect, useState } from "react";
import type { AssignedDriver, Tier } from "@/lib/data";
import { initialsOf, mxn } from "@/lib/data";

type Props = {
  driver: AssignedDriver;
  tier: Tier;
  fare: number;
  onCancel: () => void;
};

export default function DriverCard({ driver, tier, fare, onCancel }: Props) {
  const [secondsAway, setSecondsAway] = useState(tier.eta * 60);

  useEffect(() => {
    const id = setInterval(() => setSecondsAway((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(secondsAway / 60);
  const secs = secondsAway % 60;
  const arrived = secondsAway === 0;

  return (
    <div className="animate-rise space-y-3">
      <div className="glass p-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-jade opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-jade" />
          </span>
          <span className="font-bold uppercase tracking-widest text-jade">
            {arrived ? "Tu conductor llegó" : "Tu conductor va en camino"}
          </span>
          {!arrived && (
            <span className="ml-auto font-display tabular-nums text-cream">
              {mins}:{String(secs).padStart(2, "0")}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="relative grid size-14 shrink-0 place-items-center bg-rosa font-display text-xl font-extrabold text-white">
            {initialsOf(driver.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold">{driver.name}</p>
            <p className="truncate text-xs text-muted">
              {driver.car_make} {driver.car_model} · {driver.car_color}
            </p>
            <p className="mt-1 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-gold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 3 6.6 7 .9-5.2 4.9 1.4 7L12 18l-6.2 3.4 1.4-7L2 9.5l7-.9Z" />
                </svg>
                {driver.rating.toFixed(2)}
              </span>
              <span className="text-muted">{driver.trips.toLocaleString("es-MX")} viajes</span>
            </p>
          </div>
          <div className="shrink-0 border-2 border-cream/20 bg-ink px-2.5 py-1.5 text-center">
            <p className="font-display text-sm font-bold tracking-wider">{driver.plate}</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted">Placa</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={`tel:${driver.phone.replace(/\s/g, "")}`}
            className="cut-tr flex items-center justify-center gap-2 border-2 border-ink-line bg-ink-raised py-3 text-xs font-bold uppercase tracking-widest transition hover:border-rosa hover:text-rosa"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
            </svg>
            Llamar
          </a>
          <button
            type="button"
            className="cut-tr flex items-center justify-center gap-2 border-2 border-ink-line bg-ink-raised py-3 text-xs font-bold uppercase tracking-widest transition hover:border-rosa hover:text-rosa"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 20l1.1-4.6a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.8 8.4Z" />
            </svg>
            Mensaje
          </button>
        </div>
      </div>

      <div className="glass flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rosa">Total estimado</p>
          <p className="font-display text-2xl font-bold tabular-nums">{mxn(fare)}</p>
          <p className="text-xs text-muted">{tier.name} · Efectivo o tarjeta</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="skewed shrink-0 border-2 border-ink-line px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-rosa hover:text-rosa"
        >
          Cancelar
        </button>
      </div>

      <p className="px-2 text-center text-[11px] leading-relaxed text-muted">
        Comparte tu viaje en tiempo real desde el menú. Todos los conductores
        están verificados con la SEMOVI.
      </p>
    </div>
  );
}
