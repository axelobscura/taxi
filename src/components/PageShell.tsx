import Link from "next/link";
import Logo from "./Logo";
import SiteHeader from "./SiteHeader";
import { Breadcrumbs, type Crumb } from "./Landing";
import { NAV } from "@/lib/nav";
import { citiesIn } from "@/lib/cities";
import { SITE } from "@/lib/site";
import { localePath } from "@/i18n/config";
import { fmt } from "@/i18n/dictionaries";
import { getI18n } from "@/i18n/server";

/** Standard layout for the public content pages. */
export default function PageShell({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="hero-lines relative overflow-hidden bg-coal px-5 py-14 sm:py-20">
        <div className="relative mx-auto w-full max-w-6xl">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] text-snow sm:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-snow/70 sm:text-base">
              {lead}
            </p>
          )}
        </div>
      </section>

      {/* A yellow rule between the dark title band and the white body. */}
      <div aria-hidden className="h-1.5 bg-taxi" />

      <main className="theme-light flex-1 px-5 py-14">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export async function SiteFooter() {
  const { lang, dict } = await getI18n();
  const t = dict.footer;
  return (
    <footer className="bg-coal px-5 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo href={localePath(lang, "/")} sub={dict.header.tagline} />
          <p className="mt-4 text-xs leading-relaxed text-muted">{t.about}</p>
        </div>

        <div>
          <p className="eyebrow mb-3">{t.navigation}</p>
          <ul className="space-y-1.5 text-sm">
            {NAV.map((href) => (
              <li key={href}>
                <Link href={localePath(lang, href)} className="text-muted transition hover:text-accent">
                  {dict.nav[href]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {citiesIn(lang).map((city) => (
          <div key={city.slug}>
            <p className="eyebrow mb-3">{fmt(t.taxiIn, { city: city.shortName })}</p>
            <ul className="space-y-1.5 text-sm">
              {city.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={localePath(lang, `/taxi/${city.slug}/${z.slug}`)}
                    className="text-muted transition hover:text-accent"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow mb-3">{t.contact}</p>
          <ul className="space-y-1.5 text-sm text-muted">
            <li>
              <a href={`mailto:${SITE.email}`} className="transition hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li className="pt-1 text-xs">{t.service}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-ink-line pt-5 text-[11px] text-muted">
        © {new Date().getFullYear()} {SITE.name} CDMX · {t.legal}
      </div>
    </footer>
  );
}
