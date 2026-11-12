import Link from "next/link";
import Logo from "@/components/Logo";
import { logout } from "@/app/(ops)/entrar/actions";
import type { Role, User } from "@/lib/auth";

/** Shared bar for the fleet panel and the account admin. */
export default function OpsHeader({
  user,
  current,
}: {
  user: User;
  current: "flota" | "usuarios";
}) {
  return (
    <header className="border-b border-snow/10 bg-coal">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4">
        <div className="flex items-center gap-4">
          <Logo sub="Panel" />
          <nav className="flex items-center gap-1">
            <NavLink href="/flota" current={current === "flota"}>
              Flota
            </NavLink>
            {user.role === "admin" && (
              <NavLink href="/flota/usuarios" current={current === "usuarios"}>
                Usuarios
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span className="hidden text-xs font-bold uppercase tracking-widest text-snow/80 sm:block">
              {user.name}
            </span>
            <RoleBadge role={user.role} />
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-snow/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-snow transition hover:border-taxi hover:text-taxi"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`px-2 py-1 text-[11px] font-bold uppercase tracking-widest transition ${
        current ? "text-taxi" : "text-snow/70 hover:text-taxi"
      }`}
    >
      {children}
    </Link>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const admin = role === "admin";
  return (
    <span
      className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        admin ? "bg-taxi text-coal" : "border border-snow/30 text-snow/80"
      }`}
    >
      {admin ? "Admin" : "Operador"}
    </span>
  );
}
