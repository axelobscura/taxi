/**
 * Site languages. Spanish is the default and is served without a prefix
 * (`/tarifas`); every other language lives under its code (`/en/tarifas`).
 * The proxy rewrites unprefixed URLs to `/es/...` internally so both trees
 * render from `app/[lang]`.
 */
export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export const hasLang = (value: string): value is Lang =>
  (LANGS as readonly string[]).includes(value);

/** BCP 47 tags for `<html lang>`, hreflang and Open Graph. */
export const LOCALE_TAG: Record<Lang, string> = { es: "es-MX", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_MX", en: "en_US" };

/** Public URL of a site path in a language: `/tarifas` → `/en/tarifas`. */
export function localePath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/**
 * The language-neutral path, whichever form the URL arrived in: public
 * (`/tarifas`, `/en/tarifas`) or rewritten (`/es/tarifas`). Lets client code
 * compare paths without caring whether it saw the browser URL or the
 * rewritten one, which keeps server and client renders identical.
 */
export function stripLang(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (!hasLang(first)) return pathname || "/";
  return rest.length ? `/${rest.join("/")}` : "/";
}

/** Language of a pathname in any of the forms `stripLang` accepts. */
export function langOf(pathname: string): Lang {
  const first = pathname.split("/")[1];
  return hasLang(first) ? first : DEFAULT_LANG;
}

/** hreflang alternates for a language-neutral path, for metadata and sitemaps. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LANGS.map((l) => [LOCALE_TAG[l], localePath(l, path)])),
    "x-default": localePath(DEFAULT_LANG, path),
  };
}
