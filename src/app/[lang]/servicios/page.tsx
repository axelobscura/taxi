import PageShell from "@/components/PageShell";
import { OrderCta } from "@/components/Landing";
import { TIERS, mxn, mxnRate, type TierId } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import type { Lang } from "@/i18n/config";
import { fmt } from "@/i18n/dictionaries";
import { getI18n, getLang } from "@/i18n/server";

/** Sample 10 km / 33 min trip, so the tiers are comparable at a glance. */
const SAMPLE_KM = 10;
const SAMPLE_MIN = 33;

const COPY = {
  es: {
    title: "Servicios de taxi en CDMX: Eco, Rosa, Confort y XL",
    description:
      "Cuatro categorías de taxi en la CDMX: Eco, Rosa, Confort y XL para hasta 6 pasajeros. Elige según presupuesto, espacio y comodidad.",
    eyebrow: "Nuestros servicios",
    h1a: "Un taxi para",
    h1b: "cada viaje",
    lead: "Cuatro categorías con tarifa cerrada. El precio que ves antes de confirmar es el que pagas al bajar.",
    base: "Banderazo",
    perKm: "Por km",
    seats: "Plazas",
    sample: "Viaje de ejemplo ({km} km):",
    cta: "¿Listo para pedir?",
    detail: {
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
    },
  },
  en: {
    title: "Mexico City Taxi Services: Eco, Rosa, Confort and XL",
    description:
      "Four taxi ride types in Mexico City: Eco, Rosa, Confort and XL for up to 6 passengers. Choose by budget, space and comfort.",
    eyebrow: "Our services",
    h1a: "A taxi for",
    h1b: "every trip",
    lead: "Four ride types, all with a fixed fare. The price you see before you confirm is what you pay at the end.",
    base: "Base fare",
    perKm: "Per km",
    seats: "Seats",
    sample: "Sample trip ({km} km):",
    cta: "Ready to ride?",
    detail: {
      eco: [
        "Compact, fuel-efficient cars",
        "Our most affordable option",
        "Ideal for short trips within one borough",
      ],
      rosa: [
        "Our standard service across the city",
        "The largest fleet, so pickups are fastest",
        "The balance of price and waiting time",
      ],
      confort: [
        "Newer models with more room",
        "Air conditioning guaranteed",
        "Made for long trips or business travel",
      ],
      xl: [
        "SUVs and vans for up to 6 passengers",
        "Plenty of room for luggage",
        "The best choice for groups heading to the airport",
      ],
    },
  },
} satisfies Record<Lang, { detail: Record<TierId, string[]> } & Record<string, unknown>>;

export async function generateMetadata() {
  const lang = await getLang();
  return pageMetadata(lang, "/servicios", COPY[lang].title, COPY[lang].description);
}

export default async function ServiciosPage() {
  const { lang, dict } = await getI18n();
  const c = COPY[lang];
  return (
    <PageShell
      eyebrow={c.eyebrow}
      title={<>{c.h1a}<br />{c.h1b}</>}
      lead={c.lead}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const fare = Math.round(
            tier.base + SAMPLE_KM * tier.perKm + SAMPLE_MIN * tier.perMin,
          );
          return (
            <article
              key={tier.id}
              className="flex flex-col border-l-2 border-taxi bg-ink-soft p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl font-extrabold uppercase">
                  {tier.name}
                </h2>
                <span className="bg-taxi px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coal">
                  {tier.eta} min
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{dict.tiers[tier.id]}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {c.detail[tier.id].map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-muted">
                    <span aria-hidden className="mt-1.5 block size-1.5 shrink-0 bg-taxi" />
                    {line}
                  </li>
                ))}
              </ul>

              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-ink-line pt-4 text-center">
                <Cell label={c.base} value={mxn(tier.base)} />
                <Cell label={c.perKm} value={mxnRate(tier.perKm)} />
                <Cell label={c.seats} value={String(tier.seats)} />
              </dl>

              <p className="mt-4 text-xs text-muted">
                {fmt(c.sample, { km: SAMPLE_KM })}{" "}
                <span className="font-display text-base font-extrabold text-cream">
                  {mxn(fare)}
                </span>
              </p>
            </article>
          );
        })}
      </div>

      <OrderCta title={c.cta} />
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
