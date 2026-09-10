"use client";

import { useActionState, useEffect, useRef } from "react";
import { TIERS } from "@/lib/data";
import { addDriver, type FleetState } from "./actions";

const EMPTY: FleetState = {};

export default function AddDriverForm() {
  const [state, formAction, pending] = useActionState(addDriver, EMPTY);
  const form = useRef<HTMLFormElement>(null);

  // Clear the form after a successful submit so the next entry starts blank.
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <form ref={form} action={formAction} className="space-y-2 bg-ink-soft p-4">
      <Field name="name" label="Nombre completo" placeholder="Alejandra Ruiz" required />
      <Field name="phone" label="Teléfono" placeholder="55 1234 5678" required />

      <div className="grid grid-cols-2 gap-2">
        <Field name="car_make" label="Marca" placeholder="Nissan" required />
        <Field name="car_model" label="Modelo" placeholder="Versa" required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field name="car_color" label="Color" placeholder="Blanco" required />
        <Field name="plate" label="Placa" placeholder="A12-BCD" required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block bg-ink px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
            Servicio
          </span>
          <select
            name="tier"
            defaultValue="rosa"
            className="w-full bg-transparent py-1 text-sm outline-none"
          >
            {TIERS.map((t) => (
              <option key={t.id} value={t.id} className="bg-ink">
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block bg-ink px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
            Plazas
          </span>
          <input
            name="seats"
            type="number"
            min={2}
            max={8}
            defaultValue={4}
            className="w-full bg-transparent py-1 text-sm outline-none"
          />
        </label>
      </div>

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
          Estado inicial
        </span>
        <select
          name="status"
          defaultValue="available"
          className="w-full bg-transparent py-1 text-sm outline-none"
        >
          <option value="available" className="bg-ink">Disponible</option>
          <option value="offline" className="bg-ink">Fuera de línea</option>
        </select>
      </label>

      {state.error && (
        <p role="alert" className="border-l-2 border-rosa bg-rosa/10 px-3 py-2 text-sm text-rosa">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="border-l-2 border-jade bg-jade/10 px-3 py-2 text-sm text-jade">
          Conductor agregado a la flota
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="skewed-btn glow-rosa w-full bg-rosa py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="block">{pending ? "Guardando…" : "Agregar a la flota"}</span>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block bg-ink px-3 py-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
        {label}
      </span>
      <input
        name={name}
        {...rest}
        className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted/60"
      />
    </label>
  );
}
