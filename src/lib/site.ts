import {
  OG_LOCALE,
  languageAlternates,
  localePath,
  type Lang,
} from "@/i18n/config";

/** Brand and contact details shared by metadata, structured data and pages. */
export const SITE = {
  name: "TAXI-MEX",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxi.org.mx",
  email: "hola@taxi.org.mx",
} as const;

const DESCRIPTION: Record<Lang, string> = {
  es: "Pide un taxi seguro en línea en la Ciudad de México. Tarifa cerrada antes de subir, conductores verificados ante la SEMOVI y servicio 24/7.",
  en: "Book a safe taxi online in Mexico City. Fixed fare before you ride, drivers verified by SEMOVI and 24/7 service.",
};

export const siteDescription = (lang: Lang) => DESCRIPTION[lang];

/** Absolute URL for a site path, for JSON-LD where relative URLs aren't allowed. */
export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();

/** The organization node, referenced by `@id` from every other JSON-LD block. */
export const ORG_ID = absoluteUrl("/#organization");

/**
 * Serializes JSON-LD for a `<script>` tag. `<` is escaped so a string in the
 * payload can never close the tag early.
 */
export const jsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * Per-page metadata: canonical URL in the page's language, hreflang links to
 * every translation, and Open Graph. Next replaces `openGraph` wholesale
 * rather than merging it with the layout's, so the shared fields (and the
 * share image) have to be repeated on every page.
 *
 * `path` is language-neutral (`/tarifas`); the language prefix is added here.
 */
export function pageMetadata(
  lang: Lang,
  path: string,
  title: string,
  description: string,
) {
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website" as const,
      locale: OG_LOCALE[lang],
      siteName: SITE.name,
      url,
      title,
      description,
      // The file-based image in app/ is dropped once a page sets its own
      // `openGraph`, so point at it explicitly.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
