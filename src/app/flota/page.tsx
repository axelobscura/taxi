import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { listDrivers } from "@/lib/drivers";
import { logout } from "@/app/entrar/actions";
import AddDriverForm from "./AddDriverForm";
import DriverList from "./DriverList";

export const metadata = { title: "Flota · TAXI_MEX" };

export default async function FlotaPage() {
  const user = await currentUser();
  if (!user) redirect("/entrar");

  const drivers = listDrivers();
  const available = drivers.filter((d) => d.status === "available").length;
  const busy = drivers.filter((d) => d.status === "busy").length;

  return (
    <main className="min-h-dvh">
      <header className="relative flex items-stretch">
        <Link href="/" className="skewed relative -ml-4 bg-cream px-7 py-3 pl-10">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center bg-rosa">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M4 15h16v-4l-2.6-4.1a2 2 0 0 0-1.7-.9H8.3a2 2 0 0 0-1.7.9L4 11Z" fill="white" />
                <rect x="9.2" y="2.4" width="5.6" height="2.6" rx="0.8" fill="white" />
                <circle cx="7.8" cy="16.6" r="1.9" fill="#0b0b0f" />
                <circle cx="16.2" cy="16.6" r="1.9" fill="#0b0b0f" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="font-display text-base font-extrabold text-ink">TAXI_MEX</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/50">
                Flota
              </p>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3 bg-rosa px-5">
          <span className="hidden text-xs font-bold uppercase tracking-widest text-white/90 sm:block">
            {user.name}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="border-2 border-white/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-rosa"
            >
              Salir
            </button>
          </form>
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
    <div className="cut-tr border-l-2 border-rosa bg-ink-soft p-4">
      <p className={`font-display text-3xl font-extrabold tabular-nums ${accent}`}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
    </div>
  );
}
