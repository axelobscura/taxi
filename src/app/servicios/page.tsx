import Link from "next/link";
import PageShell from "@/components/PageShell";
import { TIERS, mxn } from "@/lib/data";

export const metadata = {
  title: "Servicios · TAXI_MEX",
  description:
    "Cuatro categorías de taxi en la CDMX: Eco, Rosa, Confort y XL. Elige según presupuesto, espacio y comodidad.",
};

/** Sample 10 km / 33 min trip, so the tiers are comparable at a glance. */
const SAMPLE_KM = 10;
const SAMPLE_MIN = 33;

const DETAIL: Record<string, string[]> = {
  eco: [
    "Autos compactos de bajo consumo",
    "La opción más barata del catálogo",
    "Ideal para trayectos cortos dentro de una alcaldía",
  ],
  rosa: [
    "Nuestro servicio estándar en toda la ciudad",
    "La flota más grande, por eso llega más rápido",
    "Equilibrio entre precio y tiempo de espera",
  ],
  confort: [
    "Autos de modelo reciente y mayor espacio",
    "Aire acondicionado garantizado",
    "Pensado para viajes largos o de trabajo",
  ],
  xl: [
    "Camionetas para hasta 6 pasajeros",
    "Espacio amplio para equipaje",
    "La mejor opción rumbo al aeropuerto en grupo",
  ],
};

export default function ServiciosPage() {
  return (
    <PageShell
      eyebrow="Nuestros servicios"
      title={<>Un taxi para<br />cada viaje</>}
      lead="Cuatro categorías con tarifa cerrada. El precio que ves antes de confirmar es el que pagas al bajar."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const fare = Math.round(
            tier.base + SAMPLE_KM * tier.perKm + SAMPLE_MIN * tier.perMin,
          );
          return (
            <article
              key={tier.id}
              className="cut-tr flex flex-col border-l-2 border-rosa bg-ink-soft p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl font-extrabold uppercase">
                  {tier.name}
                </h2>
                <span className="bg-rosa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {tier.eta} min
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{tier.tagline}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {DETAIL[tier.id].map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-muted">
                    <span aria-hidden className="mt-1.5 block size-1.5 shrink-0 bg-rosa" />
                    {line}
                  </li>
                ))}
              </ul>

              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-ink-line pt-4 text-center">
                <Cell label="Banderazo" value={mxn(tier.base)} />
                <Cell label="Por km" value={mxn(tier.perKm)} />
                <Cell label="Plazas" value={String(tier.seats)} />
              </dl>

              <p className="mt-4 text-xs text-muted">
                Viaje de ejemplo ({SAMPLE_KM} km):{" "}
                <span className="font-display text-base font-extrabold text-cream">
                  {mxn(fare)}
                </span>
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 border-l-2 border-rosa bg-ink-soft p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-extrabold uppercase">
            ¿Listo para pedir?
          </p>
          <p className="mt-1 text-sm text-muted">
            Elige origen y destino y compara las cuatro tarifas al instante.
          </p>
        </div>
        <Link
          href="/"
          className="skewed-btn glow-rosa shrink-0 bg-rosa px-8 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white transition active:scale-[0.98]"
        >
          <span className="block">Pedir taxi</span>
        </Link>
      </div>
    </PageShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
        {label}
      </dt>
      <dd className="font-display text-sm font-extrabold tabular-nums">{value}</dd>
    </div>
  );
}
