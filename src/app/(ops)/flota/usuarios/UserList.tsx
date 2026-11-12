"use client";

import { useState, useTransition } from "react";
import type { UserAccount } from "@/lib/users";
import { changeRole, removeUser } from "./actions";

const ROLE_LABEL = {
  admin: "Administrador",
  operator: "Operador",
} as const;

export default function UserList({
  users,
  viewerId,
}: {
  users: UserAccount[];
  viewerId: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (users.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink-line p-10 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">
          Sin cuentas
        </p>
      </div>
    );
  }

  return (
    <div className={pending ? "opacity-60" : ""}>
      {error && (
        <p role="alert" className="mb-3 border-l-2 border-taxi bg-taxi/10 px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}
      <ul className="space-y-2">
        {users.map((account) => {
          const self = account.id === viewerId;
          return (
            <li key={account.id} className="flex items-center gap-3 bg-ink-soft p-3">
              <div className="grid size-11 shrink-0 place-items-center bg-taxi font-display text-sm font-extrabold text-coal">
                {account.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold">
                  {account.name}
                  {self && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Tú
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted">{account.email}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Desde {account.created_at.slice(0, 10)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <select
                  value={account.role}
                  disabled={pending}
                  aria-label={`Rol de ${account.name}`}
                  onChange={(event) => {
                    const role = event.target.value;
                    start(async () => {
                      const result = await changeRole(account.id, role);
                      setError(result?.error ?? null);
                    });
                  }}
                  className="border border-ink-line bg-ink px-2 py-1 text-[11px] outline-none"
                >
                  <option value="operator">{ROLE_LABEL.operator}</option>
                  <option value="admin">{ROLE_LABEL.admin}</option>
                </select>
                {self ? (
                  <span className="px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted">
                    Tu cuenta
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (confirm(`¿Eliminar la cuenta de ${account.name}?`)) {
                        start(async () => {
                          const result = await removeUser(account.id);
                          setError(result?.error ?? null);
                        });
                      }
                    }}
                    className="border border-ink-line px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted transition hover:border-taxi hover:text-accent"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
