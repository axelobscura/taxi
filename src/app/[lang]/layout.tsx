import type { Metadata } from "next";
import RootShell from "@/components/RootShell";
import { I18nProvider } from "@/i18n/client";
import { LANGS, LOCALE_TAG, OG_LOCALE, localePath } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { ORG_ID, SITE, absoluteUrl, jsonLd, siteDescription } from "@/lib/site";

export { viewport } from "@/components/RootShell";

/** Both languages are prerendered; any other first segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const DEFAULT_TITLE = {
  es: "Taxi en CDMX las 24 horas · Pide en línea",
  en: "Mexico City Taxi 24/7 · Book Online",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL(SITE.url),
    applicationName: SITE.name,
    title: {
      default: `${DEFAULT_TITLE[lang]} | ${SITE.name}`,
      template: `%s | ${SITE.name}`,
    },
    description: siteDescription(lang),
    // No canonical here: it would be inherited by every page that doesn't
    // set its own. Pages set theirs through `pageMetadata`.
    openGraph: { type: "website", locale: OG_LOCALE[lang], siteName: SITE.name },
    twitter: { card: "summary_large_image" },
    // Set in the deployment env once the site is added to Search Console.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function LangLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();

  /** Site-wide structured data: who we are and what the site is. */
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/logo.svg"),
        email: SITE.email,
        contactPoint: {
          "@type": "ContactPoint",
          email: SITE.email,
          contactType: "customer service",
          areaServed: "MX",
          availableLanguage: ["es", "en"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            opens: "00:00",
            closes: "23:59",
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl(`${localePath(lang, "/")}#website`),
        url: absoluteUrl(localePath(lang, "/")),
        name: SITE.name,
        inLanguage: LOCALE_TAG[lang],
        publisher: { "@id": ORG_ID },
      },
    ],
  };

  return (
    <RootShell lang={LOCALE_TAG[lang]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(siteJsonLd) }}
      />
      <I18nProvider lang={lang}>{children}</I18nProvider>
    </RootShell>
  );
}
