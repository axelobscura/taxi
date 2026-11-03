import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import {
  FaqList,
  JsonLd,
  OrderCta,
  SampleFares,
  breadcrumbJsonLd,
  faqJsonLd,
  taxiServiceJsonLd,
} from "@/components/Landing";
import { CITIES, findCity } from "@/lib/cities";
import { TIERS, mxn, mxnRate } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

/** Only cities listed in cities.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/taxi/[ciudad]">): Promise<Metadata> {
  const city = findCity((await params).ciudad);
  if (!city) return {};
  return pageMetadata(
    `/taxi/${city.slug}`,
    `Taxi en ${city.name} (${city.shortName}) 24 horas · Tarifa cerrada`,
    `Pide un taxi seguro en ${city.name} en segundos. Tarifa cerrada antes de subir, conductores verificados y servicio 24/7 al aeropuerto y centrales.`,
  );
}

export default async function CityPage({
  params,
}: PageProps<"/taxi/[ciudad]">) {
  const city = findCity((await params).ciudad);
  if (!city) notFound();

  const path = `/taxi/${city.slug}`;
  const crumbs = [
    { href: "/", label: "Inicio" },
    { href: "/taxi", label: "Cobertura" },
    { href: path, label: city.shortName },
  ];
  // A central landmark to price sample trips from, so riders get a feel
  // for prices across the city.
  const hub = city.zones.find((z) => z.slug === "centro-historico") ?? city.zones[0];

  return (
    <PageShell
      crumbs={crumbs}
      eyebrow={`Taxi en ${city.shortName}`}
      title={<>Taxi en<br />{city.name}</>}
      lead={city.intro}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            taxiServiceJsonLd(city, path, city.intro),
            breadcrumbJsonLd(crumbs),
            faqJsonLd(city.faqs),
          ],
        }}
      />

      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Zonas con servicio
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {city.zones.map((z) => (
            <li key={z.slug}>
              <Link
                href={`${path}/${z.slug}`}
                className="block border-l-2 border-taxi bg-ink-soft p-4 transition hover:bg-ink-raised"
              >
                <span className="font-display text-base font-extrabold">
                  Taxi en {z.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {z.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Categorías y tarifas en {city.shortName}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TIERS.map((t) => (
            <div key={t.id} className="bg-ink-soft p-5">
              <h3 className="font-display text-lg font-extrabold uppercase">
                Taxi {t.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {t.tagline}. Banderazo {mxn(t.base)}, {mxnRate(t.perKm)} por km,
                hasta {t.seats} pasajeros.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Detalle completo en{" "}
          <Link href="/tarifas" className="font-bold text-cream underline">
            tarifas
          </Link>{" "}
          y{" "}
          <Link href="/servicios" className="font-bold text-cream underline">
            servicios
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Precios de ejemplo desde {hub.name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Categoría Rosa, calculados con la misma fórmula que usa la app.
        </p>
        <SampleFares from={hub.place} to={hub.destinations} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Alcaldías con cobertura
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {city.coverage.join(" · ")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Preguntas frecuentes
        </h2>
        <FaqList faqs={city.faqs} />
      </section>

      <OrderCta title={`Pide tu taxi en ${city.shortName}`} />
    </PageShell>
  );
}
