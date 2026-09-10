/** Public pages reachable from the main menu. */
export const NAV = [
  { href: "/", label: "Pedir taxi" },
  { href: "/servicios", label: "Servicios" },
  { href: "/tarifas", label: "Tarifas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/entrar", label: "Entrar" },
] as const;

/**
 * Routes shown in the footer. `/entrar` is an operator entry point rather
 * than a public page, so it stays out of the site footer listing.
 */
export const FOOTER_NAV = NAV.filter((n) => n.href !== "/entrar");
