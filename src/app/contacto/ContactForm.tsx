"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessage, type ContactState } from "./actions";

const EMPTY: ContactState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, EMPTY);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <form ref={form} action={formAction} className="space-y-2 bg-ink-soft p-5">
      <Field name="name" label="Nombre" placeholder="Tu nombre" required />
      <Field
        name="email"
        type="email"
        label="Correo"
        placeholder="tu@correo.mx"
        required
      />

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
          Asunto
        </span>
        <select
          name="subject"
          defaultValue="viaje"
          className="w-full bg-transparent py-1 text-sm outline-none"
        >
          <option value="viaje" className="bg-ink">Un viaje</option>
          <option value="factura" className="bg-ink">Facturación</option>
          <option value="conductor" className="bg-ink">Quiero manejar</option>
          <option value="otro" className="bg-ink">Otro tema</option>
        </select>
      </label>

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-rosa">
          Mensaje
        </span>
        <textarea
          name="body"
          rows={5}
          required
          placeholder="¿En qué te ayudamos?"
          className="w-full resize-y bg-transparent py-1 text-sm outline-none placeholder:text-muted/60"
        />
      </label>

      {state.error && (
        <p role="alert" className="border-l-2 border-rosa bg-rosa/10 px-3 py-2 text-sm text-rosa">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="border-l-2 border-jade bg-jade/10 px-3 py-2 text-sm text-jade">
          Mensaje recibido. Te respondemos en menos de 24 horas.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="skewed-btn glow-rosa w-full bg-rosa py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="block">{pending ? "Enviando…" : "Enviar mensaje"}</span>
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
