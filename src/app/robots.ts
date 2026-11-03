import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The operator panel and the JSON API have nothing worth indexing.
      // `/entrar` stays crawlable so bots can see its `noindex`.
      disallow: ["/api/", "/flota"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
