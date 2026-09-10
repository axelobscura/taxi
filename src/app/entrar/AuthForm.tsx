"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login, register, type AuthState } from "./actions";

const EMPTY: AuthState = {};

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return mode === "login" ? (
    <Shell mode={mode} onSwitch={() => setMode("register")}>
      <Fields mode="login" />
    </Shell>
  ) : (
    <Shell mode={mode} onSwitch={() => setMode("login")}>
      <Fields mode="register" />
    </Shell>
  );
}

/** Chrome around the form: logo, headings and the mode switch. */
function Shell({
  mode,
  onSwitch,
  children,
}: {
  mode: "login" | "register";
  onSwitch: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <div className="grid size-9 place-items-center bg-rosa">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="white" />
              <rect x="9.2" y="2.4" width="5.6" height="2.6" rx="0.8" fill="white" />
              <circle cx="7.8" cy="16.6" r="1.9" fill="#0b0b0f" />
              <circle cx="16.2" cy="16.6" r="1.9" fill="#0b0b0f" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="font-display text-lg font-extrabold">TAXI_MEX</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Panel de flota
            </p>
          </div>
        </Link>

        <p className="eyebrow mb-3">
          {mode === "login" ? "Acceso de operadores" : "Nueva cuenta"}
        </p>
        <h1 className="mb-6 font-display text-3xl font-extrabold uppercase leading-none">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </h1>

        {children}

        <button
          type="button"
          onClick={onSwitch}
          className="mt-5 w-full text-center text-sm text-muted transition hover:text-cream"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Entra"}
        </button>
      </div>
    </main>
  );
}

/** One form per mode, so each keeps a stable action and hook state. */
function Fields({ mode }: { mode: "login" | "register" }) {
  const [state, formAction, pending] = useActionState(
    mode === "login" ? login : register,
    EMPTY,
  );

  return (
    <form action={formAction} className="space-y-2">
      {mode === "register" && (
        <Input name="name" label="Nombre" autoComplete="name" required />
      )}
      <Input name="email" type="email" label="Correo" autoComplete="email" required />
      <Input
        name="password"
        type="password"
        label="Contraseña"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        minLength={8}
        required
      />

      {state.error && (
        <p
          role="alert"
          className="border-l-2 border-rosa bg-rosa/10 px-3 py-2 text-sm text-rosa"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="skewed-btn glow-rosa w-full bg-rosa py-4 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        <span className="block">
          {pending ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
        </span>
      </button>
    </form>
  );
}

function Input({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block bg-ink-soft px-3 py-2.5">
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-rosa">
        {label}
      </span>
      <input
        name={name}
        {...rest}
        className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted"
      />
    </label>
  );
}
