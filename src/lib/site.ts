/** Brand and contact details shared by metadata, structured data and pages. */
export const SITE = {
  name: "TAXI_MEX",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://taxi.org.mx",
  description:
    "Pide un taxi seguro en línea en la Ciudad de México. Tarifa cerrada antes de subir, conductores verificados ante la SEMOVI y servicio 24/7.",
  phone: "+525500115225",
  phoneDisplay: "55 0011-52256",
  email: "hola@taxi.org.mx",
  locale: "es_MX",
} as const;

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
 * Per-page metadata with canonical URL and Open Graph filled in. Next replaces
 * `openGraph` wholesale rather than merging it with the layout's, so the
 * shared fields (and the share image) have to be repeated on every page.
 */
export function pageMetadata(path: string, title: string, description: string) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title,
      description,
      // The file-based image in app/ is dropped once a page sets its own
      // `openGraph`, so point at it explicitly.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
