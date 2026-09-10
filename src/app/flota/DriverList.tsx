"use client";

import { useTransition } from "react";
import { TIERS } from "@/lib/data";
import type { DriverRow } from "@/lib/drivers";
import { changeStatus, removeDriver } from "./actions";

const STATUS: Record<string, { label: string; cls: string }> = {
  available: { label: "Disponible", cls: "bg-jade text-ink" },
  busy: { label: "En viaje", cls: "bg-gold text-ink" },
  offline: { label: "Fuera", cls: "bg-ink-line text-muted" },
};

export default function DriverList({ drivers }: { drivers: DriverRow[] }) {
  const [pending, start] = useTransition();

  if (drivers.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink-line p-10 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">
          Sin conductores
        </p>
        <p className="mt-1 text-xs text-muted">
          Agrega el primero con el formulario.
        </p>
      </div>
    );
  }

  return (
    <ul className={`space-y-2 ${pending ? "opacity-60" : ""}`}>
      {drivers.map((d) => {
        const tier = TIERS.find((t) => t.id === d.tier);
        const st = STATUS[d.status] ?? STATUS.offline;
        return (
          <li key={d.id} className="cut-tr flex items-center gap-3 bg-ink-soft p-3">
            <div className="grid size-11 shrink-0 place-items-center bg-rosa font-display text-sm font-extrabold text-white">
              {d.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">{d.name}</p>
              <p className="truncate text-xs text-muted">
                {d.car_make} {d.car_model} · {d.car_color}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="border border-cream/20 px-1.5 py-0.5 font-bold tracking-wider">
                  {d.plate}
                </span>
                <span className={`px-1.5 py-0.5 font-bold uppercase tracking-wider ${st.cls}`}>
                  {st.label}
                </span>
                {tier && (
                  <span className="px-1.5 py-0.5 font-bold uppercase tracking-wider text-muted">
                    {tier.name}
                  </span>
                )}
                <span className="text-gold">★ {d.rating.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              <select
                value={d.status}
                disabled={pending}
                onChange={(e) =>
                  start(() => {
                    changeStatus(d.id, e.target.value);
                  })
                }
                aria-label={`Estado de ${d.name}`}
                className="border border-ink-line bg-ink px-2 py-1 text-[11px] outline-none"
              >
                <option value="available">Disponible</option>
                <option value="busy">En viaje</option>
                <option value="offline">Fuera</option>
              </select>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm(`¿Eliminar a ${d.name} de la flota?`)) {
                    start(() => {
                      removeDriver(d.id);
                    });
                  }
                }}
                className="border border-ink-line px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted transition hover:border-rosa hover:text-rosa"
              >
                Quitar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
