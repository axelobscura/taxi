import { redirect } from "next/navigation";
import OpsHeader from "@/components/OpsHeader";
import { currentUser } from "@/lib/auth";
import { listUserAccounts } from "@/lib/users";
import AddUserForm from "./AddUserForm";
import UserList from "./UserList";

export const metadata = {
  title: "Usuarios",
  robots: { index: false, follow: false },
};

export default async function UsuariosPage() {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  if (user.role !== "admin") redirect("/flota");

  const users = await listUserAccounts();
  const admins = users.filter((account) => account.role === "admin").length;

  return (
    <main className="min-h-dvh">
      <OpsHeader user={user} current="usuarios" />

      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="eyebrow mb-3">Administración</p>
        <h1 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
          Cuentas del panel
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Un operador administra la flota. Un administrador también crea cuentas,
          cambia roles y las elimina.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat label="Administradores" value={admins} accent="text-taxi" />
          <Stat label="Operadores" value={users.length - admins} accent="text-gold" />
          <Stat label="Total" value={users.length} accent="text-cream" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <p className="eyebrow mb-3">Cuentas registradas</p>
            <UserList users={users} viewerId={user.id} />
          </section>
          <section>
            <p className="eyebrow mb-3">Nueva cuenta</p>
            <AddUserForm />
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="border-l-2 border-taxi bg-ink-soft p-4">
      <p className={`font-display text-3xl font-extrabold tabular-nums ${accent}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">{label}</p>
    </div>
  );
}
