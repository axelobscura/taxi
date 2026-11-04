import PageShell from "@/components/PageShell";
import { OrderCta } from "@/components/Landing";
import {
  PLACES,
  TIERS,
  distanceKm,
  durationMin,
  fareFor,
  mxn,
  mxnRate,
} from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import type { Lang } from "@/i18n/config";
import { placeLabel } from "@/i18n/dictionaries";
import { getI18n, getLang } from "@/i18n/server";

const COPY = {
  es: {
    title: "Tarifas de taxi en CDMX: banderazo y precio por km",
    description:
      "Cuánto cuesta un taxi en la CDMX: banderazo, costo por kilómetro y por minuto, y precios de rutas reales como Ángel–Aeropuerto o Polanco–Santa Fe.",
    eyebrow: "Precios claros",
    h1a: "Tarifa cerrada,",
    h1b: "sin sorpresas",
    lead: "Ves el precio antes de confirmar y ese es el que pagas. No cobramos por tráfico imprevisto ni aplicamos tarifa dinámica.",
    howTitle: "Cómo se calcula",
    how: [
      { title: "Banderazo", body: "Cargo fijo al iniciar el viaje. Cambia según la categoría." },
      { title: "Por kilómetro", body: "Distancia estimada de la ruta entre origen y destino." },
      { title: "Por minuto", body: "Tiempo estimado con el tráfico promedio de la ciudad (18 km/h)." },
    ],
    compareTitle: "Comparativa por categoría",
    cols: ["Categoría", "Banderazo", "Por km", "Por min", "Plazas"],
    routesTitle: "Rutas de ejemplo",
    routesLead: "Precios estimados en categoría Rosa, calculados con la misma fórmula que usa la app.",
    disclaimer:
      "Las distancias son estimadas en línea directa con un factor de rodeo; la tarifa final puede variar si el trayecto real cambia. Las casetas de la autopista no están incluidas.",
    cta: "Calcula tu viaje",
  },
  en: {
    title: "Mexico City Taxi Fares: Base Fare and Price per km",
    description:
      "How much a taxi costs in Mexico City: base fare, price per kilometer and per minute, and prices for real routes like Ángel–Airport or Polanco–Santa Fe.",
    eyebrow: "Clear prices",
    h1a: "Fixed fare,",
    h1b: "no surprises",
    lead: "You see the price before you confirm, and that's what you pay. We don't charge for unexpected traffic or use surge pricing.",
    howTitle: "How it's calculated",
    how: [
      { title: "Base fare", body: "A fixed charge when the trip starts. It depends on the ride type." },
      { title: "Per kilometer", body: "Estimated distance of the route from pickup to drop-off." },
      { title: "Per minute", body: "Estimated time with the city's average traffic (18 km/h)." },
    ],
    compareTitle: "Ride types compared",
    cols: ["Ride type", "Base fare", "Per km", "Per min", "Seats"],
    routesTitle: "Sample routes",
    routesLead: "Estimated Rosa prices, calculated with the same formula the app uses.",
    disclaimer:
      "Distances are estimated as a straight line with a detour factor; the final fare may vary if the actual route changes. Highway tolls are not included.",
    cta: "Price your trip",
  },
} satisfies Record<Lang, unknown>;

export async function generateMetadata() {
  const lang = await getLang();
  return pageMetadata(lang, "/tarifas", COPY[lang].title, COPY[lang].description);
}

const place = (name: string) => PLACES.find((p) => p.name === name)!;

/** Representative routes across the city, priced with the real formula. */
const ROUTES = [
  ["Ángel de la Independencia", "Aeropuerto AICM T1"],
  ["Zócalo", "Coyoacán Centro"],
  ["Polanco", "Santa Fe"],
  ["Parque México", "Ciudad Universitaria"],
  ["Terminal Norte", "Bosque de Chapultepec"],
] as const;

export default async function TarifasPage() {
  const { lang, dict } = await getI18n();
  const c = COPY[lang];
  return (
    <PageShell
      eyebrow={c.eyebrow}
      title={<>{c.h1a}<br />{c.h1b}</>}
      lead={c.lead}
    >
      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.howTitle}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.how.map((f, i) => (
            <Formula key={f.title} n={`0${i + 1}`} title={f.title} body={f.body} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.compareTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-taxi text-left">
                {c.cols.map((col, i) => (
                  <Th key={col} align={i === 0 ? "left" : "right"}>
                    {col}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.id} className="border-b border-ink-line">
                  <Td>
                    <span className="font-display font-extrabold uppercase">
                      {t.name}
                    </span>
                  </Td>
                  <Td align="right">{mxn(t.base)}</Td>
                  <Td align="right">{mxnRate(t.perKm)}</Td>
                  <Td align="right">{mxnRate(t.perMin)}</Td>
                  <Td align="right">{t.seats}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.routesTitle}
        </h2>
        <p className="mt-1 text-sm text-muted">{c.routesLead}</p>

        <ul className="mt-4 space-y-2">
          {ROUTES.map(([from, to]) => {
            const km = distanceKm(place(from), place(to));
            const min = durationMin(km);
            const rosa = TIERS.find((t) => t.id === "rosa")!;
            return (
              <li
                key={`${from}-${to}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 border-l-2 border-taxi bg-ink-soft p-4"
              >
                <span className="min-w-0 flex-1 text-sm">
                  {placeLabel(dict, from)} <span className="text-muted">→</span>{" "}
                  {placeLabel(dict, to)}
                </span>
                <span className="text-xs text-muted">
                  {km.toFixed(1)} km · {min} min
                </span>
                <span className="font-display text-lg font-extrabold tabular-nums">
                  {mxn(fareFor(rosa, km, min))}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          {c.disclaimer}
        </p>
      </section>

      <OrderCta title={c.cta} />
    </PageShell>
  );
}

function Formula({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="bg-ink-soft p-5">
      <span className="font-display text-[11px] font-bold text-accent">{n}</span>
      <h3 className="mt-1 font-display text-base font-extrabold uppercase">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-3 py-3 tabular-nums ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </td>
  );
}
