"use client";

import { useActionState, useEffect, useRef } from "react";
import { addUser, type AdminState } from "./actions";

const EMPTY: AdminState = {};

export default function AddUserForm() {
  const [state, formAction, pending] = useActionState(addUser, EMPTY);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <form ref={form} action={formAction} className="space-y-2 bg-ink-soft p-4">
      <Field name="name" label="Nombre" placeholder="Ana López" autoComplete="off" required />
      <Field name="email" type="email" label="Correo" placeholder="ana@taxi.org.mx" autoComplete="off" required />
      <Field
        name="password"
        type="password"
        label="Contraseña"
        autoComplete="new-password"
        minLength={8}
        required
      />

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
          Rol
        </span>
        <select
          name="role"
          defaultValue="operator"
          className="w-full bg-transparent py-1 text-sm outline-none"
        >
          <option value="operator" className="bg-ink">
            Operador — solo la flota
          </option>
          <option value="admin" className="bg-ink">
            Administrador — flota y cuentas
          </option>
        </select>
      </label>

      {state.error && (
        <p role="alert" className="border-l-2 border-taxi bg-taxi/10 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="border-l-2 border-jade bg-jade/10 px-3 py-2 text-sm text-jade">
          Cuenta creada
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-taxi py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="block">{pending ? "Guardando…" : "Crear cuenta"}</span>
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
      <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
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
