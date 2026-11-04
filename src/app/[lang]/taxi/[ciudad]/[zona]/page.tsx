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
import { CITIES, findCity, findZone, localizeCity } from "@/lib/cities";
import { pageMetadata } from "@/lib/site";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/dictionaries";
import { getLang } from "@/i18n/server";
import { TAXI_COPY } from "../../copy";

/** Only zones listed in cities.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.flatMap((c) =>
    c.zones.map((z) => ({ ciudad: c.slug, zona: z.slug })),
  );
}

async function resolve(params: PageProps<"/[lang]/taxi/[ciudad]/[zona]">["params"]) {
  const lang = await getLang();
  const { ciudad, zona } = await params;
  const source = findCity(ciudad);
  const city = source && localizeCity(source, lang);
  const zone = city && findZone(city, zona);
  return city && zone ? { lang, city, zone } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/taxi/[ciudad]/[zona]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { lang, city, zone } = found;
  const c = TAXI_COPY[lang];
  return pageMetadata(
    lang,
    `/taxi/${city.slug}/${zone.slug}`,
    fmt(c.zoneTitle, { zone: zone.name, short: city.shortName }),
    fmt(c.zoneDescription, { tagline: zone.tagline }),
  );
}

export default async function ZonePage({
  params,
}: PageProps<"/[lang]/taxi/[ciudad]/[zona]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { lang, city, zone } = found;
  const c = TAXI_COPY[lang];
  const href = (p: string) => localePath(lang, p);

  const cityPath = `/taxi/${city.slug}`;
  const path = `${cityPath}/${zone.slug}`;
  const crumbs = [
    { href: href("/"), label: c.home },
    { href: href("/taxi"), label: c.coverage },
    { href: href(cityPath), label: city.shortName },
    { href: href(path), label: zone.name },
  ];
  const nearby = city.zones.filter((z) => z.slug !== zone.slug);

  return (
    <PageShell
      crumbs={crumbs}
      eyebrow={zone.tagline}
      title={<>{c.taxiPrefix}<br />{zone.name}</>}
      lead={zone.intro}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            taxiServiceJsonLd(city, lang, path, zone.intro, zone.name),
            breadcrumbJsonLd(crumbs),
            faqJsonLd(zone.faqs, lang),
          ],
        }}
      />

      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.whyTitle}
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
          {fmt(c.zoneFaresTitle, { zone: zone.name })}
        </h2>
        <p className="mt-1 text-sm text-muted">{c.zoneFaresLead}</p>
        <SampleFares from={zone.place} to={zone.destinations} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.faqTitle}
        </h2>
        <FaqList faqs={[...zone.faqs, ...city.faqs]} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {fmt(c.otherZones, { short: city.shortName })}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {nearby.map((z) => (
            <li key={z.slug}>
              <Link
                href={href(`${cityPath}/${z.slug}`)}
                className="block border-2 border-ink-line px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-taxi hover:text-accent"
              >
                {fmt(c.taxiIn, { place: z.name })}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <OrderCta title={fmt(c.orderIn, { place: zone.name })} />
    </PageShell>
  );
}
