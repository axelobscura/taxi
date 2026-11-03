import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "monthly",
  ) => ({ url: absoluteUrl(path), priority, changeFrequency });

  return [
    page("/", 1, "weekly"),
    page("/taxi", 0.9, "weekly"),
    ...CITIES.flatMap((city) => [
      page(`/taxi/${city.slug}`, 0.9, "weekly"),
      ...city.zones.map((z) => page(`/taxi/${city.slug}/${z.slug}`, 0.8)),
    ]),
    page("/tarifas", 0.8),
    page("/servicios", 0.8),
    page("/nosotros", 0.5),
    page("/contacto", 0.5),
  ];
}
