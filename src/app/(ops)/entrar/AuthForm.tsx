"use client";

import Logo from "@/components/Logo";
import { useActionState, useState } from "react";
import { login, register, type AuthState } from "./actions";

const EMPTY: AuthState = {};

export default function AuthForm({ firstAccount = false }: { firstAccount?: boolean }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  return mode === "login" ? (
    <Shell mode={mode} firstAccount={firstAccount} onSwitch={() => setMode("register")}>
      <Fields mode="login" />
    </Shell>
  ) : (
    <Shell mode={mode} firstAccount={firstAccount} onSwitch={() => setMode("login")}>
      <Fields mode="register" />
    </Shell>
  );
}

/** Chrome around the form: logo, headings and the mode switch. */
function Shell({
  mode,
  firstAccount,
  onSwitch,
  children,
}: {
  mode: "login" | "register";
  firstAccount: boolean;
  onSwitch: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8">
          <Logo sub="Panel de flota" />
        </div>

        <p className="eyebrow mb-3">
          {mode === "login" ? "Acceso del panel" : "Nueva cuenta"}
        </p>
        <h1 className="mb-6 font-display text-3xl font-extrabold uppercase leading-none">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </h1>
        {mode === "register" && firstAccount && (
          <p className="-mt-3 mb-6 text-sm text-muted">
            Esta primera cuenta será administrador y podrá gestionar usuarios y la flota.
          </p>
        )}

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
          className="border-l-2 border-taxi bg-taxi/10 px-3 py-2 text-sm text-accent"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-taxi py-4 font-display text-sm font-extrabold uppercase tracking-widest text-coal transition active:scale-[0.98] disabled:opacity-60"
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
      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
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
