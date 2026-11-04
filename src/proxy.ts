import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, hasLang } from "@/i18n/config";

/**
 * Spanish pages have no prefix in the URL but render from `app/[lang]`, so
 * unprefixed paths are rewritten to `/es/...`. A visible `/es/...` URL is
 * redirected to its unprefixed form to avoid duplicate pages in search.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === DEFAULT_LANG) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LANG.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (hasLang(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next internals, the API, the operator panel,
    // metadata routes and files with an extension (logo.svg, sitemap.xml…).
    "/((?!_next|api|entrar|flota|opengraph-image|.*\\.[^/]+$).*)",
  ],
};
