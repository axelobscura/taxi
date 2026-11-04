import Logo from "@/components/Logo";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { listDrivers } from "@/lib/drivers";
import { logout } from "@/app/(ops)/entrar/actions";
import AddDriverForm from "./AddDriverForm";
import DriverList from "./DriverList";

export const metadata = {
  title: "Flota",
  robots: { index: false, follow: false },
};

export default async function FlotaPage() {
  const user = await currentUser();
  if (!user) redirect("/entrar");

  const drivers = await listDrivers();
  const available = drivers.filter((d) => d.status === "available").length;
  const busy = drivers.filter((d) => d.status === "busy").length;

  return (
    <main className="min-h-dvh">
      <header className="border-b border-snow/10 bg-coal">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Logo sub="Flota" />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-bold uppercase tracking-widest text-snow/80 sm:block">
              {user.name}
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

      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="eyebrow mb-3">Panel de operación</p>
        <h1 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">
          Flota disponible
        </h1>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat label="Disponibles" value={available} accent="text-jade" />
          <Stat label="En viaje" value={busy} accent="text-gold" />
          <Stat label="Total" value={drivers.length} accent="text-cream" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section>
            <p className="eyebrow mb-3">Conductores registrados</p>
            <DriverList drivers={drivers} />
          </section>

          <section>
            <p className="eyebrow mb-3">Alta de conductor</p>
            <AddDriverForm />
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
      <p className={`font-display text-3xl font-extrabold tabular-nums ${accent}`}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
    </div>
  );
}
