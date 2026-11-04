/**
 * Public pages in the main menu, as language-neutral paths. Labels come from
 * the `nav` section of the dictionary, keyed by these paths.
 */
export const NAV = [
  "/",
  "/servicios",
  "/tarifas",
  "/taxi",
  "/nosotros",
  "/contacto",
] as const;

export type NavPath = (typeof NAV)[number];

/** Operator login. Spanish-only, so it is never language-prefixed. */
export const LOGIN_PATH = "/entrar";
