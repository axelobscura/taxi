"use client";

import { useActionState, useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { useI18n } from "@/i18n/client";
import { sendMessage, type ContactState } from "./actions";

const EMPTY: ContactState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, EMPTY);
  const form = useRef<HTMLFormElement>(null);
  const t = useI18n().dict.contactForm;

  useEffect(() => {
    if (!state.ok) return;
    track("generate_lead", { method: "contact_form" });
    form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={formAction} className="space-y-2 bg-ink-soft p-5">
      <Field name="name" label={t.name} placeholder={t.namePlaceholder} required />
      <Field
        name="email"
        type="email"
        label={t.email}
        placeholder={t.emailPlaceholder}
        required
      />

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
          {t.subject}
        </span>
        <select
          name="subject"
          defaultValue="viaje"
          className="w-full bg-transparent py-1 text-sm outline-none"
        >
          {Object.entries(t.subjects).map(([value, label]) => (
            <option key={value} value={value} className="bg-ink">
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block bg-ink px-3 py-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
          {t.body}
        </span>
        <textarea
          name="body"
          rows={5}
          required
          placeholder={t.bodyPlaceholder}
          className="w-full resize-y bg-transparent py-1 text-sm outline-none placeholder:text-muted/60"
        />
      </label>

      {state.error && (
        <p role="alert" className="border-l-2 border-taxi bg-taxi/10 px-3 py-2 text-sm text-accent">
          {t.errors[state.error]}
        </p>
      )}
      {state.ok && (
        <p role="status" className="border-l-2 border-jade bg-jade/10 px-3 py-2 text-sm text-jade">
          {t.sent}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-taxi py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="block">{pending ? t.sending : t.send}</span>
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
