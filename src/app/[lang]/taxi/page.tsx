import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { JsonLd, OrderCta, breadcrumbJsonLd } from "@/components/Landing";
import { citiesIn } from "@/lib/cities";
import { pageMetadata } from "@/lib/site";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/dictionaries";
import { getLang } from "@/i18n/server";
import { TAXI_COPY } from "./copy";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const c = TAXI_COPY[lang];
  return pageMetadata(lang, "/taxi", c.indexTitle, c.indexDescription);
}

export default async function CoberturaPage() {
  const lang = await getLang();
  const c = TAXI_COPY[lang];
  const path = (p: string) => localePath(lang, p);
  const crumbs = [
    { href: path("/"), label: c.home },
    { href: path("/taxi"), label: c.coverage },
  ];

  return (
    <PageShell
      crumbs={crumbs}
      eyebrow={c.coverage}
      title={<>{c.indexH1a}<br />{c.indexH1b}</>}
      lead={c.indexLead}
    >
      <JsonLd
        data={{ "@context": "https://schema.org", ...breadcrumbJsonLd(crumbs) }}
      />

      <div className="space-y-10">
        {citiesIn(lang).map((city) => (
          <section key={city.slug}>
            <h2 className="font-display text-2xl font-extrabold uppercase">
              <Link
                href={path(`/taxi/${city.slug}`)}
                className="transition hover:text-accent"
              >
                {fmt(c.taxiIn, { place: city.name })}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {city.intro}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={path(`/taxi/${city.slug}/${z.slug}`)}
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
        ))}
      </div>

      <OrderCta title={c.orderNow} />
    </PageShell>
  );
}
