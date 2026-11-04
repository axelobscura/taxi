import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { absoluteUrl } from "@/lib/site";
import { LANGS, languageAlternates, localePath } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  /** One entry per language, each listing all translations as alternates. */
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "monthly",
  ) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path))
        .filter(([tag]) => tag !== "x-default")
        .map(([tag, href]) => [tag, absoluteUrl(href)]),
    );
    return LANGS.map((lang) => ({
      url: absoluteUrl(localePath(lang, path)),
      priority,
      changeFrequency,
      alternates: { languages },
    }));
  };

  return [
    ...page("/", 1, "weekly"),
    ...page("/taxi", 0.9, "weekly"),
    ...CITIES.flatMap((city) => [
      ...page(`/taxi/${city.slug}`, 0.9, "weekly"),
      ...city.zones.flatMap((z) => page(`/taxi/${city.slug}/${z.slug}`, 0.8)),
    ]),
    ...page("/tarifas", 0.8),
    ...page("/servicios", 0.8),
    ...page("/nosotros", 0.5),
    ...page("/contacto", 0.5),
  ];
}
