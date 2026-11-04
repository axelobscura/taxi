import { notFound } from "next/navigation";

/**
 * Unknown URLs are rewritten into `[lang]` by the proxy, so they land here
 * and render the localized `[lang]/not-found.tsx` inside the site layout.
 */
export default function Missing() {
  notFound();
}
