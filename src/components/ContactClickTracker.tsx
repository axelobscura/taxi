"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Phone and email links are a taxi site's main offline conversion, but GA's
 * enhanced measurement doesn't record `tel:` or `mailto:` clicks. One
 * delegated listener covers every such link, including those rendered by
 * server components.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        track("contact_click", { method: "phone", link_url: href });
      } else if (href.startsWith("mailto:")) {
        track("contact_click", { method: "email", link_url: href });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
