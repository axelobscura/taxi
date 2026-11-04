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
import { CITIES, findCity, localizeCity } from "@/lib/cities";
import { TIERS, mxn, mxnRate } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { localePath, type Lang } from "@/i18n/config";
import { fmt, getDict } from "@/i18n/dictionaries";
import { getLang } from "@/i18n/server";
import { TAXI_COPY } from "../copy";

/** Only cities listed in cities.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ ciudad: c.slug }));
}

async function resolve(params: PageProps<"/[lang]/taxi/[ciudad]">["params"]) {
  const lang: Lang = await getLang();
  const source = findCity((await params).ciudad);
  return source ? { lang, city: localizeCity(source, lang) } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/taxi/[ciudad]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { lang, city } = found;
  const c = TAXI_COPY[lang];
  return pageMetadata(
    lang,
    `/taxi/${city.slug}`,
    fmt(c.cityTitle, { city: city.name, short: city.shortName }),
    fmt(c.cityDescription, { city: city.name }),
  );
}

export default async function CityPage({
  params,
}: PageProps<"/[lang]/taxi/[ciudad]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { lang, city } = found;
  const c = TAXI_COPY[lang];
  const dict = getDict(lang);
  const href = (p: string) => localePath(lang, p);

  const path = `/taxi/${city.slug}`;
  const crumbs = [
    { href: href("/"), label: c.home },
    { href: href("/taxi"), label: c.coverage },
    { href: href(path), label: city.shortName },
  ];
  // A central landmark to price sample trips from, so riders get a feel
  // for prices across the city.
  const hub = city.zones.find((z) => z.slug === "centro-historico") ?? city.zones[0];

  return (
    <PageShell
      crumbs={crumbs}
      eyebrow={fmt(c.taxiIn, { place: city.shortName })}
      title={<>{c.taxiPrefix}<br />{city.name}</>}
      lead={city.intro}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            taxiServiceJsonLd(city, lang, path, city.intro),
            breadcrumbJsonLd(crumbs),
            faqJsonLd(city.faqs, lang),
          ],
        }}
      />

      <section>
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.zonesTitle}
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {city.zones.map((z) => (
            <li key={z.slug}>
              <Link
                href={href(`${path}/${z.slug}`)}
                className="block border-l-2 border-taxi bg-ink-soft p-4 transition hover:bg-ink-raised"
              >
                <span className="font-display text-base font-extrabold">
                  {fmt(c.taxiIn, { place: z.name })}
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
          {fmt(c.tiersTitle, { short: city.shortName })}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TIERS.map((t) => (
            <div key={t.id} className="bg-ink-soft p-5">
              <h3 className="font-display text-lg font-extrabold uppercase">
                Taxi {t.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {fmt(c.tierLine, {
                  tagline: dict.tiers[t.id],
                  base: mxn(t.base),
                  perKm: mxnRate(t.perKm),
                  seats: t.seats,
                })}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          {c.detailA}{" "}
          <Link href={href("/tarifas")} className="font-bold text-cream underline">
            {c.fares}
          </Link>{" "}
          {c.and}{" "}
          <Link href={href("/servicios")} className="font-bold text-cream underline">
            {c.services}
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {fmt(c.samplesFrom, { place: hub.name })}
        </h2>
        <p className="mt-1 text-sm text-muted">{c.samplesLead}</p>
        <SampleFares from={hub.place} to={hub.destinations} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.boroughsTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {city.coverage.join(" · ")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          {c.faqTitle}
        </h2>
        <FaqList faqs={city.faqs} />
      </section>

      <OrderCta title={fmt(c.orderIn, { place: city.shortName })} />
    </PageShell>
  );
}
