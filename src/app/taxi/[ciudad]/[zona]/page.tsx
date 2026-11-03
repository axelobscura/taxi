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
import { CITIES, findCity, findZone } from "@/lib/cities";
import { pageMetadata } from "@/lib/site";

/** Only zones listed in cities.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.flatMap((c) =>
    c.zones.map((z) => ({ ciudad: c.slug, zona: z.slug })),
  );
}

async function resolve(params: PageProps<"/taxi/[ciudad]/[zona]">["params"]) {
  const { ciudad, zona } = await params;
  const city = findCity(ciudad);
  const zone = city && findZone(city, zona);
  return city && zone ? { city, zone } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/taxi/[ciudad]/[zona]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { city, zone } = found;
  return pageMetadata(
    `/taxi/${city.slug}/${zone.slug}`,
    `Taxi en ${zone.name}, ${city.shortName} · Precio fijo 24/7`,
    `${zone.tagline}. Tarifa cerrada antes de subir, conductores verificados ante la SEMOVI y servicio las 24 horas.`,
  );
}

export default async function ZonePage({
  params,
}: PageProps<"/taxi/[ciudad]/[zona]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { city, zone } = found;

  const cityPath = `/taxi/${city.slug}`;
  const path = `${cityPath}/${zone.slug}`;
  const crumbs = [
    { href: "/", label: "Inicio" },
    { href: "/taxi", label: "Cobertura" },
    { href: cityPath, label: city.shortName },
    { href: path, label: zone.name },
  ];
  const nearby = city.zones.filter((z) => z.slug !== zone.slug);

  return (
    <PageShell
      crumbs={crumbs}
      eyebrow={zone.tagline}
      title={<>Taxi en<br />{zone.name}</>}
      lead={zone.intro}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            taxiServiceJsonLd(city, path, zone.intro, zone.name),
            breadcrumbJsonLd(crumbs),
            faqJsonLd(zone.faqs),
          ],
        }}
      />

      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Por qué pedir con nosotros
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {zone.highlights.map((h, i) => (
            <li key={h} className="bg-ink-soft p-5">
              <span className="font-display text-[11px] font-bold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-sm leading-relaxed">{h}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Precios de taxi desde {zone.name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tarifas estimadas en categoría Rosa con la fórmula de la app. Compara
          Eco, Confort y XL al pedir.
        </p>
        <SampleFares from={zone.place} to={zone.destinations} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Preguntas frecuentes
        </h2>
        <FaqList faqs={[...zone.faqs, ...city.faqs]} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Otras zonas en {city.shortName}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {nearby.map((z) => (
            <li key={z.slug}>
              <Link
                href={`${cityPath}/${z.slug}`}
                className="block border-2 border-ink-line px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-taxi hover:text-accent"
              >
                Taxi en {z.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <OrderCta title={`Pide tu taxi en ${zone.name}`} />
    </PageShell>
  );
}
