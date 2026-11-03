"use client";

import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Sends a GA4 event. A no-op when no measurement ID is configured, so local
 * development and preview builds don't need GA set up.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (!GA_ID) return;
  sendGAEvent("event", event, params);
}
